import { StateCreator } from "zustand";
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
import { api } from "@service";
import {
    TOTAL_RESIDENTS_PER_PAGE,
    TOTAL_HOUSEHOLDS_PER_PAGE,
    TOTAL_APPROVALS_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetResidentsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    neighborhoodGroup?: string;
    householdId?: string;
    append?: boolean;
}

export interface GetHouseholdsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    neighborhoodGroup?: string;
    append?: boolean;
}

export interface GetApprovalRequestsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    targetType?: ApprovalTargetType;
    append?: boolean;
}

export interface ResidentGroupSlice {
    // Cư dân
    residents?: Residents;
    gettingResidents?: boolean;
    residentsError?: boolean;
    residentDetail?: Resident | null;
    gettingResidentDetail?: boolean;
    savingResident?: boolean;
    getResidents: (args?: GetResidentsArgs) => Promise<void>;
    getResidentDetail: (id: string) => Promise<void>;
    saveResident: (params: {
        id?: string;
        payload: Partial<Resident>;
    }) => Promise<Resident | null>;
    submitResidentApproval: (id: string) => Promise<boolean>;
    approveResident: (id: string) => Promise<boolean>;
    rejectResident: (id: string, reason: string) => Promise<boolean>;

    // Hộ dân
    households?: Households;
    gettingHouseholds?: boolean;
    householdsError?: boolean;
    householdDetail?: Household | null;
    gettingHouseholdDetail?: boolean;
    savingHousehold?: boolean;
    getHouseholds: (args?: GetHouseholdsArgs) => Promise<void>;
    getHouseholdDetail: (id: string) => Promise<void>;
    saveHousehold: (params: {
        id?: string;
        payload: Partial<Household>;
    }) => Promise<Household | null>;
    addHouseholdMember: (
        id: string,
        member: Partial<HouseholdMember>,
    ) => Promise<Household | null>;
    approveHousehold: (id: string) => Promise<boolean>;
    rejectHousehold: (id: string, reason: string) => Promise<boolean>;

    // Duyệt thông tin
    approvalRequests?: ApprovalRequests;
    gettingApprovalRequests?: boolean;
    approvalRequestsError?: boolean;
    approvalRequestDetail?: ApprovalRequest | null;
    gettingApprovalRequestDetail?: boolean;
    processingApproval?: boolean;
    getApprovalRequests: (args?: GetApprovalRequestsArgs) => Promise<void>;
    getApprovalRequestDetail: (id: string) => Promise<void>;
    approveRequest: (id: string) => Promise<boolean>;
    rejectRequest: (id: string, reason: string) => Promise<boolean>;

    // Danh mục địa bàn
    neighborhoodGroups?: string[];
    getNeighborhoodGroups: () => Promise<void>;
}

const residentGroupSlice: StateCreator<
    ResidentGroupSlice & OrganizationSlice,
    [],
    [],
    ResidentGroupSlice
