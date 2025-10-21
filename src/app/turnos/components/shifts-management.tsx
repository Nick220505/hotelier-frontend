"use client";

import { useState } from "react";
import { toast } from "sonner";
import { shiftsApi, type Shift } from "@/lib/api/shifts";
import { type Employee } from "@/lib/api/employees";
import { ShiftFilters } from "./shift-filters";
import { CreateShiftDialog } from "./create-shift-dialog";
import { ShiftsList } from "./shifts-list";

interface ShiftsManagementProps {
  initialShifts: Shift[];
  employees: Employee[];
  shiftCounts: {
    total: number;
    today: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

export function ShiftsManagement({ initialShifts, employees }: ShiftsManagementProps) {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleShiftCreated = (newShift: Shift) => {
    setShifts(prev => [newShift, ...prev]);
  };

  const handleUpdateShiftStatus = async (shiftId: number, status: Shift['status']) => {
    try {
      const updatedShift = await shiftsApi.update(shiftId, { status });
      setShifts(prev => prev.map(shift => 
        shift.id === shiftId ? updatedShift : shift
      ));
      toast.success("Estado del turno actualizado");
    } catch (error) {
      console.error("Error updating shift status:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  const handleDeleteShift = async (shiftId: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este turno?")) return;

    try {
      await shiftsApi.delete(shiftId);
      setShifts(prev => prev.filter(shift => shift.id !== shiftId));
      toast.success("Turno eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting shift:", error);    
      toast.error("Error al eliminar el turno");
    }
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = 
      shift.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || shift.position === departmentFilter;
    const matchesDate = shift.date === selectedDate;
    
    return matchesSearch && matchesDepartment && matchesDate;
  });

  return (
    <>
      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <ShiftFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
        />
        
        <CreateShiftDialog 
          employees={employees}
          onShiftCreated={handleShiftCreated}
        />
      </div>

      {/* Shifts List */}
      <ShiftsList
        shifts={filteredShifts}
        onUpdateShiftStatus={handleUpdateShiftStatus}
        onDeleteShift={handleDeleteShift}
      />
    </>
  );
}
