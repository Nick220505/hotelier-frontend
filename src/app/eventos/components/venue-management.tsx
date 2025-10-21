"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { venuesApi, Venue as ApiVenue } from "@/lib/api/venues";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

// Venue schema
const venueSchema = z.object({
  name: z.string().min(1, "El nombre del salón es requerido"),
  capacity: z.number().min(1, "La capacidad debe ser mayor a 0"),
  area: z.number().min(1, "El área debe ser mayor a 0"),
  hourlyRate: z.number().min(1, "La tarifa por hora debe ser mayor a 0"),
  location: z.string().min(1, "La ubicación es requerida"),
  description: z.string().optional(),
  available: z.boolean(),
});

type VenueFormData = z.infer<typeof venueSchema>;

// Use the API Venue type
type Venue = ApiVenue;

interface VenueManagementProps {
  venues: ApiVenue[];
  onVenueAdd: (venue: ApiVenue) => void;
  onVenueUpdate?: (id: number, updates: Partial<ApiVenue>) => void;
}

export default function VenueManagement({
  venues,
  onVenueAdd,
  onVenueUpdate,
}: VenueManagementProps) {
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Venue>>({});
  
  const editForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      area: 0,
      hourlyRate: 0,
      location: "",
      description: "",
      available: true,
    },
  });

  const newVenueForm = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      area: 0,
      hourlyRate: 0,
      location: "",
      description: "",
      available: true,
    },
  });
  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setEditFormData({
      name: venue.name,
      capacity: venue.capacity,
      area: venue.area,
      hourlyRate: venue.hourlyRate,
      location: venue.location,
      description: venue.description,
      available: venue.available,
    });
  };

  const handleSaveEdit = async () => {
    if (editingVenue && onVenueUpdate) {
      try {
        const venueId = typeof editingVenue.id === 'string' ? parseInt(editingVenue.id) : editingVenue.id;
        await onVenueUpdate(venueId, editFormData);
        setEditingVenue(null);
        editForm.reset();
        toast.success('Salón actualizado exitosamente');
      } catch (error) {
        console.error('Error updating venue:', error);
        toast.error('Error al actualizar el salón. Por favor, inténtelo nuevamente.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingVenue(null);
    setEditFormData({});
  };

  const handleAddVenue = async (data: VenueFormData) => {
    try {
      const createdVenue = await venuesApi.create(data);
      onVenueAdd(createdVenue);
      newVenueForm.reset();
      toast.success('Salón creado exitosamente');
    } catch (error) {
      console.error('Error creating venue:', error);
      toast.error('Error al crear el salón. Por favor, inténtelo nuevamente.');
    }
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">Disponible</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Ocupado</Badge>
    );
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      {/* Edit Venue Dialog */}
      <Dialog open={!!editingVenue} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Salón</DialogTitle>
            <DialogDescription>
              Modifique los detalles del salón de eventos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-venue-name">Nombre del Salón</Label>
              <Input
                id="edit-venue-name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Nombre del salón"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacidad</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editFormData.capacity || ''}
                  onChange={(e) => setEditFormData({...editFormData, capacity: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-area">Área (m²)</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={editFormData.area || ''}
                  onChange={(e) => setEditFormData({...editFormData, area: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hourly-rate">Tarifa/Hora</Label>
                <Input
                  id="edit-hourly-rate"
                  type="number"
                  value={editFormData.hourlyRate || ''}
                  onChange={(e) => setEditFormData({...editFormData, hourlyRate: Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location || ''}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  placeholder="Piso 1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-available"
                  checked={editFormData.available ?? false}
                  onChange={(e) => setEditFormData({...editFormData, available: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-available">Salón disponible</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Descripción del salón..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Nuevo Salón
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Salón</DialogTitle>
              <DialogDescription>
                Registrar un nuevo salón de eventos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={newVenueForm.handleSubmit(handleAddVenue)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreSalon">Nombre del Salón</Label>
                  <Input
                    id="nombreSalon"
                    {...newVenueForm.register("name")}
                    placeholder="Nombre del salón"
                  />
                  {newVenueForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {newVenueForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacidadSalon">Capacidad</Label>
                    <Input
                      id="capacidadSalon"
                      type="number"
                      {...newVenueForm.register("capacity", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {newVenueForm.formState.errors.capacity && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.capacity.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaSalon">Área (m²)</Label>
                    <Input
                      id="areaSalon"
                      type="number"
                      {...newVenueForm.register("area", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {newVenueForm.formState.errors.area && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.area.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tarifaSalon">Tarifa/Hora</Label>
                    <Input
                      id="tarifaSalon"
                      type="number"
                      {...newVenueForm.register("hourlyRate", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {newVenueForm.formState.errors.hourlyRate && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.hourlyRate.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueLocation">Ubicación</Label>
                    <Input
                      id="venueLocation"
                      {...newVenueForm.register("location")}
                      placeholder="Piso 1"
                    />
                    {newVenueForm.formState.errors.location && (
                      <p className="text-sm text-red-500">
                        {newVenueForm.formState.errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueDescription">Descripción</Label>
                  <Textarea
                    id="venueDescription"
                    {...newVenueForm.register("description")}
                    placeholder="Descripción del salón..."
                  />
                  {newVenueForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {newVenueForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">Cancelar</Button>
                  <Button type="submit">Crear Salón</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Salones de Eventos</CardTitle>
          <CardDescription>Gestión de espacios para eventos</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Salón</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tarifa/Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{venue.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {venue.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{venue.capacity} personas</TableCell>
                  <TableCell>{venue.area} m²</TableCell>
                  <TableCell>{venue.location}</TableCell>
                  <TableCell>${venue.hourlyRate.toLocaleString()}</TableCell>
                  <TableCell>{getAvailabilityBadge(venue.available)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditVenue(venue)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
