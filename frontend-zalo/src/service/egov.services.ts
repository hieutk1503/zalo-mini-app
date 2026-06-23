/**
 * Service gọi API thật cho các module dịch vụ công mở rộng.
 * Cùng chữ ký hàm với egov.services.mock để adapter có thể hoán đổi theo môi trường.
 */
import {
    Procedure,
    Procedures,
    PublicDocument,
    PublicDocuments,
    PublicDocumentType,
    LegalDocument,
    LegalDocuments,
    HomeStats,
    Hotline,
    OfficeLocation,
    WorkScheduleEvent,
    Survey,
    SurveyAnswer,
    ChatSuggestion,
    Project,
    Projects,
    Bidding,
    Biddings,
    ServiceLink,
    UploadResult,
} from "@dts";
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

/* ----------------------------- Thủ tục hành chính ----------------------------- */

export interface GetProceduresParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
}

const mapProcedure = (apiProc: any): Procedure => ({
    id: String(apiProc.id),
    code: apiProc.code,
    name: apiProc.title || "",
    description: apiProc.description,
    category: apiProc.category || "Tất cả",
    fee: apiProc.fee,
    processingTime: apiProc.duration,
    processSteps: apiProc.process_steps,
});

export const getProcedures = async (
    params: GetProceduresParams = {},
): Promise<Procedures> => {
    const { organizationId, page = 0, limit = 10, keyword, category } = params;
    const data = await request<any[]>(
        "GET",
        API.PROCEDURES,
        { page, pageSize: limit, keyword, category },
        withOrgHeader(organizationId),
    );
    const procedures = (data || []).map(mapProcedure);
    return {
        procedures,
        total: procedures.length,
        page,
        currentPageSize: procedures.length,
    };
};

export const getProcedureDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Procedure | null> => {
    const url = generatePath(API.PROCEDURE_DETAIL, { id: params.id });
    const data = await request<any>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
    return data ? mapProcedure(data) : null;
};

/* ----------------------- Kho văn bản & mẫu đơn, tờ khai ----------------------- */

export interface GetDocumentsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    type?: PublicDocumentType;
}

const toDocument = (d: PublicDocument): PublicDocument => ({
    ...d,
    issuedDate: d.issuedDate
        ? new Date(d.issuedDate as unknown as string)
        : undefined,
});

export const getDocuments = async (
    params: GetDocumentsParams = {},
): Promise<PublicDocuments> => {
    const { organizationId, page = 0, limit = 10, keyword, type } = params;
    const data = await request<PublicDocuments>(
        "GET",
        API.DOCUMENTS,
        { page, pageSize: limit, keyword, type },
        withOrgHeader(organizationId),
    );
    return { ...data, documents: (data.documents || []).map(toDocument) };
};

export const getDocumentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<PublicDocument | null> => {
    const url = generatePath(API.DOCUMENT_DETAIL, { id: params.id });
    const data = await request<PublicDocument>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
    return data ? toDocument(data) : null;
};

/* ----------------------------- Thư viện pháp luật ----------------------------- */

export interface GetLegalDocumentsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    field?: string;
    docType?: string;
    status?: string;
}

const toLegalDocument = (d: LegalDocument): LegalDocument => ({
    ...d,
    issuedDate: d.issuedDate
        ? new Date(d.issuedDate as unknown as string)
        : undefined,
    effectiveDate: d.effectiveDate
        ? new Date(d.effectiveDate as unknown as string)
        : undefined,
});

export const getLegalDocuments = async (
    params: GetLegalDocumentsParams = {},
): Promise<LegalDocuments> => {
    const {
        organizationId,
        page = 0,
        limit = 10,
        keyword,
        field,
        docType,
        status,
    } = params;
    const data = await request<LegalDocuments>(
        "GET",
        API.LEGAL_DOCUMENTS,
        { page, pageSize: limit, keyword, field, docType, status },
        withOrgHeader(organizationId),
    );
    return {
        ...data,
        legalDocuments: (data.legalDocuments || []).map(toLegalDocument),
    };
};

export const getLegalDocumentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<LegalDocument | null> => {
    const url = generatePath(API.LEGAL_DOCUMENT_DETAIL, { id: params.id });
    const data = await request<LegalDocument>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
    return data ? toLegalDocument(data) : null;
};

/* ----------------------------- Trang chủ thông minh ----------------------------- */

export const getHomeStats = async (
    params: { organizationId?: string } = {},
): Promise<HomeStats> =>
    request<HomeStats>(
        "GET",
        API.HOME_STATS,
        {},
        withOrgHeader(params.organizationId),
    );

/* ------------------------------ Đường dây nóng ------------------------------ */

export const getHotlines = async (
    params: { organizationId?: string } = {},
): Promise<Hotline[]> =>
    request<Hotline[]>(
        "GET",
        API.HOTLINES,
        {},
        withOrgHeader(params.organizationId),
    );

/* ----------------------- Tiện ích / liên kết dịch vụ ----------------------- */

