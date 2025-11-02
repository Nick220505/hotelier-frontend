import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";

// Employee types
export type Department =
  | "FRONT_DESK"
  | "HOUSEKEEPING"
  | "MAINTENANCE"
  | "RESTAURANT"
  | "MANAGEMENT"
  | "SECURITY"
  | "VALET";

export interface Employee extends BaseEntity {
  employeeId: string;
  name: string;
  department: Department;
  position: string;
  shift?: string;
  assignedRooms?: number;
  completedRooms?: number;
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  currentLocation?: string;
}

export interface HousekeepingEmployee extends Employee {
  assignedRooms: number;
  completedRooms: number;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  currentLocation?: string;
}

export interface DepartmentStats {
  department: Department;
  activeCount: number;
  totalCount: number;
}

// Create base CRUD operations
const baseApi = createApiEndpoints<Employee>("/employees");

// Extended employees API
export const employeesApi = {
  // Base CRUD operations
  ...baseApi,

  // Specialized endpoints
  getHousekeeping: (): Promise<Employee[]> =>
    apiRequest("/employees/housekeeping"),
  getByDepartment: (department: string): Promise<Employee[]> =>
    apiRequest(`/employees/department/${department}`),
  getDepartmentStats: (): Promise<DepartmentStats[]> =>
    apiRequest("/employees/stats/departments"),
};
