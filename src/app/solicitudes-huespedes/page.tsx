import { guestRequestsApi } from "@/lib/api/guest-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import GuestRequestsInterface from "./components/guest-requests-interface";

export const dynamic = "force-dynamic";

export default async function GuestRequestsPage() {
  const requests = await guestRequestsApi.getAll();

  const statusCounts = {
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    IN_PROGRESS: requests.filter((r) => r.status === "IN_PROGRESS").length,
    COMPLETED: requests.filter((r) => r.status === "COMPLETED").length,
    CANCELLED: requests.filter((r) => r.status === "CANCELLED").length,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Solicitudes de Huéspedes</h1>
        <p className="text-muted-foreground">
          Gestiona las solicitudes y necesidades de los huéspedes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.PENDING}</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.IN_PROGRESS}</div>
            <p className="text-xs text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.COMPLETED}
            </div>
            <p className="text-xs text-muted-foreground">
              Resueltas exitosamente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.CANCELLED}
            </div>
            <p className="text-xs text-muted-foreground">
              Solicitudes canceladas
            </p>
          </CardContent>
        </Card>
      </div>

      <GuestRequestsInterface initialRequests={requests} />
    </div>
  );
}
