import { apiRequest } from "./base";

// Maintenance types
export interface MaintenanceReport {
  id: number;
  reportNumber?: string;
  room?: string;
  roomNumber?: string;
  type: string;
  issueType?: string;
  description: string;
  priority: string;
  severity?: "low" | "medium" | "high" | "urgent";
  status: "pendiente" | "en_proceso" | "completado" | "cancelado";
  reportedBy: string;
  assignedTo?: string;
  assignedTechnician?: string;
  estimatedCompletionTime?: string;
  estimatedTime?: string;
  startedAt?: string;
  completedAt?: string;
  actualCompletionTime?: string;
  cost?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend types (matching Prisma models)
interface BackendMaintenanceReport {
  id: number;
  reportNumber: string;
  roomId?: number;
  type:
    | "ELECTRICAL"
    | "PLUMBING"
    | "HVAC"
    | "FURNITURE"
    | "APPLIANCES"
    | "STRUCTURAL"
    | "COSMETIC";
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  reportedBy: string;
  assignedTechnician?: string;
  estimatedTime?: string;
  startedAt?: string;
  completedAt?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  room?: {
    id: number;
    number: string;
  };
}

interface BackendCleaningAssignment {
  id: number;
  employeeId?: number;
  roomId: number;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "INSPECTED"
    | "NEEDS_MAINTENANCE";
  notes?: string;
  qualityScore?: number;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: number;
    name: string;
    department: string;
  };
  room?: {
    id: number;
    number: string;
  };
}

interface BackendHousekeepingStatistics {
  maintenance: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  cleaning: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

// Frontend types - removed duplicate MaintenanceReport interface

export interface CleaningAssignment {
  id: string;
  employeeName: string;
  roomNumber: string;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status: string;
  notes?: string;
  qualityScore?: number;
}

export interface HousekeepingStatistics {
  maintenance: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  cleaning: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
}

export interface Room {
  id: number;
  number: string;
  type: string;
}

// Transform functions
function transformMaintenanceReport(
  backendReport: BackendMaintenanceReport,
): MaintenanceReport {
  return {
    id: backendReport.id,
    reportNumber: backendReport.reportNumber,
    room: backendReport.room?.number,
    type: getMaintenanceTypeInSpanish(backendReport.type),
    description: backendReport.description,
    priority: getPriorityInSpanish(backendReport.priority),
    status: getMaintenanceStatusInSpanish(backendReport.status),
    reportedBy: backendReport.reportedBy,
    assignedTechnician: backendReport.assignedTechnician,
    estimatedTime: backendReport.estimatedTime,
    startedAt: backendReport.startedAt
      ? backendReport.startedAt.split("T")[0]
      : undefined,
    completedAt: backendReport.completedAt
      ? backendReport.completedAt.split("T")[0]
      : undefined,
    cost: backendReport.cost,
    notes: backendReport.notes,
  };
}

function transformCleaningAssignment(
  backendAssignment: BackendCleaningAssignment,
): CleaningAssignment {
  return {
    id: backendAssignment.id.toString(),
    employeeName: backendAssignment.employee?.name || 'Sin asignar',
    roomNumber: backendAssignment.room?.number || 'N/A',
    assignedDate: backendAssignment.assignedDate.split("T")[0],
    startedAt: backendAssignment.startedAt
      ? backendAssignment.startedAt.split("T")[0]
      : undefined,
    completedAt: backendAssignment.completedAt
      ? backendAssignment.completedAt.split("T")[0]
      : undefined,
    status: getCleaningStatusInSpanish(backendAssignment.status),
    notes: backendAssignment.notes,
    qualityScore: backendAssignment.qualityScore,
  };
}

// Translation helper functions
function getMaintenanceTypeInSpanish(type: string): string {
  const typeMap: Record<string, string> = {
    ELECTRICAL: "Eléctrico",
    PLUMBING: "Plomería",
    HVAC: "Climatización",
    FURNITURE: "Mobiliario",
    APPLIANCES: "Electrodomésticos",
    STRUCTURAL: "Estructural",
    COSMETIC: "Estético",
  };
  return typeMap[type] || type;
}

function getPriorityInSpanish(priority: string): string {
  const priorityMap: Record<string, string> = {
    LOW: "baja",
    NORMAL: "media",
    HIGH: "alta",
    URGENT: "urgente",
  };
  return priorityMap[priority] || priority.toLowerCase();
}

function getMaintenanceStatusInSpanish(
  status: string,
): "pendiente" | "en_proceso" | "completado" | "cancelado" {
  const statusMap: Record<
    string,
    "pendiente" | "en_proceso" | "completado" | "cancelado"
  > = {
    PENDING: "pendiente",
    IN_PROGRESS: "en_proceso",
    COMPLETED: "completado",
    CANCELLED: "cancelado",
  };
  return statusMap[status] || "pendiente";
}

function getCleaningStatusInSpanish(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "pendiente",
    IN_PROGRESS: "en_proceso",
    COMPLETED: "completado",
    INSPECTED: "inspeccionado",
    NEEDS_MAINTENANCE: "necesita_mantenimiento",
  };
  return statusMap[status] || status.toLowerCase();
}

