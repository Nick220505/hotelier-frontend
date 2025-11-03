"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  User,
  Phone,
  Mail,
  Home,
  Users,
  CreditCard,
  MapPin,
} from "lucide-react";
import { type Reservation } from "@/lib/api/reservations";
import Link from "next/link";

interface ViewReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onCheckout?: (id: number) => void;
  isProcessing?: boolean;
  currencyCode?: string;
}

export function ViewReservationDialog({
  isOpen,
  onClose,
  reservation,
  onCheckout,
  isProcessing,
  currencyCode,
}: ViewReservationDialogProps) {
  const formatCurrency = (val: number) => {
    try {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: currencyCode || "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `$${val.toLocaleString()}`;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "CHECKED_IN":
        return <Badge className="bg-blue-100 text-blue-800">Check-in</Badge>;
      case "CHECKED_OUT":
        return <Badge className="bg-gray-100 text-gray-800">Check-out</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoomStatusBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge className="bg-green-100 text-green-800">Disponible</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">En limpieza</Badge>
    );
  };

  const getChannelDisplayName = (channel: string) => {
    switch (channel) {
      case "DIRECT":
        return "Directo";
      case "BOOKING_COM":
        return "Booking.com";
      case "EXPEDIA":
        return "Expedia";
      case "AIRBNB":
        return "Airbnb";
      case "AGENCY":
        return "Agencia";
      case "PHONE":
        return "Teléfono";
      default:
        return channel;
    }
  };

  const getRoomTypeDisplayName = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return "Individual";
      case "DOBLE":
        return "Doble";
      case "SUITE":
        return "Suite";
      case "FAMILIAR":
        return "Familiar";
      default:
        return type;
    }
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Reserva #{reservation.id}
            {getStatusBadge(reservation.status)}
          </DialogTitle>
          <DialogDescription>
            Detalles completos de la reserva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Huésped */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Huésped
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nombre:</span>
                <p className="text-muted-foreground">{reservation.guestName}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guestEmail}
                  </p>
                </div>
              </div>
              {reservation.guestPhone && (
                <div className="col-span-2">
                  <span className="font-medium">Teléfono:</span>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <p className="text-muted-foreground">
                      {reservation.guestPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información de la Reserva */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Detalles de la Reserva
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Fecha de Entrada:</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkInDate).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Fecha de Salida:</span>
                <p className="text-muted-foreground">
                  {new Date(reservation.checkOutDate).toLocaleDateString(
                    "es-ES",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium">Noches:</span>
                <p className="text-muted-foreground">
                  {reservation.nights || 0} noches
                </p>
              </div>
              <div>
                <span className="font-medium">Huéspedes:</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {reservation.guests} persona(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de la Habitación */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Información de la Habitación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Número:</span>
                <p className="text-muted-foreground">
                  {reservation.room.number}
                </p>
              </div>
              <div>
                <span className="font-medium">Tipo:</span>
                <p className="text-muted-foreground">
                  {getRoomTypeDisplayName(reservation.room.type)}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-medium">Estado:</span>
                {getRoomStatusBadge(!!reservation.room.isAvailable)}
                {!reservation.room.isAvailable && (
                  <Link
                    href="/limpieza"
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    Ver asignaciones de limpieza
                  </Link>
                )}
              </div>
              <div>
                <span className="font-medium">Capacidad:</span>
                <p className="text-muted-foreground">
                  Hasta {reservation.room.capacity} personas
                </p>
              </div>
              <div>
                <span className="font-medium">Precio por noche:</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {formatCurrency(Number(reservation.room.price))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Pago */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Información de Pago
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total:</span>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(Number(reservation.totalAmount))}
                </p>
              </div>
              <div>
                <span className="font-medium">Canal de Reserva:</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <p className="text-muted-foreground">
                    {getChannelDisplayName(reservation.channel)}
                  </p>
                </div>
              </div>
            </div>

            {(reservation.discountPercent || reservation.discountAmount) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
                {reservation.discountPercent ? (
                  <div>
                    <span className="font-medium">Descuento %:</span>
                    <p className="text-muted-foreground">
                      {Number(reservation.discountPercent).toFixed(2)}%
                    </p>
                  </div>
                ) : null}
                {reservation.discountAmount ? (
                  <div>
                    <span className="font-medium">Descuento $:</span>
                    <p className="text-muted-foreground">
                      {formatCurrency(Number(reservation.discountAmount))}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {reservation.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Notas</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {reservation.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Información de Fechas del Sistema */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              Creado: {new Date(reservation.createdAt).toLocaleString("es-ES")}
            </p>
            <p>
              Actualizado:{" "}
              {new Date(reservation.updatedAt).toLocaleString("es-ES")}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
          {reservation &&
            reservation.status !== "CHECKED_OUT" &&
            onCheckout && (
              <Button
                onClick={() => onCheckout(Number(reservation.id))}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? "Procesando..." : "Checkout"}
              </Button>
            )}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
