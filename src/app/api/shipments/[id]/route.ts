import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: { documents: true },
  });

  if (!shipment) {
    return NextResponse.json(
      { error: "Embarque no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(shipment);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        status: body.status,
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
        weight: body.weight ? parseFloat(body.weight) : undefined,
        length: body.length ? parseFloat(body.length) : undefined,
        width: body.width ? parseFloat(body.width) : undefined,
        height: body.height ? parseFloat(body.height) : undefined,
        description: body.description,
        declaredValue: body.declaredValue ? parseFloat(body.declaredValue) : undefined,
        serviceType: body.serviceType,
        shippingDate: body.shippingDate ? new Date(body.shippingDate) : undefined,
        estimatedArrival: body.estimatedArrival ? new Date(body.estimatedArrival) : undefined,
      },
    });

    return NextResponse.json(shipment);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el embarque" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.document.deleteMany({ where: { shipmentId: id } });
    await prisma.shipment.delete({ where: { id } });
    return NextResponse.json({ message: "Embarque eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el embarque" },
      { status: 500 }
    );
  }
}
