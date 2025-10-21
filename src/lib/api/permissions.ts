import { apiRequest, createApiEndpoints } from "./base";

export interface Permission {
  id: string;
  employeeId: string;
  employee: string;
  type: "VACATION" | "SICK_LEAVE" | "PERSONAL" | "OTHER";
  reason: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const baseApi = createApiEndpoints<Permission>("/permissions");

export const permissionsApi = {
  ...baseApi,

  getByEmployee: (employeeId: string): Promise<Permission[]> =>
    apiRequest(`/permissions/employee/${employeeId}`),

  getByStatus: (status: string): Promise<Permission[]> =>
    apiRequest(`/permissions/status/${status}`),

  getByType: (type: string): Promise<Permission[]> =>
    apiRequest(`/permissions/type/${type}`),

  getByDateRange: (startDate: string, endDate: string): Promise<Permission[]> =>
    apiRequest(`/permissions/range/${startDate}/${endDate}`),

  approve: (id: number, approvedBy: string): Promise<Permission> =>
    apiRequest(`/permissions/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approvedBy }),
    }),

  reject: (id: number): Promise<Permission> =>
    apiRequest(`/permissions/${id}/reject`, { method: "PATCH" }),
};
