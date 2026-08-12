"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipmentSchema, type ShipmentInput } from "@/lib/validations";
import { Button } from "@/components/atoms";
import { AddressForm } from "@/components/molecules/AddressForm/AddressForm";
import { PackageDetails } from "@/components/molecules/PackageDetails/PackageDetails";
import { Select } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { generateTrackingNumber } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { FileUploader } from "@/components/molecules";

interface ShipmentFormProps {
  onSubmit: (data: ShipmentInput, files: File[]) => Promise<void>;
  initialData?: Partial<ShipmentInput>;
  isLoading?: boolean;
}

export function ShipmentForm({ onSubmit, initialData, isLoading }: ShipmentFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    setTrackingNumber(generateTrackingNumber());
    if (!initialData?.shippingDate) {
      const today = new Date().toISOString().split("T")[0];
      const arrival = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
      document.querySelectorAll('input[name="shippingDate"]').forEach((el) => {
        (el as HTMLInputElement).value = today;
      });
      document.querySelectorAll('input[name="estimatedArrival"]').forEach((el) => {
        (el as HTMLInputElement).value = arrival;
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShipmentInput>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      serviceType: "standard",
      shippingDate: "",
      estimatedArrival: "",
      ...initialData,
    },
  });

  const onFormSubmit = async (data: ShipmentInput) => {
    await onSubmit(data, files);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Nuevo Embarque</h2>
          <p className="text-sm text-muted-foreground">
            Tracking: <span className="font-mono font-medium">{trackingNumber || "---"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              "Crear Embarque"
            )}
          </Button>
        </div>
      </div>

      {/* Remitente */}
      <div className="rounded-lg border p-6 space-y-4">
        <AddressForm prefix="sender" errors={errors as any} />
      </div>

      {/* Destinatario */}
      <div className="rounded-lg border p-6 space-y-4">
        <AddressForm prefix="recipient" errors={errors as any} />
      </div>

      {/* Paquete */}
      <div className="rounded-lg border p-6 space-y-4">
        <PackageDetails errors={errors as any} />
      </div>

      {/* Servicio */}
      <div className="rounded-lg border p-6 space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Servicio de Envío
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Tipo de servicio" required error={errors?.serviceType?.message}>
            <Select
              id="serviceType"
              options={[
                { value: "express", label: "Express (1-2 días)" },
                { value: "standard", label: "Estándar (3-5 días)" },
                { value: "economy", label: "Económico (7-10 días)" },
              ]}
              {...register("serviceType")}
            />
          </FormField>
          <FormField label="Fecha de envío" required error={errors?.shippingDate?.message}>
            <input
              type="date"
              id="shippingDate"
              {...register("shippingDate")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </FormField>
          <FormField label="Fecha estimada de llegada" required error={errors?.estimatedArrival?.message}>
            <input
              type="date"
              id="estimatedArrival"
              {...register("estimatedArrival")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </FormField>
        </div>
      </div>

      {/* Documentos */}
      <div className="rounded-lg border p-6 space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Documentos Adjuntos
        </h4>
        <FileUploader files={files} onFilesChange={setFiles} />
      </div>
    </form>
  );
}
