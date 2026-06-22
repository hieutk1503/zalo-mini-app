/**
 * Service adapter.
 *
 * Tập trung điểm chọn giữa dữ liệu mock và API thật theo biến môi trường
 * `VITE_USE_MOCK`:
 *   - "true"  -> dùng services.mock (demo, không cần backend)
 *   - "false" -> gọi API thật trong services.ts
 *
 * Mọi store slice nên import từ "@service" (adapter này) thay vì import
 * trực tiếp services.mock, để khi lên production chỉ cần đổi biến môi trường.
 */
import * as realCore from "./services";
import * as mockCore from "./services.mock";
import * as realEgov from "./egov.services";
import * as mockEgov from "./egov.services.mock";
import * as realResidentGroup from "./residentgroup.services";
import * as mockResidentGroup from "./residentgroup.services.mock";
import * as realCommunity from "./community.services";
import * as mockCommunity from "./community.services.mock";
import * as realNeighborhood from "./neighborhood.services";
import * as mockNeighborhood from "./neighborhood.services.mock";
import * as realEngagement from "./engagement.services";
import * as mockEngagement from "./engagement.services.mock";
import * as realFinance from "./finance.services";
import * as mockFinance from "./finance.services.mock";
import * as realNews from "./news.services";
import * as mockNews from "./news.services.mock";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// Ép kiểu về một type duy nhất (theo bản mock) để tránh union-of-functions
// gây khó gọi dưới strict mode. Bản real có cùng tên hàm và chữ ký tương thích.
const core: typeof mockCore = USE_MOCK
    ? mockCore
    : (realCore as unknown as typeof mockCore);
const egov: typeof mockEgov = USE_MOCK
    ? mockEgov
    : (realEgov as unknown as typeof mockEgov);
const residentGroup: typeof mockResidentGroup = USE_MOCK
    ? mockResidentGroup
    : (realResidentGroup as unknown as typeof mockResidentGroup);
const community: typeof mockCommunity = USE_MOCK
    ? mockCommunity
    : (realCommunity as unknown as typeof mockCommunity);
const neighborhood: typeof mockNeighborhood = USE_MOCK
    ? mockNeighborhood
    : (realNeighborhood as unknown as typeof mockNeighborhood);
const engagement: typeof mockEngagement = USE_MOCK
    ? mockEngagement
    : (realEngagement as unknown as typeof mockEngagement);
const finance: typeof mockFinance = USE_MOCK
    ? mockFinance
    : (realFinance as unknown as typeof mockFinance);
const news: typeof mockNews = USE_MOCK
    ? mockNews
    : (realNews as unknown as typeof mockNews);

/** Toàn bộ hàm service đã được chọn theo môi trường. */
export const api = {
    ...core,
    ...egov,
    ...residentGroup,
    ...community,
    ...neighborhood,
    ...engagement,
    ...finance,
    ...news,
};

export type Api = typeof api;
