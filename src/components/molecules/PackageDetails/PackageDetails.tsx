"use client";

import { Input, Select } from "@/components/atoms";
import { FormField } from "../FormField/FormField";

interface PackageDetailsProps {
  errors?: Record<string, string>;
}

export function PackageDetails({ errors }: PackageDetailsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        Detalles del Paquete
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Peso (kg)" required error={errors?.weight}>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
          />
        </FormField>
        <FormField label="Valor Declarado ($)" required error={errors?.declaredValue}>
          <Input
            id="declaredValue"
            name="declaredValue"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Largo (cm)" required error={errors?.length}>
          <Input
            id="length"
            name="length"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
          />
        </FormField>
        <FormField label="Ancho (cm)" required error={errors?.width}>
          <Input
            id="width"
            name="width"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
          />
        </FormField>
        <FormField label="Alto (cm)" required error={errors?.height}>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
          />
        </FormField>
        <FormField label="Descripción del contenido" required error={errors?.description}>
          <Input
            id="description"
            name="description"
            placeholder="Describe el contenido del paquete"
          />
        </FormField>
      </div>
    </div>
  );
}
