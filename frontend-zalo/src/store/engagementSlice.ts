import { StateCreator } from "zustand";
import {
    SurveyCampaign,
    SurveyCampaigns,
    SurveyResult,
    SurveyAnswer,
    Contest,
    Contests,
    ContestAnswer,
    ContestResult,
    ContestRankingEntry,
} from "@dts";
import { api } from "@service";
import {
    TOTAL_SURVEYS_PER_PAGE,
    TOTAL_CONTESTS_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetSurveyCampaignsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface GetContestsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface EngagementSlice {
    // Khảo sát (danh sách)
    surveyCampaigns?: SurveyCampaigns;
    gettingSurveyCampaigns?: boolean;
    surveyCampaignsError?: boolean;
    surveyCampaignDetail?: SurveyCampaign | null;
    gettingSurveyCampaignDetail?: boolean;
    submittingSurveyCampaign?: boolean;
    surveyResult?: SurveyResult | null;
    getSurveyCampaigns: (args?: GetSurveyCampaignsArgs) => Promise<void>;
    getSurveyCampaignDetail: (id: string) => Promise<void>;
    submitSurveyCampaign: (
        id: string,
        answers: SurveyAnswer[],
    ) => Promise<SurveyResult | null>;
    getSurveyCampaignResults: (id: string) => Promise<void>;

    // Cuộc thi
    contests?: Contests;
    gettingContests?: boolean;
    contestsError?: boolean;
    contestDetail?: Contest | null;
    gettingContestDetail?: boolean;
    submittingContest?: boolean;
    contestResult?: ContestResult | null;
    contestRanking?: ContestRankingEntry[];
    getContests: (args?: GetContestsArgs) => Promise<void>;
    getContestDetail: (id: string) => Promise<void>;
    submitContest: (
        id: string,
        answers: ContestAnswer[],
    ) => Promise<ContestResult | null>;
    getContestRanking: (id: string) => Promise<void>;
}

const engagementSlice: StateCreator<
    EngagementSlice & OrganizationSlice,
    [],
    [],
    EngagementSlice
> = (set, get) => ({
    /* --------------------------------- Khảo sát --------------------------------- */
    getSurveyCampaigns: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_SURVEYS_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingSurveyCampaigns: true,
                surveyCampaignsError: false,
            }));
            const result = await api.getSurveyCampaigns({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                surveyCampaigns: {
                    ...result,
                    surveys: append
                        ? [
                              ...(state.surveyCampaigns?.surveys || []),
                              ...result.surveys,
                          ]
                        : result.surveys,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, surveyCampaignsError: true }));
        } finally {
            set(state => ({ ...state, gettingSurveyCampaigns: false }));
        }
    },
    getSurveyCampaignDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingSurveyCampaignDetail: true,
                surveyCampaignDetail: undefined,
                surveyResult: null,
            }));
            const detail = await api.getSurveyCampaignDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, surveyCampaignDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, surveyCampaignDetail: null }));
        } finally {
            set(state => ({ ...state, gettingSurveyCampaignDetail: false }));
        }
    },
    submitSurveyCampaign: async (id: string, answers: SurveyAnswer[]) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, submittingSurveyCampaign: true }));
            const result = await api.submitSurveyCampaign({
                id,
                answers,
                organizationId,
            });
            set(state => ({ ...state, surveyResult: result || null }));
            return result || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, submittingSurveyCampaign: false }));
        }
    },
    getSurveyCampaignResults: async (id: string) => {
        const organizationId = get().organization?.id;
        const result = await api.getSurveyCampaignResults({
            id,
            organizationId,
        });
        set(state => ({ ...state, surveyResult: result || null }));
    },

    /* -------------------------------- Cuộc thi -------------------------------- */
    getContests: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_CONTESTS_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingContests: true,
                contestsError: false,
            }));
            const result = await api.getContests({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                contests: {
                    ...result,
                    contests: append
                        ? [
                              ...(state.contests?.contests || []),
                              ...result.contests,
                          ]
                        : result.contests,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, contestsError: true }));
        } finally {
            set(state => ({ ...state, gettingContests: false }));
        }
    },
    getContestDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingContestDetail: true,
                contestDetail: undefined,
                contestResult: null,
            }));
            const detail = await api.getContestDetail({ id, organizationId });
            set(state => ({ ...state, contestDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, contestDetail: null }));
        } finally {
            set(state => ({ ...state, gettingContestDetail: false }));
        }
    },
    submitContest: async (id: string, answers: ContestAnswer[]) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, submittingContest: true }));
            const result = await api.submitContest({
                id,
                answers,
                organizationId,
            });
            set(state => ({ ...state, contestResult: result || null }));
            return result || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, submittingContest: false }));
        }
    },
    getContestRanking: async (id: string) => {
        const organizationId = get().organization?.id;
        const ranking = await api.getContestRanking({ id, organizationId });
        set(state => ({ ...state, contestRanking: ranking || [] }));
    },
});

export default engagementSlice;
