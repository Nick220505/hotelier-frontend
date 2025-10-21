'use client';

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Lock } from "lucide-react";
import { UsersManagement } from "./components/users-management";
import { RolesManagement } from "./components/roles-management";
import { PermissionsManagement } from "./components/permissions-management";
import { authApi } from "@/lib/api/auth";
import { rolesApi } from "@/lib/api/roles";
import type { User } from "@/lib/api/auth";
import type { SystemRole } from "@/lib/api/roles";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          authApi.getAllUsers().catch(() => []),
          rolesApi.getAll().catch(() => [])
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching users and roles data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios, Roles y Permisos</h1>
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  return (
    <RoleGuard permissions={["users:manage_roles"]}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios, Roles y Permisos</h1>
            <p className="text-muted-foreground">
              Administra usuarios, roles del sistema y permisos
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Permisos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersManagement initialUsers={users} initialRoles={roles} />
          </TabsContent>
          
          <TabsContent value="roles">
            <RolesManagement />
          </TabsContent>
          
          <TabsContent value="permissions">
            <PermissionsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}

