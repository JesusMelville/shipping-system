"use client";

import { Input } from "@/components/atoms";
import { FormField } from "../FormField/FormField";

interface AddressFormProps {
  prefix: "sender" | "recipient";
  errors?: Record<string, string>;
}

export function AddressForm({ prefix, errors }: AddressFormProps) {
  const label = prefix === "sender" ? "Remitente" : "Destinatario";

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
        {label}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nombre completo" required error={errors?.[`${prefix}Name`]}>
          <Input
            id={`${prefix}Name`}
            name={`${prefix}Name`}
            placeholder={`Nombre del ${label.toLowerCase()}`}
          />
        </FormField>
        <FormField label="Email" required error={errors?.[`${prefix}Email`]}>
          <Input
            id={`${prefix}Email`}
            name={`${prefix}Email`}
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </FormField>
        <FormField label="Dirección" required error={errors?.[`${prefix}Address`]} className="md:col-span-2">
          <Input
            id={`${prefix}Address`}
            name={`${prefix}Address`}
            placeholder="Calle, número, colonia"
          />
        </FormField>
        <FormField label="Ciudad" required error={errors?.[`${prefix}City`]}>
          <Input
            id={`${prefix}City`}
            name={`${prefix}City`}
            placeholder="Ciudad"
          />
        </FormField>
        <FormField label="Estado" required error={errors?.[`${prefix}State`]}>
          <Input
            id={`${prefix}State`}
            name={`${prefix}State`}
            placeholder="Estado"
          />
        </FormField>
        <FormField label="Código Postal" required error={errors?.[`${prefix}Zip`]}>
          <Input
            id={`${prefix}Zip`}
            name={`${prefix}Zip`}
            placeholder="XXXXX"
          />
        </FormField>
        <FormField label="Teléfono" required error={errors?.[`${prefix}Phone`]}>
          <Input
            id={`${prefix}Phone`}
            name={`${prefix}Phone`}
            placeholder="10 dígitos"
          />
        </FormField>
      </div>
    </div>
  );
}
