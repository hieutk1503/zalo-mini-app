/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    EventItem,
} from "@dts/index";
import db from "@mock/db.json";
import Thumbnail from "@assets/thumb.png";
import FeedbackThumbnail from "@assets/feedback-thumb.png";
import { useStore as store } from "@store";

// Helper trả về dữ liệu giả sau một khoảng trễ (giả lập gọi mạng).
const delay = <T>(value: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });

export interface GetOrganizationParams {
    miniAppId: string;
}

export const getOrganization = async (
    params: GetOrganizationParams,
): Promise<Organization> => {
    const org: Organization = {
        ...db.organization,
        officialAccounts: db.organization.officialAccounts.map(oa => ({
            oaId: oa.id,
            name: oa.name,
            follow: false,
        })),
    };

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(org);
        }, 200);
    });
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
    const articles: Articles = {
        articles: db.articles.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            thumb: Thumbnail,
        })),
        total: 10,
        currentPageSize: 10,
        page: 0,
    };
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(articles);
        }, 500);
    });
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
    const feedbacks: Feedbacks = {
        ...db.feedbacks,
        total: db.feedbacks.current,
        currentPageSize: db.feedbacks.pageSize,
        page: db.feedbacks.current,
        feedbacks: db.feedbacks.data.map(item => ({
            ...item,
            creationTime: new Date(item.creationTime),
            responseTime: new Date(item.responseTime),
            id: Number(item.id),
            imageUrls: [FeedbackThumbnail],
        })),
    };

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(feedbacks);
        }, 300);
    });
};

export interface GetFeedbackTypeParams {
    organizationId: string;
}

export const getFeedbackTypes = async (
    params: GetFeedbackTypeParams,
): Promise<FeedbackType[]> =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve(
                db.feedbackTypes.map((item, index) => ({
                    id: Number(item.id),
                    title: item.title,
                    order: index + 1,
                })),
            );
        }, 500);
    });

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
): Promise<boolean> =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 500);
    });

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
): Promise<InformationGuides> =>
    Promise.resolve({
        ...db.guidelines,
        informationGuides: db.guidelines.data.map(item => ({
            ...item,
            id: Number(item.id),
        })),
    });

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

export const getHomeSections = async (): Promise<any[]> =>
    delay([
        {
            id: "hs-hero",
            key: "hero",
            order: 1,
            enabled: true,
            title: "CHÍNH QUYỀN SỐ",
            color1: "#C8102E",
            color2: "#7A0C16",
        },
        {
            id: "hs-stats",
            key: "stats",
            order: 2,
            enabled: true,
            color1: "#C8102E",
            color2: "#A4161A",
        },
        { id: "hs-statsdss", key: "statsDss", order: 3, enabled: true },
        {
            id: "hs-explore",
            key: "explore",
            order: 4,
            enabled: true,
            title: "Du lịch địa phương",
            subtitle: "Trải nghiệm thiên nhiên, văn hóa và con người",
            link: "/news",
            color1: "#C8102E",
            color2: "#7A0C16",
        },
        {
            id: "hs-newslist",
            key: "newsList",
            order: 4.5,
            enabled: false,
            title: "Tin tức mới",
        },
        {
            id: "hs-events",
            key: "events",
            order: 4.7,
            enabled: true,
            title: "Sự kiện sắp diễn ra",
        },
        { id: "hs-oa", key: "oa", order: 5, enabled: true },
        {
            id: "hs-citizen",
            key: "citizenGrid",
            order: 6,
            enabled: true,
            title: "Dành cho công dân",
        },
        {
            id: "hs-khupho",
            key: "khuphoGrid",
            order: 7,
            enabled: true,
            title: "Quản lý khu phố",
        },
        {
            id: "hs-business",
            key: "businessGrid",
            order: 8,
            enabled: true,
            title: "Dành cho doanh nghiệp, tổ chức",
        },
        {
            id: "hs-featured",
            key: "featured",
            order: 9,
            enabled: true,
            title: "Tin tức Chuyển Đổi Số",
            subtitle: "TIN NỔI BẬT",
            link: "/news",
            color1: "#7A0C16",
            color2: "#C8102E",
        },
    ]);

