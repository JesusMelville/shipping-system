"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardTemplate } from "@/components/templates";
import { DashboardStats } from "@/components/organisms";
import { ShipmentCard } from "@/components/molecules";
import { useRouter } from "next/navigation";
import { Package, Plus, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms";

interface Stats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  totalValue: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  recipientName: string;
  recipientCity: string;
  serviceType: string;
  declaredValue: number;
  shippingDate: string;
  weight: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    totalValue: 0,
  });
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/shipments?limit=5");
        if (res.ok) {
          const data = await res.json();
          setRecentShipments(data.shipments);

          const allRes = await fetch("/api/shipments?limit=1000");
          if (allRes.ok) {
            const allData = await allRes.json();
            const shipments = allData.shipments;
            setStats({
              total: shipments.length,
              pending: shipments.filter((s: Shipment) => s.status === "pending").length,
              inTransit: shipments.filter((s: Shipment) => s.status === "in_transit").length,
              delivered: shipments.filter((s: Shipment) => s.status === "delivered").length,
              totalValue: shipments.reduce((acc: number, s: Shipment) => acc + s.declaredValue, 0),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenido, {(session?.user as any)?.name || "Usuario"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/shipments/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Embarque
              </Button>
            </Link>
            <Link href="/dashboard/export">
              <Button variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando datos...
          </div>
        ) : (
          <>
            <DashboardStats stats={stats} />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Embarques Recientes</h2>
                <Link
                  href="/dashboard/shipments"
                  className="text-sm text-primary hover:underline"
                >
                  Ver todos
                </Link>
              </div>
              {recentShipments.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-white">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No hay embarques aún
                  </p>
                  <Link href="/dashboard/shipments/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear primer embarque
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentShipments.map((shipment) => (
                    <ShipmentCard
                      key={shipment.id}
                      shipment={shipment}
                      onClick={() =>
                        router.push(`/dashboard/shipments/${shipment.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardTemplate>
  );
}
