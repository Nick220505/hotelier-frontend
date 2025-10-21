import { apiRequest } from "./base";

// Backend types (matching Prisma models)
interface BackendVehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: "CAR" | "MOTORCYCLE" | "VAN" | "TRUCK" | "OTHER";
  owner: string;
  room?: string;
  guestType: "GUEST" | "VISITOR" | "EMPLOYEE" | "SUPPLIER" | "OTHER";
  assignedSpace?: string;
  entryTime: string;
  exitTime?: string;
  status: "PARKED" | "EXITED" | "BLOCKED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  space?: BackendParkingSpace;
  incidents?: BackendParkingIncident[];
}

interface BackendParkingSpace {
  id: number;
  code: string;
  zone: string;
  type: "GUEST" | "VISITOR" | "EMPLOYEE" | "LOADING" | "DISABLED" | "VIP";
  status:
    | "AVAILABLE"
    | "OCCUPIED"
    | "RESERVED"
    | "MAINTENANCE"
    | "OUT_OF_ORDER";
  currentVehicle?: string;
  hourlyRate: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  vehicles?: BackendVehicle[];
  incidents?: BackendParkingIncident[];
}

interface BackendParkingIncident {
  id: number;
  type:
    | "VEHICLE_DAMAGE"
    | "INFRASTRUCTURE"
    | "SECURITY"
    | "ACCIDENT"
    | "THEFT"
    | "OTHER";
  description: string;
  vehicleId?: number;
  spaceId?: number;
  reportDate: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  responsible: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: BackendVehicle;
  space?: BackendParkingSpace;
}

// Frontend types (matching frontend UI expectations)
export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  owner: string;
  room?: string;
  guestType: string;
  assignedSpace?: string;
  entryTime: string;
  exitTime?: string;
  status: string;
  notes?: string;
}

export interface ParkingSpace {
  id: string;
  code: string;
  zone: string;
  type: string;
  status: string;
  currentVehicle?: string;
  hourlyRate: number;
  location: string;
}

export interface ParkingIncident {
  id: string;
  type: string;
  description: string;
  vehicle?: string;
  space?: string;
  reportDate: string;
  status: string;
  responsible: string;
  priority: string;
  resolution?: string;
  resolvedAt?: string;
}

export interface ParkingStatistics {
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  maintenanceSpaces: number;
  occupancyRate: number;
  totalVehicles: number;
  parkedVehicles: number;
  pendingIncidents: number;
}

// Transform functions to convert backend data to frontend format
function transformVehicle(backendVehicle: BackendVehicle): Vehicle {
  return {
    id: backendVehicle.id.toString(),
    licensePlate: backendVehicle.licensePlate,
    brand: backendVehicle.brand,
    model: backendVehicle.model,
    color: backendVehicle.color,
    type: getVehicleTypeInSpanish(backendVehicle.type),
    owner: backendVehicle.owner,
    room: backendVehicle.room,
    guestType: getGuestTypeInSpanish(backendVehicle.guestType),
    assignedSpace: backendVehicle.assignedSpace,
    entryTime:
      backendVehicle.entryTime.split("T")[0] +
      " " +
      backendVehicle.entryTime.split("T")[1].split(".")[0],
    exitTime: backendVehicle.exitTime
      ? backendVehicle.exitTime.split("T")[0] +
        " " +
        backendVehicle.exitTime.split("T")[1].split(".")[0]
      : undefined,
    status: getVehicleStatusInSpanish(backendVehicle.status),
    notes: backendVehicle.notes,
  };
}

function transformParkingSpace(
  backendSpace: BackendParkingSpace,
): ParkingSpace {
  return {
    id: backendSpace.id.toString(),
    code: backendSpace.code,
    zone: backendSpace.zone,
    type: getSpaceTypeInSpanish(backendSpace.type),
    status: getSpaceStatusInSpanish(backendSpace.status),
    currentVehicle: backendSpace.currentVehicle,
    hourlyRate: backendSpace.hourlyRate,
    location: backendSpace.location,
  };
}

function transformParkingIncident(
  backendIncident: BackendParkingIncident,
): ParkingIncident {
  return {
    id: backendIncident.id.toString(),
    type: getIncidentTypeInSpanish(backendIncident.type),
    description: backendIncident.description,
    vehicle: backendIncident.vehicle?.licensePlate,
    space: backendIncident.space?.code,
    reportDate: backendIncident.reportDate.split("T")[0],
    status: getIncidentStatusInSpanish(backendIncident.status),
    responsible: backendIncident.responsible,
    priority: getPriorityInSpanish(backendIncident.priority),
    resolution: backendIncident.resolution,
    resolvedAt: backendIncident.resolvedAt
      ? backendIncident.resolvedAt.split("T")[0]
      : undefined,
  };
}

