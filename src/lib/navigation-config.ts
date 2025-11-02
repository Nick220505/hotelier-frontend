// Navigation item to permission mapping
export interface NavigationItem {
  title: string;
  url: string;
  icon: string;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  excludeRoles?: string[];
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

// Define permission requirements for each navigation item
export const navigationConfig: NavigationGroup[] = [
  {
    title: "Panel Principal",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: "Home",
        requiredPermissions: ["dashboard:read"],
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        title: "Reservas",
        url: "/reservas",
        icon: "CalendarDays",
        requiredPermissions: ["reservations:read"],
        excludeRoles: ["cliente", "huesped", "guest", "customer"],
      },
      {
        title: "Tablero de Habitaciones",
        url: "/tablero-habitaciones",
        icon: "Grid3X3",
        requiredPermissions: ["rooms:read", "reservations:read"],
        excludeRoles: ["huesped", "guest", "customer"],
      },
      {
        title: "Mis Reservas",
        url: "/mis-reservas",
        icon: "CalendarClock",
        requiredRoles: ["huesped", "cliente", "guest", "customer"],
      },
      {
        title: "Huéspedes",
        url: "/huespedes",
        icon: "UserPlus",
        requiredPermissions: ["guests:read"],
      },
      {
        title: "Limpieza",
        url: "/limpieza",
        icon: "Bed",
        requiredPermissions: ["housekeeping:read"],
      },
      {
        title: "Restaurante",
        url: "/restaurante",
        icon: "Utensils",
        requiredPermissions: ["restaurant:read"],
      },
      {
        title: "Eventos Corporativos",
        url: "/eventos",
        icon: "Calendar",
        requiredPermissions: ["events:read"],
      },
      {
        title: "Instalaciones Recreativas",
        url: "/recreacion",
        icon: "Dumbbell",
        requiredPermissions: ["recreational:read"],
      },
    ],
  },
  {
    title: "Gestión Financiera",
    items: [
      {
        title: "Facturación",
        url: "/facturacion",
        icon: "DollarSign",
        requiredRoles: ["administrador", "gerente", "recepcionista", "cliente"],
      },
    ],
  },
  {
    title: "Recursos",
    items: [
      {
        title: "Inventario",
        url: "/inventario",
        icon: "Package",
        requiredPermissions: ["inventory:read"],
      },
      {
        title: "Personal",
        url: "/personal",
        icon: "UserCheck",
        excludeRoles: ["cliente", "huesped", "guest", "customer"],
      },
      {
        title: "Parqueadero",
        url: "/parqueadero",
        icon: "Car",
        requiredPermissions: ["parking:read"],
      },
      {
        title: "Mantenimiento",
        url: "/mantenimiento",
        icon: "Wrench",
        requiredPermissions: ["maintenance:read"],
        requiredRoles: ["administrador", "gerente", "mantenimiento"],
      },
    ],
  },
  {
    title: "Análisis",
    items: [
      {
        title: "Reportes",
        url: "/reportes",
        icon: "BarChart3",
        requiredPermissions: ["reports:read"],
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        title: "Configuración",
        url: "/configuracion",
        icon: "Settings",
        requiredPermissions: ["configuration:read"],
      },
      {
        title: "Usuarios",
        url: "/configuracion/usuarios",
        icon: "User",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrador"],
      },
      {
        title: "Auditoría del Sistema",
        url: "/auditoria",
        icon: "Eye",
        requiredPermissions: ["users:read"],
        requiredRoles: ["administrador", "gerente"],
      },
      {
        title: "Perfil",
        url: "/perfil",
        icon: "UserCheck",
        // No specific permissions required - all authenticated users can access their profile
      },
    ],
  },
];

// Helper function to check if user has required permissions for a navigation item
export const canAccessNavItem = (
  item: NavigationItem,
  userPermissions: string[],
  userRoles: string[],
): boolean => {
  // Ensure we have arrays to work with
  const safeUserPermissions = userPermissions || [];
  const safeUserRoles = userRoles || [];

  // Check if user role is excluded
  if (item.excludeRoles && item.excludeRoles.length > 0) {
    const hasExcludedRole = item.excludeRoles.some((role) =>
      safeUserRoles.includes(role),
    );
    if (hasExcludedRole) {
      return false;
    }
  }

  // If no permissions or roles are required, allow access
  if (!item.requiredPermissions && !item.requiredRoles) {
    return true;
  }

  // Check role requirements (if any)
  if (item.requiredRoles && item.requiredRoles.length > 0) {
    const hasRequiredRole = item.requiredRoles.some((role) =>
      safeUserRoles.includes(role),
    );
    if (!hasRequiredRole) {
      return false;
    }
  }

  // Check permission requirements (if any)
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    const hasRequiredPermission = item.requiredPermissions.some((permission) =>
      safeUserPermissions.includes(permission),
    );
    if (!hasRequiredPermission) {
      return false;
    }
  }

  return true;
};

// Filter navigation groups based on user permissions
export const filterNavigationByPermissions = (
  navigationGroups: NavigationGroup[],
  userPermissions: string[],
  userRoles: string[],
): NavigationGroup[] => {
  const filtered = navigationGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        return canAccessNavItem(item, userPermissions, userRoles);
      });

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);

  return filtered;
};
