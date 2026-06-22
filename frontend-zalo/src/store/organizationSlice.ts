import { Articles, Organization, HomeSection, EventItem } from "@dts";
import { api } from "@service";
import { GetArticlesParams, GetOrganizationParams } from "@service/services";

import { followOfficialAccount } from "@service/zalo";
import { StateCreator } from "zustand";

export interface OrganizationSlice {
    organization?: Organization;
    gettingOrganization?: boolean;
    gettingArticles?: boolean;
    articles?: Articles;
    weather?: { temp: string; condition: string; emoji: string };
    homeSections?: HomeSection[];
    events?: EventItem[];
    eventDetail?: EventItem | null;
    gettingEventDetail?: boolean;
    followOA: (params: { id: string }) => Promise<void>;
    getHomeSections: () => Promise<void>;
    getEvents: () => Promise<void>;
    getEventDetail: (id: string) => Promise<void>;
    getOrganization: (params: GetOrganizationParams) => Promise<void>;
    getArticles: (params: GetArticlesParams) => Promise<void>;
    getWeather: () => Promise<void>;
}

const organizationSlice: StateCreator<OrganizationSlice> = (set, get) => ({
    organization: undefined,

    gettingOrganization: false,
    gettingProfile: false,

    followOA: async (params: { id: string }) => {
        try {
            await followOfficialAccount(params);
            const org = get().organization;

            if (org) {
                org.officialAccounts = org.officialAccounts?.map(item => {
                    if (item.oaId !== params.id) {
                        return item;
                    }
                    return {
                        ...item,
                        follow: true,
                    };
                });
                set(state => ({
                    ...state,
                    organization: org,
                    followingOA: false,
                }));
            }
        } catch (err) {
            console.error("err: ", err);
        }
    },
    getOrganization: async (params: GetOrganizationParams) => {
        try {
            set(state => ({
                ...state,
                gettingOrganization: true,
            }));
            const org = await api.getOrganization(params);

            set(state => ({
                ...state,
                organization: org,
            }));
        } finally {
            set(state => ({
                ...state,
                gettingOrganization: false,
            }));
        }
    },
    getHomeSections: async () => {
        try {
            const secs = await api.getHomeSections();
            set(state => ({ ...state, homeSections: secs || [] }));
        } catch (e) {
            set(state => ({ ...state, homeSections: [] }));
        }
    },
    getEvents: async () => {
        try {
            const evs = await api.getEvents();
            set(state => ({ ...state, events: evs || [] }));
        } catch (e) {
            set(state => ({ ...state, events: [] }));
        }
    },
    getEventDetail: async (id: string) => {
        try {
            set(state => ({ ...state, gettingEventDetail: true }));
            const ev = await api.getEvent(id);
            set(state => ({ ...state, eventDetail: ev || null }));
        } finally {
            set(state => ({ ...state, gettingEventDetail: false }));
        }
    },
    getWeather: async () => {
        try {
            const w = await api.getWeather();
            if (w) {
                set(state => ({ ...state, weather: w }));
            }
        } catch (e) {
            /* giữ giá trị mặc định hiển thị ở giao diện */
        }
    },
    getArticles: async (params: GetArticlesParams) => {
        try {
            set(state => ({
                ...state,
                gettingArticles: true,
            }));
            const articles = await api.getArticles(params);
            set(state => ({
                ...state,

                gettingArticles: false,

                articles: {
                    ...articles,
                    articles: [
                        ...(state.articles?.articles || []),
                        ...articles.articles,
                    ],
                    currentPageSize: articles.currentPageSize,
                    page: articles.page,
                },
            }));
        } catch (err) {
            set(state => ({
                ...state,
                gettingArticles: false,
            }));
        }
    },
});

export default organizationSlice;
