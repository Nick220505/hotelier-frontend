"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Users, Car, FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      icon: CalendarDays,
      label: "Nueva Reserva",
      color: "text-blue-600 dark:text-blue-400",
      href: "/reservas",
    },
    {
      icon: Users,
      label: "Check-in Rápido",
      color: "text-green-600 dark:text-green-400",
      href: "/reservas",
    },
    {
      icon: Car,
      label: "Parqueadero",
      color: "text-orange-600 dark:text-orange-400",
      href: "/parqueadero",
    },
    {
      icon: FileText,
      label: "Generar Reporte",
      color: "text-purple-600 dark:text-purple-400",
      href: "/reportes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>
          Accesos directos a funciones principales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link 
              key={index} 
              href={action.href} 
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors"
            >
              <action.icon className={`h-5 w-5 ${action.color} flex-shrink-0`} />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
