import ExcelJS from "exceljs";

interface ShipmentDoc {
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
  shippingDate: Date;
  estimatedArrival: Date;
  createdAt: Date;
  documents: { fileName: string; fileType: string }[];
}

interface ShipmentSummary {
  trackingNumber: string;
  status: string;
  recipientName: string;
  recipientCity: string;
  serviceType: string;
  declaredValue: number;
  shippingDate: Date;
  estimatedArrival: Date;
  createdAt: Date;
  user: { name: string };
}

export async function generateFullReport(shipments: ShipmentDoc[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Embarques";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Reporte Completo", {
    properties: { tabColor: { argb: "2563EB" } },
  });

  sheet.columns = [
    { header: "No. Tracking", key: "trackingNumber", width: 22 },
    { header: "Estado", key: "status", width: 14 },
    { header: "Remitente", key: "senderName", width: 22 },
    { header: "Dir. Remitente", key: "senderAddress", width: 30 },
    { header: "Ciudad Remitente", key: "senderCity", width: 18 },
    { header: "Estado Remitente", key: "senderState", width: 16 },
    { header: "CP Remitente", key: "senderZip", width: 12 },
    { header: "Tel. Remitente", key: "senderPhone", width: 16 },
    { header: "Email Remitente", key: "senderEmail", width: 25 },
    { header: "Destinatario", key: "recipientName", width: 22 },
    { header: "Dir. Destinatario", key: "recipientAddress", width: 30 },
    { header: "Ciudad Destinatario", key: "recipientCity", width: 18 },
    { header: "Estado Destinatario", key: "recipientState", width: 16 },
    { header: "CP Destinatario", key: "recipientZip", width: 12 },
    { header: "Tel. Destinatario", key: "recipientPhone", width: 16 },
    { header: "Email Destinatario", key: "recipientEmail", width: 25 },
    { header: "Peso (kg)", key: "weight", width: 12 },
    { header: "Largo (cm)", key: "length", width: 12 },
    { header: "Ancho (cm)", key: "width", width: 12 },
    { header: "Alto (cm)", key: "height", width: 12 },
    { header: "Descripción", key: "description", width: 30 },
    { header: "Valor Declarado", key: "declaredValue", width: 16 },
    { header: "Servicio", key: "serviceType", width: 18 },
    { header: "Fecha Envío", key: "shippingDate", width: 16 },
    { header: "Fecha Est. Llegada", key: "estimatedArrival", width: 16 },
    { header: "Documentos", key: "documents", width: 40 },
    { header: "Creado", key: "createdAt", width: 18 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "2563EB" },
  };
  headerRow.alignment = { horizontal: "center" };

  shipments.forEach((s) => {
    sheet.addRow({
      trackingNumber: s.trackingNumber,
      status: getStatusSpanish(s.status),
      senderName: s.senderName,
      senderAddress: s.senderAddress,
      senderCity: s.senderCity,
      senderState: s.senderState,
      senderZip: s.senderZip,
      senderPhone: s.senderPhone,
      senderEmail: s.senderEmail,
      recipientName: s.recipientName,
      recipientAddress: s.recipientAddress,
      recipientCity: s.recipientCity,
      recipientState: s.recipientState,
      recipientZip: s.recipientZip,
      recipientPhone: s.recipientPhone,
      recipientEmail: s.recipientEmail,
      weight: s.weight,
      length: s.length,
      width: s.width,
      height: s.height,
      description: s.description,
      declaredValue: s.declaredValue,
      serviceType: getServiceSpanish(s.serviceType),
      shippingDate: new Date(s.shippingDate).toLocaleDateString("es-MX"),
      estimatedArrival: new Date(s.estimatedArrival).toLocaleDateString("es-MX"),
      documents: s.documents.map((d) => d.fileName).join(", "),
      createdAt: new Date(s.createdAt).toLocaleDateString("es-MX"),
    });
  });

  return workbook;
}

export async function generateSummaryReport(shipments: ShipmentSummary[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Embarques";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Reporte Resumido", {
    properties: { tabColor: { argb: "10B981" } },
  });

  sheet.columns = [
    { header: "No. Tracking", key: "trackingNumber", width: 22 },
    { header: "Estado", key: "status", width: 14 },
    { header: "Destinatario", key: "recipientName", width: 22 },
    { header: "Ciudad Destino", key: "recipientCity", width: 18 },
    { header: "Servicio", key: "serviceType", width: 18 },
    { header: "Valor Declarado", key: "declaredValue", width: 16 },
    { header: "Fecha Envío", key: "shippingDate", width: 16 },
    { header: "Fecha Est. Llegada", key: "estimatedArrival", width: 16 },
    { header: "Creado por", key: "userName", width: 22 },
    { header: "Creado", key: "createdAt", width: 18 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "10B981" },
  };
  headerRow.alignment = { horizontal: "center" };

  shipments.forEach((s) => {
    sheet.addRow({
      trackingNumber: s.trackingNumber,
      status: getStatusSpanish(s.status),
      recipientName: s.recipientName,
      recipientCity: s.recipientCity,
      serviceType: getServiceSpanish(s.serviceType),
      declaredValue: s.declaredValue,
      shippingDate: new Date(s.shippingDate).toLocaleDateString("es-MX"),
      estimatedArrival: new Date(s.estimatedArrival).toLocaleDateString("es-MX"),
      userName: s.user.name,
      createdAt: new Date(s.createdAt).toLocaleDateString("es-MX"),
    });
  });

  return workbook;
}

function getStatusSpanish(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendiente",
    in_transit: "En Tránsito",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };
  return map[status] || status;
}

function getServiceSpanish(service: string): string {
  const map: Record<string, string> = {
    express: "Express (1-2 días)",
    standard: "Estándar (3-5 días)",
    economy: "Económico (7-10 días)",
  };
  return map[service] || service;
}
