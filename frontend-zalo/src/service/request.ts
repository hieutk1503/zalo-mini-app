import { UNAUTHORIZED } from "@constants";
import { BASE_URL } from "@constants/common";
import { ResData } from "@dts";
import { useStore as store } from "@store";
import { getToken } from "./zalo";

interface FetchOptions {
    useAuth?: boolean;
    baseUrl?: string;
    customHeader?: object;
}

export async function request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    data?: any,
    options?: FetchOptions,
    retryCount = 0,
): Promise<T> {
    const { useAuth = true, baseUrl = BASE_URL } = options || {};
    const headers = new Headers();
    const { token } = store.getState();

    if (useAuth && token) {
        headers.append("Authorization", `Bearer ${token}`);
    }
    if (options && options.customHeader) {
        const { customHeader } = options;
        Object.keys(customHeader).forEach(key => {
            headers.append(key, `${customHeader[key]}`);
        });
    }
    const requestUrl = new URL(url, baseUrl);
    const requestOptions: { [key: string]: any } = {
        method,
        headers,
    };

    if (method === "GET") {
        // Bỏ các tham số undefined/null/"" để tránh URLSearchParams biến chúng
        // thành chuỗi "undefined" (gây lọc sai ở backend, ví dụ /news?keyword=undefined).
        const params = new URLSearchParams();
        if (data && typeof data === "object") {
            Object.keys(data).forEach(key => {
                const value = (data as Record<string, unknown>)[key];
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, String(value));
                }
            });
        }
        const qs = params.toString();
        if (qs) requestUrl.search = qs;
    } else {
        headers.append("Content-Type", "application/json");
        requestOptions.body = JSON.stringify(data);
    }
    const response = await fetch(requestUrl.toString(), {
        ...requestOptions,
    });

    const resData = (await response.json()) as any;
    
    // Nếu BE trả về trực tiếp mảng (NestJS) hoặc không có field 'err'/'data'
    if (Array.isArray(resData) || (resData && typeof resData === 'object' && !('err' in resData) && !('data' in resData))) {
        return resData as T;
    }

    if (resData.err === UNAUTHORIZED && retryCount === 0 && useAuth && token) {
        try {
            const accessToken = await getToken();
            store.setState(state => ({ ...state, token: accessToken }));
            // Lấy lại token mới rồi thử lại request đúng 1 lần.
            return await request(method, url, data, options, retryCount + 1);
        } catch (err) {
            throw new Error((err as any).message);
        }
    }
    if (resData.err || resData.data === undefined) {
        // eslint-disable-next-line no-throw-literal
        throw { code: resData.err, message: resData.message };
    }
    return resData.data as T;
}
