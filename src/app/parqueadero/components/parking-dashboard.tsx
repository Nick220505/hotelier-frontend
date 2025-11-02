"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, MapPin, Users } from "lucide-react";
import {
  parkingApi,
  Vehicle,
  ParkingSpace,
  ParkingIncident,
} from "@/lib/api/parking";
import { toast } from "sonner";
import VehicleManagement from "./vehicle-management";
import SpaceManagement from "./space-management";
import IncidentManagement from "./incident-management";
import VehicleRegistrationDialog from "./vehicle-registration-dialog";
import IncidentReportDialog from "./incident-report-dialog";

interface ParkingDashboardProps {
  initialVehicles: Vehicle[];
  initialSpaces: ParkingSpace[];
  initialIncidents: ParkingIncident[];
  onVehicleAdd: (vehicleData: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room: string;
    guestType: string;
    assignedSpace: string;
    notes: string;
  }) => void;
  onVehicleExit: (vehicleId: string) => void;
  onIncidentAdd: (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => void;
}

export default function ParkingDashboard({
  initialVehicles,
  initialSpaces,
  initialIncidents,
  onVehicleAdd,
  onVehicleExit,
  onIncidentAdd,
}: ParkingDashboardProps) {
  const { hasRole } = useAuthContext();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [incidents, setIncidents] = useState(initialIncidents);

  // Sincronizar con las props cuando cambien
  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  useEffect(() => {
    setSpaces(initialSpaces);
  }, [initialSpaces]);

  useEffect(() => {
    setIncidents(initialIncidents);
  }, [initialIncidents]);

  const handleAddVehicle = (newVehicleData: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room: string;
    guestType: string;
    assignedSpace: string;
    notes: string;
  }) => {
    // Llamar la función del padre que maneja la persistencia
    onVehicleAdd(newVehicleData);
  };

  const handleVehicleExit = (vehicleId: string) => {
    // Llamar la función del padre que maneja la persistencia
    onVehicleExit(vehicleId);
  };

  const handleSpaceMaintenance = async (spaceId: string) => {
    try {
      // Actualizar en el backend
      const updatedSpace = await parkingApi.updateParkingSpace(spaceId, {
        status: "mantenimiento",
      });

      // Actualizar el estado local
      setSpaces(
        spaces.map((space) => (space.id === spaceId ? updatedSpace : space)),
      );

      toast.success("Espacio marcado en mantenimiento");
    } catch (error) {
      console.error("Error updating space status:", error);
      toast.error("Error al actualizar el estado del espacio");
    }
  };

  const handleSpaceEnable = async (spaceId: string) => {
    try {
      // Actualizar en el backend
      const updatedSpace = await parkingApi.updateParkingSpace(spaceId, {
        status: "disponible",
      });

      // Actualizar el estado local
      setSpaces(
        spaces.map((space) => (space.id === spaceId ? updatedSpace : space)),
      );

      toast.success("Espacio habilitado correctamente");
    } catch (error) {
      console.error("Error updating space status:", error);
      toast.error("Error al actualizar el estado del espacio");
    }
  };

  const handleAddIncident = (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => {
    // Llamar la función del padre que maneja la persistencia
    onIncidentAdd(incidentData);
  };

  const handleAssignIncident = (incidentId: string) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: "en_proceso" }
          : incident,
      ),
    );
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: "resuelto" }
          : incident,
      ),
    );
  };

  // Calculate stats
  const occupiedSpaces = spaces.filter((e) => e.status === "ocupado").length;
  const availableSpaces = spaces.filter(
    (e) => e.status === "disponible",
  ).length;
  const parkedVehicles = vehicles.filter(
    (v) => v.status === "parqueado",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Parqueadero</h1>
          <p className="text-muted-foreground">
            Control de vehículos, espacios e incidencias
          </p>
        </div>
        <div className="flex space-x-2">
          {!hasRole("cliente") && (
            <IncidentReportDialog
              vehicles={vehicles}
              spaces={spaces}
              onIncidentAdd={handleAddIncident}
            />
          )}
          <VehicleRegistrationDialog
            spaces={spaces}
            onVehicleAdd={handleAddVehicle}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Espacios Ocupados
            </CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupiedSpaces}</div>
            <p className="text-xs text-muted-foreground">
              De {spaces.length} espacios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Espacios Disponibles
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSpaces}</div>
            <p className="text-xs text-muted-foreground">Libres ahora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehículos Hoy</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parkedVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Actualmente parqueados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehiculos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
          <TabsTrigger value="espacios">Espacios</TabsTrigger>
          <TabsTrigger value="incidencias">Incidencias</TabsTrigger>
        </TabsList>

        <TabsContent value="vehiculos" className="space-y-4">
          <VehicleManagement
            vehicles={vehicles}
            onVehicleExit={handleVehicleExit}
          />
        </TabsContent>

        <TabsContent value="espacios" className="space-y-4">
          <SpaceManagement
            spaces={spaces}
            onSpaceMaintenance={handleSpaceMaintenance}
            onSpaceEnable={handleSpaceEnable}
          />
        </TabsContent>

        <TabsContent value="incidencias" className="space-y-4">
          <IncidentManagement
            incidents={incidents}
            onAssignIncident={handleAssignIncident}
            onResolveIncident={handleResolveIncident}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
