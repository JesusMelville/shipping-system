"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardTemplate } from "@/components/templates";
import { DocumentList } from "@/components/organisms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms";
import { Badge, Button } from "@/components/atoms";
import { StatusBadge, FileUploader } from "@/components/molecules";
import {
  formatDate,
  formatCurrency,
  getServiceLabel,
  getStatusLabel,
} from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Calendar,
  Weight,
  Ruler,
  DollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  senderName: string;
  senderAddress: string;
  senderCity: string;
  senderState: string;
  senderZip: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientZip: string;
  recipientPhone: string;
  recipientEmail: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
  declaredValue: number;
  serviceType: string;
  shippingDate: string;
  estimatedArrival: string;
  documents: Document[];
  createdAt: string;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchShipment() {
      try {
        const res = await fetch(`/api/shipments/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setShipment(data);
        } else {
          router.push("/dashboard/shipments");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchShipment();
  }, [params.id, router]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/shipments/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setShipment(updated);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUploadFiles = async () => {
    if (files.length === 0 || !shipment) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("shipmentId", shipment.id);

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }

      const res = await fetch(`/api/shipments/${shipment.id}`);
      if (res.ok) {
        const updated = await res.json();
        setShipment(updated);
        setFiles([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("¿Eliminar este documento?")) return;

    try {
      const res = await fetch(`/api/upload?id=${docId}`, { method: "DELETE" });
      if (res.ok && shipment) {
        const updatedRes = await fetch(`/api/shipments/${shipment.id}`);
        if (updatedRes.ok) {
          const updated = await updatedRes.json();
          setShipment(updated);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <DashboardTemplate>
        <div className="text-center py-12 text-muted-foreground">
          Cargando embarque...
        </div>
      </DashboardTemplate>
    );
  }

  if (!shipment) return null;

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/shipments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{shipment.trackingNumber}</h1>
                <StatusBadge status={shipment.status} />
              </div>
              <p className="text-muted-foreground">
                Creado el {formatDate(shipment.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {shipment.status === "pending" && (
              <Button onClick={() => handleStatusChange("in_transit")}>
                <Truck className="mr-2 h-4 w-4" />
                Marcar En Tránsito
              </Button>
            )}
            {shipment.status === "in_transit" && (
              <Button onClick={() => handleStatusChange("delivered")}>
                <Package className="mr-2 h-4 w-4" />
                Marcar Entregado
              </Button>
            )}
            {(shipment.status === "pending" || shipment.status === "in_transit") && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("cancelled")}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Remitente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Remitente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Nombre:</strong> {shipment.senderName}</p>
              <p><strong>Dirección:</strong> {shipment.senderAddress}</p>
              <p>
                <strong>Ciudad:</strong> {shipment.senderCity},{" "}
                {shipment.senderState} {shipment.senderZip}
              </p>
              <p><strong>Teléfono:</strong> {shipment.senderPhone}</p>
              <p><strong>Email:</strong> {shipment.senderEmail}</p>
            </CardContent>
          </Card>

          {/* Destinatario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Destinatario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Nombre:</strong> {shipment.recipientName}</p>
              <p><strong>Dirección:</strong> {shipment.recipientAddress}</p>
              <p>
                <strong>Ciudad:</strong> {shipment.recipientCity},{" "}
                {shipment.recipientState} {shipment.recipientZip}
              </p>
              <p><strong>Teléfono:</strong> {shipment.recipientPhone}</p>
              <p><strong>Email:</strong> {shipment.recipientEmail}</p>
            </CardContent>
          </Card>

          {/* Paquete */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Detalles del Paquete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Descripción:</strong> {shipment.description}</p>
              <div className="flex gap-4">
                <p>
                  <strong>Peso:</strong> {shipment.weight} kg
                </p>
                <p>
                  <strong>Dimensiones:</strong> {shipment.length}×{shipment.width}×
                  {shipment.height} cm
                </p>
              </div>
              <p>
                <strong>Valor declarado:</strong>{" "}
                {formatCurrency(shipment.declaredValue)}
              </p>
            </CardContent>
          </Card>

          {/* Servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="h-4 w-4" />
                Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Tipo:</strong> {getServiceLabel(shipment.serviceType)}
              </p>
              <p>
                <strong>Fecha de envío:</strong>{" "}
                {formatDate(shipment.shippingDate)}
              </p>
              <p>
                <strong>Fecha estimada:</strong>{" "}
                {formatDate(shipment.estimatedArrival)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Documentos ({shipment.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DocumentList
              documents={shipment.documents}
              onDelete={handleDeleteDocument}
            />

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Subir nuevos documentos</h4>
              <FileUploader files={files} onFilesChange={setFiles} />
              {files.length > 0 && (
                <Button
                  onClick={handleUploadFiles}
                  disabled={isUploading}
                  className="mt-3"
                >
                  {isUploading ? "Subiendo..." : "Subir Documentos"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardTemplate>
  );
}
