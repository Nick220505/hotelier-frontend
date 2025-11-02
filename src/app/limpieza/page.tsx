"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IncidentReportDialog from "./components/incident-report-dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, Users } from "lucide-react";
import {
  housekeepingApi,
  type CleaningAssignment,
} from "@/lib/api/housekeeping";
import { employeesApi, type Employee } from "@/lib/api/employees";
// import { roomsApi, type Room } from "@/lib/api/rooms";

export default function LimpiezaPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [cleaningAssignments, setCleaningAssignments] = useState<
    CleaningAssignment[]
  >([]);
  // const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const handleReportIncident = async (incident: {
    room: string;
    type: string;
    priority: string;
    description: string;
  }) => {
    try {
      // Aquí irá la llamada a la API cuando la implementemos
      console.log("Nueva solicitud de mantenimiento:", incident);
    } catch (error) {
      console.error("Error al crear solicitud de mantenimiento:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, assignmentsData] = await Promise.all([
          employeesApi.getHousekeeping(),
          housekeepingApi.getTodaysCleaningAssignments(),
          // roomsApi.getAll(),
        ]);

        setEmployees(employeesData);
        setCleaningAssignments(assignmentsData);
        // setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching cleaning data:", error);
        // Set empty arrays on error to prevent crashes
        setEmployees([]);
        setCleaningAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Limpieza</h1>
          <p className="text-muted-foreground">Cargando datos de limpieza...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  // Calculate cleaning statistics based on assignments
  const assignmentsByStatus = {
    pendiente: cleaningAssignments.filter((a) => a.status === "pendiente")
      .length,
    en_proceso: cleaningAssignments.filter((a) => a.status === "en_proceso")
      .length,
    completado: cleaningAssignments.filter((a) => a.status === "completado")
      .length,
    inspeccionado: cleaningAssignments.filter(
      (a) => a.status === "inspeccionado",
    ).length,
  };

  const totalEmployees = employees.length;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Limpieza</h1>
        <p className="text-muted-foreground">
          Gestión de limpieza y mantenimiento de habitaciones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Completadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignmentsByStatus.completado}
            </div>
            <p className="text-xs text-muted-foreground">
              Limpiezas terminadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Pendientes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {assignmentsByStatus.pendiente}
            </div>
            <p className="text-xs text-muted-foreground">Esperando limpieza</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {assignmentsByStatus.en_proceso}
            </div>
            <p className="text-xs text-muted-foreground">Limpieza en curso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personal Disponible
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              Empleados de limpieza
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Asignaciones de Limpieza</CardTitle>
            </div>
            <IncidentReportDialog onReportIncident={handleReportIncident} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cleaningAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">
                        Habitación {assignment.roomNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.employeeName}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      assignment.status === "completado"
                        ? "default"
                        : assignment.status === "en_proceso"
                          ? "secondary"
                          : assignment.status === "inspeccionado"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {assignment.status === "completado"
                      ? "Completado"
                      : assignment.status === "en_proceso"
                        ? "En proceso"
                        : assignment.status === "inspeccionado"
                          ? "Inspeccionado"
                          : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal de Limpieza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => {
                // Count assignments for this employee
                const employeeAssignments = cleaningAssignments.filter(
                  (a) => a.employeeName === employee.name,
                );
                const completedCount = employeeAssignments.filter(
                  (a) => a.status === "completado",
                ).length;
                return (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Turno {employee.shift}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {completedCount}/{employeeAssignments.length}
                      </p>
                      <Badge
                        variant={
                          employee.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {employee.status === "ACTIVE"
                          ? "Activo"
                          : employee.status === "ON_LEAVE"
                            ? "De permiso"
                            : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