> = (set, get) => ({
    /* --------------------------------- Cư dân --------------------------------- */
    getResidents: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_RESIDENTS_PER_PAGE,
            keyword,
            status,
            neighborhoodGroup,
            householdId,
            append,
        } = args;
        try {
            set(state => ({ ...state, gettingResidents: true, residentsError: false }));
            const result = await api.getResidents({
                organizationId,
                page,
                limit,
                keyword,
                status,
                neighborhoodGroup,
                householdId,
            });
            set(state => ({
                ...state,
                residents: {
                    ...result,
                    residents: append
                        ? [
                              ...(state.residents?.residents || []),
                              ...result.residents,
                          ]
                        : result.residents,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, residentsError: true }));
        } finally {
            set(state => ({ ...state, gettingResidents: false }));
        }
    },
    getResidentDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingResidentDetail: true,
                residentDetail: undefined,
            }));
            const detail = await api.getResidentDetail({ id, organizationId });
            set(state => ({ ...state, residentDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, residentDetail: null }));
        } finally {
            set(state => ({ ...state, gettingResidentDetail: false }));
        }
    },
    saveResident: async ({ id, payload }) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingResident: true }));
            const saved = id
                ? await api.updateResident({ id, payload, organizationId })
                : await api.createResident({ payload, organizationId });
            if (saved) {
                set(state => ({ ...state, residentDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingResident: false }));
        }
    },
    submitResidentApproval: async (id: string) => {
        const organizationId = get().organization?.id;
        const ok = await api.submitResidentApproval({ id, organizationId });
        if (ok) {
            await get().getResidentDetail(id);
        }
        return ok;
    },
    approveResident: async (id: string) => {
        const organizationId = get().organization?.id;
        const ok = await api.approveResident({ id, organizationId });
        if (ok) {
            await get().getResidentDetail(id);
        }
        return ok;
    },
    rejectResident: async (id: string, reason: string) => {
        const organizationId = get().organization?.id;
        const ok = await api.rejectResident({ id, reason, organizationId });
        if (ok) {
            await get().getResidentDetail(id);
        }
        return ok;
    },

    /* --------------------------------- Hộ dân --------------------------------- */
    getHouseholds: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_HOUSEHOLDS_PER_PAGE,
            keyword,
            status,
            neighborhoodGroup,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingHouseholds: true,
                householdsError: false,
            }));
            const result = await api.getHouseholds({
                organizationId,
                page,
                limit,
                keyword,
                status,
                neighborhoodGroup,
            });
            set(state => ({
                ...state,
                households: {
                    ...result,
                    households: append
                        ? [
                              ...(state.households?.households || []),
                              ...result.households,
                          ]
                        : result.households,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, householdsError: true }));
        } finally {
            set(state => ({ ...state, gettingHouseholds: false }));
        }
    },
    getHouseholdDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingHouseholdDetail: true,
                householdDetail: undefined,
            }));
            const detail = await api.getHouseholdDetail({ id, organizationId });
            set(state => ({ ...state, householdDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, householdDetail: null }));
        } finally {
            set(state => ({ ...state, gettingHouseholdDetail: false }));
        }
    },
    saveHousehold: async ({ id, payload }) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingHousehold: true }));
            const saved = id
                ? await api.updateHousehold({ id, payload, organizationId })
                : await api.createHousehold({ payload, organizationId });
            if (saved) {
                set(state => ({ ...state, householdDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingHousehold: false }));
        }
    },
    addHouseholdMember: async (id, member) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingHousehold: true }));
            const updated = await api.addHouseholdMember({
                id,
                member,
                organizationId,
            });
            if (updated) {
                set(state => ({ ...state, householdDetail: updated }));
            }
            return updated || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingHousehold: false }));
        }
    },
    approveHousehold: async (id: string) => {
        const organizationId = get().organization?.id;
        const ok = await api.approveHousehold({ id, organizationId });
        if (ok) {
            await get().getHouseholdDetail(id);
        }
        return ok;
    },
    rejectHousehold: async (id: string, reason: string) => {
        const organizationId = get().organization?.id;
        const ok = await api.rejectHousehold({ id, reason, organizationId });
        if (ok) {
            await get().getHouseholdDetail(id);
        }
        return ok;
    },

    /* ------------------------------ Duyệt thông tin ------------------------------ */
    getApprovalRequests: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_APPROVALS_PER_PAGE,
            keyword,
            status,
            targetType,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingApprovalRequests: true,
                approvalRequestsError: false,
            }));
            const result = await api.getApprovalRequests({
                organizationId,
                page,
                limit,
                keyword,
                status,
                targetType,
            });
            set(state => ({
                ...state,
                approvalRequests: {
                    ...result,
                    requests: append
                        ? [
                              ...(state.approvalRequests?.requests || []),
                              ...result.requests,
                          ]
                        : result.requests,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, approvalRequestsError: true }));
        } finally {
            set(state => ({ ...state, gettingApprovalRequests: false }));
        }
    },
    getApprovalRequestDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingApprovalRequestDetail: true,
                approvalRequestDetail: undefined,
            }));
            const detail = await api.getApprovalRequestDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, approvalRequestDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, approvalRequestDetail: null }));
        } finally {
            set(state => ({ ...state, gettingApprovalRequestDetail: false }));
        }
    },
    approveRequest: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingApproval: true }));
            const ok = await api.approveRequest({ id, organizationId });
            if (ok) {
                await get().getApprovalRequestDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingApproval: false }));
        }
    },
    rejectRequest: async (id: string, reason: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingApproval: true }));
            const ok = await api.rejectRequest({ id, reason, organizationId });
            if (ok) {
                await get().getApprovalRequestDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingApproval: false }));
        }
    },

    /* ------------------------------ Danh mục địa bàn ------------------------------ */
    getNeighborhoodGroups: async () => {
        const organizationId = get().organization?.id;
        try {
            const groups = await api.getNeighborhoodGroups({ organizationId });
            set(state => ({ ...state, neighborhoodGroups: groups }));
        } catch (err) {
            set(state => ({ ...state, neighborhoodGroups: [] }));
        }
    },
});

export default residentGroupSlice;
