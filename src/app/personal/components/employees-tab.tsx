"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { employeesApi, type Employee } from "@/lib/api/employees";
import { UserPlus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const getDepartmentDisplayName = (department: string): string => {
  const departmentNames: Record<string, string> = {
    FRONT_DESK: "Recepción",
    HOUSEKEEPING: "Limpieza",
    MAINTENANCE: "Mantenimiento",
    RESTAURANT: "Restaurante",
    MANAGEMENT: "Gerencia",
    SECURITY: "Seguridad",
    VALET: "Botones",
  };
  return departmentNames[department] || department;
};

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge variant="default" className="bg-green-500">
          Activo
        </Badge>
      );
    case "INACTIVE":
      return <Badge variant="secondary">Inactivo</Badge>;
    case "ON_LEAVE":
      return <Badge variant="outline">De Permiso</Badge>;
    default:
      return (
        <Badge variant="default" className="bg-green-500">
          Activo
        </Badge>
      );
  }
};

export function EmployeesTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "FRONT_DESK",
    position: "",
    shift: "",
    status: "ACTIVE",
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeesApi.getAll();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment,
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        employeeId: employee.employeeId,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        shift: employee.shift || "",
        status: employee.status || "ACTIVE",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        employeeId: "",
        name: "",
        department: "FRONT_DESK",
        position: "",
        shift: "",
        status: "ACTIVE",
      });
    }
    setDialogOpen(true);
  };

  const handleSaveEmployee = async () => {
    try {
      if (editingEmployee) {
        await employeesApi.update(Number(editingEmployee.id), formData as any);
        toast.success("Empleado actualizado exitosamente");
      } else {
        await employeesApi.create(formData as any);
        toast.success("Empleado creado exitosamente");
      }
      setDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Error al guardar empleado");
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;

    try {
      await employeesApi.delete(Number(deletingEmployee.id));
      toast.success("Empleado eliminado exitosamente");
      setDeleteDialogOpen(false);
      setDeletingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error al eliminar empleado");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID o posición..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Departamentos</SelectItem>
                <SelectItem value="FRONT_DESK">Recepción</SelectItem>
                <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
                <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                <SelectItem value="RESTAURANT">Restaurante</SelectItem>
                <SelectItem value="MANAGEMENT">Gerencia</SelectItem>
                <SelectItem value="SECURITY">Seguridad</SelectItem>
                <SelectItem value="VALET">Botones</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleOpenDialog()}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </div>

          {/* Employees Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No se encontraron empleados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        {getDepartmentDisplayName(employee.department)}
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.shift || "-"}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingEmployee(employee);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? "Actualiza la información del empleado"
                : "Completa los datos del nuevo empleado"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employeeId">ID Empleado</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                placeholder="EMP001"
                disabled={!!editingEmployee}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="María García"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRONT_DESK">Recepción</SelectItem>
                  <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
                  <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                  <SelectItem value="RESTAURANT">Restaurante</SelectItem>
                  <SelectItem value="MANAGEMENT">Gerencia</SelectItem>
                  <SelectItem value="SECURITY">Seguridad</SelectItem>
                  <SelectItem value="VALET">Botones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Posición</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="Recepcionista"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift">Turno</Label>
              <Input
                id="shift"
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                placeholder="Mañana"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="ON_LEAVE">De Permiso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEmployee}>
              {editingEmployee ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{" "}
              <strong>{deletingEmployee?.name}</strong>? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEmployee}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
