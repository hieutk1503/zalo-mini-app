import { StateCreator } from "zustand";
import {
    Reflection,
    Reflections,
    QuickNotification,
    QuickNotifications,
} from "@dts";
import { api } from "@service";
import {
    TOTAL_REFLECTIONS_PER_PAGE,
    TOTAL_NOTIFICATIONS_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetReflectionsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface GetNotificationsArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    level?: string;
    append?: boolean;
}

export interface CommunitySlice {
    // Phản ánh nâng cao
    reflections?: Reflections;
    gettingReflections?: boolean;
    reflectionsError?: boolean;
    reflectionDetail?: Reflection | null;
    gettingReflectionDetail?: boolean;
    processingReflection?: boolean;
    getReflections: (args?: GetReflectionsArgs) => Promise<void>;
    getReflectionDetail: (id: string) => Promise<void>;
    receiveReflection: (id: string, note?: string) => Promise<boolean>;
    forwardReflection: (
        id: string,
        unit: string,
        note?: string,
    ) => Promise<boolean>;
    completeReflection: (id: string, note: string) => Promise<boolean>;

    // Thông báo nhanh
    notifications?: QuickNotifications;
    gettingNotifications?: boolean;
    notificationsError?: boolean;
    notificationDetail?: QuickNotification | null;
    gettingNotificationDetail?: boolean;
    getNotifications: (args?: GetNotificationsArgs) => Promise<void>;
    getNotificationDetail: (id: string) => Promise<void>;
    markNotificationRead: (id: string) => Promise<void>;
}

const communitySlice: StateCreator<
    CommunitySlice & OrganizationSlice,
    [],
    [],
    CommunitySlice
> = (set, get) => ({
    /* ----------------------------- Phản ánh nâng cao ----------------------------- */
    getReflections: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_REFLECTIONS_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingReflections: true,
                reflectionsError: false,
            }));
            const result = await api.getReflections({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                reflections: {
                    ...result,
                    reflections: append
                        ? [
                              ...(state.reflections?.reflections || []),
                              ...result.reflections,
                          ]
                        : result.reflections,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, reflectionsError: true }));
        } finally {
            set(state => ({ ...state, gettingReflections: false }));
        }
    },
    getReflectionDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingReflectionDetail: true,
                reflectionDetail: undefined,
            }));
            const detail = await api.getReflectionDetail({ id, organizationId });
            set(state => ({ ...state, reflectionDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, reflectionDetail: null }));
        } finally {
            set(state => ({ ...state, gettingReflectionDetail: false }));
        }
    },
    receiveReflection: async (id: string, note?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingReflection: true }));
            const ok = await api.receiveReflection({ id, note, organizationId });
            if (ok) {
                await get().getReflectionDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingReflection: false }));
        }
    },
    forwardReflection: async (id: string, unit: string, note?: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingReflection: true }));
            const ok = await api.forwardReflection({
                id,
                unit,
                note,
                organizationId,
            });
            if (ok) {
                await get().getReflectionDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingReflection: false }));
        }
    },
    completeReflection: async (id: string, note: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, processingReflection: true }));
            const ok = await api.completeReflection({ id, note, organizationId });
            if (ok) {
                await get().getReflectionDetail(id);
            }
            return ok;
        } finally {
            set(state => ({ ...state, processingReflection: false }));
        }
    },

    /* ------------------------------ Thông báo nhanh ------------------------------ */
    getNotifications: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_NOTIFICATIONS_PER_PAGE,
            keyword,
            level,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingNotifications: true,
                notificationsError: false,
            }));
            const result = await api.getNotifications({
                organizationId,
                page,
                limit,
                keyword,
                level,
            });
            set(state => ({
                ...state,
                notifications: {
                    ...result,
                    notifications: append
                        ? [
                              ...(state.notifications?.notifications || []),
                              ...result.notifications,
                          ]
                        : result.notifications,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, notificationsError: true }));
        } finally {
            set(state => ({ ...state, gettingNotifications: false }));
        }
    },
    getNotificationDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingNotificationDetail: true,
                notificationDetail: undefined,
            }));
            const detail = await api.getNotificationDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, notificationDetail: detail || null }));
            if (detail && !detail.read) {
                get().markNotificationRead(id);
            }
        } catch (err) {
            set(state => ({ ...state, notificationDetail: null }));
        } finally {
            set(state => ({ ...state, gettingNotificationDetail: false }));
        }
    },
    markNotificationRead: async (id: string) => {
        const organizationId = get().organization?.id;
        await api.markNotificationRead({ id, organizationId });
        set(state => ({
            ...state,
            notifications: state.notifications
                ? {
                      ...state.notifications,
                      notifications: state.notifications.notifications.map(n =>
                          n.id === id ? { ...n, read: true } : n,
                      ),
                  }
                : state.notifications,
        }));
    },
});

export default communitySlice;
