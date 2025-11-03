"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RoomServiceOrder } from "@/lib/api/restaurant";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: RoomServiceOrder | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const getStatusColor = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: RoomServiceOrder["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "preparing":
        return "Preparando";
      case "ready":
        return "Lista";
      case "delivered":
        return "Entregada";
      default:
        return "Desconocido";
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Orden #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Habitación:</strong> {order.room}
            </div>
            <div>
              <strong>Huésped:</strong> {order.guest}
            </div>
            <div>
              <strong>Estado:</strong>
              <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            <div>
              <strong>Total:</strong> ${order.total.toLocaleString()}
            </div>
          </div>

          <div>
            <strong>Productos:</strong>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-muted rounded"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <strong>Hora de pedido:</strong>{" "}
            {new Date(order.orderTime).toLocaleString()}
          </div>

          {order.estimatedTime && (
            <div>
              <strong>Tiempo estimado:</strong> {order.estimatedTime}
            </div>
          )}

          {order.waiter && (
            <div>
              <strong>Mesero asignado:</strong> {order.waiter}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
