"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children, className, ...props }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { FormField };
