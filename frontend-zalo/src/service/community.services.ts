/**
 * Service API thật cho Phản ánh nâng cao (xử lý) và Thông báo nhanh.
 * Cùng chữ ký với community.services.mock để adapter hoán đổi theo môi trường.
 */
import {
    Reflection,
    Reflections,
    QuickNotification,
    QuickNotifications,
} from "@dts";
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

/* ------------------------------ Phản ánh (xử lý) ------------------------------ */

export interface GetReflectionsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getReflections = async (
    params: GetReflectionsParams = {},
): Promise<Reflections> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<Reflections>(
        "GET",
        API.REFLECTIONS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getReflectionDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Reflection | null> => {
    const url = generatePath(API.REFLECTION_DETAIL, { id: params.id });
    return request<Reflection>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const receiveReflection = async (params: {
    id: string;
    note?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.REFLECTION_DETAIL, {
        id: params.id,
    })}/receive`;
    return request<boolean>(
        "POST",
        url,
        { note: params.note },
        withOrgHeader(params.organizationId),
    );
};

export const forwardReflection = async (params: {
    id: string;
    unit: string;
    note?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.REFLECTION_DETAIL, {
        id: params.id,
    })}/forward`;
    return request<boolean>(
        "POST",
        url,
        { unit: params.unit, note: params.note },
        withOrgHeader(params.organizationId),
    );
};

export const completeReflection = async (params: {
    id: string;
    note: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.REFLECTION_DETAIL, {
        id: params.id,
    })}/complete`;
    return request<boolean>(
        "POST",
        url,
        { note: params.note },
        withOrgHeader(params.organizationId),
    );
};

/* ------------------------------ Thông báo nhanh ------------------------------ */

export interface GetNotificationsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    level?: string;
}

export const getNotifications = async (
    params: GetNotificationsParams = {},
): Promise<QuickNotifications> => {
    const { organizationId, page = 0, limit = 10, ...rest } = params;
    return request<QuickNotifications>(
        "GET",
        API.QUICK_NOTIFICATIONS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getNotificationDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<QuickNotification | null> => {
    const url = generatePath(API.QUICK_NOTIFICATION_DETAIL, { id: params.id });
    return request<QuickNotification>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export const markNotificationRead = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const url = `${generatePath(API.QUICK_NOTIFICATION_DETAIL, {
        id: params.id,
    })}/read`;
    return request<boolean>(
        "POST",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};
