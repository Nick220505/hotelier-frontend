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

interface FinancialReport {
  period: string;
  revenue: number;
  invoices: number;
  paid?: number;
  pending: number;
  paymentPercentage?: number;
}

interface FinancialReportsProps {
  reports: FinancialReport[];
}

export default function FinancialReports({ reports }: FinancialReportsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes Financieros</CardTitle>
        <CardDescription>
          Resumen de ingresos y facturación por período
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Ingresos</TableHead>
              <TableHead>Facturas</TableHead>
              <TableHead>Pagadas</TableHead>
              <TableHead>Pendientes</TableHead>
              <TableHead>% Cobro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{report.period}</TableCell>
                <TableCell>
                  ${(Number(report.revenue) || 0).toLocaleString()}
                </TableCell>
                <TableCell>{Number(report.invoices) || 0}</TableCell>
                <TableCell>{Number(report.paid) || 0}</TableCell>
                <TableCell>{Number(report.pending) || 0}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      (Number(report.paymentPercentage) || 0) > 90
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {(Number(report.paymentPercentage) || 0).toFixed(1)}%
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
