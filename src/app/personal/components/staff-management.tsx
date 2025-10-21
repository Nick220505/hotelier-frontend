"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, CalendarDays, CheckCircle } from "lucide-react";
import EmployeeManagement from "./employee-management";
import ShiftManagement from "./shift-management";
import AttendanceManagement from "./attendance-management";
import PermissionManagement from "./permission-management";

interface Employee {
  id: string;
  name: string;
  lastName: string;
  document: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  shift: string;
  status: string;
  supervisor: string;
}

interface Shift {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

interface Attendance {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  entryTime: string;
  exitTime: string;
  regularHours: number;
  extraHours: number;
  status: string;
  notes: string;
}

interface Permission {
  id: string;
  employeeId: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  approvedBy: string;
}

interface StaffManagementProps {
  initialEmployees: Employee[];
  initialShifts: Shift[];
  initialAttendance: Attendance[];
  initialPermissions: Permission[];
}

export default function StaffManagement({
  initialEmployees,
  initialShifts,
  initialAttendance,
  initialPermissions,
}: StaffManagementProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [shifts, setShifts] = useState(initialShifts);
  const [attendance] = useState(initialAttendance);
  const [permissions, setPermissions] = useState(initialPermissions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Personal</h1>
          <p className="text-muted-foreground">
            Administración de empleados, turnos y asistencia
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empleados
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.filter((emp) => emp.status === "activo").length}{" "}
              activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnos Hoy</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                shifts.filter(
                  (shift) =>
                    shift.date === new Date().toISOString().split("T")[0],
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Programados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistencia Hoy
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (attendance.filter(
                  (ast) =>
                    ast.date === new Date().toISOString().split("T")[0] &&
                    ast.status === "presente",
                ).length /
                  attendance.filter(
                    (ast) =>
                      ast.date === new Date().toISOString().split("T")[0],
                  ).length) *
                  100,
              ) || 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Empleados presentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Permisos Pendientes
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                permissions.filter(
                  (permission) => permission.status === "pendiente",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Por aprobar</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="shifts">Turnos</TabsTrigger>
          <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
          <TabsTrigger value="permisos">Permisos</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Empleados</CardTitle>
              <CardDescription>
                Gestión de información de empleados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeManagement
                employees={employees}
                onEmployeesChange={setEmployees}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programación de Turnos</CardTitle>
              <CardDescription>
                Gestión de horarios y turnos de trabajo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShiftManagement
                shifts={shifts}
                employees={employees}
                onShiftsChange={setShifts}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asistencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control de Asistencia</CardTitle>
              <CardDescription>
                Registro de entrada y salida de empleados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceManagement attendance={attendance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permisos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Permisos</CardTitle>
              <CardDescription>
                Gestión de vacaciones y permisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionManagement
                permissions={permissions}
                onPermissionsChange={setPermissions}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
