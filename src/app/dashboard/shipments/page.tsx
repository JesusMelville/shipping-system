"use client";

import { useEffect, useState } from "react";
import { DashboardTemplate } from "@/components/templates";
import { ShipmentTable } from "@/components/organisms";
import { Button, Input } from "@/components/atoms";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  recipientName: string;
  recipientCity: string;
  serviceType: string;
  declaredValue: number;
  shippingDate: string;
  createdAt: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/shipments?${params}`);
      if (res.ok) {
        const data = await res.json();
        setShipments(data.shipments);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [currentPage, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este embarque?")) return;

    try {
      const res = await fetch(`/api/shipments/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchShipments();
      }
    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Embarques</h1>
            <p className="text-muted-foreground">
              Gestiona todos tus envíos de paquetería
            </p>
          </div>
          <Link href="/dashboard/shipments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Embarque
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tracking, destinatario..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_transit">En Tránsito</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando embarques...
          </div>
        ) : (
          <ShipmentTable
            shipments={shipments}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardTemplate>
  );
}
