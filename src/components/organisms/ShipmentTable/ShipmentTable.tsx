"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/atoms";
import { Button, Badge, Input } from "@/components/atoms";
import { StatusBadge } from "@/components/molecules";
import { formatDate, formatCurrency, getStatusLabel } from "@/lib/utils";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
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

interface ShipmentTableProps {
  shipments: Shipment[];
  onDelete?: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ShipmentTable({
  shipments,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ShipmentTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Tracking</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Destinatario</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Fecha Envío</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron embarques
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">
                      {shipment.trackingNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={shipment.status} />
                  </TableCell>
                  <TableCell>{shipment.recipientName}</TableCell>
                  <TableCell>{shipment.recipientCity}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getStatusLabel(shipment.serviceType)}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(shipment.declaredValue)}</TableCell>
                  <TableCell>{formatDate(shipment.shippingDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/shipments/${shipment.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(shipment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
