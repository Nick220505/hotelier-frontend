"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";
import { reservationsApi, type Reservation, type BookingChannel } from "@/lib/api/reservations";
import { roomsApi, type Room } from "@/lib/api/rooms";
import { configurationApi } from "@/lib/api/configuration";

interface Companion {
  name: string;
  age?: number;
}

interface ReservationWithCompanions extends Reservation {
  companions?: Companion[];
}
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CardLoader } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { NewReservationDialog } from "@/app/reservas/components/new-reservation-dialog";
import { toast } from "sonner";
import { Search, Calendar, MapPin, CalendarPlus } from "lucide-react";
import { formatCurrency, type SupportedCurrency } from "@/lib/utils/currency";


type CreateReservationPayload = Omit<Reservation, "id" | "createdAt" | "updatedAt" | "user" | "room" | "totalAmount" | "status">;

export function MyReservationsManagement() {
  const { hasRole } = useAuthContext();
  const [myReservations, setMyReservations] = useState<ReservationWithCompanions[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currencyCode, setCurrencyCode] = useState<string>("COP");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);



  useEffect(() => {
    async function load() {
      try {
        const [mine, allRooms, cfg] = await Promise.all([
          reservationsApi.getMine(),
          roomsApi.getAll(),
          configurationApi.getHotelConfig().catch(() => ({ currency: "COP" })),
        ]);
        setMyReservations(mine);
        setRooms(allRooms);
        if (cfg?.currency) setCurrencyCode(cfg.currency);
      } catch (e) {
        console.error("Error loading my reservations:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatCurrencyAmount = (val: number) => {
    return formatCurrency(val, (currencyCode as SupportedCurrency) || 'COP');
  };

  const handleCreateMyReservation = async (formData: {
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    channel: string;
    discountAmount?: number;
    specialRequests?: string;
  }) => {
    try {
      setLoading(true);
      
      const payload: CreateReservationPayload = {
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone || undefined,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        roomId: formData.roomId,
        channel: "DIRECT" as BookingChannel,
        userId: 0, // Will be set by backend from JWT
      };

      if (formData.discountAmount) {
        payload.discountAmount = formData.discountAmount;
      }

      await reservationsApi.createSelf(payload);
      const mine = await reservationsApi.getMine();
      setMyReservations(mine);

      setOpenDialog(false);
      toast.success("Reserva creada", { description: "Tu reserva ha sido creada exitosamente." });
    } catch (e) {
      console.error("Error creating self reservation:", e);
      toast.error("Error", { description: "No se pudo crear la reserva." });
    } finally {
      setLoading(false);
    }
  };

  // Spanish status translations
  const getStatusInSpanish = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'CHECKED_IN': 'Check-in',
      'CHECKED_OUT': 'Check-out',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  // Status badge variant with custom colors
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'PENDING':
        return 'secondary'; // Gray
      case 'CONFIRMED':
        return 'default'; // Blue
      case 'CHECKED_IN':
        return 'default'; // Green will be handled with custom class
      case 'CHECKED_OUT':
        return 'outline'; // White/transparent
      case 'CANCELLED':
        return 'destructive'; // Red
      default:
        return 'secondary';
    }
  };

  // Status badge custom classes for better colors
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'CHECKED_IN':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'CHECKED_OUT':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Filter reservations by search term
  const filteredReservations = myReservations.filter((reservation) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.id.toString().includes(searchLower) ||
      (reservation.room?.number || reservation.roomId.toString()).toLowerCase().includes(searchLower) ||
      getStatusInSpanish(reservation.status).toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Reservas</h1>
          <p className="text-muted-foreground">Gestiona tus reservas del hotel</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>Nueva Reserva</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Listado</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8 w-64"
                  placeholder="Buscar por #, habitación o estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <CardLoader text="Cargando reservas..." />
          ) : filteredReservations.length === 0 ? (
            <EmptyState
              icon={CalendarPlus}
              title={searchTerm ? "Sin resultados" : "No tienes reservas"}
              description={searchTerm 
                ? "No encontramos reservas que coincidan con tu búsqueda" 
                : "Crea tu primera reserva para comenzar"}
              action={{
                label: "Nueva Reserva",
                onClick: () => setOpenDialog(true)
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Huésped</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="w-24">Habitación</TableHead>
                    <TableHead className="hidden sm:table-cell">Entrada</TableHead>
                    <TableHead className="hidden sm:table-cell">Salida</TableHead>
                    <TableHead className="hidden md:table-cell w-20">Noches</TableHead>
                    <TableHead>Huéspedes</TableHead>
                    <TableHead>Descuentos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{r.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{r.guestName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{r.guestEmail}</div>
                          {r.guestPhone && (
                            <div className="text-muted-foreground">{r.guestPhone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{r.room?.number ?? r.roomId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(r.checkInDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(r.checkOutDate).toLocaleDateString('es-ES')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center">{r.nights}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {r.companions && r.companions.length > 0 ? (
                            <div>
                              <div className="font-medium">{1 + r.companions.length} huéspedes</div>
                              <div className="text-muted-foreground">
                                <div>1 principal</div>
                                {r.companions.slice(0, 2).map((c, i) => (
                                  <div key={i}>{c.name}</div>
                                ))}
                                {r.companions.length > 2 && (
                                  <div>+{r.companions.length - 2} más</div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium">1 huésped</div>
                              <div className="text-muted-foreground">Solo principal</div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {(r.discountPercent || r.discountAmount) ? (
                            <div>
                              {r.discountPercent && (
                                <div>{r.discountPercent}% descuento</div>
                              )}
                              {r.discountAmount && (
                                <div>{formatCurrencyAmount(r.discountAmount)} fijo</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Sin descuentos</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm lg:text-base">{formatCurrencyAmount(Number(r.totalAmount))}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(r.status)}
                          className={`${getStatusClasses(r.status)} text-xs`}
                        >
                          {getStatusInSpanish(r.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

            <NewReservationDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        onAddReservation={handleCreateMyReservation}
        rooms={rooms}
        loading={loading}
        hideDiscounts={hasRole('cliente')}
      />
    </div>
  );
}
