'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  User, 
  Clock,
  Smartphone,
} from 'lucide-react';
import { type AuditLog, AuditAction, AuditResource } from '@/lib/api/audit';

interface AuditLogsTableProps {
  logs: AuditLog[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function AuditLogsTable({
  logs,
  total,
  loading,
  currentPage,
  pageSize,
  onPageChange,
}: AuditLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, total);

  const getActionBadgeColor = (action: AuditAction): string => {
    switch (action) {
      case AuditAction.CREATE:
        return 'bg-green-100 text-green-800';
      case AuditAction.READ:
        return 'bg-blue-100 text-blue-800';
      case AuditAction.UPDATE:
        return 'bg-yellow-100 text-yellow-800';
      case AuditAction.DELETE:
        return 'bg-red-100 text-red-800';
      case AuditAction.LOGIN:
        return 'bg-purple-100 text-purple-800';
      case AuditAction.LOGOUT:
        return 'bg-gray-100 text-gray-800';
      case AuditAction.LOGIN_FAILED:
        return 'bg-red-100 text-red-800';
      case AuditAction.CHECK_IN:
      case AuditAction.CHECK_OUT:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceBadgeColor = (resource: AuditResource): string => {
    switch (resource) {
      case AuditResource.USER:
      case AuditResource.ROLE:
      case AuditResource.PERMISSION:
        return 'bg-purple-100 text-purple-800';
      case AuditResource.RESERVATION:
      case AuditResource.ROOM:
      case AuditResource.GUEST:
        return 'bg-blue-100 text-blue-800';
      case AuditResource.INVOICE:
      case AuditResource.PAYMENT:
      case AuditResource.BILLING:
        return 'bg-green-100 text-green-800';
      case AuditResource.EMPLOYEE:
      case AuditResource.SHIFT:
      case AuditResource.ATTENDANCE:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatActionText = (action: AuditAction): string => {
    const actionMap: Record<AuditAction, string> = {
      [AuditAction.CREATE]: 'Crear',
      [AuditAction.READ]: 'Leer',
      [AuditAction.UPDATE]: 'Actualizar',
      [AuditAction.DELETE]: 'Eliminar',
      [AuditAction.LOGIN]: 'Iniciar Sesión',
      [AuditAction.LOGOUT]: 'Cerrar Sesión',
      [AuditAction.LOGIN_FAILED]: 'Login Fallido',
      [AuditAction.CHECK_IN]: 'Check In',
      [AuditAction.CHECK_OUT]: 'Check Out',
      [AuditAction.PAYMENT_PROCESSED]: 'Pago Procesado',
      [AuditAction.INVOICE_GENERATED]: 'Factura Generada',
      [AuditAction.STATUS_CHANGE]: 'Cambio de Estado',
      [AuditAction.SYSTEM_CONFIG_CHANGE]: 'Config. Sistema',
      [AuditAction.REPORT_GENERATED]: 'Reporte Generado',
      [AuditAction.EXPORT]: 'Exportar',
      [AuditAction.CUSTOM]: 'Personalizado',
      [AuditAction.PASSWORD_CHANGE]: 'Cambio Contraseña',
      [AuditAction.PASSWORD_RESET]: 'Reset Contraseña',
      [AuditAction.CANCEL_RESERVATION]: 'Cancelar Reserva',
      [AuditAction.MODIFY_RESERVATION]: 'Modificar Reserva',
      [AuditAction.REFUND_ISSUED]: 'Reembolso',
      [AuditAction.APPROVAL]: 'Aprobar',
      [AuditAction.REJECTION]: 'Rechazar',
      [AuditAction.PERMISSION_GRANTED]: 'Otorgar Permiso',
      [AuditAction.PERMISSION_REVOKED]: 'Revocar Permiso',
      [AuditAction.ROLE_ASSIGNED]: 'Asignar Rol',
      [AuditAction.ROLE_REMOVED]: 'Remover Rol',
      [AuditAction.FILE_UPLOAD]: 'Subir Archivo',
      [AuditAction.FILE_DOWNLOAD]: 'Descargar Archivo',
      [AuditAction.FILE_DELETE]: 'Eliminar Archivo',
    };
    
    return actionMap[action] || action;
  };

  const formatResourceText = (resource: AuditResource): string => {
    const resourceMap: Record<AuditResource, string> = {
      [AuditResource.USER]: 'Usuario',
      [AuditResource.ROLE]: 'Rol',
      [AuditResource.PERMISSION]: 'Permiso',
      [AuditResource.RESERVATION]: 'Reserva',
      [AuditResource.ROOM]: 'Habitación',
      [AuditResource.GUEST]: 'Huésped',
      [AuditResource.INVOICE]: 'Factura',
      [AuditResource.PAYMENT]: 'Pago',
      [AuditResource.BILLING]: 'Facturación',
      [AuditResource.EMPLOYEE]: 'Empleado',
      [AuditResource.SHIFT]: 'Turno',
      [AuditResource.ATTENDANCE]: 'Asistencia',
      [AuditResource.HOUSEKEEPING]: 'Limpieza',
      [AuditResource.MAINTENANCE]: 'Mantenimiento',
      [AuditResource.RESTAURANT]: 'Restaurante',
      [AuditResource.MENU_ITEM]: 'Menú',
      [AuditResource.ROOM_SERVICE]: 'Serv. Habitación',
      [AuditResource.EVENT]: 'Evento',
      [AuditResource.VENUE]: 'Lugar',
      [AuditResource.RECREATIONAL]: 'Recreación',
      [AuditResource.INVENTORY]: 'Inventario',
      [AuditResource.SUPPLIER]: 'Proveedor',
      [AuditResource.PARKING]: 'Parqueadero',
      [AuditResource.GUEST_REQUEST]: 'Sol. Huésped',
      [AuditResource.EMPLOYEE_REQUEST]: 'Sol. Empleado',
      [AuditResource.REPORT]: 'Reporte',
      [AuditResource.ANALYTICS]: 'Analíticas',
      [AuditResource.CONFIGURATION]: 'Configuración',
      [AuditResource.NOTIFICATION]: 'Notificación',
      [AuditResource.AUDIT_LOG]: 'Log Auditoría',
      [AuditResource.SYSTEM]: 'Sistema',
      [AuditResource.OTHER]: 'Otro',
    };
    
    return resourceMap[resource] || resource;
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría</CardTitle>
          <CardDescription>Cargando registros...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registros de Auditoría</CardTitle>
          <CardDescription>
            Mostrando {startIndex} - {endIndex} de {total} registros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No se encontraron registros de auditoría
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{log.user.name}</p>
                            <p className="text-sm text-muted-foreground">{log.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>
                          {formatActionText(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getResourceBadgeColor(log.resource)}>
                            {formatResourceText(log.resource)}
                          </Badge>
                          {log.resourceId && (
                            <span className="text-sm text-muted-foreground">
                              #{log.resourceId}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={log.description}>
                          {log.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Detalles del Registro de Auditoría</DialogTitle>
                              <DialogDescription>
                                Información completa del registro #{log.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <ScrollArea className="max-h-[60vh]">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Usuario</h4>
                                      <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <div>
                                          <p>{selectedLog.user.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedLog.user.email}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Fecha y Hora</h4>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {format(new Date(selectedLog.createdAt), "PPpp", { locale: es })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Acción</h4>
                                      <Badge className={getActionBadgeColor(selectedLog.action)}>
                                        {formatActionText(selectedLog.action)}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Recurso</h4>
                                      <div className="flex items-center gap-2">
                                        <Badge className={getResourceBadgeColor(selectedLog.resource)}>
                                          {formatResourceText(selectedLog.resource)}
                                        </Badge>
                                        {selectedLog.resourceId && (
                                          <span className="text-sm font-mono">
                                            #{selectedLog.resourceId}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Descripción</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded">
                                      {selectedLog.description}
                                    </p>
                                  </div>

                                  {(selectedLog.userAgent) && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Información de Conexión</h4>
                                      <div className="space-y-2">
                                        {selectedLog.userAgent && (
                                          <div className="flex items-center gap-2">
                                            <Smartphone className="h-4 w-4" />
                                            <span>Agente:</span>
                                            <span className="font-mono break-all">{selectedLog.userAgent}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Detalles Adicionales</h4>
                                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                                        {JSON.stringify(selectedLog.details, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage + 1} de {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
