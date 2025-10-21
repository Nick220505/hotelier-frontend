'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { attendanceApi, type Attendance } from '@/lib/api/attendance';
import { employeesApi, type Employee } from '@/lib/api/employees';
import { Calendar, Clock, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PRESENT':
      return <Badge variant="default" className="bg-green-500">Presente</Badge>;
    case 'ABSENT':
      return <Badge variant="destructive">Ausente</Badge>;
    case 'LATE':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Tarde</Badge>;
    case 'EARLY_LEAVE':
      return <Badge variant="secondary">Salida Temprana</Badge>;
    case 'SICK_LEAVE':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Incapacidad</Badge>;
    case 'VACATION':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Vacaciones</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function AttendanceTab() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [deletingAttendance, setDeletingAttendance] = useState<Attendance | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    employeeId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    checkIn: '',
    checkOut: '',
    status: 'PRESENT',
    notes: '',
    hoursWorked: 0,
    overtimeHours: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [attendanceData, employeesData] = await Promise.all([
        attendanceApi.getByDate(selectedDate),
        employeesApi.getAll(),
      ]);
      setAttendances(attendanceData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateHoursWorked = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    
    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;
    
    const diffMinutes = outTotalMinutes - inTotalMinutes;
    return Math.round((diffMinutes / 60) * 100) / 100;
  };

  const handleOpenDialog = (attendance?: Attendance) => {
    if (attendance) {
      setEditingAttendance(attendance);
      setFormData({
        employeeId: attendance.employeeId.toString(),
        date: attendance.date,
        checkIn: attendance.checkIn || '',
        checkOut: attendance.checkOut || '',
        status: attendance.status,
        notes: attendance.notes || '',
        hoursWorked: typeof attendance.hoursWorked === 'number' 
          ? attendance.hoursWorked 
          : parseFloat(attendance.hoursWorked?.toString() || '0'),
        overtimeHours: typeof attendance.overtimeHours === 'number' 
          ? attendance.overtimeHours 
          : parseFloat(attendance.overtimeHours?.toString() || '0'),
      });
    } else {
      setEditingAttendance(null);
      setFormData({
        employeeId: '',
        date: selectedDate,
        checkIn: '',
        checkOut: '',
        status: 'PRESENT',
        notes: '',
        hoursWorked: 0,
        overtimeHours: 0,
      });
    }
    setDialogOpen(true);
  };

  const handleTimeChange = (field: 'checkIn' | 'checkOut', value: string) => {
    const newFormData = { ...formData, [field]: value };
    if (newFormData.checkIn && newFormData.checkOut) {
      newFormData.hoursWorked = calculateHoursWorked(newFormData.checkIn, newFormData.checkOut);
    }
    setFormData(newFormData);
  };

  const handleSaveAttendance = async () => {
    try {
      const data = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
      };

      if (editingAttendance) {
        await attendanceApi.update(editingAttendance.id, data);
        toast.success('Asistencia actualizada exitosamente');
      } else {
        await attendanceApi.create(data);
        toast.success('Asistencia registrada exitosamente');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Error al guardar asistencia');
    }
  };

  const handleDeleteAttendance = async () => {
    if (!deletingAttendance) return;
    
    try {
      await attendanceApi.delete(deletingAttendance.id);
      toast.success('Asistencia eliminada exitosamente');
      setDeleteDialogOpen(false);
      setDeletingAttendance(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Error al eliminar asistencia');
    }
  };

  const getEmployeeInfo = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return {
      name: employee?.name || 'Desconocido',
      position: employee?.position || '-',
      department: employee?.department || '-',
    };
  };

  const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
  const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
  const lateCount = attendances.filter(a => a.status === 'LATE').length;
  const totalHours = attendances.reduce((sum, a) => {
    const hours = typeof a.hoursWorked === 'number' ? a.hoursWorked : parseFloat(a.hoursWorked?.toString() || '0');
    return sum + (isNaN(hours) ? 0 : hours);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presentes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Asistieron hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">No asistieron</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tardanzas</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">Llegaron tarde</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Horas trabajadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Asistencia</CardTitle>
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
                Registrar Asistencia
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : attendances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No hay registros de asistencia para esta fecha
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((attendance) => {
                    const info = getEmployeeInfo(attendance.employeeId);
                    return (
                      <TableRow key={attendance.id}>
                        <TableCell className="font-medium">{info.name}</TableCell>
                        <TableCell>{info.department}</TableCell>
                        <TableCell>{info.position}</TableCell>
                        <TableCell>{attendance.checkIn || '-'}</TableCell>
                        <TableCell>{attendance.checkOut || '-'}</TableCell>
                        <TableCell>
                          {typeof attendance.hoursWorked === 'number' 
                            ? attendance.hoursWorked.toFixed(1) 
                            : parseFloat(attendance.hoursWorked?.toString() || '0').toFixed(1)}h
                        </TableCell>
                        <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(attendance)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingAttendance(attendance);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Attendance Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAttendance ? 'Editar Asistencia' : 'Registrar Asistencia'}
            </DialogTitle>
            <DialogDescription>
              {editingAttendance
                ? 'Actualiza el registro de asistencia'
                : 'Completa los datos de asistencia del empleado'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Empleado</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                disabled={!!editingAttendance}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
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
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Hora Entrada</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={formData.checkIn}
                  onChange={(e) => handleTimeChange('checkIn', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">Hora Salida</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOut}
                  onChange={(e) => handleTimeChange('checkOut', e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRESENT">Presente</SelectItem>
                  <SelectItem value="ABSENT">Ausente</SelectItem>
                  <SelectItem value="LATE">Tarde</SelectItem>
                  <SelectItem value="EARLY_LEAVE">Salida Temprana</SelectItem>
                  <SelectItem value="SICK_LEAVE">Incapacidad</SelectItem>
                  <SelectItem value="VACATION">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hoursWorked">Horas Trabajadas</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: parseFloat(e.target.value) })}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales (opcional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAttendance}>
              {editingAttendance ? 'Actualizar' : 'Registrar'}
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
              ¿Estás seguro de que deseas eliminar este registro de asistencia? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAttendance}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

