"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import { type Shift } from "@/lib/api/shifts";

interface ShiftsListProps {
  shifts: Shift[];
  onUpdateShiftStatus: (shiftId: number, status: Shift['status']) => void;
  onDeleteShift: (shiftId: number) => void;
}

export function ShiftsList({ shifts, onUpdateShiftStatus, onDeleteShift }: ShiftsListProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-500";
      case "COMPLETED": return "bg-green-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "RECEPTION": return "Recepción";
      case "HOUSEKEEPING": return "Limpieza";
      case "RESTAURANT": return "Restaurante";
      case "MAINTENANCE": return "Mantenimiento";
      case "SECURITY": return "Seguridad";
      default: return position;
    }
  };

  if (shifts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron turnos para la fecha seleccionada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <Card key={shift.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{shift.employee?.name || 'Sin asignar'}</span>
                </div>
                <Badge variant="outline">{getPositionLabel(shift.position)}</Badge>
                <Badge className={`${getStatusBadgeColor(shift.status)} text-white`}>
                  {shift.status === 'SCHEDULED' ? 'Programado' : 
                   shift.status === 'COMPLETED' ? 'Completado' : 'Cancelado'}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {shift.startTime} - {shift.endTime}
                </div>
                
                {shift.status === 'SCHEDULED' && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onUpdateShiftStatus(shift.id, 'COMPLETED')}
                    >
                      Completar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateShiftStatus(shift.id, 'CANCELLED')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeleteShift(shift.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              Posición: {getPositionLabel(shift.position)} • Fecha: {new Date(shift.date).toLocaleDateString()}
              {shift.notes && ` • Notas: ${shift.notes}`}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
