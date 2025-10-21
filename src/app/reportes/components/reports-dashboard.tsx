"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ReportsKPIs } from "./reports-kpis";
import { OccupancyCharts } from "./occupancy-charts";
import { OccupancyDetailsTable } from "./occupancy-details-table";
import { FinancialSummary } from "./financial-summary";
import { OperationalReportTable } from "./operational-report-table";
import { CustomerReportsTable } from "./customer-reports-table";

interface ReportsData {
  occupancyReports: Array<{
    roomType: string;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyPercentage: number;
    averageRate: number;
  }>;
  operationalReports: Array<{
    department: string;
    checkInsCompleted?: number;
    checkOutsCompleted?: number;
    roomsCleaned?: number;
    roomsOutOfOrder?: number;
    customersServed?: number;
    requestsHandled?: number;
    pendingRequests?: number;
    averageCheckInTime?: string;
    averageCleaningTime?: string;
    averageServiceTime?: string;
    averageResponseTime?: string;
    customerSatisfaction: number;
    reportedIncidents: number;
    averageSalesPerTable?: number;
  }>;
  customerReports: Array<{
    segment: string;
    quantity: number;
    averageRevenue: number;
    averageStay: number;
    satisfaction: number;
    loyalty: string;
    totalValue: number;
  }>;
  financialReports: Array<{
    category: string;
    january: number;
    december: number;
    variation: number;
    totalPercentage: number;
  }>;
  generalKpis: {
    averageOccupancy: number;
    revenuePerRoomDisponible: number;
    revenuePerRoomOcupada: number;
    satisfaccionGeneral: number;
    averageStayTime: number;
    tasaRepeticion: number;
    costoAdquisicionCliente: number;
    valorVidaCliente: number;
  };
}

interface ReportsDashboardProps {
  initialData: ReportsData;
}

export default function ReportsDashboard({
  initialData,
}: ReportsDashboardProps) {
  const [occupancyReports] = useState(initialData.occupancyReports);
  const [operationalReports] = useState(initialData.operationalReports);
  const [customerReports] = useState(initialData.customerReports);
  const [financialReports] = useState(initialData.financialReports);
  const [generalKpis] = useState(initialData.generalKpis);

  // Datos para gráficas
  const occupancyData = [
    { date: "Ene", occupancy: 75, revenue: 45000 },
    { date: "Feb", occupancy: 82, revenue: 52000 },
    { date: "Mar", occupancy: 78, revenue: 48000 },
    { date: "Abr", occupancy: 85, revenue: 61000 },
    { date: "May", occupancy: 80, revenue: 55000 },
    { date: "Jun", occupancy: 88, revenue: 67000 },
    { date: "Jul", occupancy: 92, revenue: 74000 },
  ];

  const guestTypeData = [
    { name: "Negocios", value: 45, fill: "hsl(var(--chart-1))" },
    { name: "Turismo", value: 35, fill: "hsl(var(--chart-2))" },
    { name: "Eventos", value: 15, fill: "hsl(var(--chart-3))" },
    { name: "Otros", value: 5, fill: "hsl(var(--chart-4))" },
  ];

  const chartConfig = {
    occupancy: { label: "Ocupación %" },
    revenue: { label: "Ingresos" },
    satisfaction: { label: "Satisfacción" },
    negocios: { label: "Negocios" },
    turismo: { label: "Turismo" },
    eventos: { label: "Eventos" },
    otros: { label: "Otros" },
  };

  const handleExportReport = (type: string) => {
    toast("Exportación iniciada", {
      description: `Generando reporte de ${type}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Dashboard ejecutivo y reportes detallados
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => handleExportReport("general")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <ReportsKPIs
        kpis={{
          averageOccupancy: generalKpis.averageOccupancy,
          revenuePerRoomDisponible: generalKpis.revenuePerRoomDisponible,
          satisfaccionGeneral: generalKpis.satisfaccionGeneral,
          averageStayTime: generalKpis.averageStayTime,
        }}
      />

      <Tabs defaultValue="ocupacion" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ocupacion">Ocupación</TabsTrigger>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="ocupacion" className="space-y-4">
          <OccupancyCharts
            occupancyData={occupancyData}
            guestTypeData={guestTypeData}
            chartConfig={chartConfig}
          />
          <OccupancyDetailsTable occupancyReports={occupancyReports} />
        </TabsContent>

        <TabsContent value="financiero" className="space-y-4">
          <FinancialSummary
            financialReports={financialReports}
            onExport={() => handleExportReport("financiero")}
          />
        </TabsContent>

        <TabsContent value="operacional" className="space-y-4">
          <OperationalReportTable
            operationalReports={operationalReports}
            onExport={() => handleExportReport("operacional")}
          />
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <CustomerReportsTable
            customerReports={customerReports}
            onExport={() => handleExportReport("clientes")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
