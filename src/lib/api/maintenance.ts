import { apiRequest } from "./base";

export interface GeneralMaintenanceRequest {
  id: number;
  title: string;
  description?: string;
  type: "preventive" | "corrective" | "emergency" | "upgrade" | "inspection";
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "postponed";
  location: string;
  equipment?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  actualCost?: number;
  assignedTechnicianId?: number;
  assignedTechnician?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  requestedById?: number;
  requestedBy?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  startedAt?: string;
  completedAt?: string;
  workPerformed?: string;
  materialsUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestDto {
  title: string;
  description?: string;
  type: "preventive" | "corrective" | "emergency" | "upgrade" | "inspection";
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  location: string;
  equipment?: string;
  scheduledDate?: string;
  scheduledStartTime?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  assignedTechnicianId?: number;
  requestedById?: number;
}

export interface UpdateMaintenanceRequestDto
  extends Partial<CreateMaintenanceRequestDto> {
  status?:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "postponed";
  actualCost?: number;
  startedAt?: string;
  completedAt?: string;
  workPerformed?: string;
  materialsUsed?: string;
}

export interface MaintenanceStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
    critical: number;
  };
}

export const maintenanceApi = {
  async getAll(): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>("/maintenance");
  },

  async getById(id: number): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(`/maintenance/${id}`);
  },

  async create(
    data: CreateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>("/maintenance", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: UpdateMaintenanceRequestDto,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(`/maintenance/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/maintenance/${id}`, {
      method: "DELETE",
    });
  },

  async getByStatus(status: string): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>(
      `/maintenance/status/${status}`,
    );
  },

  async getByPriority(priority: string): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>(
      `/maintenance/priority/${priority}`,
    );
  },

  async getByTechnician(
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>(
      `/maintenance/technician/${technicianId}`,
    );
  },

  async getOverdue(): Promise<GeneralMaintenanceRequest[]> {
    return apiRequest<GeneralMaintenanceRequest[]>("/maintenance/overdue");
  },

  async getUpcoming(days?: number): Promise<GeneralMaintenanceRequest[]> {
    const url = days
      ? `/maintenance/upcoming?days=${days}`
      : "/maintenance/upcoming";
    return apiRequest<GeneralMaintenanceRequest[]>(url);
  },

  async getStats(): Promise<MaintenanceStats> {
    return apiRequest<MaintenanceStats>("/maintenance/stats");
  },

  async assignTechnician(
    id: number,
    technicianId: number,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(
      `/maintenance/${id}/assign/${technicianId}`,
      {
        method: "PATCH",
      },
    );
  },

  async updateStatus(
    id: number,
    status: string,
  ): Promise<GeneralMaintenanceRequest> {
    return apiRequest<GeneralMaintenanceRequest>(
      `/maintenance/${id}/status/${status}`,
      {
        method: "PATCH",
      },
    );
  },
};
