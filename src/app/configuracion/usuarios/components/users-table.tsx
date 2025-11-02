"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/api/auth";
import { UserRow } from "./user-row";

interface UsersTableProps {
  users: User[];
  onAssignRoles: (user: User) => void;
}

export function UsersTable({ users, onAssignRoles }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Último acceso</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} onAssignRoles={onAssignRoles} />
        ))}
      </TableBody>
    </Table>
  );
}
