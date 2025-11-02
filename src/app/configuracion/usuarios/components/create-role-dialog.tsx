"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateRoleRequest } from "@/lib/api/roles";
import { Plus } from "lucide-react";

const createRoleSchema = z.object({
  name: z
    .string({ message: "Este campo es obligatorio" })
    .min(1, "El nombre del rol es obligatorio")
    .max(50, "Debe tener máximo 50 caracteres"),
  description: z
    .string()
    .max(200, "Debe tener máximo 200 caracteres")
    .optional(),
});

type CreateRoleFormData = z.infer<typeof createRoleSchema>;

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoleRequest) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateRoleDialogProps) {
  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = (data: CreateRoleFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Crear Rol
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
          <DialogDescription>
            Define un nuevo rol personalizado para el sistema
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <Input
              id="name"
              placeholder="ej: recepcionista_senior"
              {...form.register("name")}
              disabled={form.formState.isSubmitting}
              className={form.formState.errors.name ? "border-red-500" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las responsabilidades de este rol..."
              {...form.register("description")}
              disabled={form.formState.isSubmitting}
              className={
                form.formState.errors.description ? "border-red-500" : ""
              }
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creando..." : "Crear Rol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