export const housekeepingApi = {
  // Maintenance Reports
  getMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports",
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getPendingMaintenanceReports: async (): Promise<MaintenanceReport[]> => {
    const backendReports = (await apiRequest(
      "/housekeeping/maintenance-reports/pending",
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByStatus: async (
    status: string,
  ): Promise<MaintenanceReport[]> => {
    const statusMap: Record<string, string> = {
      pendiente: "PENDING",
      en_proceso: "IN_PROGRESS",
      completado: "COMPLETED",
      cancelado: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendReports = (await apiRequest(
      `/housekeeping/maintenance-reports/by-status?status=${backendStatus}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByPriority: async (
    priority: string,
  ): Promise<MaintenanceReport[]> => {
    const priorityMap: Record<string, string> = {
      baja: "LOW",
      media: "NORMAL",
      alta: "HIGH",
      urgente: "URGENT",
    };
    const backendPriority = priorityMap[priority] || priority.toUpperCase();
    const backendReports = (await apiRequest(
      `/housekeeping/maintenance-reports/by-priority?priority=${backendPriority}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  getMaintenanceReportsByType: async (
    type: string,
  ): Promise<MaintenanceReport[]> => {
    const typeMap: Record<string, string> = {
      Eléctrico: "ELECTRICAL",
      Plomería: "PLUMBING",
      Climatización: "HVAC",
      Mobiliario: "FURNITURE",
      Electrodomésticos: "APPLIANCES",
      Estructural: "STRUCTURAL",
      Estético: "COSMETIC",
    };
    const backendType = typeMap[type] || type.toUpperCase();
    const backendReports = (await apiRequest(
      `/housekeeping/maintenance-reports/by-type?type=${backendType}`,
    )) as BackendMaintenanceReport[];
    return backendReports.map(transformMaintenanceReport);
  },

  createMaintenanceReport: async (
    reportData: Partial<MaintenanceReport>,
  ): Promise<MaintenanceReport> => {
    const backendData = {
      reportNumber: reportData.reportNumber || `MNT${Date.now()}`,
      type: "GENERAL",
      description: reportData.description,
      priority: "NORMAL",
      reportedBy: reportData.reportedBy || "Sistema",
      assignedTechnician: reportData.assignedTechnician,
      estimatedTime: reportData.estimatedTime,
    };

    const backendReport = (await apiRequest(
      "/housekeeping/maintenance-reports",
      {
        method: "POST",
        body: JSON.stringify(backendData),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  startMaintenanceWork: async (
    id: string,
    assignedTechnician?: string,
  ): Promise<MaintenanceReport> => {
    const backendReport = (await apiRequest(
      `/housekeeping/maintenance-reports/${id}/start`,
      {
        method: "PUT",
        body: JSON.stringify({ assignedTechnician }),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  completeMaintenanceWork: async (
    id: string,
    cost?: number,
    notes?: string,
  ): Promise<MaintenanceReport> => {
    const backendReport = (await apiRequest(
      `/housekeeping/maintenance-reports/${id}/complete`,
      {
        method: "PUT",
        body: JSON.stringify({ cost, notes }),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },

  // Cleaning Assignments
  getCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/cleaning-assignments",
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  getTodaysCleaningAssignments: async (): Promise<CleaningAssignment[]> => {
    const backendAssignments = (await apiRequest(
      "/housekeeping/cleaning-assignments/today",
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  getCleaningAssignmentsByStatus: async (
    status: string,
  ): Promise<CleaningAssignment[]> => {
    const statusMap: Record<string, string> = {
      pendiente: "PENDING",
      en_proceso: "IN_PROGRESS",
      completado: "COMPLETED",
      inspeccionado: "INSPECTED",
      necesita_mantenimiento: "NEEDS_MAINTENANCE",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendAssignments = (await apiRequest(
      `/housekeeping/cleaning-assignments/by-status?status=${backendStatus}`,
    )) as BackendCleaningAssignment[];
    return backendAssignments.map(transformCleaningAssignment);
  },

  startCleaningWork: async (id: string): Promise<CleaningAssignment> => {
    const backendAssignment = (await apiRequest(
      `/housekeeping/cleaning-assignments/${id}/start`,
      {
        method: "PUT",
      },
    )) as BackendCleaningAssignment;

    return transformCleaningAssignment(backendAssignment);
  },

  completeCleaningWork: async (
    id: string,
    qualityScore?: number,
    notes?: string,
  ): Promise<CleaningAssignment> => {
    const backendAssignment = (await apiRequest(
      `/housekeeping/cleaning-assignments/${id}/complete`,
      {
        method: "PUT",
        body: JSON.stringify({ qualityScore, notes }),
      },
    )) as BackendCleaningAssignment;

    return transformCleaningAssignment(backendAssignment);
  },

  // Statistics
  getStatistics: async (): Promise<HousekeepingStatistics> => {
    return (await apiRequest(
      "/housekeeping/statistics",
    )) as BackendHousekeepingStatistics;
  },

  getMaintenanceCosts: async (startDate: string, endDate: string) => {
    return await apiRequest(
      `/housekeeping/maintenance-costs?startDate=${startDate}&endDate=${endDate}`,
    );
  },

  getCleaningPerformance: async (employeeId?: string) => {
    const url = employeeId
      ? `/housekeeping/cleaning-performance?employeeId=${employeeId}`
      : "/housekeeping/cleaning-performance";
    return await apiRequest(url);
  },

  getRoomsForIncidentReports: async (): Promise<Room[]> => {
    return (await apiRequest(
      "/housekeeping/rooms/for-incident-reports",
    )) as Room[];
  },

  createIncidentReport: async (incidentData: {
    roomNumber: string;
    type: string;
    priority: string;
    description: string;
    reportedBy?: string;
  }): Promise<MaintenanceReport> => {
    // Map frontend types to backend enums
    const typeMap: Record<string, string> = {
      "Plomería": "PLUMBING",
      "Electricidad": "ELECTRICAL",
      "Aire Acondicionado": "HVAC",
      "Mobiliario": "FURNITURE",
      "Electrodomésticos": "APPLIANCES",
      "Estructural": "STRUCTURAL",
      "Estético": "COSMETIC",
      "General": "GENERAL",
    };

    const priorityMap: Record<string, string> = {
      "baja": "LOW",
      "media": "NORMAL", 
      "alta": "HIGH",
      "crítica": "URGENT",
    };

    const backendData = {
      roomNumber: incidentData.roomNumber,
      type: typeMap[incidentData.type] || "GENERAL",
      priority: priorityMap[incidentData.priority] || "NORMAL",
      description: incidentData.description,
      reportedBy: incidentData.reportedBy || "Housekeeping Staff",
    };

    const backendReport = (await apiRequest(
      "/housekeeping/incident-reports",
      {
        method: "POST",
        body: JSON.stringify(backendData),
      },
    )) as BackendMaintenanceReport;

    return transformMaintenanceReport(backendReport);
  },
};
