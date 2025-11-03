"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Award } from "lucide-react";
import { Employee } from "@/lib/api/employees";

interface EmployeePerformanceChartProps {
  employees: Employee[];
}

const DEPARTMENT_NAMES: Record<string, string> = {
  FRONT_DESK: "Recepción",
  HOUSEKEEPING: "Limpieza",
  MAINTENANCE: "Mantenimiento",
  RESTAURANT: "Restaurante",
  MANAGEMENT: "Gerencia",
  SECURITY: "Seguridad",
  VALET: "Valet",
};

const getBarColor = (rate: number) => {
  if (rate >= 80) return "#10b981"; // green
  if (rate >= 60) return "#f59e0b"; // amber
  return "#ef4444"; // red
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      position: string;
      department: string;
      completionRate: number;
      completed: number;
      pending: number;
      assigned: number;
      efficiency: string;
    };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-sm mb-1">{data.name}</p>
        <p className="text-xs text-gray-500 mb-2">
          {data.position} - {data.department}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            Tasa de completitud:{" "}
            <span
              className="font-bold"
              style={{ color: getBarColor(data.completionRate) }}
            >
              {data.completionRate}%
            </span>
          </p>
          <p className="text-sm text-green-600">
            ✓ Completadas: <span className="font-medium">{data.completed}</span>
          </p>
          <p className="text-sm text-orange-600">
            ⏳ Pendientes: <span className="font-medium">{data.pending}</span>
          </p>
          <p className="text-sm text-gray-600">
            Total asignadas:{" "}
            <span className="font-medium">{data.assigned}</span>
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
          Rendimiento: <span className="font-medium">{data.efficiency}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function EmployeePerformanceChart({
  employees,
}: EmployeePerformanceChartProps) {
  // Filter employees with performance data (those who have assigned rooms)
  const performanceData = employees
    .filter((emp) => (emp.assignedRooms || 0) > 0)
    .map((emp) => {
      const assigned = emp.assignedRooms || 0;
      const completed = emp.completedRooms || 0;
      const completionRate = assigned > 0 ? (completed / assigned) * 100 : 0;

      return {
        name: emp.name,
        employeeId: emp.employeeId,
        department: DEPARTMENT_NAMES[emp.department] || emp.department,
        position: emp.position,
        assigned,
        completed,
        pending: assigned - completed,
        completionRate: Math.round(completionRate),
        efficiency:
          completionRate >= 80
            ? "Excelente"
            : completionRate >= 60
              ? "Bueno"
              : "Regular",
      };
    })
    .sort((a, b) => b.completionRate - a.completionRate);

  if (performanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Rendimiento de Empleados
          </CardTitle>
          <CardDescription>
            Tasa de completitud de tareas por empleado
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <p className="text-muted-foreground">
            No hay datos de rendimiento disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average performance
  const avgPerformance =
    performanceData.length > 0
      ? Math.round(
          performanceData.reduce((acc, emp) => acc + emp.completionRate, 0) /
            performanceData.length,
        )
      : 0;

  const topPerformer = performanceData[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Rendimiento de Empleados
            </CardTitle>
            <CardDescription>
              Tasa de completitud de tareas por empleado
            </CardDescription>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">
                Promedio: {avgPerformance}%
              </span>
            </div>
            {topPerformer && (
              <div className="text-xs text-muted-foreground">
                Top: {topPerformer.name} ({topPerformer.completionRate}%)
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={performanceData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{
                value: "Tasa de Completitud (%)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.completionRate)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Performance Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Excelente (≥80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
            <span className="text-muted-foreground">Bueno (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Regular (&lt;60%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
