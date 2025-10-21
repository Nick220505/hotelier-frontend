import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { RecreationalFacility } from "@/lib/api/recreational";

interface BookingsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  facilityFilter: string;
  onFacilityChange: (value: string) => void;
  facilities: RecreationalFacility[];
}

export function BookingsFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  facilityFilter,
  onFacilityChange,
  facilities,
}: BookingsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por huésped, email o habitación..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="PENDING">Pendiente</SelectItem>
          <SelectItem value="CONFIRMED">Confirmada</SelectItem>
          <SelectItem value="CHECKED_IN">En Curso</SelectItem>
          <SelectItem value="COMPLETED">Completada</SelectItem>
          <SelectItem value="CANCELLED">Cancelada</SelectItem>
          <SelectItem value="NO_SHOW">No Show</SelectItem>
        </SelectContent>
      </Select>

      <Select value={facilityFilter} onValueChange={onFacilityChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Instalación" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las instalaciones</SelectItem>
          {facilities.map(facility => (
            <SelectItem key={facility.id} value={facility.id.toString()}>
              {facility.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
