// Traducciones para el módulo de personal

export const positionTranslations = {
  // Housekeeping positions
  "Room Attendant": "Camarera",
  "Housekeeping Supervisor": "Supervisor Limpieza",
  Housekeeper: "Camarera",

  // Front Desk positions
  "Front Desk Agent": "Agente Mostrador",
  "Front Desk Manager": "Gerente Mostrador",

  // Maintenance positions
  "Maintenance Technician": "Técnico Mantenimiento",
  "Maintenance Manager": "Gerente Mantenimiento",
  Electrician: "Electricista",
  Plumber: "Plomero",

  // Security positions
  "Security Guard": "Guardia Seguridad",
  "Security Manager": "Gerente Seguridad",

  // Restaurant positions
  Waitress: "Mesera",
  Waiter: "Mesero",
  Chef: "Chef",
  Cook: "Cocinero",
  Bartender: "Bartender",
  Server: "Mesero",

  // Management positions
  "General Manager": "Gerente General",
  "Assistant Manager": "Gerente Asistente",
  Supervisor: "Supervisor",
} as const;

export const departmentTranslations = {
  // Departments
  HOUSEKEEPING: "Limpieza",
  MAINTENANCE: "Mantenimiento",
  SECURITY: "Seguridad",
  RESTAURANT: "Restaurante",
  KITCHEN: "Cocina",
  BAR: "Bar",
  MANAGEMENT: "Gerencia",
  ADMINISTRATION: "Administración",
  SALES: "Ventas",
  LAUNDRY: "Lavandería",
  PARKING: "Estacionamiento",
} as const;

export const shiftTranslations = {
  // Shifts
  Morning: "Mañana",
  Day: "Día",
  Evening: "Tarde",
  Night: "Noche",
  "Full Time": "Tiempo Completo",
  "Part Time": "Medio Tiempo",
  Weekend: "Fin de Semana",
  Split: "Dividido",
} as const;

export const statusTranslations = {
  // Status
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  ON_LEAVE: "Vacaciones",
  SICK_LEAVE: "Incapacidad",
  TERMINATED: "Terminado",
  SUSPENDED: "Suspendido",
} as const;

export const shiftStatusTranslations = {
  // Shift Status
  SCHEDULED: "Programado",
  ACTIVE: "Activo",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  NO_SHOW: "No Asistió",
} as const;
