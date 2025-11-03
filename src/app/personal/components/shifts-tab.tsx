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
import { shiftsApi, type Shift } from "@/lib/api/shifts";
import { employeesApi, type Employee } from "@/lib/api/employees";
import { Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-300"
        >
          Programado
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="default" className="bg-green-500">
          En Progreso
        </Badge>
      );
    case "COMPLETED":
      return <Badge variant="secondary">Completado</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getShiftTypeName = (type: string) => {
  const types: Record<string, string> = {
    MORNING: "Mañana",
    AFTERNOON: "Tarde",
    NIGHT: "Noche",
    DOUBLE: "Doble",
  };
  return types[type] || type;
};

export function ShiftsTab() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "08:00",
    endTime: "16:00",
    type: "MORNING",
    status: "SCHEDULED",
    position: "",
    department: "",
    notes: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [shiftsData, employeesData] = await Promise.all([
        shiftsApi.getByDate(selectedDate),
        employeesApi.getAll(),
      ]);
      setShifts(shiftsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (shift?: Shift) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({
        employeeId: shift.employeeId.toString(),
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        type: shift.type,
        status: shift.status,
        position: shift.position,
        department: shift.department,
        notes: shift.notes || "",
      });
    } else {
      setEditingShift(null);
      setFormData({
        employeeId: "",
        date: selectedDate,
        startTime: "08:00",
        endTime: "16:00",
        type: "MORNING",
        status: "SCHEDULED",
        position: "",
        department: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((e) => e.id === parseInt(employeeId));
    if (employee) {
      setFormData({
        ...formData,
        employeeId,
        position: employee.position,
        department: employee.department,
      });
    }
  };

  const handleSaveShift = async () => {
    try {
      const data = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
      };

      if (editingShift) {
        await shiftsApi.update(editingShift.id, data as any);
        toast.success("Turno actualizado exitosamente");
      } else {
        await shiftsApi.create(data as any);
        toast.success("Turno creado exitosamente");
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving shift:", error);
      toast.error("Error al guardar turno");
    }
  };

  const handleDeleteShift = async () => {
    if (!deletingShift) return;

    try {
      await shiftsApi.delete(deletingShift.id);
      toast.success("Turno eliminado exitosamente");
      setDeleteDialogOpen(false);
      setDeletingShift(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error("Error al eliminar turno");
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.name || "Desconocido";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Turnos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Turno
              </Button>
            </div>
          </div>

          {/* Shifts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Horario</TableHead>
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
                ) : shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No hay turnos programados para esta fecha
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(shift.employeeId)}
                      </TableCell>
                      <TableCell>{shift.department}</TableCell>
                      <TableCell>{shift.position}</TableCell>
                      <TableCell>{getShiftTypeName(shift.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(shift.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(shift)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingShift(shift);
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

      {/* Add/Edit Shift Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? "Editar Turno" : "Nuevo Turno"}
            </DialogTitle>
            <DialogDescription>
              {editingShift
                ? "Actualiza la información del turno"
                : "Completa los datos del nuevo turno"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Empleado</Label>
              <Select
                value={formData.employeeId}
                onValueChange={handleEmployeeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id.toString()}
                    >
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Hora Inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Hora Fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Turno</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING">Mañana</SelectItem>
                  <SelectItem value="AFTERNOON">Tarde</SelectItem>
                  <SelectItem value="NIGHT">Noche</SelectItem>
                  <SelectItem value="DOUBLE">Doble</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="SCHEDULED">Programado</SelectItem>
                  <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notas adicionales (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveShift}>
              {editingShift ? "Actualizar" : "Crear"}
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
              ¿Estás seguro de que deseas eliminar este turno? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteShift}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
