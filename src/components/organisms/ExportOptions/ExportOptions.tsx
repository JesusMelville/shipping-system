"use client";

import { useState } from "react";
import { Button, Select } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { Download, FileSpreadsheet } from "lucide-react";

interface ExportOptionsProps {
  onExport: (type: "full" | "summary", filters: ExportFilters) => Promise<void>;
  isLoading?: boolean;
}

interface ExportFilters {
  status: string;
  serviceType: string;
  dateFrom: string;
  dateTo: string;
}

export function ExportOptions({ onExport, isLoading }: ExportOptionsProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    status: "",
    serviceType: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleExport = async (type: "full" | "summary") => {
    await onExport(type, filters);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Reporte Completo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Incluye toda la información de los embarques: remitente, destinatario, 
            detalles del paquete, servicio, fechas y documentos adjuntos.
          </p>
          <Button
            onClick={() => handleExport("full")}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              "Generando..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar Reporte Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Reporte Resumido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vista resumida con tracking, destinatario, servicio, 
            valor declarado y fechas principales.
          </p>
          <Button
            onClick={() => handleExport("summary")}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              "Generando..."
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar Reporte Resumido
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Filtros de Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Estado">
              <Select
                id="exportStatus"
                options={[
                  { value: "", label: "Todos" },
                  { value: "pending", label: "Pendientes" },
                  { value: "in_transit", label: "En Tránsito" },
                  { value: "delivered", label: "Entregados" },
                  { value: "cancelled", label: "Cancelados" },
                ]}
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              />
            </FormField>
            <FormField label="Servicio">
              <Select
                id="exportService"
                options={[
                  { value: "", label: "Todos" },
                  { value: "express", label: "Express" },
                  { value: "standard", label: "Estándar" },
                  { value: "economy", label: "Económico" },
                ]}
                value={filters.serviceType}
                onChange={(e) =>
                  setFilters({ ...filters, serviceType: e.target.value })
                }
              />
            </FormField>
            <FormField label="Fecha desde">
              <input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </FormField>
            <FormField label="Fecha hasta">
              <input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
