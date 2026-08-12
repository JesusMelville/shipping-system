"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardTemplate } from "@/components/templates";
import { ShipmentForm } from "@/components/organisms";
import type { ShipmentInput } from "@/lib/validations";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms";

export default function NewShipmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ShipmentInput, files: File[]) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error al crear el embarque");
      }

      const shipment = await res.json();

      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("shipmentId", shipment.id);

          await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
        }
      }

      router.push("/dashboard/shipments");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear el embarque");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/shipments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nuevo Embarque</h1>
            <p className="text-muted-foreground">
              Completa la información para crear un nuevo envío
            </p>
          </div>
        </div>

        <ShipmentForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </DashboardTemplate>
  );
}
