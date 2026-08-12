import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateFullReport, generateSummaryReport } from "@/lib/excel";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "full";
  const status = searchParams.get("status") || "";
  const serviceType = searchParams.get("serviceType") || "";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (serviceType) {
    where.serviceType = serviceType;
  }

  if (dateFrom || dateTo) {
    where.shippingDate = {};
    if (dateFrom) {
      where.shippingDate.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.shippingDate.lte = new Date(dateTo + "T23:59:59");
    }
  }

  try {
    let workbook;

    if (type === "summary") {
      const shipments = await prisma.shipment.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      workbook = await generateSummaryReport(shipments);
    } else {
      const shipments = await prisma.shipment.findMany({
        where,
        include: { documents: true },
        orderBy: { createdAt: "desc" },
      });
      workbook = await generateFullReport(shipments);
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="reporte-embarques-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Error al generar el reporte" },
      { status: 500 }
    );
  }
}
