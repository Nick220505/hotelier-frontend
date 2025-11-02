import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";

interface AttendanceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
}

export function AttendanceFilters({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  selectedDate,
  onDateChange,
}: AttendanceFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={departmentFilter} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              <SelectItem value="RECEPTION">Recepción</SelectItem>
              <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
              <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
              <SelectItem value="MANAGEMENT">Gestión</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PRESENT">Presente</SelectItem>
              <SelectItem value="ABSENT">Ausente</SelectItem>
              <SelectItem value="LATE">Tarde</SelectItem>
              <SelectItem value="EARLY_LEAVE">Salida Temprana</SelectItem>
              <SelectItem value="SICK_LEAVE">Licencia Médica</SelectItem>
              <SelectItem value="VACATION">Vacaciones</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