export const getServiceLinks = async (
    params: { organizationId?: string } = {},
): Promise<ServiceLink[]> =>
    request<ServiceLink[]>(
        "GET",
        API.SERVICE_LINKS,
        {},
        withOrgHeader(params.organizationId),
    );

/* ------------------------------- Upload tệp ------------------------------- */

export interface UploadFileParams {
    organizationId?: string;
    filename?: string;
    contentType: string;
    contentBase64: string;
}

export const uploadFile = async (
    params: UploadFileParams,
): Promise<UploadResult> => {
    const { organizationId, ...body } = params;
    return request<UploadResult>(
        "POST",
        API.UPLOADS,
        body,
        withOrgHeader(organizationId),
    );
};

/* ------------------------------- Bản đồ trụ sở ------------------------------- */

export const getOfficeLocations = async (
    params: { organizationId?: string } = {},
): Promise<OfficeLocation[]> =>
    request<OfficeLocation[]>(
        "GET",
        API.OFFICE_LOCATIONS,
        {},
        withOrgHeader(params.organizationId),
    );

/* ------------------------------ Lịch công tác ------------------------------ */

export const getWorkScheduleEvents = async (
    params: { organizationId?: string } = {},
): Promise<WorkScheduleEvent[]> => {
    const data = await request<WorkScheduleEvent[]>(
        "GET",
        API.WORK_SCHEDULE,
        {},
        withOrgHeader(params.organizationId),
    );
    return (data || []).map(e => ({
        ...e,
        date: new Date(e.date as unknown as string),
    }));
};

/* ----------------------------- Khảo sát hài lòng ----------------------------- */

export const getActiveSurvey = async (
    params: { organizationId?: string } = {},
): Promise<Survey | null> =>
    request<Survey>(
        "GET",
        API.SURVEY,
        {},
        withOrgHeader(params.organizationId),
    );

export interface SubmitSurveyParams {
    organizationId?: string;
    surveyId: string;
    answers: SurveyAnswer[];
}

export const submitSurvey = async (
    params: SubmitSurveyParams,
): Promise<boolean> => {
    const { organizationId, ...body } = params;
    return request<boolean>(
        "POST",
        API.SUBMIT_SURVEY,
        body,
        withOrgHeader(organizationId),
    );
};

/* --------------------------- Dự án đầu tư công --------------------------- */

export interface GetProjectsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
}

const toProject = (p: Project): Project => ({
    ...p,
    startDate: p.startDate
        ? new Date(p.startDate as unknown as string)
        : undefined,
    endDate: p.endDate ? new Date(p.endDate as unknown as string) : undefined,
});

export const getProjects = async (
    params: GetProjectsParams = {},
): Promise<Projects> => {
    const { organizationId, page = 0, limit = 10, keyword } = params;
    const data = await request<Projects>(
        "GET",
        API.PROJECTS,
        { page, pageSize: limit, keyword },
        withOrgHeader(organizationId),
    );
    return { ...data, projects: (data.projects || []).map(toProject) };
};

export const getProjectDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Project | null> => {
    const url = generatePath(API.PROJECT_DETAIL, { id: params.id });
    const data = await request<Project>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
    return data ? toProject(data) : null;
};

/* ------------------------------- Đấu thầu ------------------------------- */

export interface GetBiddingsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
}

const toBidding = (b: Bidding): Bidding => ({
    ...b,
    publishDate: b.publishDate
        ? new Date(b.publishDate as unknown as string)
        : undefined,
    closeDate: b.closeDate
        ? new Date(b.closeDate as unknown as string)
        : undefined,
});

export const getBiddings = async (
    params: GetBiddingsParams = {},
): Promise<Biddings> => {
    const { organizationId, page = 0, limit = 10, keyword } = params;
    const data = await request<Biddings>(
        "GET",
        API.BIDDINGS,
        { page, pageSize: limit, keyword },
        withOrgHeader(organizationId),
    );
    return { ...data, biddings: (data.biddings || []).map(toBidding) };
};

export const getBiddingDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Bidding | null> => {
    const url = generatePath(API.BIDDING_DETAIL, { id: params.id });
    const data = await request<Bidding>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
    return data ? toBidding(data) : null;
};

/* ----------------------- Chatbot AI dịch vụ công ----------------------- */

export interface CreateChatSessionResult {
    sessionId: string;
}

export interface SendChatMessageParams {
    organizationId?: string;
    sessionId?: string;
    message: string;
}

export interface ChatBotReply {
    sessionId: string;
    answer: string;
    suggestions?: ChatSuggestion[];
}

export const createChatSession = async (
    params: { organizationId?: string } = {},
): Promise<CreateChatSessionResult> =>
    request<CreateChatSessionResult>(
        "POST",
        API.CHATBOT_SESSIONS,
        {},
        withOrgHeader(params.organizationId),
    );

export const sendChatMessage = async (
    params: SendChatMessageParams,
): Promise<ChatBotReply> => {
    const { organizationId, ...body } = params;
    return request<ChatBotReply>(
        "POST",
        API.CHATBOT_MESSAGES,
        body,
        withOrgHeader(organizationId),
    );
};
