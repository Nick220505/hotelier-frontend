"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useActiveGuests } from "@/hooks/use-active-guests"
import { Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const vehicleSchema = z.object({
  licensePlate: z
    .string({ message: "La placa es obligatoria" })
    .min(1, "La placa es obligatoria")
    .max(20, "La placa debe tener máximo 20 caracteres")
    .regex(/^[A-Z0-9-]+$/i, "La placa solo puede contener letras, números y guiones"),
  brand: z
    .string({ message: "La marca es obligatoria" })
    .min(1, "La marca es obligatoria")
    .max(50, "La marca debe tener máximo 50 caracteres"),
  model: z
    .string({ message: "El modelo es obligatorio" })
    .min(1, "El modelo es obligatorio")
    .max(50, "El modelo debe tener máximo 50 caracteres"),
  color: z
    .string({ message: "El color es obligatorio" })
    .min(1, "El color es obligatorio")
    .max(30, "El color debe tener máximo 30 caracteres"),
  type: z
    .string({ message: "El tipo es obligatorio" })
    .min(1, "Debe seleccionar un tipo de vehículo"),
  guestId: z
    .string({ message: "El propietario es obligatorio" })
    .min(1, "Debe seleccionar un propietario"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleData {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
  type: string;
  guestId: string;
}

interface VehicleRegistrationFormProps {
  onRegister?: (vehicleData: VehicleData) => void;
}

export function VehicleRegistrationForm({ onRegister }: VehicleRegistrationFormProps) {
  const [open, setOpen] = useState(false)
  const { guests, loading, error } = useActiveGuests()
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      licensePlate: "",
      brand: "",
      model: "",
      color: "",
      type: "",
      guestId: "",
    },
  });

  const handleFormSubmit = (data: VehicleFormData) => {
    if (onRegister) {
      onRegister(data)
    }
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        form.reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="default">Registrar Nuevo Vehículo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Vehículo</DialogTitle>
          <DialogDescription>
            Ingrese los datos del vehículo para registrarlo en el sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">
                Placa *
              </Label>
              <div className="col-span-3">
                <Input
                  id="licensePlate"
                  {...form.register("licensePlate")}
                  className={form.formState.errors.licensePlate ? "border-red-500" : ""}
                />
                {form.formState.errors.licensePlate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.licensePlate.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Marca *
              </Label>
              <div className="col-span-3">
                <Input
                  id="brand"
                  {...form.register("brand")}
                  className={form.formState.errors.brand ? "border-red-500" : ""}
                />
                {form.formState.errors.brand && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.brand.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Modelo *
              </Label>
              <div className="col-span-3">
                <Input
                  id="model"
                  {...form.register("model")}
                  className={form.formState.errors.model ? "border-red-500" : ""}
                />
                {form.formState.errors.model && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.model.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color *
              </Label>
              <div className="col-span-3">
                <Input
                  id="color"
                  {...form.register("color")}
                  className={form.formState.errors.color ? "border-red-500" : ""}
                />
                {form.formState.errors.color && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.color.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo *
              </Label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={form.formState.errors.type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccione el tipo de vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automóvil">Automóvil</SelectItem>
                        <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Camioneta">Camioneta</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guestId" className="text-right">
                Propietario *
              </Label>
              <div className="col-span-3">
                <Controller
                  name="guestId"
                  control={form.control}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className={form.formState.errors.guestId ? "border-red-500" : ""}>
                        <SelectValue placeholder={loading ? "Cargando huéspedes..." : "Seleccione un huésped"} />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2">Cargando...</span>
                          </div>
                        ) : error ? (
                          <div className="p-2 text-red-500">Error al cargar huéspedes</div>
                        ) : guests.length === 0 ? (
                          <div className="p-2">No hay huéspedes activos</div>
                        ) : (
                          guests.map((guest) => (
                            <SelectItem key={guest.id} value={guest.id.toString()}>
                              <div>
                                <div>{guest.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {guest.email} {guest.roomNumber ? `- Habitación ${guest.roomNumber}` : ""}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.guestId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.guestId.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              form.reset();
              setOpen(false);
            }}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}