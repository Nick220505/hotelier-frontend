"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  recreationalApi, 
  type RecreationalFacility, 
  type FacilityType, 
  type FacilityStatus 
} from "@/lib/api/recreational";
import { FacilityDialog } from "./facility-dialog";
import { FacilityDetailsDialog } from "./facility-details-dialog";
import { toast } from "sonner";

interface FacilitiesManagementProps {
  facilities: RecreationalFacility[];
  onFacilitiesChange: (facilities: RecreationalFacility[]) => void;
}

export function FacilitiesManagement({ facilities, onFacilitiesChange }: FacilitiesManagementProps) {
  const [editingFacility, setEditingFacility] = useState<RecreationalFacility | null>(null);
  const [viewingFacility, setViewingFacility] = useState<RecreationalFacility | null>(null);
  const [showFacilityDialog, setShowFacilityDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (facility: RecreationalFacility) => {
    setEditingFacility(facility);
    setShowFacilityDialog(true);
  };

  const handleView = (facility: RecreationalFacility) => {
    setViewingFacility(facility);
  };

  const handleDelete = async (facility: RecreationalFacility) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la instalación "${facility.name}"?`)) {
      return;
    }

    try {
      setDeletingId(Number(facility.id));
      await recreationalApi.deleteFacility(Number(facility.id));
      onFacilitiesChange(facilities.filter(f => f.id !== facility.id));
      toast.success("Instalación eliminada correctamente");
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Error al eliminar la instalación");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusToggle = async (facility: RecreationalFacility) => {
    try {
      const newStatus: FacilityStatus = facility.isAvailable ? "OUT_OF_ORDER" : "AVAILABLE";
      const updatedFacility = await recreationalApi.updateFacility(Number(facility.id), {
        status: newStatus,
        isAvailable: !facility.isAvailable,
      });

      onFacilitiesChange(
        facilities.map(f => f.id === facility.id ? updatedFacility : f)
      );
      
      toast.success(
        `Instalación ${updatedFacility.isAvailable ? 'activada' : 'desactivada'} correctamente`
      );
    } catch (error) {
      console.error("Error updating facility status:", error);
      toast.error("Error al actualizar el estado de la instalación");
    }
  };

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

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Gestión de Instalaciones</h3>
            <p className="text-sm text-muted-foreground">
              Administra todas las instalaciones recreativas del hotel
            </p>
          </div>
        </div>

        {facilities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">No hay instalaciones</CardTitle>
              <CardDescription className="text-center mb-4">
                No se han registrado instalaciones recreativas aún.
                Crea la primera instalación para comenzar.
              </CardDescription>
              <Button onClick={() => setShowFacilityDialog(true)}>
                Crear Primera Instalación
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Instalaciones Recreativas ({facilities.length})</CardTitle>
              <CardDescription>
                Lista de todas las instalaciones disponibles en el hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Instalación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facilities.map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{facility.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {facility.openingTime} - {facility.closingTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getFacilityTypeLabel(facility.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{facility.location}</TableCell>
                        <TableCell>{facility.capacity} personas</TableCell>
                        <TableCell>
                          {getStatusBadge(facility.status, facility.isAvailable)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                disabled={deletingId === facility.id}
                              >
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleView(facility)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(facility)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusToggle(facility)}>
                                <Settings className="mr-2 h-4 w-4" />
                                {facility.isAvailable ? "Desactivar" : "Activar"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDelete(facility)}
                                disabled={deletingId === facility.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {deletingId === facility.id ? "Eliminando..." : "Eliminar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <FacilityDialog
        open={showFacilityDialog}
        onOpenChange={(open) => {
          setShowFacilityDialog(open);
          if (!open) {
            setEditingFacility(null);
          }
        }}
        facility={editingFacility}
        onFacilityCreated={(facility) => {
          if (editingFacility) {
            onFacilitiesChange(
              facilities.map(f => f.id === facility.id ? facility : f)
            );
          } else {
            onFacilitiesChange([...facilities, facility]);
          }
          setShowFacilityDialog(false);
          setEditingFacility(null);
        }}
      />

      {/* View Details Dialog */}
      <FacilityDetailsDialog
        facility={viewingFacility}
        open={!!viewingFacility}
        onOpenChange={(open) => {
          if (!open) {
            setViewingFacility(null);
          }
        }}
      />
    </>
  );
}
