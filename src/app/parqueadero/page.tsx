'use client';

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { parkingApi, type Vehicle, type ParkingSpace, type ParkingIncident } from "@/lib/api/parking";
import { toast } from "sonner";
import ParkingDashboard from "./components/parking-dashboard";

export default function ParqueaderoPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [incidents, setIncidents] = useState<ParkingIncident[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vehiclesData, spacesData, incidentsData] = await Promise.all([
        parkingApi.getVehicles().catch((err) => {
          console.warn("Failed to fetch vehicles:", err);
          return [];
        }),
        parkingApi.getParkingSpaces().catch((err) => {
          console.warn("Failed to fetch spaces:", err);
          return [];
        }),
        parkingApi.getIncidents().catch((err) => {
          console.warn("Failed to fetch incidents:", err);
          return [];
        })
      ]);
      
      setVehicles(vehiclesData);
      setSpaces(spacesData);
      setIncidents(incidentsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching parking data:", error);
      setError("Error loading parking data");
      toast.error("Error al cargar los datos del parqueadero");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetchData();
  }, [user, authLoading]);

  const handleAddVehicle = async (newVehicleData: {
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
    try {
      // Crear el vehículo en el backend
      const createdVehicle = await parkingApi.createVehicle({
        licensePlate: newVehicleData.licensePlate.toUpperCase(),
        brand: newVehicleData.brand,
        model: newVehicleData.model,
        color: newVehicleData.color,
        type: newVehicleData.type,
        owner: newVehicleData.owner,
        room: newVehicleData.room || undefined,
        guestType: newVehicleData.guestType,
        assignedSpace: newVehicleData.assignedSpace,
        notes: newVehicleData.notes || undefined,
      });

      // Actualizar el estado local
      setVehicles(prev => [...prev, createdVehicle]);
      
      // Actualizar el estado del espacio ocupado
      setSpaces(prev => prev.map(space => 
        space.code === newVehicleData.assignedSpace
          ? { 
              ...space, 
              status: "ocupado", 
              currentVehicle: newVehicleData.licensePlate.toUpperCase() 
            }
          : space
      ));

      toast.success("Vehículo registrado exitosamente");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("Error al registrar el vehículo");
    }
  };

  const handleVehicleExit = async (vehicleId: string) => {
    try {
      await parkingApi.checkOutVehicle(vehicleId);
      
      // Actualizar el estado local
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId
          ? { 
              ...vehicle, 
              status: "salido", 
              exitTime: new Date().toISOString().slice(0, 16).replace("T", " ") 
            }
          : vehicle
      ));

      // Liberar el espacio
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle?.assignedSpace) {
        setSpaces(prev => prev.map(space => 
          space.code === vehicle.assignedSpace
            ? { ...space, status: "disponible", currentVehicle: undefined }
            : space
        ));
      }

      toast.success("Salida del vehículo registrada");
    } catch (error) {
      console.error("Error checking out vehicle:", error);
      toast.error("Error al registrar la salida del vehículo");
    }
  };

  const handleAddIncident = async (incidentData: {
    type: string;
    description: string;
    vehicle: string;
    space: string;
    priority: string;
  }) => {
    try {
      const createdIncident = await parkingApi.createIncident({
        type: incidentData.type,
        description: incidentData.description,
        vehicle: incidentData.vehicle || undefined,
        space: incidentData.space || undefined,
        priority: incidentData.priority,
        responsible: user?.name || "Usuario Actual",
      });

      setIncidents(prev => [...prev, createdIncident]);
      toast.success("Incidente reportado exitosamente");
    } catch (error) {
      console.error("Error creating incident:", error);
      toast.error("Error al reportar el incidente");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Cargando datos del parqueadero...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ParkingDashboard
      initialVehicles={vehicles}
      initialSpaces={spaces}
      initialIncidents={incidents}
      onVehicleAdd={handleAddVehicle}
      onVehicleExit={handleVehicleExit}
      onIncidentAdd={handleAddIncident}
    />
  );
}
