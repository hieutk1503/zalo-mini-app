import {
    Article,
    Articles,
    Feedback,
    Feedbacks,
    FeedbackType,
    InformationGuide,
    InformationGuides,
    Organization,
    Profile,
    ScheduleAppointment,
    ScheduleAppointmentStatus,
    HomeSection,
    EventItem,
} from "@dts/index";
import {
    API,
    TOTAL_ARTICLES_PER_PAGE,
    TOTAL_FEEDBACKS_PER_PAGE,
    TOTAL_INFORMATION_GUIDE_PER_PAGE,
} from "@constants/common";
import { generatePath } from "@utils/string";
import { formatDate } from "@utils/date-time";
import { request } from "./request";

export interface GetOrganizationParams {
    miniAppId: string;
}

export const getOrganization = async (
    params: GetOrganizationParams,
): Promise<Organization> => {
    try {
        const org = await request<Organization>(
            "GET",
            API.GET_ORGANIZATION,
            params,
        );

        return {
            officialAccounts: org.officialAccounts?.map(item => ({
                follow: item.follow,
                logoUrl: item.logoUrl,
                name: item.name,
                oaId: item.oaId?.toString(),
            })),
            id: org.id?.toString(),
            logoUrl: org.logoUrl,
            description: org.description,
            name: org.name,
        };
    } catch (err) {
        throw err;
    }
};

export interface GetArticlesParams {
    organizationId: string;
    page?: number;
    limit?: number;
}
export interface GetArticlesResponse {
    current: number;
    data: (Omit<Article, "createdAt"> & { createdAt: number })[];
    pageSize: number;
    total: number;
}

export const getArticles = async (
    params: GetArticlesParams,
): Promise<Articles> => {
    try {
        const {
            organizationId,
            limit = TOTAL_ARTICLES_PER_PAGE,
            page = 1,
        } = params;
        const url = generatePath(API.GET_ARTICLES, {
            id: organizationId,
        });
        const data = await request<GetArticlesResponse>("GET", url, {
            page,
            pargeSize: limit,
        });
        const articles: Articles = {
            articles: data.data?.map(item => ({
                id: item.id,
                title: item.title,
                thumb: item.thumb,
                createdAt: new Date(item.createdAt),
                desc: item.desc,
                link: item.link,
            })),
            page: data.current,
            total: data.total,
            currentPageSize: data.pageSize,
        };
        return articles;
    } catch (err) {
        throw err;
    }
};

export interface GetFeedbacksParams {
    organizationId: string;
    page?: number;
    limit?: number;
    firstFetch?: boolean;
}
export interface GetFeedbacksResponse {
    current: number;
    data: (Omit<Feedback, "createdAt"> & { createdAt: number })[];
    pageSize: number;
    total: number;
}

export const getFeedbacks = async (
    params: GetFeedbacksParams,
): Promise<Feedbacks> => {
    try {
        const {
            organizationId,
            limit = TOTAL_FEEDBACKS_PER_PAGE,
            page = 0,
        } = params;
        const data = await request<GetFeedbacksResponse>(
            "GET",
            API.FEEDBACK,
            {
                page,
                pargeSize: limit,
            },
            {
                customHeader: {
                    "x-organization-id": organizationId,
                },
            },
        );
        const feedbacks: Feedbacks = {
            feedbacks: data.data?.map(item => ({
                id: item.id,
                title: item.title,
                content: item.content,
                response: item.response,
                creationTime: new Date(item.creationTime),
                responseTime: new Date(item.responseTime),
                type: item.type,
                imageUrls: item.imageUrls,
            })),
            page: data.current,
            total: data.total,
            currentPageSize: data.pageSize,
        };
        return feedbacks;
    } catch (err) {
        throw err;
    }
};

export interface GetFeedbackTypeParams {
    organizationId: string;
}

