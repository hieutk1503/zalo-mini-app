/**
 * Mock service cho các module dịch vụ công mở rộng.
 * Dữ liệu lấy từ @mock/egov.json. Có mô phỏng độ trễ mạng, lọc và phân trang.
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
import db from "@mock/egov.json";
import coreDb from "@mock/db.json";
import serviceLinksDb from "@mock/service-links.json";
import { matchKeyword } from "@utils/string";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const allProcedures = db.procedures as unknown as Procedure[];

const allDocuments = (db.documents as unknown as PublicDocument[]).map(d => ({
    ...d,
    type: d.type as PublicDocumentType,
    issuedDate: d.issuedDate ? new Date(d.issuedDate as unknown as string) : undefined,
}));

const allLegalDocuments = (
    ((db as unknown as { legalDocuments?: LegalDocument[] }).legalDocuments ||
        []) as LegalDocument[]
).map(d => ({
    ...d,
    issuedDate: d.issuedDate
        ? new Date(d.issuedDate as unknown as string)
        : undefined,
    effectiveDate: d.effectiveDate
        ? new Date(d.effectiveDate as unknown as string)
        : undefined,
}));

/* ----------------------------- Thủ tục hành chính ----------------------------- */

export interface GetProceduresParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
}

export const getProcedures = async (
    params: GetProceduresParams = {},
): Promise<Procedures> => {
    const { page = 0, limit = 10, keyword = "", category } = params;
    let list = [...allProcedures];
    if (category) {
        list = list.filter(p => p.category === category);
    }
    if (keyword) {
        list = list.filter(p =>
            matchKeyword(keyword, [p.name, p.code, p.category, p.agency]),
        );
    }
    const total = list.length;
    const start = page * limit;
    const procedures = list.slice(start, start + limit);
    return delay({ procedures, total, page, currentPageSize: limit });
};

export const getProcedureDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Procedure | null> => {
    const found = allProcedures.find(p => p.id === params.id) || null;
    return delay(found);
};

/* ----------------------- Kho văn bản & mẫu đơn, tờ khai ----------------------- */

export interface GetDocumentsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    type?: PublicDocumentType;
}

export const getDocuments = async (
    params: GetDocumentsParams = {},
): Promise<PublicDocuments> => {
    const { page = 0, limit = 10, keyword = "", type } = params;
    let list = [...allDocuments];
    if (type) {
        list = list.filter(d => d.type === type);
    }
    if (keyword) {
        list = list.filter(d =>
            matchKeyword(keyword, [
                d.title,
                d.documentNo,
                d.summary,
                d.category,
            ]),
        );
    }
    const total = list.length;
    const start = page * limit;
    const documents = list.slice(start, start + limit);
    return delay({ documents, total, page, currentPageSize: limit });
};

export const getDocumentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<PublicDocument | null> => {
    const found = allDocuments.find(d => d.id === params.id) || null;
    return delay(found);
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

export const getLegalDocuments = async (
    params: GetLegalDocumentsParams = {},
): Promise<LegalDocuments> => {
    const {
        page = 0,
        limit = 10,
        keyword = "",
        field,
        docType,
        status,
    } = params;
    let list = [...allLegalDocuments];
    if (field) {
        list = list.filter(d => d.field === field);
    }
    if (docType) {
        list = list.filter(d => d.docType === docType);
    }
    if (status) {
        list = list.filter(d => d.status === status);
    }
    if (keyword) {
        list = list.filter(d =>
            matchKeyword(keyword, [
                d.title,
                d.docNo,
                d.field,
                d.issuingAgency,
                d.plainExplanation,
            ]),
        );
    }
    const total = list.length;
    const start = page * limit;
    const legalDocuments = list.slice(start, start + limit);
    return delay({ legalDocuments, total, page, currentPageSize: limit });
};

export const getLegalDocumentDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<LegalDocument | null> => {
    const found = allLegalDocuments.find(d => d.id === params.id) || null;
    return delay(found);
};

/* ----------------------------- Trang chủ thông minh ----------------------------- */

export const getHomeStats = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<HomeStats> =>
    delay({
        procedureCount: allProcedures.length,
        legalDocumentCount: allLegalDocuments.length,
        documentCount: allDocuments.length,
        appointmentCount: 0,
        newsCount: 0,
        feedbackCount: 0,
        reflectionResolvedRate: null,
        population: null,
        satisfactionScore: null,
        onlineServiceRate: null,
    });

/* ------------------------------ Đường dây nóng ------------------------------ */

export const getHotlines = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<Hotline[]> => delay(db.hotlines as unknown as Hotline[]);

/* ----------------------- Tiện ích / liên kết dịch vụ ----------------------- */

export const getServiceLinks = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<ServiceLink[]> =>
    delay(
        (serviceLinksDb.serviceLinks as unknown as ServiceLink[])
            .filter(l => l.enabled !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
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
    const name = params.filename || `tep-${Date.now()}`;
    // Mock: không lưu thật, trả về URL giả lập.
    return delay(
        {
            url: `https://mock.local/uploads/${encodeURIComponent(name)}`,
            name,
            size: Math.floor((params.contentBase64 || "").length * 0.75),
            type: params.contentType,
        },
        400,
    );
};

/* ------------------------------- Bản đồ trụ sở ------------------------------- */

export const getOfficeLocations = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<OfficeLocation[]> =>
    delay(db.officeLocations as unknown as OfficeLocation[]);

/* ------------------------------ Lịch công tác ------------------------------ */

export const getWorkScheduleEvents = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<WorkScheduleEvent[]> =>
    delay(
        (db.workSchedule as unknown as WorkScheduleEvent[]).map(e => ({
            ...e,
            date: new Date(e.date as unknown as string),
        })),
    );

/* ----------------------------- Khảo sát hài lòng ----------------------------- */

export const getActiveSurvey = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<Survey | null> => delay(db.survey as unknown as Survey);

export interface SubmitSurveyParams {
    organizationId?: string;
    surveyId: string;
    answers: SurveyAnswer[];
}

export const submitSurvey = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: SubmitSurveyParams,
): Promise<boolean> => delay(true, 500);

/* --------------------------- Dự án đầu tư công --------------------------- */

const allProjects = (db.projects as unknown as Project[]).map(p => ({
    ...p,
    startDate: p.startDate
        ? new Date(p.startDate as unknown as string)
        : undefined,
    endDate: p.endDate ? new Date(p.endDate as unknown as string) : undefined,
}));

const allBiddings = (db.biddings as unknown as Bidding[]).map(b => ({
    ...b,
    publishDate: b.publishDate
        ? new Date(b.publishDate as unknown as string)
        : undefined,
    closeDate: b.closeDate
        ? new Date(b.closeDate as unknown as string)
        : undefined,
}));

export interface GetProjectsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
}

