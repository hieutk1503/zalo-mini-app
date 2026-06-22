import { StateCreator } from "zustand";
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
    ChatMessage,
    Project,
    Projects,
    Bidding,
    Biddings,
    ServiceLink,
} from "@dts";
import { api } from "@service";
import {
    TOTAL_PROCEDURES_PER_PAGE,
    TOTAL_DOCUMENTS_PER_PAGE,
    TOTAL_LEGAL_DOCUMENTS_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetProceduresArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    category?: string;
    append?: boolean;
}

export interface GetDocumentsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    type?: PublicDocumentType;
    append?: boolean;
}

export interface GetLegalDocumentsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    field?: string;
    docType?: string;
    status?: string;
    append?: boolean;
}

export interface EgovSlice {
    // Thủ tục hành chính
    procedures?: Procedures;
    gettingProcedures?: boolean;
    procedureDetail?: Procedure | null;
    gettingProcedureDetail?: boolean;
    getProcedures: (args?: GetProceduresArgs) => Promise<void>;
    getProcedureDetail: (id: string) => Promise<void>;

    // Kho văn bản & mẫu đơn
    documents?: PublicDocuments;
    gettingDocuments?: boolean;
    documentDetail?: PublicDocument | null;
    gettingDocumentDetail?: boolean;
    getDocuments: (args?: GetDocumentsArgs) => Promise<void>;
    getDocumentDetail: (id: string) => Promise<void>;

    // Thư viện pháp luật
    legalDocuments?: LegalDocuments;
    gettingLegalDocuments?: boolean;
    legalDocumentDetail?: LegalDocument | null;
    gettingLegalDocumentDetail?: boolean;
    getLegalDocuments: (args?: GetLegalDocumentsArgs) => Promise<void>;
    getLegalDocumentDetail: (id: string) => Promise<void>;

    // Trang chủ thông minh
    homeStats?: HomeStats;
    gettingHomeStats?: boolean;
    getHomeStats: () => Promise<void>;

    // Đường dây nóng
    hotlines?: Hotline[];
    gettingHotlines?: boolean;
    getHotlines: () => Promise<void>;

    // Tiện ích / liên kết dịch vụ
    serviceLinks?: ServiceLink[];
    gettingServiceLinks?: boolean;
    getServiceLinks: () => Promise<void>;

    // Bản đồ trụ sở
    officeLocations?: OfficeLocation[];
    gettingOfficeLocations?: boolean;
    getOfficeLocations: () => Promise<void>;

    // Lịch công tác
    workScheduleEvents?: WorkScheduleEvent[];
    gettingWorkScheduleEvents?: boolean;
    getWorkScheduleEvents: () => Promise<void>;

    // Khảo sát hài lòng
    survey?: Survey | null;
    gettingSurvey?: boolean;
    submittingSurvey?: boolean;
    surveySubmitted?: boolean;
    getActiveSurvey: () => Promise<void>;
    submitSurvey: (answers: SurveyAnswer[]) => Promise<boolean>;

    // Dự án đầu tư
    projects?: Projects;
    gettingProjects?: boolean;
    projectDetail?: Project | null;
    gettingProjectDetail?: boolean;
    getProjects: (keyword?: string) => Promise<void>;
    getProjectDetail: (id: string) => Promise<void>;

    // Đấu thầu
    biddings?: Biddings;
    gettingBiddings?: boolean;
    biddingDetail?: Bidding | null;
    gettingBiddingDetail?: boolean;
    getBiddings: (keyword?: string) => Promise<void>;
    getBiddingDetail: (id: string) => Promise<void>;

