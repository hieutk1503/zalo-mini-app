/**
 * Service API thật cho Quản lý thu / chi.
 * Cùng chữ ký với finance.services.mock để adapter hoán đổi theo môi trường.
 */
import {
    IncomeCampaign,
    IncomeCampaigns,
    PaymentStatus,
    ExpenseRecord,
    ExpenseRecords,
} from "@dts";
import { API } from "@constants/common";
import { generatePath } from "@utils/string";
import { request } from "./request";

const withOrgHeader = (organizationId?: string) =>
    organizationId
        ? { customHeader: { "x-organization-id": organizationId } }
        : undefined;

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
    const { organizationId, page = 0, limit = 20, ...rest } = params;
    return request<IncomeCampaigns>(
        "GET",
        API.INCOME_CAMPAIGNS,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getIncomeCampaignDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<IncomeCampaign | null> => {
    const url = generatePath(API.INCOME_CAMPAIGN_DETAIL, { id: params.id });
    return request<IncomeCampaign>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveIncomeCampaignParams {
    organizationId?: string;
    payload: Partial<IncomeCampaign>;
}

export const createIncomeCampaign = async (
    params: SaveIncomeCampaignParams,
): Promise<IncomeCampaign> =>
    request<IncomeCampaign>(
        "POST",
        API.INCOME_CAMPAIGNS,
        params.payload,
        withOrgHeader(params.organizationId),
    );

export const updatePaymentStatus = async (params: {
    id: string;
    paymentId: string;
    status: PaymentStatus;
    amountPaid?: number;
    organizationId?: string;
}): Promise<IncomeCampaign | null> => {
    const url = generatePath(API.INCOME_PAYMENT_STATUS, { id: params.id });
    return request<IncomeCampaign>(
        "POST",
        url,
        {
            paymentId: params.paymentId,
            status: params.status,
            amountPaid: params.amountPaid,
        },
        withOrgHeader(params.organizationId),
    );
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
    const { organizationId, page = 0, limit = 20, ...rest } = params;
    return request<ExpenseRecords>(
        "GET",
        API.EXPENSES,
        { page, pageSize: limit, ...rest },
        withOrgHeader(organizationId),
    );
};

export const getExpenseDetail = async (params: {
    id: string;
    organizationId?: string;
}): Promise<ExpenseRecord | null> => {
    const url = generatePath(API.EXPENSE_DETAIL, { id: params.id });
    return request<ExpenseRecord>(
        "GET",
        url,
        {},
        withOrgHeader(params.organizationId),
    );
};

export interface SaveExpenseParams {
    organizationId?: string;
    payload: Partial<ExpenseRecord>;
}

export const createExpense = async (
    params: SaveExpenseParams,
): Promise<ExpenseRecord> =>
    request<ExpenseRecord>(
        "POST",
        API.EXPENSES,
        params.payload,
        withOrgHeader(params.organizationId),
    );
