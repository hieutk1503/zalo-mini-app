import {
    getUserInfo,
    getAccessToken,
    followOA,
    openWebview,
} from "zmp-sdk/apis";
import { User } from "@dts";
import { openMediaPicker, saveImageToGallery } from "zmp-sdk";
import { ImageType } from "zmp-ui/image-viewer";

export const getZaloUserInfo = async (): Promise<User> => {
    try {
        const user = await getUserInfo({ avatarType: "normal" });
        const { userInfo } = user;
        return Promise.resolve(userInfo);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getToken = async (): Promise<string> => {
    try {
        const token = await getAccessToken({});
        if (token) {
            return token;
        }
        // Token tĩnh chỉ dùng cho dev nội bộ, cấu hình qua VITE_DEV_TOKEN.
        // Production để trống biến này -> không bao giờ có token giả.
        const devToken = import.meta.env.VITE_DEV_TOKEN as string | undefined;
        if (devToken) {
            return devToken;
        }
        return Promise.reject(new Error("Không lấy được access token từ Zalo"));
    } catch (err) {
        return Promise.reject(err);
    }
};

export const followOfficialAccount = async ({
    id,
}: {
    id: string;
}): Promise<void> => {
    try {
        await followOA({ id });
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
};

export const openWebView = async (link: string): Promise<void> => {
    try {
        await openWebview({ url: link });
        return Promise.resolve();
    } catch (err) {
        throw err;
    }
};

export const saveImage = async (img: string): Promise<void> => {
    try {
        await saveImageToGallery({ imageBase64Data: img });
        return Promise.resolve();
    } catch (err) {
        throw err;
    }
};

export interface PickImageParams {
    maxItemSize?: number;
    maxSelectItem?: number;
    serverUploadUrl: string;
}

export interface UploadImageResponse {
    domain: string;
    images: string[];
}

export const pickImages = async (
    params: PickImageParams,
): Promise<(ImageType & { name: string })[]> => {
    try {
        const res = await openMediaPicker({
            type: "photo",
            maxItemSize: params.maxItemSize || 1024 * 1024,
            maxSelectItem: params.maxSelectItem || 1,
            serverUploadUrl: params.serverUploadUrl,
        });
        const { data } = res;
        // openMediaPicker có thể trả string hoặc string[] tuỳ nền tảng.
        const raw = Array.isArray(data) ? data[0] : data;
        const result = JSON.parse(raw);
        const { domain, images } = result.data as UploadImageResponse;
        const uploadedImgUrls = images.map(img => ({
            src: domain + img,
            name: img,
        }));
        return uploadedImgUrls;
    } catch (err) {
        return Promise.reject(err);
    }
};