export const getFeedbackTypes = async (params: GetFeedbackTypeParams) => {
    try {
        const { organizationId } = params;
        const feedbackTypes = await request<FeedbackType[]>(
            "GET",
            API.FEEDBACK_TYPES,
            {},
            {
                customHeader: {
                    "x-organization-id": organizationId,
                },
            },
        );
        return feedbackTypes;
    } catch (error) {
        throw error;
    }
};

export interface CreateFeedbackParams {
    organizationId?: string;
    title: string;
    content: string;
    imageUrls?: string[];
    feedbackTypeId: number;
    token: string;
}

export const createFeedback = async (
    feedback: CreateFeedbackParams,
    organizationId: string,
): Promise<boolean> => {
    try {
        const data = await request<boolean>("POST", API.FEEDBACK, feedback, {
            customHeader: {
                "x-organization-id": organizationId,
            },
        });
        return data;
    } catch (error) {
        throw error;
    }
};

export interface GetInformationGuidesParams {
    organizationId: string;
    page?: number;
    limit?: number;
}
export interface GetInformationGuidesResponse {
    current: number;
    data: InformationGuide[];
    pageSize: number;
    total: number;
}

export const getInformationGuides = async (
    params: GetInformationGuidesParams,
): Promise<InformationGuides> => {
    try {
        const {
            organizationId,
            limit = TOTAL_INFORMATION_GUIDE_PER_PAGE,
            page = 0,
        } = params;
        const data = await request<GetInformationGuidesResponse>(
            "GET",
            API.INFORMATION_GUIDE,
            {
                page,
                pargeSize: limit,
            },
            {
                customHeader: {
                    "x-organization-id": organizationId,
                },
            },
        );
        const informationGuides: InformationGuides = {
            informationGuides: data.data?.map(item => ({
                id: item.id,
                question: item.question,
                answer: item.answer,
            })),
            page: data.current,
            total: data.total,
            currentPageSize: data.pageSize,
        };
        return informationGuides;
    } catch (err) {
        throw err;
    }
};

