/**
 * Mock service cho module eGov DSS / Resident Group (Cư dân, Hộ dân, Duyệt).
 * Giữ dữ liệu trong bộ nhớ để thao tác duyệt/từ chối/tạo mới tồn tại trong phiên.
 * Dữ liệu nguồn là dữ liệu GIẢ trong @mock/resident-group.json.
 */
import {
    Resident,
    Residents,
    Household,
    HouseholdMember,
    Households,
    ApprovalRequest,
    ApprovalRequests,
    ApprovalTargetType,
} from "@dts";
import db from "@mock/resident-group.json";
import { matchKeyword } from "@utils/string";
import { NEIGHBORHOOD_GROUPS } from "@constants/resident-group";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// Kho dữ liệu in-memory (mutable trong phiên làm việc).
const residents: Resident[] = clone(db.residents) as Resident[];
const households: Household[] = clone(db.households) as Household[];
const approvalRequests: ApprovalRequest[] = clone(
    db.approvalRequests,
) as ApprovalRequest[];

let seq = 1000;
const newId = (prefix: string) => {
    seq += 1;
    return `${prefix}-${Date.now()}-${seq}`;
};
const today = () => new Date().toISOString().slice(0, 10);

const paginate = <T>(list: T[], page: number, limit: number) => ({
    total: list.length,
    page,
    currentPageSize: limit,
    slice: list.slice(page * limit, page * limit + limit),
});

/* --------------------------------- Cư dân --------------------------------- */

export interface GetResidentsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    neighborhoodGroup?: string;
    householdId?: string;
}

export const getResidents = async (
    params: GetResidentsParams = {},
): Promise<Residents> => {
    const {
        page = 0,
        limit = 10,
        keyword = "",
        status,
        neighborhoodGroup,
        householdId,
    } = params;
    let list = [...residents];
    if (status) {
        list = list.filter(r => r.status === status);
    }
    if (neighborhoodGroup) {
        list = list.filter(r => r.neighborhoodGroup === neighborhoodGroup);
    }
    if (householdId) {
        list = list.filter(r => r.householdId === householdId);
    }
    if (keyword) {
        list = list.filter(r =>
            matchKeyword(keyword, [r.fullName, r.citizenId, r.phone]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ residents: slice, ...meta });
};

export const getResidentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Resident | null> =>
    delay(clone(residents.find(r => r.id === params.id) || null));

export interface SaveResidentParams {
    organizationId?: string;
    id?: string;
    payload: Partial<Resident>;
}

export const createResident = async (
    params: SaveResidentParams,
): Promise<Resident> => {
    const resident: Resident = {
        id: newId("res"),
        fullName: params.payload.fullName || "",
        citizenId: params.payload.citizenId || "",
        status: params.payload.status || "pending",
        createdAt: today(),
        ...params.payload,
    } as Resident;
    residents.unshift(resident);
    return delay(clone(resident), 400);
};

export const updateResident = async (
    params: SaveResidentParams,
): Promise<Resident | null> => {
    const idx = residents.findIndex(r => r.id === params.id);
    if (idx < 0) {
        return delay(null);
    }
    residents[idx] = {
        ...residents[idx],
        ...params.payload,
        updatedAt: today(),
    };
    return delay(clone(residents[idx]), 400);
};

export const submitResidentApproval = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = residents.find(x => x.id === params.id);
    if (!r) {
        return delay(false);
    }
    r.status = "pending";
    r.rejectReason = undefined;
    return delay(true, 400);
};

export const approveResident = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = residents.find(x => x.id === params.id);
    if (!r) {
        return delay(false);
    }
    r.status = "approved";
    r.rejectReason = undefined;
    return delay(true, 400);
};

export const rejectResident = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = residents.find(x => x.id === params.id);
    if (!r) {
        return delay(false);
    }
    r.status = "rejected";
    r.rejectReason = params.reason;
    return delay(true, 400);
};

/* --------------------------------- Hộ dân --------------------------------- */

export interface GetHouseholdsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    neighborhoodGroup?: string;
}

const withMemberCount = (h: Household): Household => ({
    ...h,
    memberCount: h.members?.length ?? h.memberCount ?? 0,
});

export const getHouseholds = async (
    params: GetHouseholdsParams = {},
): Promise<Households> => {
    const {
        page = 0,
        limit = 10,
        keyword = "",
        status,
        neighborhoodGroup,
    } = params;
    let list = [...households];
    if (status) {
        list = list.filter(h => h.status === status);
    }
    if (neighborhoodGroup) {
        list = list.filter(h => h.neighborhoodGroup === neighborhoodGroup);
    }
    if (keyword) {
        list = list.filter(h =>
            matchKeyword(keyword, [h.code, h.headName, h.addressDetail]),
        );
    }
    const { slice, ...meta } = paginate(list.map(withMemberCount), page, limit);
    return delay({ households: slice, ...meta });
};

