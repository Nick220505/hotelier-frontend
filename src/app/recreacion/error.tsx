"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecreacionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to monitoring service
    console.error("Recreational page error:", error);
  }, [error]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Instalaciones Recreativas</h2>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">Error al Cargar</CardTitle>
            <CardDescription>
              No pudimos cargar la información de las instalaciones recreativas. 
              Por favor, intenta nuevamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>Detalles técnicos:</strong>
              <br />
              {error.message || "Error desconocido"}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={reset} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Recargar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