    // Chatbot AI
    chatSessionId?: string;
    chatMessages?: ChatMessage[];
    chatLoading?: boolean;
    initChat: () => void;
    sendChat: (text: string) => Promise<void>;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const egovSlice: StateCreator<
    EgovSlice & OrganizationSlice,
    [],
    [],
    EgovSlice
> = (set, get) => ({
    /* --------------------------- Thủ tục hành chính --------------------------- */
    getProcedures: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_PROCEDURES_PER_PAGE,
            keyword,
            category,
            append,
        } = args;
        try {
            set(state => ({ ...state, gettingProcedures: true }));
            const result = await api.getProcedures({
                organizationId,
                page,
                limit,
                keyword,
                category,
            });
            set(state => ({
                ...state,
                procedures: {
                    ...result,
                    procedures: append
                        ? [
                              ...(state.procedures?.procedures || []),
                              ...result.procedures,
                          ]
                        : result.procedures,
                },
            }));
        } catch (err) {
            set(state => ({
                ...state,
                procedures: {
                    procedures: [],
                    total: 0,
                    page: 0,
                    currentPageSize: limit,
                },
            }));
        } finally {
            set(state => ({ ...state, gettingProcedures: false }));
        }
    },
    getProcedureDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingProcedureDetail: true,
                procedureDetail: undefined,
            }));
            const detail = await api.getProcedureDetail({ id, organizationId });
            set(state => ({ ...state, procedureDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, procedureDetail: null }));
        } finally {
            set(state => ({ ...state, gettingProcedureDetail: false }));
        }
    },

    /* --------------------------- Kho văn bản & mẫu đơn --------------------------- */
    getDocuments: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_DOCUMENTS_PER_PAGE,
            keyword,
            type,
            append,
        } = args;
        try {
            set(state => ({ ...state, gettingDocuments: true }));
            const result = await api.getDocuments({
                organizationId,
                page,
                limit,
                keyword,
                type,
            });
            set(state => ({
                ...state,
                documents: {
                    ...result,
                    documents: append
                        ? [
                              ...(state.documents?.documents || []),
                              ...result.documents,
                          ]
                        : result.documents,
                },
            }));
        } catch (err) {
            set(state => ({
                ...state,
                documents: {
                    documents: [],
                    total: 0,
                    page: 0,
                    currentPageSize: limit,
                },
            }));
        } finally {
            set(state => ({ ...state, gettingDocuments: false }));
        }
    },
    getDocumentDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingDocumentDetail: true,
                documentDetail: undefined,
            }));
            const detail = await api.getDocumentDetail({ id, organizationId });
            set(state => ({ ...state, documentDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, documentDetail: null }));
        } finally {
            set(state => ({ ...state, gettingDocumentDetail: false }));
        }
    },

    /* ----------------------------- Thư viện pháp luật ----------------------------- */
    getLegalDocuments: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_LEGAL_DOCUMENTS_PER_PAGE,
            keyword,
            field,
            docType,
            status,
            append,
        } = args;
        try {
            set(state => ({ ...state, gettingLegalDocuments: true }));
            const result = await api.getLegalDocuments({
                organizationId,
                page,
                limit,
                keyword,
                field,
                docType,
                status,
            });
            set(state => ({
                ...state,
                legalDocuments: {
                    ...result,
                    legalDocuments: append
                        ? [
                              ...(state.legalDocuments?.legalDocuments || []),
                              ...result.legalDocuments,
                          ]
                        : result.legalDocuments,
                },
            }));
        } catch (err) {
            set(state => ({
                ...state,
                legalDocuments: {
                    legalDocuments: [],
                    total: 0,
                    page: 0,
                    currentPageSize: limit,
                },
            }));
        } finally {
            set(state => ({ ...state, gettingLegalDocuments: false }));
        }
    },
    getLegalDocumentDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingLegalDocumentDetail: true,
                legalDocumentDetail: undefined,
            }));
            const detail = await api.getLegalDocumentDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, legalDocumentDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, legalDocumentDetail: null }));
        } finally {
            set(state => ({ ...state, gettingLegalDocumentDetail: false }));
        }
    },

    /* ----------------------------- Trang chủ thông minh ----------------------------- */
    getHomeStats: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingHomeStats: true }));
            const stats = await api.getHomeStats({ organizationId });
            set(state => ({ ...state, homeStats: stats }));
        } catch (err) {
            set(state => ({ ...state, homeStats: undefined }));
        } finally {
            set(state => ({ ...state, gettingHomeStats: false }));
        }
    },

    /* ------------------------------ Đường dây nóng ------------------------------ */
    getHotlines: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingHotlines: true }));
            const hotlines = await api.getHotlines({ organizationId });
            set(state => ({ ...state, hotlines }));
        } finally {
            set(state => ({ ...state, gettingHotlines: false }));
        }
    },

    /* --------------------- Tiện ích / liên kết dịch vụ --------------------- */
    getServiceLinks: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingServiceLinks: true }));
            const serviceLinks = await api.getServiceLinks({ organizationId });
            set(state => ({ ...state, serviceLinks }));
        } catch (err) {
            set(state => ({ ...state, serviceLinks: [] }));
        } finally {
            set(state => ({ ...state, gettingServiceLinks: false }));
        }
    },

    /* ------------------------------- Bản đồ trụ sở ------------------------------- */
    getOfficeLocations: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingOfficeLocations: true }));
            const officeLocations = await api.getOfficeLocations({
                organizationId,
            });
            set(state => ({ ...state, officeLocations }));
        } finally {
            set(state => ({ ...state, gettingOfficeLocations: false }));
        }
    },

    /* ------------------------------ Lịch công tác ------------------------------ */
    getWorkScheduleEvents: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingWorkScheduleEvents: true }));
            const workScheduleEvents = await api.getWorkScheduleEvents({
                organizationId,
            });
            set(state => ({ ...state, workScheduleEvents }));
        } finally {
            set(state => ({ ...state, gettingWorkScheduleEvents: false }));
        }
    },

    /* ----------------------------- Khảo sát hài lòng ----------------------------- */
    getActiveSurvey: async () => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingSurvey: true }));
            const survey = await api.getActiveSurvey({ organizationId });
            set(state => ({ ...state, survey: survey || null }));
        } finally {
            set(state => ({ ...state, gettingSurvey: false }));
        }
    },
    submitSurvey: async (answers: SurveyAnswer[]) => {
        const organizationId = get().organization?.id;
        const { survey } = get();
        if (!survey) {
            return false;
        }
        try {
            set(state => ({ ...state, submittingSurvey: true }));
            const ok = await api.submitSurvey({
                organizationId,
                surveyId: survey.id,
                answers,
            });
            set(state => ({ ...state, surveySubmitted: !!ok }));
            return !!ok;
        } catch (err) {
            return false;
        } finally {
            set(state => ({ ...state, submittingSurvey: false }));
        }
    },

    /* ------------------------------ Dự án đầu tư ------------------------------ */
    getProjects: async (keyword?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingProjects: true }));
            const result = await api.getProjects({ organizationId, keyword });
            set(state => ({ ...state, projects: result }));
        } catch (err) {
            set(state => ({
                ...state,
                projects: {
                    projects: [],
                    total: 0,
                    page: 0,
                    currentPageSize: 10,
                },
            }));
        } finally {
            set(state => ({ ...state, gettingProjects: false }));
        }
    },
    getProjectDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingProjectDetail: true,
                projectDetail: undefined,
            }));
            const detail = await api.getProjectDetail({ id, organizationId });
            set(state => ({ ...state, projectDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, projectDetail: null }));
        } finally {
            set(state => ({ ...state, gettingProjectDetail: false }));
        }
    },

    /* -------------------------------- Đấu thầu -------------------------------- */
    getBiddings: async (keyword?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, gettingBiddings: true }));
            const result = await api.getBiddings({ organizationId, keyword });
            set(state => ({ ...state, biddings: result }));
        } catch (err) {
            set(state => ({
                ...state,
                biddings: {
                    biddings: [],
                    total: 0,
                    page: 0,
                    currentPageSize: 10,
                },
            }));
        } finally {
            set(state => ({ ...state, gettingBiddings: false }));
        }
    },
    getBiddingDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingBiddingDetail: true,
                biddingDetail: undefined,
            }));
            const detail = await api.getBiddingDetail({ id, organizationId });
            set(state => ({ ...state, biddingDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, biddingDetail: null }));
        } finally {
            set(state => ({ ...state, gettingBiddingDetail: false }));
        }
    },

    /* ------------------------------- Chatbot AI ------------------------------- */
    initChat: () => {
        if ((get().chatMessages || []).length > 0) {
            return;
        }
        const greeting: ChatMessage = {
            id: "greeting",
            role: "bot",
            content:
                "Xin chào! Tôi là trợ lý dịch vụ công. Bạn cần hỏi về thủ tục, " +
                "hồ sơ hay thông tin nào? Hãy chọn nhanh hoặc nhập câu hỏi bên dưới.",
            createdAt: new Date(),
            suggestions: [
                { label: "Đăng ký khai sinh" },
                { label: "Đăng ký kết hôn" },
                { label: "Chứng thực bản sao" },
            ],
        };
        set(state => ({ ...state, chatMessages: [greeting] }));
    },
    sendChat: async (text: string) => {
        const message = (text || "").trim();
        if (!message) {
            return;
        }
        const organizationId = get().organization?.id;
        const userMsg: ChatMessage = {
            id: newId(),
            role: "user",
            content: message,
            createdAt: new Date(),
        };
        set(state => ({
            ...state,
            chatMessages: [...(state.chatMessages || []), userMsg],
            chatLoading: true,
        }));
        try {
            const reply = await api.sendChatMessage({
                organizationId,
                sessionId: get().chatSessionId,
                message,
            });
            const botMsg: ChatMessage = {
                id: newId(),
                role: "bot",
                content: reply.answer,
                createdAt: new Date(),
                suggestions: reply.suggestions,
            };
            set(state => ({
                ...state,
                chatSessionId: reply.sessionId,
                chatMessages: [...(state.chatMessages || []), botMsg],
            }));
        } catch (err) {
            const botMsg: ChatMessage = {
                id: newId(),
                role: "bot",
                content: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
                createdAt: new Date(),
            };
            set(state => ({
                ...state,
                chatMessages: [...(state.chatMessages || []), botMsg],
            }));
        } finally {
            set(state => ({ ...state, chatLoading: false }));
        }
    },
});

export default egovSlice;
