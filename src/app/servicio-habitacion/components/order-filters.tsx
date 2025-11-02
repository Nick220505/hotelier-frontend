"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function OrderFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Buscar por habitación, huésped..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">Pendientes</SelectItem>
          <SelectItem value="preparing">Preparando</SelectItem>
          <SelectItem value="ready">Listas</SelectItem>
          <SelectItem value="delivered">Entregadas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