export const getProjects = async (
    params: GetProjectsParams = {},
): Promise<Projects> => {
    const { page = 0, limit = 10, keyword = "" } = params;
    let list = [...allProjects];
    if (keyword) {
        list = list.filter(p =>
            matchKeyword(keyword, [p.name, p.field, p.investor, p.location]),
        );
    }
    const total = list.length;
    const start = page * limit;
    const projects = list.slice(start, start + limit);
    return delay({ projects, total, page, currentPageSize: limit });
};

export const getProjectDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Project | null> => {
    const found = allProjects.find(p => p.id === params.id) || null;
    return delay(found);
};

/* ------------------------------- Đấu thầu ------------------------------- */

export interface GetBiddingsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
}

export const getBiddings = async (
    params: GetBiddingsParams = {},
): Promise<Biddings> => {
    const { page = 0, limit = 10, keyword = "" } = params;
    let list = [...allBiddings];
    if (keyword) {
        list = list.filter(b =>
            matchKeyword(keyword, [b.name, b.code, b.investor, b.field]),
        );
    }
    const total = list.length;
    const start = page * limit;
    const biddings = list.slice(start, start + limit);
    return delay({ biddings, total, page, currentPageSize: limit });
};

export const getBiddingDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Bidding | null> => {
    const found = allBiddings.find(b => b.id === params.id) || null;
    return delay(found);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: { organizationId?: string } = {},
): Promise<CreateChatSessionResult> =>
    delay({ sessionId: `sess-${Date.now()}` }, 100);

export const sendChatMessage = async (
    params: SendChatMessageParams,
): Promise<ChatBotReply> => {
    const sessionId = params.sessionId || `sess-${Date.now()}`;
    const message = params.message || "";

    // 1) Tra cứu theo thủ tục hành chính
    const proc = allProcedures.find(p =>
        matchKeyword(message, [p.name, p.category, p.code]),
    );
    if (proc) {
        const answer = [
            `Về thủ tục "${proc.name}":`,
            `• Lĩnh vực: ${proc.category}`,
            `• Cơ quan thực hiện: ${proc.agency || "—"}`,
            `• Lệ phí: ${proc.fee || "—"}`,
            `• Thời hạn giải quyết: ${proc.processingTime || "—"}`,
            ``,
            `Thành phần hồ sơ: ${proc.dossierRequirements || "—"}`,
        ].join("\n");
        const suggestions: ChatSuggestion[] = [
            { label: "Xem chi tiết thủ tục", path: `/procedures/${proc.id}` },
        ];
        if (proc.onlineSubmissionUrl) {
            suggestions.push({
                label: "Nộp hồ sơ trực tuyến",
                link: proc.onlineSubmissionUrl,
            });
        }
        return delay({ sessionId, answer, suggestions }, 400);
    }

    // 2) Tra cứu theo hỏi đáp (FAQ)
    const faq = (coreDb.guidelines.data || []).find(g =>
        matchKeyword(message, [g.question, g.answer]),
    );
    if (faq) {
        return delay(
            {
                sessionId,
                answer: faq.answer,
                suggestions: [
                    { label: "Xem thêm hỏi đáp", path: "/information-guide" },
                ],
            },
            400,
        );
    }

    // 3) Fallback khi không trả lời được
    return delay(
        {
            sessionId,
            answer:
                "Xin lỗi, tôi chưa có thông tin chính xác cho câu hỏi này. " +
                "Bạn có thể tra cứu danh mục thủ tục hành chính hoặc liên hệ " +
                "Bộ phận Một cửa để được hỗ trợ trực tiếp.",
            suggestions: [
                { label: "Tra cứu thủ tục", path: "/procedures" },
                { label: "Đường dây nóng", path: "/hotlines" },
            ],
        },
        400,
    );
};
