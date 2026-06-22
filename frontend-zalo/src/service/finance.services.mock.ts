/**
 * Mock service cho Quản lý thu / chi khu phố.
 * In-memory; cập nhật trạng thái đóng & tạo mới tồn tại trong phiên.
 * Nguồn dữ liệu GIẢ: @mock/finance.json.
 */
import {
    IncomeCampaign,
    IncomeCampaigns,
    PaymentStatus,
    ExpenseRecord,
    ExpenseRecords,
} from "@dts";
import db from "@mock/finance.json";
import { matchKeyword } from "@utils/string";

const delay = <T>(data: T, ms = 300): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(data), ms);
    });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const campaigns: IncomeCampaign[] = clone(
    db.incomeCampaigns,
) as IncomeCampaign[];
const expenses: ExpenseRecord[] = clone(db.expenses) as ExpenseRecord[];

let seq = 4000;
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

/** Bổ sung số liệu tổng hợp cho đợt thu. */
const withStats = (c: IncomeCampaign): IncomeCampaign => {
    const hh = c.households || [];
    const collectedAmount = hh.reduce((s, h) => s + (h.amountPaid || 0), 0);
    const paidCount = hh.filter(h => h.status === "paid").length;
    return {
        ...c,
        totalHouseholds: hh.length,
        paidCount,
        unpaidCount: hh.length - paidCount,
        collectedAmount,
        expectedTotal:
            c.expectedTotal ?? (c.amountPerHousehold || 0) * hh.length,
    };
};

/* -------------------------------- Quản lý thu -------------------------------- */

export interface GetIncomeCampaignsParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getIncomeCampaigns = async (
    params: GetIncomeCampaignsParams = {},
): Promise<IncomeCampaigns> => {
    const { page = 0, limit = 20, keyword = "", status } = params;
    let list = [...campaigns];
    if (status) {
        list = list.filter(c => c.status === status);
    }
    if (keyword) {
        list = list.filter(c =>
            matchKeyword(keyword, [c.name, c.feeType, c.neighborhoodGroup]),
        );
    }
    const { slice, ...meta } = paginate(list.map(withStats), page, limit);
    return delay({ campaigns: slice, ...meta });
};

export const getIncomeCampaignDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<IncomeCampaign | null> => {
    const found = campaigns.find(c => c.id === params.id);
    return delay(found ? clone(withStats(found)) : null);
};

export interface SaveIncomeCampaignParams {
    organizationId?: string;
    payload: Partial<IncomeCampaign>;
}

export const createIncomeCampaign = async (
    params: SaveIncomeCampaignParams,
): Promise<IncomeCampaign> => {
    const campaign: IncomeCampaign = {
        id: newId("in"),
        name: params.payload.name || "",
        status: params.payload.status || "active",
        households: params.payload.households || [],
        createdAt: today(),
        ...params.payload,
    } as IncomeCampaign;
    campaigns.unshift(campaign);
    return delay(clone(withStats(campaign)), 400);
};

export const updatePaymentStatus = async (params: {
    id: string;
    paymentId: string;
    status: PaymentStatus;
    amountPaid?: number;
    organizationId?: string;
}): Promise<IncomeCampaign | null> => {
    const c = campaigns.find(x => x.id === params.id);
    if (!c) return delay(null);
    const hh = (c.households || []).find(h => h.id === params.paymentId);
    if (!hh) return delay(null);
    hh.status = params.status;
    if (params.status === "paid") {
        hh.amountPaid = params.amountPaid ?? hh.amountDue;
        hh.paidDate = today();
    } else if (params.status === "partial") {
        hh.amountPaid = params.amountPaid ?? hh.amountPaid;
        hh.paidDate = today();
    } else if (params.status === "unpaid") {
        hh.amountPaid = 0;
        hh.paidDate = undefined;
    } else if (params.status === "exempt") {
        hh.amountPaid = 0;
    }
    return delay(clone(withStats(c)), 300);
};

/* -------------------------------- Quản lý chi -------------------------------- */

export interface GetExpensesParams {
    organizationId?: string;
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
}

export const getExpenses = async (
    params: GetExpensesParams = {},
): Promise<ExpenseRecords> => {
    const { page = 0, limit = 20, keyword = "", status } = params;
    let list = [...expenses];
    if (status) {
        list = list.filter(e => e.status === status);
    }
    if (keyword) {
        list = list.filter(e =>
            matchKeyword(keyword, [e.name, e.purpose, e.neighborhoodGroup]),
        );
    }
    const { slice, ...meta } = paginate(list, page, limit);
    return delay({ expenses: slice, ...meta });
};

export const getExpenseDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ExpenseRecord | null> =>
    delay(clone(expenses.find(e => e.id === params.id) || null));

export interface SaveExpenseParams {
    organizationId?: string;
    payload: Partial<ExpenseRecord>;
}

export const createExpense = async (
    params: SaveExpenseParams,
): Promise<ExpenseRecord> => {
    const expense: ExpenseRecord = {
        id: newId("ex"),
        name: params.payload.name || "",
        purpose: params.payload.purpose || "",
        amount: params.payload.amount || 0,
        expenseDate: params.payload.expenseDate || today(),
        status: params.payload.status || "recorded",
        attachments: params.payload.attachments || [],
        createdAt: today(),
        ...params.payload,
    } as ExpenseRecord;
    expenses.unshift(expense);
    return delay(clone(expense), 400);
};
