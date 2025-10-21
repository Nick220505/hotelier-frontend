import { useState, useEffect } from 'react';
import { roomsApi } from '@/lib/api/rooms';
import { reservationsApi } from '@/lib/api/reservations';

export interface ActiveGuest {
  id: string;
  name: string;
  email: string;
  roomNumber: string;
  checkOut: string;
}

export function useActiveGuests() {
  const [guests, setGuests] = useState<ActiveGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        // Obtener habitaciones y reservaciones
        const [rooms, reservations] = await Promise.all([
          roomsApi.getAll(),
          reservationsApi.getAll()
        ]);

        // Filtrar reservaciones activas (checked in o confirmed para hoy)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeReservations = reservations.filter(reservation => {
          const checkIn = new Date(reservation.checkInDate);
          const checkOut = new Date(reservation.checkOutDate);
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);

          return (
            (reservation.status === "CHECKED_IN" || reservation.status === "CONFIRMED") &&
            today >= checkIn &&
            today < checkOut
          );
        });

        // Mapear las reservaciones activas a huéspedes activos
        const activeGuests = activeReservations.map(reservation => {
          const room = rooms.find(r => r.id === reservation.roomId);
          return {
            id: reservation.id.toString(),
            name: reservation.guestName || 'Sin nombre',
            email: reservation.guestEmail || 'No disponible',
            roomNumber: room?.number || 'No asignada',
            checkOut: reservation.checkOutDate
          };
        });

        setGuests(activeGuests);
        setError(null);
      } catch (err) {
        setError('Error al cargar los huéspedes activos');
        console.error('Error fetching occupied rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return { guests, loading, error };
}