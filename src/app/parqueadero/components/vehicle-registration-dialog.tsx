"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { ParkingSpace } from "@/lib/api/parking";

const vehicleSchema = z.object({
  licensePlate: z.string().min(3, "La placa debe tener al menos 3 caracteres"),
  brand: z.string().min(2, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  color: z.string().min(1, "El color es requerido"),
  type: z.string().min(1, "El tipo de vehículo es requerido"),
  owner: z.string().min(2, "El nombre del propietario es requerido"),
  room: z.string().optional(),
  guestType: z.string().min(1, "El tipo de huésped es requerido"),
  assignedSpace: z.string().min(1, "Debe asignar un espacio"),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleRegistrationDialogProps {
  spaces: ParkingSpace[];
  onVehicleAdd: (vehicle: {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
    type: string;
    owner: string;
    room?: string;
    guestType: string;
    assignedSpace: string;
    notes?: string;
  }) => void;
}

export default function VehicleRegistrationDialog({
  spaces,
  onVehicleAdd,
}: VehicleRegistrationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: "",
      brand: "",
      model: "",
      color: "",
      type: "",
      owner: "",
      room: "",
      guestType: "",
      assignedSpace: "",
      notes: "",
    },
  });

  const handleSubmit = (data: VehicleFormData) => {
    onVehicleAdd(data);
    vehicleForm.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Vehículo</DialogTitle>
          <DialogDescription>
            Registrar ingreso de un nuevo vehículo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={vehicleForm.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  {...vehicleForm.register("licensePlate")}
                  placeholder="ABC123"
                  onChange={(e) => {
                    vehicleForm.setValue("licensePlate", e.target.value.toUpperCase());
                  }}
                />
                {vehicleForm.formState.errors.licensePlate && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.licensePlate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  {...vehicleForm.register("brand")}
                  placeholder="Toyota"
                />
                {vehicleForm.formState.errors.brand && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.brand.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  {...vehicleForm.register("model")}
                  placeholder="Corolla"
                />
                {vehicleForm.formState.errors.model && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.model.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  {...vehicleForm.register("color")}
                  placeholder="Blanco"
                />
                {vehicleForm.formState.errors.color && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.color.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Vehículo</Label>
                <Controller
                  name="type"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automóvil">Automóvil</SelectItem>
                        <SelectItem value="Camioneta">Camioneta</SelectItem>
                        <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                        <SelectItem value="Camión">Camión</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.type && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propietario">Propietario</Label>
                <Input
                  id="propietario"
                  {...vehicleForm.register("owner")}
                  placeholder="Nombre del propietario"
                />
                {vehicleForm.formState.errors.owner && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.owner.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestType">Tipo</Label>
                <Controller
                  name="guestType"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Huésped</SelectItem>
                        <SelectItem value="visitante">Visitante</SelectItem>
                        <SelectItem value="employee">Empleado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.guestType && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.guestType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Habitación (Opcional)</Label>
                <Input
                  id="room"
                  {...vehicleForm.register("room")}
                  placeholder="205"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="espacioAsignado">Espacio Asignado</Label>
                <Controller
                  name="assignedSpace"
                  control={vehicleForm.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar espacio" />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces
                          .filter((e) => e.status === "disponible")
                          .map((space) => (
                            <SelectItem key={space.id} value={space.code}>
                              {space.code} - {space.zone} ({space.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {vehicleForm.formState.errors.assignedSpace && (
                  <p className="text-sm text-red-500">
                    {vehicleForm.formState.errors.assignedSpace.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea
                id="notes"
                {...vehicleForm.register("notes")}
                placeholder="Observaciones adicionales..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Vehículo</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
