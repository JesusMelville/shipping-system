"use client";

import { Card, CardContent } from "@/components/atoms";
import { Badge } from "@/components/atoms";
import { getStatusLabel, getStatusColor, formatCurrency, formatDate, getServiceLabel } from "@/lib/utils";
import { Package, MapPin, Truck, Calendar } from "lucide-react";

interface ShipmentCardProps {
  shipment: {
    id: string;
    trackingNumber: string;
    status: string;
    recipientName: string;
    recipientCity: string;
    serviceType: string;
    declaredValue: number;
    shippingDate: string;
    weight: number;
  };
  onClick?: () => void;
}

export function ShipmentCard({ shipment, onClick }: ShipmentCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm font-medium">
              {shipment.trackingNumber}
            </span>
          </div>
          <Badge className={getStatusColor(shipment.status)}>
            {getStatusLabel(shipment.status)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{shipment.recipientName} - {shipment.recipientCity}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>{getServiceLabel(shipment.serviceType)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(shipment.shippingDate)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{shipment.weight} kg</span>
          <span className="font-medium">{formatCurrency(shipment.declaredValue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