// Translation helper functions
function getVehicleTypeInSpanish(type: string): string {
  const typeMap: Record<string, string> = {
    CAR: "Automóvil",
    MOTORCYCLE: "Motocicleta",
    VAN: "Van",
    TRUCK: "Camión",
    OTHER: "Otro",
  };
  return typeMap[type] || type;
}

function getGuestTypeInSpanish(type: string): string {
  const typeMap: Record<string, string> = {
    GUEST: "guest",
    VISITOR: "visitante",
    EMPLOYEE: "empleado",
    SUPPLIER: "proveedor",
    OTHER: "otro",
  };
  return typeMap[type] || type.toLowerCase();
}

function getVehicleStatusInSpanish(status: string): string {
  const statusMap: Record<string, string> = {
    PARKED: "parqueado",
    EXITED: "salido",
    BLOCKED: "bloqueado",
  };
  return statusMap[status] || status.toLowerCase();
}

function getSpaceTypeInSpanish(type: string): string {
  const typeMap: Record<string, string> = {
    GUEST: "Huéspedes",
    VISITOR: "Visitantes",
    EMPLOYEE: "Empleados",
    LOADING: "Carga/Descarga",
    DISABLED: "Discapacitados",
    VIP: "VIP",
  };
  return typeMap[type] || type;
}

function getSpaceStatusInSpanish(status: string): string {
  const statusMap: Record<string, string> = {
    AVAILABLE: "disponible",
    OCCUPIED: "ocupado",
    RESERVED: "reservado",
    MAINTENANCE: "mantenimiento",
    OUT_OF_ORDER: "fuera_de_servicio",
  };
  return statusMap[status] || status.toLowerCase();
}

function getIncidentTypeInSpanish(type: string): string {
  const typeMap: Record<string, string> = {
    VEHICLE_DAMAGE: "Daño Vehículo",
    INFRASTRUCTURE: "Infraestructura",
    SECURITY: "Seguridad",
    ACCIDENT: "Accidente",
    THEFT: "Robo",
    OTHER: "Otro",
  };
  return typeMap[type] || type;
}

function getIncidentStatusInSpanish(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "pendiente",
    IN_PROGRESS: "en_proceso",
    RESOLVED: "resuelto",
    CANCELLED: "cancelado",
  };
  return statusMap[status] || status.toLowerCase();
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

