"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
}

interface PaymentManagementProps {
  payments: Payment[];
}

export default function PaymentManagement({
  payments,
}: PaymentManagementProps) {
  const getPaymentMethodBadge = (method: string) => {
    const variants: Record<string, string> = {
      tarjeta: "bg-blue-100 text-blue-800",
      efectivo: "bg-green-100 text-green-800",
      transferencia: "bg-purple-100 text-purple-800",
    };

    return (
      <Badge className={variants[method] || "bg-gray-100 text-gray-800"}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Pagos</CardTitle>
        <CardDescription>Registro de todos los pagos recibidos</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pago</TableHead>
              <TableHead>Factura</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((paymentItem) => (
              <TableRow key={paymentItem.id}>
                <TableCell className="font-medium">{paymentItem.id}</TableCell>
                <TableCell>{paymentItem.invoiceId}</TableCell>
                <TableCell>{paymentItem.date}</TableCell>
                <TableCell>
                  ${(Number(paymentItem.amount) || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {getPaymentMethodBadge(paymentItem.method)}
                </TableCell>
                <TableCell>{paymentItem.reference}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    Aprobado
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
