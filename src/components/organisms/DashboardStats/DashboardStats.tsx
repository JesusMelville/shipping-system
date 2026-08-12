"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms";
import { Package, Truck, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  totalValue: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Embarques",
      value: stats.total,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "En Tránsito",
      value: stats.inTransit,
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Entregados",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-2 lg:col-span-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total de Envíos</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(stats.totalValue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
