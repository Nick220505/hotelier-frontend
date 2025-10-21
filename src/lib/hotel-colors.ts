/**
 * Hotel Status Color Utilities
 * Provides easy access to hotel-specific status colors and utilities
 */

export const HotelColors = {
  // Room Status Colors
  room: {
    available: 'hsl(var(--room-available))',
    occupied: 'hsl(var(--room-occupied))', 
    maintenance: 'hsl(var(--room-maintenance))',
    cleaning: 'hsl(var(--room-cleaning))',
    outOfOrder: 'hsl(var(--room-out-of-order))',
  },
  
  // Booking Status Colors
  booking: {
    confirmed: 'hsl(var(--booking-confirmed))',
    pending: 'hsl(var(--booking-pending))',
    cancelled: 'hsl(var(--booking-cancelled))',
    noShow: 'hsl(var(--booking-no-show))',
    checkedIn: 'hsl(var(--booking-checked-in))',
    checkedOut: 'hsl(var(--booking-checked-out))',
  },
  
  // Payment Status Colors
  payment: {
    paid: 'hsl(var(--payment-paid))',
    pending: 'hsl(var(--payment-pending))',
    overdue: 'hsl(var(--payment-overdue))',
    partial: 'hsl(var(--payment-partial))',
  },
  
  // Semantic Colors
  semantic: {
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    info: 'hsl(var(--info))',
    destructive: 'hsl(var(--destructive))',
  }
} as const;

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'outOfOrder';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'noShow' | 'checkedIn' | 'checkedOut';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';

/**
 * Get the appropriate color for a room status
 */
export function getRoomStatusColor(status: RoomStatus): string {
  return HotelColors.room[status];
}

/**
 * Get the appropriate color for a booking status
 */
export function getBookingStatusColor(status: BookingStatus): string {
  return HotelColors.booking[status];
}

/**
 * Get the appropriate color for a payment status
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  return HotelColors.payment[status];
}

/**
 * Room status CSS class mapping for Tailwind
 */
export const RoomStatusClasses = {
  available: 'bg-room-available text-white',
  occupied: 'bg-room-occupied text-white',
  maintenance: 'bg-room-maintenance text-white',
  cleaning: 'bg-room-cleaning text-white',
  outOfOrder: 'bg-room-out-of-order text-white',
} as const;

/**
 * Booking status CSS class mapping for Tailwind
 */
export const BookingStatusClasses = {
  confirmed: 'bg-booking-confirmed text-white',
  pending: 'bg-booking-pending text-white',
  cancelled: 'bg-booking-cancelled text-white',
  noShow: 'bg-gray-500 text-white',
  checkedIn: 'bg-booking-checked-in text-white',
  checkedOut: 'bg-gray-400 text-white',
} as const;

/**
 * Status indicator classes with proper styling
 */
export const StatusIndicatorClasses = {
  available: 'status-available',
  occupied: 'status-occupied',
  maintenance: 'status-maintenance',
  cleaning: 'status-cleaning',
} as const;

/**
 * Get status indicator class for room status
 */
export function getStatusIndicatorClass(status: RoomStatus): string {
  return StatusIndicatorClasses[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Hotel theme color palette for charts and data visualization
 */
export const ChartColors = [
  'hsl(var(--chart-1))', // Hotel blue
  'hsl(var(--chart-2))', // Success green
  'hsl(var(--chart-3))', // Warning amber
  'hsl(var(--chart-4))', // Info cyan
  'hsl(var(--chart-5))', // Luxury purple
] as const;

/**
 * Priority levels with colors
 */
export const PriorityColors = {
  low: 'hsl(var(--success))',
  medium: 'hsl(var(--warning))',
  high: 'hsl(var(--destructive))',
  urgent: 'hsl(0 84% 40%)', // Darker red for urgent
} as const;

export type Priority = keyof typeof PriorityColors;