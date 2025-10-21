"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Wrench, Users } from "lucide-react";
import RoomStatusManagement from "./room-status-management";
import MaintenanceManagement from "./maintenance-management";
import StaffStatusManagement from "./staff-status-management";
import IncidentReportDialog from "./incident-report-dialog";

interface Room {
  id: string;
  number: string;
  type: string;
  available: boolean;
  status: string;
  lastCleaning?: string;
  nextGuest?: string;
  assignedEmployee?: string;
}

interface HousekeepingEmployee {
  id: string;
  name: string;
  shift: string;
  assignedRooms: number;
  completedRooms: number;
  status: string;
  currentLocation: string;
}

interface MaintenanceReport {
  id: string;
  room: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  assignedTechnician?: string;
  estimatedTime?: string;
}

interface CleaningDashboardProps {
  initialRooms: Room[];
  initialEmployees: HousekeepingEmployee[];
  initialMaintenanceReports: MaintenanceReport[];
}

export default function CleaningDashboard({
  initialRooms,
  initialEmployees,
  initialMaintenanceReports,
}: CleaningDashboardProps) {
  const [rooms, setRooms] = useState(initialRooms);
  const [employees] = useState(initialEmployees);
  const [maintenanceReports, setMaintenanceReports] = useState(
    initialMaintenanceReports,
  );

  const handleStartCleaning = (roomNumber: string) => {
    setRooms(
      rooms.map((room) =>
        room.number === roomNumber ? { ...room, status: "en_limpieza" } : room,
      ),
    );
  };

  const handleStartMaintenance = (reportId: string) => {
    setMaintenanceReports(
      maintenanceReports.map((report) =>
        report.id === reportId ? { ...report, status: "en_proceso" } : report,
      ),
    );
  };

  const handleCompleteMaintenance = (reportId: string) => {
    setMaintenanceReports(
      maintenanceReports.map((report) =>
        report.id === reportId ? { ...report, status: "completado" } : report,
      ),
    );
  };

  const handleReportIncident = (incident: {
    room: string;
    type: string;
    priority: string;
    description: string;
  }) => {
    const newReport: MaintenanceReport = {
      id: (maintenanceReports.length + 1).toString(),
      room: incident.room,
      type: incident.type,
      description: incident.description,
      priority: incident.priority,
      status: "pendiente",
    };
    setMaintenanceReports([...maintenanceReports, newReport]);
  };

  // Calculate stats
  const cleanRooms = rooms.filter((room) => room.available).length;
  const pendingCleaning = rooms.filter((room) => !room.available).length;
  const maintenanceRooms = maintenanceReports.filter(
    (report) => report.status !== "completado",
  ).length;
  const activeStaff = employees.filter(
    (emp) => emp.status === "available",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Limpieza y Mantenimiento
          </h1>
          <p className="text-muted-foreground">
            Control del estado de habitaciones y mantenimiento
          </p>
        </div>
        <IncidentReportDialog
          onReportIncident={handleReportIncident}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Habitaciones Limpias
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cleanRooms}</div>
            <p className="text-xs text-muted-foreground">
              De {rooms.length} habitaciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes Limpieza
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCleaning}</div>
            <p className="text-xs text-muted-foreground">Por limpiar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Mantenimiento
            </CardTitle>
            <Wrench className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRooms}</div>
            <p className="text-xs text-muted-foreground">Fuera de servicio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personal Activo
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff}</div>
            <p className="text-xs text-muted-foreground">
              De {employees.length} empleados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <IncidentReportDialog
          onReportIncident={handleReportIncident}
        />
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Estado Habitaciones</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          <RoomStatusManagement
            rooms={rooms}
            onStartCleaning={handleStartCleaning}
          />
        </TabsContent>

        <TabsContent value="mantenimiento" className="space-y-4">
          <MaintenanceManagement
            maintenanceReports={maintenanceReports}
            onStartMaintenance={handleStartMaintenance}
            onCompleteMaintenance={handleCompleteMaintenance}
          />
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <StaffStatusManagement employees={employees} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
