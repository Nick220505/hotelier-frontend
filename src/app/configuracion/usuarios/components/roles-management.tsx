"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  SystemRole,
  SystemPermission,
  CreateRoleRequest,
  UpdateRoleRequest,
  rolesApi,
  systemPermissionsApi,
} from "@/lib/api/roles";
import { Edit, Shield, Trash2 } from "lucide-react";
import { CreateRoleDialog } from "./create-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import { AssignPermissionsDialog } from "./assign-permissions-dialog";

export function RolesManagement() {
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [permissions, setPermissions] = useState<SystemPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        rolesApi.getAll(),
        systemPermissionsApi.getAll(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      toast.error("Error", {
        description: "No se pudieron cargar los datos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (data: CreateRoleRequest) => {
    try {
      await rolesApi.create(data);
      await loadData();
      setCreateDialogOpen(false);
      toast("Éxito", { description: "Rol creado correctamente" });
    } catch {
      toast.error("Error", { description: "No se pudo crear el rol" });
    }
  };

  const handleUpdateRole = async (data: UpdateRoleRequest) => {
    if (!selectedRole) return;

    try {
      await rolesApi.update(selectedRole.id, data);
      await loadData();
      setEditDialogOpen(false);
      setSelectedRole(null);
      toast("Éxito", { description: "Rol actualizado correctamente" });
    } catch {
      toast.error("Error", { description: "No se pudo actualizar el rol" });
    }
  };

  const handleDeleteRole = async (role: SystemRole) => {
    try {
      await rolesApi.delete(role.id);
      await loadData();
      toast("Éxito", { description: "Rol eliminado correctamente" });
    } catch {
      toast.error("Error", { description: "No se pudo eliminar el rol" });
    }
  };

  const handleAssignPermissions = async (
    roleId: number,
    permissionIds: number[],
  ) => {
    try {
      await rolesApi.assignPermissions(roleId, { permissionIds });
      await loadData();
      setPermissionsDialogOpen(false);
      setSelectedRole(null);
      toast("Éxito", { description: "Permisos asignados correctamente" });
    } catch {
      toast.error("Error", { description: "No se pudieron asignar los permisos" });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Roles del Sistema</CardTitle>
            <CardDescription>
              Gestiona los roles disponibles en el sistema
            </CardDescription>
          </div>
          <CreateRoleDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onSubmit={handleCreateRole}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={role.isSystem ? "secondary" : "default"}>
                      {role.isSystem ? "Sistema" : "Personalizado"}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.permissions?.length || 0}</TableCell>
                  <TableCell>{role.userRoles?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role);
                          setEditDialogOpen(true);
                        }}
                        disabled={role.isSystem}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role);
                          setPermissionsDialogOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              role.isSystem || (role.userRoles?.length || 0) > 0
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El rol será
                              eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRole(role)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <EditRoleDialog
        role={selectedRole}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateRole}
      />

      {/* Assign Permissions Dialog */}
      <AssignPermissionsDialog
        role={selectedRole}
        permissions={permissions}
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        onSubmit={handleAssignPermissions}
      />
    </div>
  );
}

