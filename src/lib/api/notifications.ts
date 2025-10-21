import { apiRequest } from "./base";

export type NotificationType = "INFO" | "WARNING" | "ALERT";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  refId?: number | null;
  refType?: string | null;
  isRead: boolean;
  userId?: number | null;
  createdAt: string;
}

export const notificationsApi = {
  list: (includeRead = false): Promise<Notification[]> =>
    apiRequest(`/notifications?includeRead=${includeRead}`),

  markRead: (id: number): Promise<void> =>
    apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllRead: (): Promise<void> =>
    apiRequest(`/notifications/read-all`, { method: "PATCH" }),
};
