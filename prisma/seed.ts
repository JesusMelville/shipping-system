import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@demo.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "user@demo.com",
      password: hashedPassword,
      role: "user",
    },
  });

  const shipments = [
    {
      trackingNumber: "SHP-DEMO-001",
      status: "pending",
      senderName: "Empresa ABC S.A. de C.V.",
      senderAddress: "Av. Reforma 123, Col. Centro",
      senderCity: "Ciudad de México",
      senderState: "CDMX",
      senderZip: "06000",
      senderPhone: "5512345678",
      senderEmail: "envios@abc.com",
      recipientName: "Juan Pérez García",
      recipientAddress: "Calle Norte 456, Col. Industrial",
      recipientCity: "Guadalajara",
      recipientState: "Jalisco",
      recipientZip: "44100",
      recipientPhone: "3312345678",
      recipientEmail: "juan.perez@email.com",
      weight: 5.5,
      length: 30,
      width: 25,
      height: 20,
      description: "Electrónicos - Laptop y accesorios",
      declaredValue: 15000,
      serviceType: "express",
      shippingDate: new Date("2024-12-01"),
      estimatedArrival: new Date("2024-12-03"),
      userId: user.id,
    },
    {
      trackingNumber: "SHP-DEMO-002",
      status: "in_transit",
      senderName: "Distribuidora XYZ",
      senderAddress: "Blvd. Industrias 789",
      senderCity: "Monterrey",
      senderState: "Nuevo León",
      senderZip: "64000",
      senderPhone: "8112345678",
      senderEmail: "ventas@xyz.com",
      recipientName: "María López Hernández",
      recipientAddress: "Av. Juárez 321, Col. Roma",
      recipientCity: "Puebla",
      recipientState: "Puebla",
      recipientZip: "72000",
      recipientPhone: "2212345678",
      recipientEmail: "maria.lopez@email.com",
      weight: 12.0,
      length: 50,
      width: 40,
      height: 35,
      description: "Ropa y textiles - 50 prendas variadas",
      declaredValue: 25000,
      serviceType: "standard",
      shippingDate: new Date("2024-11-28"),
      estimatedArrival: new Date("2024-12-02"),
      userId: user.id,
    },
    {
      trackingNumber: "SHP-DEMO-003",
      status: "delivered",
      senderName: "Importaciones del Sur",
      senderAddress: "Calle Sur 654",
      senderCity: "Oaxaca",
      senderState: "Oaxaca",
      senderZip: "68000",
      senderPhone: "9512345678",
      senderEmail: "info@importsur.com",
      recipientName: "Carlos Ramírez Torres",
      recipientAddress: "Priv. de los Pinos 987",
      recipientCity: "Querétaro",
      recipientState: "Querétaro",
      recipientZip: "76000",
      recipientPhone: "4421234567",
      recipientEmail: "carlos.ramirez@email.com",
      weight: 3.2,
      length: 25,
      width: 20,
      height: 15,
      description: "Artesanías - Figuras de barro",
      declaredValue: 8000,
      serviceType: "economy",
      shippingDate: new Date("2024-11-20"),
      estimatedArrival: new Date("2024-11-30"),
      userId: user2.id,
    },
    {
      trackingNumber: "SHP-DEMO-004",
      status: "pending",
      senderName: "Farmacia Salud",
      senderAddress: "Av. Universidad 100",
      senderCity: "Mérida",
      senderState: "Yucatán",
      senderZip: "97000",
      senderPhone: "9991234567",
      senderEmail: "pedidos@salud.com",
      recipientName: "Ana García Muñoz",
      recipientAddress: "Calle Hidalgo 200, Centro",
      recipientCity: "Cancún",
      recipientState: "Quintana Roo",
      recipientZip: "77500",
      recipientPhone: "9981234567",
      recipientEmail: "ana.garcia@email.com",
      weight: 1.8,
      length: 20,
      width: 15,
      height: 10,
      description: "Medicamentos generales (no controlados)",
      declaredValue: 3500,
      serviceType: "express",
      shippingDate: new Date("2024-12-02"),
      estimatedArrival: new Date("2024-12-03"),
      userId: user.id,
    },
    {
      trackingNumber: "SHP-DEMO-005",
      status: "in_transit",
      senderName: "Tecnología Avanzada SA",
      senderAddress: "Parque Industrial 500",
      senderCity: "Querétaro",
      senderState: "Querétaro",
      senderZip: "76120",
      senderPhone: "4421234567",
      senderEmail: "envios@tecavanzada.com",
      recipientName: "Roberto Sánchez Díaz",
      recipientAddress: "Blvd. López Mateos 800",
      recipientCity: "Toluca",
      recipientState: "Estado de México",
      recipientZip: "50000",
      recipientPhone: "7221234567",
      recipientEmail: "roberto.sanchez@email.com",
      weight: 8.0,
      length: 40,
      width: 35,
      height: 30,
      description: "Equipos de cómputo - Servidor y periféricos",
      declaredValue: 45000,
      serviceType: "standard",
      shippingDate: new Date("2024-11-30"),
      estimatedArrival: new Date("2024-12-04"),
      userId: user2.id,
    },
  ];

  for (const shipment of shipments) {
    await prisma.shipment.upsert({
      where: { trackingNumber: shipment.trackingNumber },
      update: {},
      create: shipment,
    });
  }

  console.log("Seed completed!");
  console.log("  admin@demo.com / password123");
  console.log("  user@demo.com / password123");
  console.log(`  ${shipments.length} shipments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
