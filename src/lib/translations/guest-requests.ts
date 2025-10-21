// Traducciones para Guest Requests

export const requestTypeTranslations = {
  TOWELS: "Toallas",
  ROOM_SERVICE: "Servicio a la Habitación",
  MAINTENANCE: "Mantenimiento",
  HOUSEKEEPING: "Limpieza",
  CONCIERGE: "Conserjería",
  TECHNICAL_SUPPORT: "Soporte Técnico",
  OTHER: "Otros",
} as const;

export const requestStatusTranslations = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
} as const;

export const requestPriorityTranslations = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const;

// Función helper para obtener traducciones
export const getRequestTypeTranslation = (type: string): string => {
  return (
    requestTypeTranslations[type as keyof typeof requestTypeTranslations] ||
    type
  );
};

export const getRequestStatusTranslation = (status: string): string => {
  return (
    requestStatusTranslations[
      status as keyof typeof requestStatusTranslations
    ] || status
  );
};

export const getRequestPriorityTranslation = (priority: string): string => {
  return (
    requestPriorityTranslations[
      priority as keyof typeof requestPriorityTranslations
    ] || priority
  );
};
