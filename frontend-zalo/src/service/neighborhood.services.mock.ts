/**
 * Mock service cho Cuộc họp & Nhóm cộng đồng (P1 vận hành khu phố).
 * In-memory để thao tác xác nhận/tạo/thêm thành viên tồn tại trong phiên.
 * Nguồn dữ liệu GIẢ: @mock/neighborhood.json.
 */
import {
    Meeting,
    Meetings,
    CommunityGroup,
    CommunityGroups,
    CommunityGroupMember,
} from "@dts";
import db from "@mock/neighborhood.json";
import { matchKeyword } from "@utils/string";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const meetings: Meeting[] = clone(db.meetings) as Meeting[];
const groups: CommunityGroup[] = clone(db.groups) as CommunityGroup[];

let seq = 3000;
const newId = (p: string) => {
    seq += 1;
    return `${p}-${Date.now()}-${seq}`;
};
const today = () => new Date().toISOString().slice(0, 10);

const paginate = <T>(list: T[], page: number, limit: number) => ({
    total: list.length,
    page,
    currentPageSize: limit,
    slice: list.slice(page * limit, page * limit + limit),
});

/* --------------------------------- Cuộc họp --------------------------------- */

export interface GetMeetingsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

const withCount = (m: Meeting): Meeting => ({
    ...m,
    participantCount: m.participants?.length ?? m.participantCount ?? 0,
});

export const getMeetings = async (
    params: GetMeetingsParams = {},
): Promise<Meetings> => {
    const { page = 0, limit = 10, keyword = "", status } = params;
    let list = [...meetings];
    if (status) {
        list = list.filter(m => m.status === status);
    }
    if (keyword) {
        list = list.filter(m =>
            matchKeyword(keyword, [m.title, m.content, m.location]),
        );
    }
    const { slice, ...meta } = paginate(list.map(withCount), page, limit);
    return delay({ meetings: slice, ...meta });
};

export const getMeetingDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Meeting | null> => {
    const found = meetings.find(m => m.id === params.id);
    return delay(found ? clone(withCount(found)) : null);
};

export interface SaveMeetingParams {
    organizationId?: string;
    payload: Partial<Meeting>;
}

export const createMeeting = async (
    params: SaveMeetingParams,
): Promise<Meeting> => {
    const meeting: Meeting = {
        id: newId("mt"),
        title: params.payload.title || "",
        content: params.payload.content || "",
        startTime: params.payload.startTime || "",
        location: params.payload.location || "",
        status: params.payload.status || "scheduled",
        participants: params.payload.participants || [],
        myConfirmStatus: "pending",
        createdAt: today(),
        ...params.payload,
    } as Meeting;
    meetings.unshift(meeting);
    return delay(clone(withCount(meeting)), 400);
};

export const confirmMeeting = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const m = meetings.find(x => x.id === params.id);
    if (!m) return delay(false);
    m.myConfirmStatus = "confirmed";
    return delay(true, 300);
};

export const declineMeeting = async (params: {
    id: string;
    reason?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const m = meetings.find(x => x.id === params.id);
    if (!m) return delay(false);
    m.myConfirmStatus = "declined";
    return delay(true, 300);
};

/* ------------------------------ Nhóm cộng đồng ------------------------------ */

export interface GetGroupsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

const withMemberCount = (g: CommunityGroup): CommunityGroup => ({
    ...g,
    memberCount: g.members?.length ?? g.memberCount ?? 0,
});

export const getCommunityGroups = async (
    params: GetGroupsParams = {},
): Promise<CommunityGroups> => {
    const { page = 0, limit = 10, keyword = "", status } = params;
    let list = [...groups];
    if (status) {
        list = list.filter(g => g.status === status);
    }
    if (keyword) {
        list = list.filter(g =>
            matchKeyword(keyword, [g.name, g.description, g.topic]),
        );
    }
    const { slice, ...meta } = paginate(list.map(withMemberCount), page, limit);
    return delay({ groups: slice, ...meta });
};

export const getCommunityGroupDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const found = groups.find(g => g.id === params.id);
    return delay(found ? clone(withMemberCount(found)) : null);
};

export interface SaveGroupParams {
    organizationId?: string;
    id?: string;
    payload: Partial<CommunityGroup>;
}

export const createCommunityGroup = async (
    params: SaveGroupParams,
): Promise<CommunityGroup> => {
    const group: CommunityGroup = {
        id: newId("gr"),
        name: params.payload.name || "",
        status: params.payload.status || "active",
        members: params.payload.members || [],
        createdAt: today(),
        ...params.payload,
    } as CommunityGroup;
    groups.unshift(group);
    return delay(clone(withMemberCount(group)), 400);
};

export const updateCommunityGroup = async (
    params: SaveGroupParams,
): Promise<CommunityGroup | null> => {
    const idx = groups.findIndex(g => g.id === params.id);
    if (idx < 0) return delay(null);
    groups[idx] = { ...groups[idx], ...params.payload };
    return delay(clone(withMemberCount(groups[idx])), 400);
};

export const addCommunityGroupMember = async (params: {
    id: string;
    member: Partial<CommunityGroupMember>;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const group = groups.find(g => g.id === params.id);
    if (!group) return delay(null);
    const member: CommunityGroupMember = {
        id: newId("gm"),
        name: params.member.name || "",
        ...params.member,
    } as CommunityGroupMember;
    group.members = [...(group.members || []), member];
    return delay(clone(withMemberCount(group)), 400);
};

export const removeCommunityGroupMember = async (params: {
    id: string;
    memberId: string;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const group = groups.find(g => g.id === params.id);
    if (!group) return delay(null);
    group.members = (group.members || []).filter(m => m.id !== params.memberId);
    return delay(clone(withMemberCount(group)), 300);
};
