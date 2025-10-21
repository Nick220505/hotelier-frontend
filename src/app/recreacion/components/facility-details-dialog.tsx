"use client";

import { Clock, MapPin, Users, DollarSign, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type RecreationalFacility, type FacilityType, type FacilityStatus } from "@/lib/api/recreational";

interface FacilityDetailsDialogProps {
  facility: RecreationalFacility | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FacilityDetailsDialog({
  facility,
  open,
  onOpenChange,
}: FacilityDetailsDialogProps) {
  if (!facility) return null;

  const getFacilityTypeLabel = (type: FacilityType) => {
    const typeLabels: Record<FacilityType, string> = {
      SWIMMING_POOL: "Piscina",
      GYM: "Gimnasio",
      TENNIS_COURT: "Cancha de Tenis",
      SPA: "Spa",
      SAUNA: "Sauna",
      JACUZZI: "Jacuzzi",
      GAME_ROOM: "Sala de Juegos",
      YOGA_STUDIO: "Estudio de Yoga",
      KIDS_PLAY_AREA: "Zona Infantil",
      BUSINESS_CENTER: "Centro de Negocios",
      OTHER: "Otra",
    };
    return typeLabels[type] || type;
  };

  const getStatusBadge = (status: FacilityStatus, isAvailable: boolean) => {
    if (!isAvailable || status === "OUT_OF_ORDER") {
      return <Badge variant="destructive">Fuera de Servicio</Badge>;
    }

    switch (status) {
      case "AVAILABLE":
        return <Badge variant="default" className="bg-green-500">Disponible</Badge>;
      case "OCCUPIED":
        return <Badge variant="secondary" className="bg-blue-500">Ocupada</Badge>;
      case "MAINTENANCE":
        return <Badge variant="secondary" className="bg-yellow-500">Mantenimiento</Badge>;
      case "RESERVED":
        return <Badge variant="secondary" className="bg-purple-500">Reservada</Badge>;
      case "CLEANING":
        return <Badge variant="secondary" className="bg-orange-500">Limpieza</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days.map(day => dayNames[day]).join(', ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{facility.name}</DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {facility.location}
              </DialogDescription>
            </div>
            <div className="text-right">
              {getStatusBadge(facility.status, facility.isAvailable)}
              <div className="mt-1">
                <Badge variant="outline">{getFacilityTypeLabel(facility.type)}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          {facility.description && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Descripción
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Capacidad y Espacio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Capacidad máxima:</span>
                  <span className="text-sm font-medium">{facility.capacity} personas</span>
                </div>
                {facility.area && (
                  <div className="flex justify-between">
                    <span className="text-sm">Área:</span>
                    <span className="text-sm font-medium">{facility.area} m²</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Restricciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Mín. reserva:</span>
                  <span className="text-sm font-medium">{facility.minimumBookingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Máx. reserva:</span>
                  <span className="text-sm font-medium">{facility.maximumBookingHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Anticipación:</span>
                  <span className="text-sm font-medium">{facility.advanceBookingHours}h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operating Hours */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Horarios de Operación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Horario:</span>
                    <span className="text-sm font-medium">
                      {facility.openingTime} - {facility.closingTime}
                    </span>
                  </div>
                  {facility.availableDays && facility.availableDays.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Días disponibles:</span>
                      <span className="text-sm font-medium">
                        {getDayNames(facility.availableDays)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          {facility.amenities && facility.amenities.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Amenidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {facility.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rules */}
          {facility.rules && facility.rules.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Reglas y Políticas</h4>
              <div className="space-y-2">
                {facility.rules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Notes */}
          {facility.maintenanceNotes && (
            <div>
              <h4 className="font-semibold mb-2">Notas de Mantenimiento</h4>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {facility.maintenanceNotes}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Creada:</span>
              <span>{new Date(facility.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Última actualización:</span>
              <span>{new Date(facility.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
