"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  CalendarDays,
  DollarSign,
  Bed,
  Utensils,
  Package,
  UserCheck,
  Calendar,
  BarChart3,
  Car,
  Building,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Reservas", href: "/reservas", icon: CalendarDays },
  { name: "Facturación", href: "/facturacion", icon: DollarSign },
  { name: "Limpieza", href: "/limpieza", icon: Bed },
  { name: "Restaurante", href: "/restaurante", icon: Utensils },
  { name: "Inventario", href: "/inventario", icon: Package },
  { name: "Personal", href: "/personal", icon: UserCheck },
  { name: "Eventos", href: "/eventos", icon: Calendar },
  { name: "Parqueadero", href: "/parqueadero", icon: Car },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r border-border shadow-xs">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">HotelCraft</h1>
            <p className="text-sm text-muted-foreground">Suite Integral</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isActive
                    ? "bg-secondary text-secondary-foreground font-medium shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>

        <Separator className="my-4" />

        <div className="px-3 py-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Sistema
          </p>
          <div className="mt-2 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Configuración
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              Ayuda
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
