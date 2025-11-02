"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Facturación page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            Error en Facturación
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Algo salió mal al cargar la información de facturación.
          </p>
          <p className="text-sm text-muted-foreground">
            {error.message || "Error desconocido"}
          </p>
          <Button onClick={reset} className="w-full">
            Intentar de nuevo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
