"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { type Reservation } from "@/lib/api/reservations";

interface ReservationsTableProps {
  reservations: Reservation[];
  onViewReservation: (id: number) => void;
  onEditReservation: (id: number) => void;
  onDeleteReservation: (id: number) => void;
  currencyCode?: string;
  onUpdateStatus?: (id: number, status: Reservation["status"]) => void;
}

export function ReservationsTable({
  reservations,
  onViewReservation,
  onEditReservation,
  onDeleteReservation,
  currencyCode,
  onUpdateStatus,
}: ReservationsTableProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
        <CardDescription>
          {reservations.length} reservas encontradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Huéspedes</TableHead>
              <TableHead>Descuentos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">#{reservation.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{reservation.guestName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{reservation.guestEmail}</div>
                    {reservation.guestPhone && (
                      <div className="text-muted-foreground">{reservation.guestPhone}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{reservation.room.number}</div>
                    <div className="text-sm text-muted-foreground">
                      {getRoomTypeDisplayName(reservation.room.type)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {new Date(reservation.checkInDate).toLocaleDateString()}
                    </div>
                    <div>
                      {new Date(reservation.checkOutDate).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">
                      {reservation.nights} noches
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">{reservation.guests} huéspedes</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {(reservation.discountPercent || reservation.discountAmount) ? (
                      <div>
                        {reservation.discountPercent && (
                          <div>{reservation.discountPercent}% descuento</div>
                        )}
                        {reservation.discountAmount && (
                          <div>{formatCurrency(reservation.discountAmount)} fijo</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin descuentos</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(Number(reservation.totalAmount))}</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>
                  {getChannelDisplayName(reservation.channel)}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {new Date(reservation.createdAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(reservation.createdAt).toLocaleTimeString(
                        "es-ES",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    {onUpdateStatus && (
                      <div className="flex flex-wrap gap-2">
                        {reservation.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus(reservation.id, "CONFIRMED")}
                            >
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus(reservation.id, "CANCELLED")}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {reservation.status === "CONFIRMED" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus(reservation.id, "CHECKED_IN")}
                            >
                              Check-in
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdateStatus(reservation.id, "CANCELLED")}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewReservation(reservation.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditReservation(reservation.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteReservation(reservation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