export const getHomeSections = async (): Promise<HomeSection[]> => {
    try {
        const data = await request<HomeSection[]>("GET", API.HOME_SECTIONS, {});
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
};

export const getEvents = async (): Promise<EventItem[]> => {
    try {
        const data = await request<EventItem[]>("GET", API.EVENTS, {});
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
};

export const getEvent = async (id: string): Promise<EventItem | null> => {
    try {
        const data = await request<EventItem>(
            "GET",
            generatePath(API.EVENT_DETAIL, { id }),
            {},
        );
        return data || null;
    } catch (e) {
        return null;
    }
};

export interface WeatherInfo {
    temp: string;
    condition: string;
    emoji: string;
    code?: number;
    updatedAt?: string;
}
export const getWeather = async (params?: {
    lat?: number;
    lon?: number;
}): Promise<WeatherInfo | null> => {
    try {
        const qs = new URLSearchParams();
        if (params?.lat) qs.set("lat", String(params.lat));
        if (params?.lon) qs.set("lon", String(params.lon));
        const path = qs.toString()
            ? `${API.WEATHER}?${qs.toString()}`
            : API.WEATHER;
        const data = await request<WeatherInfo>("GET", path, {});
        return data || null;
    } catch (e) {
        return null;
    }
};

export interface GetWorkScheduleParams {
    organizationId: string;
}
export interface GetWorkScheduleResponse {
    fullName: string;
    yourNumber: number;
    currentNumber: number;
    date: string;
    content: string;
    phoneNumber: string;
    status: ScheduleAppointmentStatus;
    rejectedInfo?: string;
}

export const getWorkSchedule = async (
    params: GetWorkScheduleParams,
): Promise<ScheduleAppointment | null> => {
    try {
        const { organizationId } = params;
        const data = await request<GetWorkScheduleResponse>(
            "GET",
            API.GET_SCHEDULE,
            {},
            {
                customHeader: {
                    "x-organization-id": organizationId,
                },
            },
        );
        if (!data) {
            return null;
        }

        const date = new Date(data.date.replace(/-/g, "/"));

        const schedule: ScheduleAppointment = {
            number: Number(data.yourNumber),
            currentNumber: Number(data.currentNumber),
            date,
            fullName: data.fullName,
            content: data.content,
            phoneNumber: data.phoneNumber,
            status: data.status,
            rejectedInfo: data.rejectedInfo,
        };
        return schedule;
    } catch (err) {
        throw err;
    }
};

export interface GetWorkSchedulesParams {
    organizationId: string;
    phone?: string;
    citizenId?: string;
}
export interface WorkScheduleListItem {
    fullName: string;
    yourNumber: number;
    currentNumber: number;
    date: string;
    content: string;
    phoneNumber: string;
    citizenId?: string;
    appointmentTime?: string;
    code?: string;
    status: ScheduleAppointmentStatus;
    rejectedInfo?: string;
}
export interface GetWorkSchedulesResponse {
    schedules: WorkScheduleListItem[];
}

export const getWorkSchedules = async (
    params: GetWorkSchedulesParams,
): Promise<ScheduleAppointment[]> => {
    const { organizationId, phone, citizenId } = params;
    const qs = new URLSearchParams();
    if (phone) qs.set("phone", phone);
    if (citizenId) qs.set("citizenId", citizenId);
    const path = qs.toString()
        ? `${API.GET_SCHEDULES}?${qs.toString()}`
        : API.GET_SCHEDULES;
    const data = await request<GetWorkSchedulesResponse>(
        "GET",
        path,
        {},
        { customHeader: { "x-organization-id": organizationId } },
    );
    const list = (data && data.schedules) || [];
    return list.map(d => ({
        number: Number(d.yourNumber),
        currentNumber: Number(d.currentNumber),
        date: new Date(String(d.date).replace(/-/g, "/")),
        fullName: d.fullName,
        content: d.content,
        phoneNumber: d.phoneNumber,
        citizenId: d.citizenId,
        appointmentTime: d.appointmentTime,
        code: d.code,
        status: d.status,
        rejectedInfo: d.rejectedInfo,
    }));
};

export interface CreateWorkScheduleParams {
    organizationId: string;
    date: Date;
    fullName: string;
    content: string;
    phoneNumber: string;
    citizenId?: string;
    appointmentTime?: string;
}
export interface CreateWorkScheduleResponse {
    fullName: string;
    yourNumber: number;
    currentNumber: number;
    date: string;
    content: string;
    phoneNumber: string;
    citizenId?: string;
    appointmentTime?: string;
    code?: string;
    organizationId: string;
    status: ScheduleAppointmentStatus;
}

export const createWorkSchedule = async (
    params: CreateWorkScheduleParams,
): Promise<ScheduleAppointment | null> => {
    try {
        const { organizationId, ...rest } = params;
        const data = await request<CreateWorkScheduleResponse | null>(
            "POST",
            API.CREATE_SCHEDULE,
            {
                ...rest,
                date: formatDate(rest.date, "mm-dd-yyyy"),
            },
            {
                customHeader: {
                    "x-organization-id": organizationId,
                },
            },
        );

        if (!data) {
            return null;
        }
        const date = new Date(data.date.replace(/-/g, "/"));

        const schedule: ScheduleAppointment = {
            number: Number(data.yourNumber),
            currentNumber: Number(data.currentNumber),
            date,
            fullName: data.fullName,
            content: data.content,
            phoneNumber: data.phoneNumber,
            citizenId: data.citizenId,
            appointmentTime: data.appointmentTime,
            code: data.code,
            status: data.status,
        };
        return schedule;
    } catch (err) {
        throw err;
    }
};

export interface SearchProfileParams {
    profileCode: string;
    organizationId: string;
}

export type SearchProfilesResponse = Profile[];

export const searchProfiles = async (
    params: SearchProfileParams,
): Promise<Profile[] | undefined> => {
    try {
        const result = await request<SearchProfilesResponse>(
            "GET",
            API.SEARCH_PROFILES,
            params,
            {
                customHeader: {
                    "x-organization-id": params.organizationId,
                },
            },
        );
        return result;
    } catch (err) {
        throw err;
    }
};
