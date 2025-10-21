import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  positionTranslations,
  departmentTranslations,
} from "@/lib/translations/staff";

interface Employee {
  id: string;
  name: string;
  lastName: string;
  document: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  shift: string;
  status: string;
  supervisor: string;
}

interface EmployeesTableProps {
  employees: Employee[];
}

const getEmployeeStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "activo":
    case "active":
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
    case "vacaciones":
    case "on_leave":
      return <Badge className="bg-blue-100 text-blue-800">Vacaciones</Badge>;
    case "incapacidad":
    case "sick_leave":
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Incapacidad</Badge>
      );
    case "inactivo":
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getDepartmentBadge = (department: string) => {
  const translatedDept =
    departmentTranslations[
      department.toUpperCase() as keyof typeof departmentTranslations
    ] || department;

  const colorMap: Record<string, string> = {
    Limpieza: "bg-blue-100 text-blue-800",
    Recepción: "bg-green-100 text-green-800",
    Mantenimiento: "bg-orange-100 text-orange-800",
    Seguridad: "bg-red-100 text-red-800",
    Restaurante: "bg-purple-100 text-purple-800",
    Cocina: "bg-yellow-100 text-yellow-800",
    Bar: "bg-indigo-100 text-indigo-800",
    Gerencia: "bg-gray-100 text-gray-800",
  };

  const colorClass = colorMap[translatedDept] || "bg-gray-100 text-gray-800";

  return <Badge className={colorClass}>{translatedDept}</Badge>;
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Salario</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No hay empleados registrados
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>
                  {employee.name} {employee.lastName}
                </TableCell>
                <TableCell>{employee.document}</TableCell>
                <TableCell>
                  {positionTranslations[
                    employee.position.toUpperCase() as keyof typeof positionTranslations
                  ] || employee.position}
                </TableCell>
                <TableCell>
                  {getDepartmentBadge(employee.department)}
                </TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  ${employee.salary.toLocaleString()}
                </TableCell>
                <TableCell>
                  {getEmployeeStatusBadge(employee.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
