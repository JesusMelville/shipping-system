"use client";

import { useState } from "react";
import { DashboardTemplate } from "@/components/templates";
import { ExportOptions } from "@/components/organisms";
import { FileSpreadsheet } from "lucide-react";

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (
    type: "full" | "summary",
    filters: { status: string; serviceType: string; dateFrom: string; dateTo: string }
  ) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ type });
      if (filters.status) params.set("status", filters.status);
      if (filters.serviceType) params.set("serviceType", filters.serviceType);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const res = await fetch(`/api/export?${params}`);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reporte-embarques-${type}-${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Error al generar el reporte");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el reporte");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Exportar a Excel
          </h1>
          <p className="text-muted-foreground">
            Genera reportes detallados o resumidos de tus embarques
          </p>
        </div>

        <ExportOptions onExport={handleExport} isLoading={isLoading} />
      </div>
    </DashboardTemplate>
  );
}
