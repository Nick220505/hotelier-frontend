"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ParkingSpace {
  id: string;
  number: string;
  zone: string;
  type: "standard" | "premium" | "disability" | "electric";
  status: "available" | "occupied" | "reserved" | "maintenance";
  currentVehicle?: {
    licensePlate: string;
    owner: string;
    entryTime: string;
    room?: string;
  };
}

interface ParkingSpaceCardProps {
  space: ParkingSpace;
  onClick: (space: ParkingSpace) => void;
}

export function ParkingSpaceCard({ space, onClick }: ParkingSpaceCardProps) {
  const getSpaceStatusColor = (status: ParkingSpace["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpaceTypeIcon = (type: ParkingSpace["type"]) => {
    switch (type) {
      case "premium":
        return "⭐";
      case "disability":
        return "♿";
      case "electric":
        return "🔋";
      default:
        return "🚗";
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        space.status === "available" ? "hover:border-green-300" : ""
      } ${
        space.status === "occupied" ? "hover:border-red-300" : ""
      }`}
      onClick={() => onClick(space)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span>{getSpaceTypeIcon(space.type)}</span>
            {space.number}
          </CardTitle>
          <Badge className={getSpaceStatusColor(space.status)}>
            {space.status === "available" && "Disponible"}
            {space.status === "occupied" && "Ocupado"}
            {space.status === "reserved" && "Reservado"}
            {space.status === "maintenance" && "Mantenimiento"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{space.zone}</p>
      </CardHeader>
      <CardContent>
        {space.currentVehicle && (
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Placa:</strong> {space.currentVehicle.licensePlate}
            </div>
            <div className="text-sm">
              <strong>Propietario:</strong> {space.currentVehicle.owner}
            </div>
            {space.currentVehicle.room && (
              <div className="text-sm">
                <strong>Habitación:</strong> {space.currentVehicle.room}
              </div>
            )}
            <div className="text-sm">
              <strong>Entrada:</strong> {new Date(space.currentVehicle.entryTime).toLocaleString()}
            </div>
          </div>
        )}
        {space.status === "available" && (
          <p className="text-sm text-muted-foreground">Haz clic para registrar entrada</p>
        )}
      </CardContent>
    </Card>
  );
}
