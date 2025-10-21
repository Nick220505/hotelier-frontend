import { apiRequest } from "./base";
import { DashboardStats, DashboardActivity, DashboardRevenue } from "../types";

// Dashboard API for main dashboard statistics and data
export const dashboardApi = {
  // Get dashboard statistics
  getStats: (): Promise<DashboardStats> => apiRequest("/dashboard/stats"),

  // Get recent activity
  getActivity: (): Promise<DashboardActivity[]> =>
    apiRequest("/dashboard/activity"),

  // Get revenue information
  getRevenue: (): Promise<DashboardRevenue> => apiRequest("/dashboard/revenue"),
};
