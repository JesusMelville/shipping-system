import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const shipmentId = formData.get("shipmentId") as string;

    if (!file || !shipmentId) {
      return NextResponse.json(
        { error: "Archivo y shipmentId son requeridos" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileUrl: fileName,
        fileSize: file.size,
        fileType: file.type,
        shipmentId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("id");

  if (!documentId) {
    return NextResponse.json(
      { error: "Document ID requerido" },
      { status: 400 }
    );
  }

  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (doc) {
      const filePath = path.join(process.cwd(), "public", "uploads", doc.fileUrl);
      try {
        const { unlink } = await import("fs/promises");
        await unlink(filePath);
      } catch {}
    }

    await prisma.document.delete({ where: { id: documentId } });
    return NextResponse.json({ message: "Documento eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el documento" },
      { status: 500 }
    );
  }
}
