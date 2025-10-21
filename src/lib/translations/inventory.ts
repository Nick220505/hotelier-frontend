// Traducciones para el módulo de inventario

export const inventoryCategoryTranslations = {
  // Categorías principales
  CLEANING_SUPPLIES: "Suministros",
  LINENS: "Lencería",
  AMENITIES: "Amenidades",
  ELECTRONICS: "Electrónicos",
  MAINTENANCE: "Mantenimiento",
  HOUSEKEEPING: "Limpieza",
  FOOD_BEVERAGE: "AlimentosBebidas",
  OFFICE: "Oficina",
  SECURITY: "Seguridad",
  GUEST_SUPPLIES: "SuministrosHuésped",

  // Subcategorías adicionales
  BATHROOM_SUPPLIES: "SuministrosBaño",
  BEDROOM_SUPPLIES: "SuministrosCuarto",
  CLEANING_EQUIPMENT: "EquipoLimpieza",
  LAUNDRY_SUPPLIES: "SuministrosLavandería",
  GUEST_AMENITIES: "AmenidadesHuésped",
  ROOM_AMENITIES: "AmenidadesCuarto",
  BATH_AMENITIES: "AmenidadesBaño",
  TECHNOLOGY: "Tecnología",
  FURNITURE: "Mobiliario",
  TEXTILE: "Textil",
  CHEMICAL: "Químicos",
  TOOLS: "Herramientas",
  SAFETY: "Seguridad",
} as const;

export const inventoryStatusTranslations = {
  AVAILABLE: "Disponible",
  LOW_STOCK: "Bajo Stock",
  OUT_OF_STOCK: "Agotado",
  DISCONTINUED: "Descontinuado",
  ORDERED: "Pedido",
  RESERVED: "Reservado",
} as const;

export const movementTypeTranslations = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUSTMENT: "Ajuste",
  TRANSFER: "Transferencia",
  RETURN: "Devolución",
  LOSS: "Pérdida",
  DAMAGE: "Daño",
} as const;

export const unitTranslations = {
  bottles: "botellas",
  pieces: "piezas",
  bars: "barras",
  units: "unidades",
  boxes: "cajas",
  packs: "paquetes",
  rolls: "rollos",
  liters: "litros",
  kilograms: "kilogramos",
  grams: "gramos",
  meters: "metros",
  pairs: "pares",
  sets: "conjuntos",
  items: "artículos",
} as const;
