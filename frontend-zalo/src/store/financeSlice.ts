import { StateCreator } from "zustand";
import {
    IncomeCampaign,
    IncomeCampaigns,
    PaymentStatus,
    ExpenseRecord,
    ExpenseRecords,
} from "@dts";
import { api } from "@service";
import {
    TOTAL_INCOME_PER_PAGE,
    TOTAL_EXPENSES_PER_PAGE,
} from "@constants/common";
import { OrganizationSlice } from "./organizationSlice";

export interface GetIncomeArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface GetExpensesArgs {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    append?: boolean;
}

export interface FinanceSlice {
    // Quản lý thu
    incomeCampaigns?: IncomeCampaigns;
    gettingIncomeCampaigns?: boolean;
    incomeCampaignsError?: boolean;
    incomeCampaignDetail?: IncomeCampaign | null;
    gettingIncomeCampaignDetail?: boolean;
    savingIncomeCampaign?: boolean;
    updatingPayment?: boolean;
    getIncomeCampaigns: (args?: GetIncomeArgs) => Promise<void>;
    getIncomeCampaignDetail: (id: string) => Promise<void>;
    createIncomeCampaign: (
        payload: Partial<IncomeCampaign>,
    ) => Promise<IncomeCampaign | null>;
    updatePaymentStatus: (
        id: string,
        paymentId: string,
        status: PaymentStatus,
        amountPaid?: number,
    ) => Promise<boolean>;

    // Quản lý chi
    expenses?: ExpenseRecords;
    gettingExpenses?: boolean;
    expensesError?: boolean;
    expenseDetail?: ExpenseRecord | null;
    gettingExpenseDetail?: boolean;
    savingExpense?: boolean;
    getExpenses: (args?: GetExpensesArgs) => Promise<void>;
    getExpenseDetail: (id: string) => Promise<void>;
    createExpense: (
        payload: Partial<ExpenseRecord>,
    ) => Promise<ExpenseRecord | null>;
}

const financeSlice: StateCreator<
    FinanceSlice & OrganizationSlice,
    [],
    [],
    FinanceSlice
> = (set, get) => ({
    /* -------------------------------- Quản lý thu -------------------------------- */
    getIncomeCampaigns: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_INCOME_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingIncomeCampaigns: true,
                incomeCampaignsError: false,
            }));
            const result = await api.getIncomeCampaigns({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                incomeCampaigns: {
                    ...result,
                    campaigns: append
                        ? [
                              ...(state.incomeCampaigns?.campaigns || []),
                              ...result.campaigns,
                          ]
                        : result.campaigns,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, incomeCampaignsError: true }));
        } finally {
            set(state => ({ ...state, gettingIncomeCampaigns: false }));
        }
    },
    getIncomeCampaignDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingIncomeCampaignDetail: true,
                incomeCampaignDetail: undefined,
            }));
            const detail = await api.getIncomeCampaignDetail({
                id,
                organizationId,
            });
            set(state => ({ ...state, incomeCampaignDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, incomeCampaignDetail: null }));
        } finally {
            set(state => ({ ...state, gettingIncomeCampaignDetail: false }));
        }
    },
    createIncomeCampaign: async payload => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingIncomeCampaign: true }));
            const saved = await api.createIncomeCampaign({
                payload,
                organizationId,
            });
            if (saved) {
                set(state => ({ ...state, incomeCampaignDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingIncomeCampaign: false }));
        }
    },
    updatePaymentStatus: async (id, paymentId, status, amountPaid) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, updatingPayment: true }));
            const updated = await api.updatePaymentStatus({
                id,
                paymentId,
                status,
                amountPaid,
                organizationId,
            });
            if (updated) {
                set(state => ({ ...state, incomeCampaignDetail: updated }));
            }
            return !!updated;
        } finally {
            set(state => ({ ...state, updatingPayment: false }));
        }
    },

    /* -------------------------------- Quản lý chi -------------------------------- */
    getExpenses: async (args = {}) => {
        const organizationId = get().organization?.id;
        const {
            page = 0,
            limit = TOTAL_EXPENSES_PER_PAGE,
            keyword,
            status,
            append,
        } = args;
        try {
            set(state => ({
                ...state,
                gettingExpenses: true,
                expensesError: false,
            }));
            const result = await api.getExpenses({
                organizationId,
                page,
                limit,
                keyword,
                status,
            });
            set(state => ({
                ...state,
                expenses: {
                    ...result,
                    expenses: append
                        ? [
                              ...(state.expenses?.expenses || []),
                              ...result.expenses,
                          ]
                        : result.expenses,
                },
            }));
        } catch (err) {
            set(state => ({ ...state, expensesError: true }));
        } finally {
            set(state => ({ ...state, gettingExpenses: false }));
        }
    },
    getExpenseDetail: async (id: string) => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({
                ...state,
                gettingExpenseDetail: true,
                expenseDetail: undefined,
            }));
            const detail = await api.getExpenseDetail({ id, organizationId });
            set(state => ({ ...state, expenseDetail: detail || null }));
        } catch (err) {
            set(state => ({ ...state, expenseDetail: null }));
        } finally {
            set(state => ({ ...state, gettingExpenseDetail: false }));
        }
    },
    createExpense: async payload => {
        const organizationId = get().organization?.id;
        try {
            set(state => ({ ...state, savingExpense: true }));
            const saved = await api.createExpense({ payload, organizationId });
            if (saved) {
                set(state => ({ ...state, expenseDetail: saved }));
            }
            return saved || null;
        } catch (err) {
            return null;
        } finally {
            set(state => ({ ...state, savingExpense: false }));
        }
    },
});

export default financeSlice;
