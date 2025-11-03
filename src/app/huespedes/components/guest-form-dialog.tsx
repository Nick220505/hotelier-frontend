"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { guestsApi, type Guest } from "@/lib/api/guests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const guestSchema = z.object({
  name: z
    .string({ message: "Este campo es obligatorio" })
    .min(2, "Debe tener al menos 2 caracteres")
    .max(100, "Debe tener máximo 100 caracteres"),
  email: z
    .string({ message: "Este campo es obligatorio" })
    .email("Ingresa un email válido"),
  phone: z
    .string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Ingresa un teléfono válido")
    .optional()
    .or(z.literal("")),
  document: z
    .string()
    .regex(/^[A-Z0-9]{6,20}$/i, "Formato de documento inválido")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  nationality: z.string().optional(),
  vip: z.boolean().default(false),
});

type GuestFormData = z.infer<typeof guestSchema>;

interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGuest: Guest | null;
  onGuestSaved: (guest: Guest, isEdit: boolean) => void;
}

export function GuestFormDialog({
  open,
  onOpenChange,
  editingGuest,
  onGuestSaved,
}: GuestFormDialogProps) {
  const form = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      address: "",
      nationality: "",
      vip: false,
    },
  });

  useEffect(() => {
    if (editingGuest) {
      form.reset({
        name: editingGuest.name || "",
        email: editingGuest.email || "",
        phone: editingGuest.phone || "",
        document: editingGuest.document || "",
        address: editingGuest.address || "",
        nationality: editingGuest.nationality || "",
        vip: !!editingGuest.vip,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        document: "",
        address: "",
        nationality: "",
        vip: false,
      });
    }
  }, [editingGuest, form]);

  const onSubmit = async (data: GuestFormData) => {
    try {
      if (editingGuest) {
        const updated = await guestsApi.update(editingGuest.id, data);
        onGuestSaved(updated, true);
      } else {
        const created = await guestsApi.create(data);
        onGuestSaved(created, false);
      }
    } catch (e: unknown) {
      console.error("Error saving guest:", e);
      toast.error("Error", {
        description: e instanceof Error ? e.message : "No se pudo guardar",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingGuest ? "Editar Huésped" : "Nuevo Huésped"}
          </DialogTitle>
          <DialogDescription>
            Completa la información del huésped
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                {...form.register("name")}
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                {...form.register("phone")}
                className={form.formState.errors.phone ? "border-red-500" : ""}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Documento</Label>
              <Input
                {...form.register("document")}
                className={
                  form.formState.errors.document ? "border-red-500" : ""
                }
              />
              {form.formState.errors.document && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.document.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input {...form.register("address")} />
            </div>
            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <Input {...form.register("nationality")} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="vip"
              checked={useWatch({ control: form.control, name: "vip" })}
              onCheckedChange={(v) => form.setValue("vip", !!v)}
            />
            <Label htmlFor="vip">VIP</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Guardando..."
                : editingGuest
                  ? "Guardar"
                  : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