export const getHouseholdDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Household | null> => {
    const found = households.find(h => h.id === params.id);
    return delay(found ? clone(withMemberCount(found)) : null);
};

export interface SaveHouseholdParams {
    organizationId?: string;
    id?: string;
    payload: Partial<Household>;
}

export const createHousehold = async (
    params: SaveHouseholdParams,
): Promise<Household> => {
    const household: Household = {
        id: newId("hk"),
        code: params.payload.code || `HK-${seq}`,
        headName: params.payload.headName || "",
        addressDetail: params.payload.addressDetail || "",
        neighborhoodGroup: params.payload.neighborhoodGroup || "",
        status: params.payload.status || "pending",
        members: params.payload.members || [],
        createdAt: today(),
        ...params.payload,
    } as Household;
    households.unshift(household);
    return delay(clone(withMemberCount(household)), 400);
};

export const updateHousehold = async (
    params: SaveHouseholdParams,
): Promise<Household | null> => {
    const idx = households.findIndex(h => h.id === params.id);
    if (idx < 0) {
        return delay(null);
    }
    households[idx] = {
        ...households[idx],
        ...params.payload,
        updatedAt: today(),
    };
    return delay(clone(withMemberCount(households[idx])), 400);
};

export const addHouseholdMember = async (params: {
    id: string;
    member: Partial<HouseholdMember>;
    organizationId?: string;
}): Promise<Household | null> => {
    const household = households.find(h => h.id === params.id);
    if (!household) {
        return delay(null);
    }
    const member: HouseholdMember = {
        id: newId("m"),
        fullName: params.member.fullName || "",
        relationToHead: params.member.relationToHead || "Khác",
        status: params.member.status || "pending",
        ...params.member,
    } as HouseholdMember;
    household.members = [...(household.members || []), member];
    return delay(clone(withMemberCount(household)), 400);
};

export const approveHousehold = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const h = households.find(x => x.id === params.id);
    if (!h) {
        return delay(false);
    }
    h.status = "approved";
    h.rejectReason = undefined;
    return delay(true, 400);
};

export const rejectHousehold = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const h = households.find(x => x.id === params.id);
    if (!h) {
        return delay(false);
    }
    h.status = "rejected";
    h.rejectReason = params.reason;
    return delay(true, 400);
};

/* ------------------------------ Duyệt thông tin ------------------------------ */

export interface GetApprovalRequestsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    targetType?: ApprovalTargetType;
}

export const getApprovalRequests = async (
    params: GetApprovalRequestsParams = {},
): Promise<ApprovalRequests> => {
    const { page = 0, limit = 10, keyword = "", status, targetType } = params;
    let list = [...approvalRequests];
    if (status) {
        list = list.filter(a => a.status === status);
    }
    if (targetType) {
        list = list.filter(a => a.targetType === targetType);
    }
    if (keyword) {
        list = list.filter(a =>
            matchKeyword(keyword, [a.targetName, a.requesterName, a.summary]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ requests: slice, ...meta });
};

export const getApprovalRequestDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ApprovalRequest | null> =>
    delay(clone(approvalRequests.find(a => a.id === params.id) || null));

const applyToTarget = (
    req: ApprovalRequest,
    status: "approved" | "rejected",
    reason?: string,
) => {
    if (req.targetType === "resident") {
        const r = residents.find(x => x.id === req.targetId);
        if (r) {
            r.status = status;
            r.rejectReason = status === "rejected" ? reason : undefined;
        }
    } else {
        const h = households.find(x => x.id === req.targetId);
        if (h) {
            h.status = status;
            h.rejectReason = status === "rejected" ? reason : undefined;
        }
    }
};

export const approveRequest = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const req = approvalRequests.find(a => a.id === params.id);
    if (!req) {
        return delay(false);
    }
    req.status = "approved";
    req.rejectReason = undefined;
    applyToTarget(req, "approved");
    return delay(true, 400);
};

export const rejectRequest = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const req = approvalRequests.find(a => a.id === params.id);
    if (!req) {
        return delay(false);
    }
    req.status = "rejected";
    req.rejectReason = params.reason;
    applyToTarget(req, "rejected", params.reason);
    return delay(true, 400);
};

/* ------------------------------ Danh mục địa bàn ------------------------------ */

export const getNeighborhoodGroups = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<string[]> => delay([...NEIGHBORHOOD_GROUPS], 100);
