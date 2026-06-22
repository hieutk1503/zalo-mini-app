/**
 * Service API thật cho Khảo sát (danh sách) và Cuộc thi.
 * Cùng chữ ký với engagement.services.mock để adapter hoán đổi theo môi trường.
 */
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
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

/* --------------------------------- Khảo sát --------------------------------- */

export interface GetSurveyCampaignsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getSurveyCampaigns = async (
    params: GetSurveyCampaignsParams = {},
): Promise<SurveyCampaigns> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<SurveyCampaigns>(
        "GET",
        API.SURVEY_CAMPAIGNS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getSurveyCampaignDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<SurveyCampaign | null> => {
    const url = generatePath(API.SURVEY_CAMPAIGN_DETAIL, { id: params.id });
    return request<SurveyCampaign>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const submitSurveyCampaign = async (params: {
    id: string;
    answers: SurveyAnswer[];
    organizationId?: string;
}): Promise<SurveyResult | null> => {
    const url = `${generatePath(API.SURVEY_CAMPAIGN_DETAIL, {
        id: params.id,
    })}/submit`;
    return request<SurveyResult>(
        "POST",
        url,
        { answers: params.answers },
        withOrgHeader(params.organizationId),
    );
};

export const getSurveyCampaignResults = async (params: {
    id: string;
    organizationId?: string;
}): Promise<SurveyResult | null> => {
    const url = generatePath(API.SURVEY_CAMPAIGN_RESULT, { id: params.id });
    return request<SurveyResult>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

/* -------------------------------- Cuộc thi -------------------------------- */

export interface GetContestsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getContests = async (
    params: GetContestsParams = {},
): Promise<Contests> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<Contests>(
        "GET",
        API.CONTESTS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getContestDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Contest | null> => {
    const url = generatePath(API.CONTEST_DETAIL, { id: params.id });
    return request<Contest>("GET", url, {}, withOrgHeader(params.organizationId));
};

export const submitContest = async (params: {
    id: string;
    answers: ContestAnswer[];
    organizationId?: string;
}): Promise<ContestResult | null> => {
    const url = `${generatePath(API.CONTEST_DETAIL, { id: params.id })}/submit`;
    return request<ContestResult>(
        "POST",
        url,
        { answers: params.answers },
        withOrgHeader(params.organizationId),
    );
};

export const getContestRanking = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ContestRankingEntry[]> => {
    const url = generatePath(API.CONTEST_RANKING, { id: params.id });
    return request<ContestRankingEntry[]>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};
