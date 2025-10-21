"use client";

import { Input } from "@/components/ui/input";

interface ParkingSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ParkingSearch({ searchTerm, onSearchChange }: ParkingSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder="Buscar por número, zona, placa o propietario..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