export const parkingApi = {
  // Vehicle management
  getVehicles: async (): Promise<Vehicle[]> => {
    const backendVehicles = (await apiRequest(
      "/parking/vehicles",
    )) as BackendVehicle[];
    return backendVehicles.map(transformVehicle);
  },

  getVehiclesByStatus: async (status: string): Promise<Vehicle[]> => {
    const statusMap: Record<string, string> = {
      parqueado: "PARKED",
      salido: "EXITED",
      bloqueado: "BLOCKED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendVehicles = (await apiRequest(
      `/parking/vehicles/by-status?status=${backendStatus}`,
    )) as BackendVehicle[];
    return backendVehicles.map(transformVehicle);
  },

  getVehiclesByGuestType: async (guestType: string): Promise<Vehicle[]> => {
    const typeMap: Record<string, string> = {
      guest: "GUEST",
      visitante: "VISITOR",
      empleado: "EMPLOYEE",
      proveedor: "SUPPLIER",
      otro: "OTHER",
    };
    const backendType = typeMap[guestType] || guestType.toUpperCase();
    const backendVehicles = (await apiRequest(
      `/parking/vehicles/by-guest-type?guestType=${backendType}`,
    )) as BackendVehicle[];
    return backendVehicles.map(transformVehicle);
  },

  createVehicle: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    // Mapear tipos de frontend a backend
    const typeMap: Record<string, string> = {
      "Automóvil": "CAR",
      "Motocicleta": "MOTORCYCLE",
      "Camioneta": "VAN",
      "Camión": "TRUCK",
      "Otro": "OTHER"
    };

    const guestTypeMap: Record<string, string> = {
      "guest": "GUEST",
      "visitante": "VISITOR",
      "employee": "EMPLOYEE",
      "empleado": "EMPLOYEE"
    };

    const backendData = {
      licensePlate: vehicleData.licensePlate,
      brand: vehicleData.brand,
      model: vehicleData.model,
      color: vehicleData.color,
      type: typeMap[vehicleData.type || ""] || "OTHER",
      owner: vehicleData.owner,
      room: vehicleData.room || undefined,
      guestType: guestTypeMap[vehicleData.guestType || ""] || "VISITOR",
      assignedSpace: vehicleData.assignedSpace,
      notes: vehicleData.notes || undefined,
    };

    const backendVehicle = (await apiRequest("/parking/vehicles", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendVehicle;

    return transformVehicle(backendVehicle);
  },

  checkOutVehicle: async (id: string): Promise<Vehicle> => {
    const backendVehicle = (await apiRequest(
      `/parking/vehicles/${id}/checkout`,
      {
        method: "PUT",
      },
    )) as BackendVehicle;

    return transformVehicle(backendVehicle);
  },

  // Parking space management
  getParkingSpaces: async (): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      "/parking/spaces",
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getAvailableSpaces: async (): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      "/parking/spaces/available",
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getSpacesByType: async (type: string): Promise<ParkingSpace[]> => {
    const typeMap: Record<string, string> = {
      Huéspedes: "GUEST",
      Visitantes: "VISITOR",
      Empleados: "EMPLOYEE",
      "Carga/Descarga": "LOADING",
      Discapacitados: "DISABLED",
      VIP: "VIP",
    };
    const backendType = typeMap[type] || type.toUpperCase();
    const backendSpaces = (await apiRequest(
      `/parking/spaces/by-type?type=${backendType}`,
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  getSpacesByZone: async (zone: string): Promise<ParkingSpace[]> => {
    const backendSpaces = (await apiRequest(
      `/parking/spaces/by-zone?zone=${zone}`,
    )) as BackendParkingSpace[];
    return backendSpaces.map(transformParkingSpace);
  },

  updateParkingSpace: async (
    id: string,
    updates: { status?: string }
  ): Promise<ParkingSpace> => {
    const statusMap: Record<string, string> = {
      disponible: "AVAILABLE",
      ocupado: "OCCUPIED",
      reservado: "RESERVED",
      mantenimiento: "MAINTENANCE",
      fuera_de_servicio: "OUT_OF_ORDER",
    };

    const backendData: { status?: string } = {};
    if (updates.status) {
      backendData.status = statusMap[updates.status] || updates.status.toUpperCase();
    }

    const backendSpace = (await apiRequest(`/parking/spaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })) as BackendParkingSpace;

    return transformParkingSpace(backendSpace);
  },

  // Incident management
  getIncidents: async (): Promise<ParkingIncident[]> => {
    const backendIncidents = (await apiRequest(
      "/parking/incidents",
    )) as BackendParkingIncident[];
    return backendIncidents.map(transformParkingIncident);
  },

  getIncidentsByStatus: async (status: string): Promise<ParkingIncident[]> => {
    const statusMap: Record<string, string> = {
      pendiente: "PENDING",
      en_proceso: "IN_PROGRESS",
      resuelto: "RESOLVED",
      cancelado: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    const backendIncidents = (await apiRequest(
      `/parking/incidents/by-status?status=${backendStatus}`,
    )) as BackendParkingIncident[];
    return backendIncidents.map(transformParkingIncident);
  },

  createIncident: async (
    incidentData: {
      type: string;
      description: string;
      vehicle?: string;
      space?: string;
      priority: string;
      responsible: string;
    },
  ): Promise<ParkingIncident> => {
    // Mapear tipos de frontend a backend
    const typeMap: Record<string, string> = {
      "Daño Vehículo": "VEHICLE_DAMAGE",
      "Infraestructura": "INFRASTRUCTURE",
      "Seguridad": "SECURITY",
      "Accidente": "ACCIDENT",
      "Robo": "THEFT",
      "Limpieza": "OTHER",
      "Otro": "OTHER"
    };

    // Buscar vehículo por placa si se especifica
    let vehicleId: number | undefined;
    if (incidentData.vehicle) {
      try {
        const vehicles = await apiRequest("/parking/vehicles") as BackendVehicle[];
        const vehicle = vehicles.find(v => v.licensePlate === incidentData.vehicle);
        vehicleId = vehicle?.id;
      } catch (error) {
        console.warn("No se pudo encontrar el vehículo:", error);
      }
    }

    // Buscar espacio por código si se especifica
    let spaceId: number | undefined;
    if (incidentData.space) {
      try {
        const spaces = await apiRequest("/parking/spaces") as BackendParkingSpace[];
        const space = spaces.find(s => s.code === incidentData.space);
        spaceId = space?.id;
      } catch (error) {
        console.warn("No se pudo encontrar el espacio:", error);
      }
    }

    const backendData = {
      type: typeMap[incidentData.type] || "OTHER",
      description: incidentData.description,
      responsible: incidentData.responsible,
      vehicleId: vehicleId,
      spaceId: spaceId,
    };

    const backendIncident = (await apiRequest("/parking/incidents", {
      method: "POST",
      body: JSON.stringify(backendData),
    })) as BackendParkingIncident;

    return transformParkingIncident(backendIncident);
  },

  resolveIncident: async (
    id: string,
    resolution: string,
  ): Promise<ParkingIncident> => {
    const backendIncident = (await apiRequest(
      `/parking/incidents/${id}/resolve`,
      {
        method: "PUT",
        body: JSON.stringify({ resolution }),
      },
    )) as BackendParkingIncident;

    return transformParkingIncident(backendIncident);
  },
};
