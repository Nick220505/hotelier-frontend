import React from 'react';
import { cn } from '@/lib/utils';
import { RoomStatus, getStatusIndicatorClass } from '@/lib/hotel-colors';

interface RoomStatusBadgeProps {
  status: RoomStatus;
  className?: string;
  showIcon?: boolean;
}

const statusIcons = {
  available: '✓',
  occupied: '🏠',
  maintenance: '🔧',
  cleaning: '🧽',
  outOfOrder: '❌',
};

const statusLabels = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  cleaning: 'Cleaning',
  outOfOrder: 'Out of Order',
};

export function RoomStatusBadge({ status, className, showIcon = true }: RoomStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full',
        getStatusIndicatorClass(status),
        className
      )}
    >
      {showIcon && <span>{statusIcons[status]}</span>}
      {statusLabels[status]}
    </span>
  );
}

interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  status: RoomStatus;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  className?: string;
}

export function RoomCard({
  roomNumber,
  roomType,
  status,
  guestName,
  checkIn,
  checkOut,
  className
}: RoomCardProps) {
  return (
    <div
      className={cn(
        'card-hover border rounded-lg p-4 bg-card',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">Room {roomNumber}</h3>
          <p className="text-sm text-muted-foreground">{roomType}</p>
        </div>
        <RoomStatusBadge status={status} />
      </div>
      
      {guestName && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Guest:</span>
            <span className="text-sm text-muted-foreground">{guestName}</span>
          </div>
          {checkIn && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Check-in:</span>
              <span className="text-sm text-muted-foreground">{checkIn}</span>
            </div>
          )}
          {checkOut && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Check-out:</span>
              <span className="text-sm text-muted-foreground">{checkOut}</span>
            </div>
          )}
        </div>
      )}
      
      {status === 'maintenance' && (
        <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded text-xs text-warning">
          Maintenance required - contact facilities team
        </div>
      )}
      
      {status === 'cleaning' && (
        <div className="mt-3 p-2 bg-info/10 border border-info/20 rounded text-xs text-info">
          Housekeeping in progress
        </div>
      )}
    </div>
  );
}

// Example usage component
export function RoomStatusDemo() {
  const sampleRooms = [
    {
      roomNumber: '101',
      roomType: 'Standard Double',
      status: 'available' as RoomStatus,
    },
    {
      roomNumber: '102',
      roomType: 'Deluxe Suite',
      status: 'occupied' as RoomStatus,
      guestName: 'John Doe',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
    },
    {
      roomNumber: '103',
      roomType: 'Standard Single',
      status: 'maintenance' as RoomStatus,
    },
    {
      roomNumber: '104',
      roomType: 'Executive Suite',
      status: 'cleaning' as RoomStatus,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Room Status Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleRooms.map((room) => (
            <RoomCard key={room.roomNumber} {...room} />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Status Badges</h3>
        <div className="flex flex-wrap gap-2">
          <RoomStatusBadge status="available" />
          <RoomStatusBadge status="occupied" />
          <RoomStatusBadge status="maintenance" />
          <RoomStatusBadge status="cleaning" />
          <RoomStatusBadge status="outOfOrder" />
        </div>
      </div>
    </div>
  );
}