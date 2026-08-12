import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateTrackingNumber } from "@/lib/utils";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { trackingNumber: { contains: search } },
      { recipientName: { contains: search } },
      { recipientCity: { contains: search } },
    ];
  }

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { documents: true },
    }),
    prisma.shipment.count({ where }),
  ]);

  return NextResponse.json({
    shipments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const userId = (session.user as any).id;

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: generateTrackingNumber(),
        status: "pending",
        senderName: body.senderName,
        senderAddress: body.senderAddress,
        senderCity: body.senderCity,
        senderState: body.senderState,
        senderZip: body.senderZip,
        senderPhone: body.senderPhone,
        senderEmail: body.senderEmail,
        recipientName: body.recipientName,
        recipientAddress: body.recipientAddress,
        recipientCity: body.recipientCity,
        recipientState: body.recipientState,
        recipientZip: body.recipientZip,
        recipientPhone: body.recipientPhone,
        recipientEmail: body.recipientEmail,
        weight: parseFloat(body.weight),
        length: parseFloat(body.length),
        width: parseFloat(body.width),
        height: parseFloat(body.height),
        description: body.description,
        declaredValue: parseFloat(body.declaredValue),
        serviceType: body.serviceType,
        shippingDate: new Date(body.shippingDate),
        estimatedArrival: new Date(body.estimatedArrival),
        userId,
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Error al crear el embarque" },
      { status: 500 }
    );
  }
}
