import { apiRequest } from "./base";
import { BaseEntity } from "../types";

export interface CashFlowEntry extends BaseEntity {
  type: CashFlowType;
  category: CashFlowCategory;
  amount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  description: string;
  referenceId?: string;
  referenceType?: string;
  transactionDate: string;
  recordedBy?: number;
  notes?: string;
}

export enum CashFlowType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum CashFlowCategory {
  // Income Categories
  ROOM_REVENUE = "ROOM_REVENUE",
  RESTAURANT_REVENUE = "RESTAURANT_REVENUE",
  EVENT_REVENUE = "EVENT_REVENUE",
  RECREATIONAL_REVENUE = "RECREATIONAL_REVENUE",
  PARKING_REVENUE = "PARKING_REVENUE",
  SERVICES_REVENUE = "SERVICES_REVENUE",
  OTHER_INCOME = "OTHER_INCOME",

  // Expense Categories
  STAFF_SALARIES = "STAFF_SALARIES",
  UTILITIES = "UTILITIES",
  MAINTENANCE = "MAINTENANCE",
  SUPPLIES = "SUPPLIES",
  FOOD_BEVERAGE_COST = "FOOD_BEVERAGE_COST",
  MARKETING = "MARKETING",
  INSURANCE = "INSURANCE",
  TAXES = "TAXES",
  RENT_MORTGAGE = "RENT_MORTGAGE",
  EQUIPMENT = "EQUIPMENT",
  PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
  CLEANING_SUPPLIES = "CLEANING_SUPPLIES",
  LINENS_TOWELS = "LINENS_TOWELS",
  AMENITIES = "AMENITIES",
  TECHNOLOGY = "TECHNOLOGY",
  TRAINING = "TRAINING",
  TRAVEL = "TRAVEL",
  OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
  OTHER_EXPENSES = "OTHER_EXPENSES",
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHECK = "CHECK",
  DIGITAL_WALLET = "DIGITAL_WALLET",
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  CRYPTOCURRENCY = "CRYPTOCURRENCY",
  GIFT_CARD = "GIFT_CARD",
  LOYALTY_POINTS = "LOYALTY_POINTS",
  OTHER = "OTHER",
}

export interface CashFlowQuery {
  type?: CashFlowType;
  category?: CashFlowCategory;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  referenceId?: string;
  referenceType?: string;
  search?: string;
  skip?: number;
  take?: number;
  order?: "asc" | "desc";
  sortBy?: string;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  period: string;
}

export interface CashFlowByCategory {
  category: string;
  type: CashFlowType;
  total: number;
  count: number;
}

export interface CashFlowByPeriod {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  date: string;
}

export interface CashFlowStatistics {
  summary: CashFlowSummary;
  byCategory: CashFlowByCategory[];
  byPeriod: CashFlowByPeriod[];
  trends: {
    incomeGrowth: number;
    expenseGrowth: number;
    netFlowTrend: number;
  };
}

export interface CreateCashFlowEntryDto {
  type: CashFlowType;
  category: CashFlowCategory;
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  description: string;
  referenceId?: string;
  referenceType?: string;
  transactionDate: string;
  recordedBy?: number;
  notes?: string;
}

export const cashFlowApi = {
  // Get all cash flow entries with filtering
  getAll: (
    query: CashFlowQuery = {},
  ): Promise<{ data: CashFlowEntry[]; total: number }> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    return apiRequest(`/cash-flow${queryString ? `?${queryString}` : ""}`);
  },

  // Create cash flow entry
  create: (data: CreateCashFlowEntryDto): Promise<CashFlowEntry> =>
    apiRequest("/cash-flow", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get cash flow entry by ID
  getById: (id: number): Promise<CashFlowEntry> =>
    apiRequest(`/cash-flow/${id}`),

  // Update cash flow entry
  update: (
    id: number,
    data: Partial<CreateCashFlowEntryDto>,
  ): Promise<CashFlowEntry> =>
    apiRequest(`/cash-flow/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete cash flow entry
  delete: (id: number): Promise<{ message: string }> =>
    apiRequest(`/cash-flow/${id}`, {
      method: "DELETE",
    }),

  // Get cash flow summary
  getSummary: (
    startDate: string,
    endDate: string,
  ): Promise<CashFlowSummary> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return apiRequest(`/cash-flow/summary?${params.toString()}`);
  },

  // Get cash flow by category
  getByCategory: (
    startDate: string,
    endDate: string,
  ): Promise<CashFlowByCategory[]> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return apiRequest(`/cash-flow/by-category?${params.toString()}`);
  },

  // Get cash flow by period
  getByPeriod: (
    startDate: string,
    endDate: string,
    period: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<CashFlowByPeriod[]> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      period,
    });
    return apiRequest(`/cash-flow/by-period?${params.toString()}`);
  },

  // Get cash flow statistics
  getStatistics: (
    startDate: string,
    endDate: string,
    period: "daily" | "weekly" | "monthly" = "daily",
  ): Promise<CashFlowStatistics> => {
    const params = new URLSearchParams({
      startDate,
      endDate,
      period,
    });
    return apiRequest(`/cash-flow/statistics?${params.toString()}`);
  },
};
