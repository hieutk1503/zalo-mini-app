/**
 * Service API thật cho Cuộc họp & Nhóm cộng đồng.
 * Cùng chữ ký với neighborhood.services.mock để adapter hoán đổi theo môi trường.
 */
import {
    Meeting,
    Meetings,
    CommunityGroup,
    CommunityGroups,
    CommunityGroupMember,
} from "@dts";
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

/* --------------------------------- Cuộc họp --------------------------------- */

export interface GetMeetingsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getMeetings = async (
    params: GetMeetingsParams = {},
): Promise<Meetings> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<Meetings>(
        "GET",
        API.MEETINGS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getMeetingDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Meeting | null> => {
    const url = generatePath(API.MEETING_DETAIL, { id: params.id });
    return request<Meeting>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveMeetingParams {
    organizationId?: string;
    payload: Partial<Meeting>;
}

export const createMeeting = async (
    params: SaveMeetingParams,
): Promise<Meeting> =>
    request<Meeting>(
        "POST",
        API.MEETINGS,
        params.payload,
        withOrgHeader(params.organizationId),
    );

export const confirmMeeting = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.MEETING_DETAIL, {
        id: params.id,
    })}/confirm`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const declineMeeting = async (params: {
    id: string;
    reason?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.MEETING_DETAIL, { id: params.id })}/reject`;
    return request<boolean>(
        "POST",
        url,
        { reason: params.reason },
        withOrgHeader(params.organizationId),
    );
};

/* ------------------------------ Nhóm cộng đồng ------------------------------ */

export interface GetGroupsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getCommunityGroups = async (
    params: GetGroupsParams = {},
): Promise<CommunityGroups> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<CommunityGroups>(
        "GET",
        API.COMMUNITY_GROUPS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getCommunityGroupDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const url = generatePath(API.COMMUNITY_GROUP_DETAIL, { id: params.id });
    return request<CommunityGroup>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveGroupParams {
    organizationId?: string;
    id?: string;
    payload: Partial<CommunityGroup>;
}

export const createCommunityGroup = async (
    params: SaveGroupParams,
): Promise<CommunityGroup> =>
    request<CommunityGroup>(
        "POST",
        API.COMMUNITY_GROUPS,
        params.payload,
        withOrgHeader(params.organizationId),
    );

export const updateCommunityGroup = async (
    params: SaveGroupParams,
): Promise<CommunityGroup | null> => {
    const url = generatePath(API.COMMUNITY_GROUP_DETAIL, { id: params.id });
    return request<CommunityGroup>(
        "PATCH",
        url,
        params.payload,
        withOrgHeader(params.organizationId),
    );
};

export const addCommunityGroupMember = async (params: {
    id: string;
    member: Partial<CommunityGroupMember>;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const url = `${generatePath(API.COMMUNITY_GROUP_DETAIL, {
        id: params.id,
    })}/members`;
    return request<CommunityGroup>(
        "POST",
        url,
        params.member,
        withOrgHeader(params.organizationId),
    );
};

export const removeCommunityGroupMember = async (params: {
    id: string;
    memberId: string;
    organizationId?: string;
}): Promise<CommunityGroup | null> => {
    const url = `${generatePath(API.COMMUNITY_GROUP_DETAIL, {
        id: params.id,
    })}/members/${params.memberId}`;
    return request<CommunityGroup>(
        "DELETE",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};