export const getEvents = async (): Promise<EventItem[]> =>
    delay([
        {
            id: "evt-1",
            title: "Ngày hội Đại đoàn kết toàn dân tộc khu phố",
            description:
                "<p>Giao lưu văn nghệ, trao quà hộ khó khăn và biểu dương gia đình văn hóa.</p>",
            location: "Nhà văn hóa Khu phố 3",
            startTime: "2026-06-20T19:00:00Z",
            endTime: "2026-06-20T21:30:00Z",
            imageUrl: "https://picsum.photos/seed/event1/640/360",
            status: "published",
        },
        {
            id: "evt-2",
            title: "Tập huấn nộp hồ sơ dịch vụ công trực tuyến",
            description:
                "<p>Hướng dẫn người dân nộp hồ sơ trên Cổng Dịch vụ công quốc gia.</p>",
            location: "Hội trường UBND phường",
            startTime: "2026-06-25T08:00:00Z",
            endTime: "2026-06-25T10:30:00Z",
            imageUrl: "https://picsum.photos/seed/event2/640/360",
            status: "published",
        },
    ]);

export const getEvent = async (id: string): Promise<EventItem | null> => {
    const all = await getEvents();
    return all.find(e => e.id === id) || null;
};

export const getWeather = async (): Promise<{
    temp: string;
    condition: string;
    emoji: string;
} | null> =>
    new Promise(resolve => {
        setTimeout(
            () =>
                resolve({
                    temp: "30°C",
                    condition: "Mây rải rác",
                    emoji: "⛅",
                }),
            200,
        );
    });

export const getWorkSchedule = async (
    params: GetWorkScheduleParams,
): Promise<ScheduleAppointment | null> =>
    new Promise(resolve => {
        setTimeout(() => {
            if (!store.getState().schedule) {
                return resolve(null);
            }
            return resolve({
                number: 53,
                currentNumber: 11,
                date: new Date(),
                fullName: "User Name",
                content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
                status: "approved",
                phoneNumber: "0122402390",
            });
        }, 500);
    });

export const getWorkSchedules = async (params: {
    organizationId: string;
    phone?: string;
    citizenId?: string;
}): Promise<ScheduleAppointment[]> =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    number: 53,
                    currentNumber: 11,
                    date: new Date(),
                    fullName: "Nguyễn Văn An",
                    content: "Sao y chứng thực giấy khai sinh",
                    phoneNumber: "0903123456",
                    code: "LH2026-0053",
                    appointmentTime: "08:30 20/06/2026",
                    status: "approved",
                },
                {
                    number: 41,
                    currentNumber: 41,
                    date: new Date(Date.now() - 86400000 * 7),
                    fullName: "Nguyễn Văn An",
                    content: "Xác nhận thông tin cư trú",
                    phoneNumber: "0903123456",
                    code: "LH2026-0041",
                    status: "completed",
                },
                {
                    number: 39,
                    currentNumber: 11,
                    date: new Date(Date.now() - 86400000 * 14),
                    fullName: "Nguyễn Văn An",
                    content: "Đăng ký tạm trú",
                    phoneNumber: "0903123456",
                    code: "LH2026-0039",
                    status: "rejected",
                    rejectedInfo: "Thiếu giấy tờ tùy thân, đề nghị bổ sung",
                },
            ]);
        }, 300);
    });

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
        return new Promise(resolve => {
            setTimeout(() => {
                const queueNumber = 53;
                resolve({
                    number: queueNumber,
                    currentNumber: 11,
                    date: params.date || new Date(),
                    fullName: params.fullName,
                    content: params.content,
                    status: "pending",
                    phoneNumber: params.phoneNumber,
                    citizenId: params.citizenId,
                    appointmentTime: params.appointmentTime,
                    code: `LH${new Date().getFullYear()}-${String(
                        queueNumber,
                    ).padStart(4, "0")}`,
                });
            }, 500);
        });
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
): Promise<Profile[] | undefined> =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve(
                db.profiles.map(item => ({
                    ...item,
                    dueDate: new Date(item.dueDate),
                    notifications: item.notifications.map(noti => ({
                        ...noti,
                        createdAt: new Date(noti.createdAt),
                    })),
                })),
            );
        }, 500);
    });
