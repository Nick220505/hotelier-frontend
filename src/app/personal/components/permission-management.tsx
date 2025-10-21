"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

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

interface PermissionManagementProps {
  permissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
}

export default function PermissionManagement({
  permissions,
  onPermissionsChange,
}: PermissionManagementProps) {
  const getPermissionTypeLabel = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "VACATION":
        return "Vacaciones";
      case "SICK_LEAVE":
        return "Incapacidad";
      case "PERSONAL":
        return "Personal";
      case "OTHER":
        return "Otro";
      default:
        return type;
    }
  };

  const getPermissionStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "APPROVED":
      case "APROBADO":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case "PENDING":
      case "PENDIENTE":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "REJECTED":
      case "RECHAZADO":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case "CANCELLED":
      case "CANCELADO":
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprovePermission = (permissionId: string) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, status: "aprobado", approvedBy: "Usuario Actual" }
        : permission,
    );
    onPermissionsChange(updatedPermissions);
  };

  const handleRejectPermission = (permissionId: string) => {
    const updatedPermissions = permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, status: "rechazado", approvedBy: "Usuario Actual" }
        : permission,
    );
    onPermissionsChange(updatedPermissions);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Solicitudes de Permisos</h3>
        <p className="text-sm text-muted-foreground">
          Gestión de vacaciones y permisos
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Días</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">
                {permission.employee}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getPermissionTypeLabel(permission.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{permission.startDate}</div>
                  <div>{permission.endDate}</div>
                </div>
              </TableCell>
              <TableCell>{permission.days}</TableCell>
              <TableCell>{permission.reason}</TableCell>
              <TableCell>
                {getPermissionStatusBadge(permission.status)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {(permission.status.toUpperCase() === "PENDING" ||
                    permission.status.toUpperCase() === "PENDIENTE") && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprovePermission(permission.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectPermission(permission.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
