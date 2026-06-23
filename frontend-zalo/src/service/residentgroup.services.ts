/**
 * Service gọi API thật cho module eGov DSS / Resident Group.
 * Cùng chữ ký hàm với residentgroup.services.mock để adapter hoán đổi theo môi trường.
 * Chỉ được gọi khi VITE_USE_MOCK=false và đã cấu hình VITE_BASE_URL.
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
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

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
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<Residents>(
        "GET",
        API.RESIDENTS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getResidentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Resident | null> => {
    const url = generatePath(API.RESIDENT_DETAIL, { id: params.id });
    return request<Resident>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveResidentParams {
    organizationId?: string;
    id?: string;
    payload: Partial<Resident>;
}

export const createResident = async (
    params: SaveResidentParams,
): Promise<Resident> =>
    request<Resident>(
        "POST",
        API.RESIDENTS,
        params.payload,
        withOrgHeader(params.organizationId),
    );

export const updateResident = async (
    params: SaveResidentParams,
): Promise<Resident | null> => {
    const url = generatePath(API.RESIDENT_DETAIL, { id: params.id });
    return request<Resident>(
        "PATCH",
        url,
        params.payload,
        withOrgHeader(params.organizationId),
    );
};

export const submitResidentApproval = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.RESIDENT_DETAIL, {
        id: params.id,
    })}/submit-approval`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const approveResident = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.RESIDENT_DETAIL, {
        id: params.id,
    })}/approve`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const rejectResident = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.RESIDENT_DETAIL, {
        id: params.id,
    })}/reject`;
    return request<boolean>(
        "POST",
        url,
        { reason: params.reason },
        withOrgHeader(params.organizationId),
    );
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

export const getHouseholds = async (
    params: GetHouseholdsParams = {},
): Promise<Households> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<Households>(
        "GET",
        API.HOUSEHOLDS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getHouseholdDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Household | null> => {
    const url = generatePath(API.HOUSEHOLD_DETAIL, { id: params.id });
    return request<Household>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveHouseholdParams {
    organizationId?: string;
    id?: string;
    payload: Partial<Household>;
}

export const createHousehold = async (
    params: SaveHouseholdParams,
): Promise<Household> =>
    request<Household>(
        "POST",
        API.HOUSEHOLDS,
        params.payload,
        withOrgHeader(params.organizationId),
    );

export const updateHousehold = async (
    params: SaveHouseholdParams,
): Promise<Household | null> => {
    const url = generatePath(API.HOUSEHOLD_DETAIL, { id: params.id });
    return request<Household>(
        "PATCH",
        url,
        params.payload,
        withOrgHeader(params.organizationId),
    );
};

export const addHouseholdMember = async (params: {
    id: string;
    member: Partial<HouseholdMember>;
    organizationId?: string;
}): Promise<Household | null> => {
    const url = generatePath(API.HOUSEHOLD_MEMBERS, { id: params.id });
    return request<Household>(
        "POST",
        url,
        params.member,
        withOrgHeader(params.organizationId),
    );
};

export const approveHousehold = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.HOUSEHOLD_DETAIL, {
        id: params.id,
    })}/approve`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const rejectHousehold = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.HOUSEHOLD_DETAIL, {
        id: params.id,
    })}/reject`;
    return request<boolean>(
        "POST",
        url,
        { reason: params.reason },
        withOrgHeader(params.organizationId),
    );
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
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<ApprovalRequests>(
        "GET",
        API.APPROVAL_REQUESTS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getApprovalRequestDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ApprovalRequest | null> => {
    const url = generatePath(API.APPROVAL_REQUEST_DETAIL, { id: params.id });
    return request<ApprovalRequest>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const approveRequest = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.APPROVAL_REQUEST_DETAIL, {
        id: params.id,
    })}/approve`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const rejectRequest = async (params: {
    id: string;
    reason: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.APPROVAL_REQUEST_DETAIL, {
        id: params.id,
    })}/reject`;
    return request<boolean>(
        "POST",
        url,
        { reason: params.reason },
        withOrgHeader(params.organizationId),
    );
};

/* ------------------------------ Danh mục địa bàn ------------------------------ */

export const getNeighborhoodGroups = async (
    params: { organizationId?: string } = {},
): Promise<string[]> =>
    request<string[]>(
        "GET",
        API.NEIGHBORHOOD_GROUPS,
        {},
        withOrgHeader(params.organizationId),
    );
