import { apiRequest, getAPIBaseURL } from "./base";
import { authCookies } from "../auth-cookies";

// Billing types
export interface Invoice {
  id: string;
  number: string;
  guest: string;
  room: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: "pagada" | "pendiente" | "vencida" | "cancelada";
  paymentMethod?: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "CHECK"
  | "MOBILE_PAYMENT"
  | "CRYPTOCURRENCY"
  | "GIFT_CARD";
export type PaymentStatus =
  | "completado"
  | "pendiente"
  | "fallido"
  | "reembolsado";

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  status: string;
  notes?: string;
}

export interface FinancialReport {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  invoices: number;
  paid?: number;
  pending: number;
  paymentPercentage: number;
}

export interface CreateInvoiceDto {
  guestName: string;
  roomNumber: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxes: number;
  total: number;
  reservationId: number;
  paymentMethod?: string;
  invoiceItems: Array<{
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

// Backend types matching the backend DTOs
interface BackendPayment {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  status: string;
  processedAt?: string;
  createdAt: string;
  reference?: string;
  notes?: string;
}
interface BackendInvoice {
  id: number;
  number: string;
  guestName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxes: number;
  total: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  paymentMethod?:
    | "CASH"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "BANK_TRANSFER"
    | "CHECK";
  reservationId: number;
  reservation?: {
    room: {
      number: string;
    };
    user?: {
      name: string;
    };
  };
  invoiceItems: BackendInvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface BackendInvoiceItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface BackendBillingStats {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceAmount: number;
}

// Transform functions to convert backend data to frontend format
function transformInvoice(backendInvoice: BackendInvoice): Invoice {
  return {
    id: backendInvoice.id.toString(),
    number: backendInvoice.number,
    guest: backendInvoice.guestName,
    room: backendInvoice.reservation?.room?.number || "N/A",
    issueDate: backendInvoice.issueDate.split("T")[0],
    dueDate: backendInvoice.dueDate.split("T")[0],
    subtotal: parseFloat(backendInvoice.subtotal.toString()) || 0,
    taxes: parseFloat(backendInvoice.taxes.toString()) || 0,
    total: parseFloat(backendInvoice.total.toString()) || 0,
    status: transformInvoiceStatus(backendInvoice.status),
    paymentMethod: transformPaymentMethod(backendInvoice.paymentMethod),
    items: (backendInvoice.invoiceItems || []).map(transformInvoiceItem),
    createdAt: new Date(backendInvoice.createdAt).toISOString(),
    updatedAt: new Date(backendInvoice.updatedAt).toISOString(),
  };
}

function transformInvoiceItem(backendItem: BackendInvoiceItem): InvoiceItem {
  return {
    description: backendItem.description,
    quantity: parseInt(backendItem.quantity.toString()) || 0,
    price: parseFloat(backendItem.price.toString()) || 0,
    total: parseFloat(backendItem.total.toString()) || 0,
  };
}

function transformInvoiceStatus(
  status: string,
): "pagada" | "pendiente" | "vencida" | "cancelada" {
  switch (status) {
    case "PAID":
      return "pagada";
    case "PENDING":
      return "pendiente";
    case "OVERDUE":
      return "vencida";
    case "CANCELLED":
      return "cancelada";
    default:
      return "pendiente";
  }
}

function transformPaymentMethod(method?: string): PaymentMethod | undefined {
  if (!method) return undefined;
  
  // Asegurarse de que el método de pago sea uno de los valores válidos
  const validMethods: PaymentMethod[] = [
    "CASH",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "BANK_TRANSFER",
    "CHECK",
    "MOBILE_PAYMENT",
    "CRYPTOCURRENCY",
    "GIFT_CARD"
  ];
  
  return validMethods.includes(method as PaymentMethod) 
    ? method as PaymentMethod 
    : "CASH"; // Valor por defecto si el método no es válido
}

function transformPaymentStatus(
  status: string,
): "completado" | "pendiente" | "fallido" | "reembolsado" {
  switch (status) {
    case "COMPLETED":
      return "completado";
    case "PENDING":
      return "pendiente";
    case "FAILED":
      return "fallido";
    case "REFUNDED":
      return "reembolsado";
    default:
      return "pendiente";
  }
}

function transformBillingStatsToReport(
  stats: BackendBillingStats,
): FinancialReport {
  const totalInvoices = stats.paidInvoices + stats.pendingInvoices;
  const revenue = stats.totalRevenue;
  const expenses = revenue * 0.35; // Estimated
  const profit = revenue - expenses;

  return {
    period: "Mes actual",
    revenue: revenue,
    expenses: expenses,
    profit: profit,
    invoices: totalInvoices,
    paid: stats.paidInvoices,
    pending: stats.pendingInvoices,
    paymentPercentage:
      totalInvoices > 0 ? (stats.paidInvoices / totalInvoices) * 100 : 0,
  };
}

// Billing API client
export const billingApi = {
  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const backendInvoices = (await apiRequest(
      "/billing/invoices",
    )) as BackendInvoice[];
    return backendInvoices.map(transformInvoice);
  },

  getInvoicesByStatus: async (status: string): Promise<Invoice[]> => {
    const statusMap: Record<string, string> = {
      pagada: "PAID",
      pendiente: "PENDING",
      vencida: "OVERDUE",
      cancelada: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendInvoices = (await apiRequest(
      `/billing/invoices?status=${backendStatus}`,
    )) as BackendInvoice[];
    return backendInvoices.map(transformInvoice);
  },

  getOverdueInvoices: async (): Promise<Invoice[]> => {
    const backendInvoices = (await apiRequest(
      "/billing/invoices/overdue",
    )) as BackendInvoice[];
    return backendInvoices.map(transformInvoice);
  },

  getInvoicesByDateRange: async (
    startDate: string,
    endDate: string,
  ): Promise<Invoice[]> => {
    const backendInvoices = (await apiRequest(
      `/billing/invoices/date-range?startDate=${startDate}&endDate=${endDate}`,
    )) as BackendInvoice[];
    return backendInvoices.map(transformInvoice);
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    try {
      const backendInvoice = (await apiRequest(
        `/billing/invoices/${id}`,
      )) as BackendInvoice;
      return transformInvoice(backendInvoice);
    } catch {
      return null;
    }
  },

  createInvoice: async (invoiceData: CreateInvoiceDto): Promise<Invoice> => {
    // Asegurarse de que las fechas se envíen como ISO strings
    const backendData = {
      ...invoiceData,
      issueDate: invoiceData.issueDate.toISOString(),
      dueDate: invoiceData.dueDate.toISOString(),
    };

    const backendInvoice = (await apiRequest("/billing/invoices", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendInvoice;

    return transformInvoice(backendInvoice);
  },

  updateInvoice: async (
    id: string,
    invoiceData: Partial<Invoice>,
  ): Promise<Invoice> => {
    const backendData = {
      guestName: invoiceData.guest,
      dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined,
      subtotal: invoiceData.subtotal,
      taxes: invoiceData.taxes,
      total: invoiceData.total,
      status: invoiceData.status?.toUpperCase(),
    };

    const backendInvoice = (await apiRequest(`/billing/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })) as BackendInvoice;

    return transformInvoice(backendInvoice);
  },

  markInvoiceAsPaid: async (
    id: string,
    paymentMethod: string,
  ): Promise<Invoice> => {
  const backendMethod = paymentMethod;    const backendInvoice = (await apiRequest(
      `/billing/invoices/${id}/mark-paid`,
      {
        method: "PUT",
        body: JSON.stringify({ paymentMethod: backendMethod }),
      },
    )) as BackendInvoice;

    return transformInvoice(backendInvoice);
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await apiRequest(`/billing/invoices/${id}`, {
      method: "DELETE",
    });
  },

  // Statistics and reports
  getBillingStatistics: async (): Promise<FinancialReport> => {
    const stats = (await apiRequest(
      "/billing/invoices/statistics",
    )) as BackendBillingStats;
    return transformBillingStatsToReport(stats);
  },

  // Mock payments data - this would be implemented when payment tracking is added to backend
  getPayments: async (): Promise<Payment[]> => {
    try {
      const backendPayments = (await apiRequest(
        "/billing/payments",
      )) as BackendPayment[];
      return backendPayments.map((payment: BackendPayment) => ({
        id: payment.id.toString(),
        invoiceId: payment.invoiceId.toString(),
        amount: payment.amount,
        method: transformPaymentMethod(payment.method) || "desconocido",
        status: transformPaymentStatus(payment.status),
        date: payment.processedAt
          ? payment.processedAt.split("T")[0]
          : payment.createdAt.split("T")[0],
        reference: payment.reference || "",
        notes: payment.notes || "",
      }));
    } catch (error) {
      console.error("Error fetching payments:", error);
      return [];
    }
  },

  // Financial reports - basic implementation using billing stats
  getFinancialReports: async (): Promise<FinancialReport[]> => {
    const stats = await billingApi.getBillingStatistics();
    return [stats];
  },

  // Download invoice as PDF
  downloadInvoice: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${getAPIBaseURL()}/billing/invoices/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${authCookies.getAccessToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `factura-${id}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create blob URL
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw new Error('No se pudo descargar la factura');
    }
  },
};
