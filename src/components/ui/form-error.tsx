"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

export function ValidationMessage({ 
  field, 
  errors 
}: { 
  field: string; 
  errors: Record<string, string[]> | undefined;
}) {
  const fieldErrors = errors?.[field];
  if (!fieldErrors?.length) return null;

  return <FormError message={fieldErrors[0]} className="mt-1" />;
}
