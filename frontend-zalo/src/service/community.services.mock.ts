/**
 * Mock service cho Phản ánh nâng cao (xử lý) và Thông báo nhanh.
 * Giữ dữ liệu in-memory để thao tác xử lý/đánh dấu đã đọc tồn tại trong phiên.
 * Nguồn dữ liệu GIẢ: @mock/reflections.json.
 */
import {
    Reflection,
    Reflections,
    ReflectionLog,
    ReflectionLogAction,
    QuickNotification,
    QuickNotifications,
} from "@dts";
import db from "@mock/reflections.json";
import { matchKeyword } from "@utils/string";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const reflections: Reflection[] = clone(db.reflections) as Reflection[];
const notifications: QuickNotification[] = clone(
    db.notifications,
) as QuickNotification[];

let seq = 2000;
const newId = (p: string) => {
    seq += 1;
    return `${p}-${Date.now()}-${seq}`;
};
const today = () => new Date().toISOString().slice(0, 10);

const paginate = <T>(list: T[], page: number, limit: number) => ({
    total: list.length,
    page,
    currentPageSize: limit,
    slice: list.slice(page * limit, page * limit + limit),
});

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
    const { page = 0, limit = 10, keyword = "", status } = params;
    let list = [...reflections];
    if (status) {
        list = list.filter(r => r.status === status);
    }
    if (keyword) {
        list = list.filter(r =>
            matchKeyword(keyword, [r.code, r.title, r.typeName, r.senderName]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ reflections: slice, ...meta });
};

export const getReflectionDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<Reflection | null> =>
    delay(clone(reflections.find(r => r.id === params.id) || null));

const addLog = (
    r: Reflection,
    action: ReflectionLogAction,
    note?: string,
    toUnit?: string,
) => {
    const log: ReflectionLog = {
        id: newId("log"),
        action,
        note,
        toUnit,
        byName: "Cán bộ xử lý",
        at: today(),
    };
    // Mutate bản ghi trong store mock in-memory (cố ý).
    // eslint-disable-next-line no-param-reassign
    r.logs = [...(r.logs || []), log];
};

export const receiveReflection = async (params: {
    id: string;
    note?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = reflections.find(x => x.id === params.id);
    if (!r) return delay(false);
    r.status = "processing";
    addLog(r, "receive", params.note);
    return delay(true, 400);
};

export const forwardReflection = async (params: {
    id: string;
    unit: string;
    note?: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = reflections.find(x => x.id === params.id);
    if (!r) return delay(false);
    r.status = "forwarded";
    r.handlingUnit = params.unit;
    addLog(r, "forward", params.note, params.unit);
    return delay(true, 400);
};

export const completeReflection = async (params: {
    id: string;
    note: string;
    organizationId?: string;
}): Promise<boolean> => {
    const r = reflections.find(x => x.id === params.id);
    if (!r) return delay(false);
    r.status = "completed";
    addLog(r, "complete", params.note);
    return delay(true, 400);
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
    const { page = 0, limit = 10, keyword = "", level } = params;
    let list = [...notifications];
    if (level) {
        list = list.filter(n => n.level === level);
    }
    if (keyword) {
        list = list.filter(n => matchKeyword(keyword, [n.title, n.content]));
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ notifications: slice, ...meta });
};

export const getNotificationDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<QuickNotification | null> =>
    delay(clone(notifications.find(n => n.id === params.id) || null));

export const markNotificationRead = async (params: {
    id: string;
    organizationId?: string;
}): Promise<boolean> => {
    const n = notifications.find(x => x.id === params.id);
    if (!n) return delay(false);
    n.read = true;
    return delay(true, 100);
};
