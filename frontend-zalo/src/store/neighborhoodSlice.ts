import { StateCreator } from "zustand";
import {
    Meeting,
    Meetings,
    CommunityGroup,
    CommunityGroups,
    CommunityGroupMember,
} from "@dts";
import { api } from "@service";
import {
    TOTAL_MEETINGS_PER_PAGE,
    TOTAL_GROUPS_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetMeetingsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface GetGroupsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface NeighborhoodSlice {
    // Cuộc họp
    meetings?: Meetings;
    gettingMeetings?: boolean;
    meetingsError?: boolean;
    meetingDetail?: Meeting | null;
    gettingMeetingDetail?: boolean;
    savingMeeting?: boolean;
    processingMeeting?: boolean;
    getMeetings: (args?: GetMeetingsArgs) => Promise<void>;
    getMeetingDetail: (id: string) => Promise<void>;
    createMeeting: (payload: Partial<Meeting>) => Promise<Meeting | null>;
    confirmMeeting: (id: string) => Promise<boolean>;
    declineMeeting: (id: string, reason?: string) => Promise<boolean>;

    // Nhóm cộng đồng
    groups?: CommunityGroups;
    gettingGroups?: boolean;
    groupsError?: boolean;
    groupDetail?: CommunityGroup | null;
    gettingGroupDetail?: boolean;
    savingGroup?: boolean;
    getCommunityGroups: (args?: GetGroupsArgs) => Promise<void>;
    getCommunityGroupDetail: (id: string) => Promise<void>;
    createCommunityGroup: (
        payload: Partial<CommunityGroup>,
    ) => Promise<CommunityGroup | null>;
    addCommunityGroupMember: (
        id: string,
        member: Partial<CommunityGroupMember>,
    ) => Promise<CommunityGroup | null>;
    removeCommunityGroupMember: (
        id: string,
        memberId: string,
    ) => Promise<CommunityGroup | null>;
}

const neighborhoodSlice: StateCreator<
    NeighborhoodSlice & OrganizationSlice,
    [],
    [],
    NeighborhoodSlice
> = (set, get) => ({
    /* --------------------------------- Cuộc họp --------------------------------- */
    getMeetings: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_MEETINGS_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingMeetings: true,
                meetingsError: false,
            }));
            const result = await api.getMeetings({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                meetings: {
                    ...result,
                    meetings: append
                        ? [
                              ...(state.meetings?.meetings || []),
                              ...result.meetings,
                          ]
                        : result.meetings,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, meetingsError: true }));
        } finally {
            set(state => ({ ...state, gettingMeetings: false }));
        }
    },
    getMeetingDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingMeetingDetail: true,
                meetingDetail: undefined,
            }));
            const detail = await api.getMeetingDetail({ id, organizationId });
            set(state => ({ ...state, meetingDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, meetingDetail: null }));
        } finally {
            set(state => ({ ...state, gettingMeetingDetail: false }));
        }
    },
    createMeeting: async payload => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingMeeting: true }));
            const saved = await api.createMeeting({ payload, organizationId });
            if (saved) {
                set(state => ({ ...state, meetingDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingMeeting: false }));
        }
    },
    confirmMeeting: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingMeeting: true }));
            const ok = await api.confirmMeeting({ id, organizationId });
            if (ok) {
                await get().getMeetingDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingMeeting: false }));
        }
    },
    declineMeeting: async (id: string, reason?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingMeeting: true }));
            const ok = await api.declineMeeting({ id, reason, organizationId });
            if (ok) {
                await get().getMeetingDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingMeeting: false }));
        }
    },

    /* ------------------------------ Nhóm cộng đồng ------------------------------ */
    getCommunityGroups: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_GROUPS_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingGroups: true,
                groupsError: false,
            }));
            const result = await api.getCommunityGroups({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                groups: {
                    ...result,
                    groups: append
                        ? [...(state.groups?.groups || []), ...result.groups]
                        : result.groups,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, groupsError: true }));
        } finally {
            set(state => ({ ...state, gettingGroups: false }));
        }
    },
    getCommunityGroupDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingGroupDetail: true,
                groupDetail: undefined,
            }));
            const detail = await api.getCommunityGroupDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, groupDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, groupDetail: null }));
        } finally {
            set(state => ({ ...state, gettingGroupDetail: false }));
        }
    },
    createCommunityGroup: async payload => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingGroup: true }));
            const saved = await api.createCommunityGroup({
                payload,
                organizationId,
            });
            if (saved) {
                set(state => ({ ...state, groupDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingGroup: false }));
        }
    },
    addCommunityGroupMember: async (id, member) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingGroup: true }));
            const updated = await api.addCommunityGroupMember({
                id,
                member,
                organizationId,
            });
            if (updated) {
                set(state => ({ ...state, groupDetail: updated }));
            }
            return updated || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingGroup: false }));
        }
    },
    removeCommunityGroupMember: async (id, memberId) => {
        const organizationId = get().organization?.id;
        const updated = await api.removeCommunityGroupMember({
            id,
            memberId,
            organizationId,
        });
        if (updated) {
            set(state => ({ ...state, groupDetail: updated }));
        }
        return updated || null;
    },
});

export default neighborhoodSlice;
