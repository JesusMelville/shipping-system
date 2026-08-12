import { createClient } from "@libsql/client";
import "dotenv/config";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const schema = `
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Shipment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "trackingNumber" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "senderName" TEXT NOT NULL,
  "senderAddress" TEXT NOT NULL,
  "senderCity" TEXT NOT NULL,
  "senderState" TEXT NOT NULL,
  "senderZip" TEXT NOT NULL,
  "senderPhone" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "recipientName" TEXT NOT NULL,
  "recipientAddress" TEXT NOT NULL,
  "recipientCity" TEXT NOT NULL,
  "recipientState" TEXT NOT NULL,
  "recipientZip" TEXT NOT NULL,
  "recipientPhone" TEXT NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "weight" REAL NOT NULL,
  "length" REAL NOT NULL,
  "width" REAL NOT NULL,
  "height" REAL NOT NULL,
  "description" TEXT NOT NULL,
  "declaredValue" REAL NOT NULL,
  "serviceType" TEXT NOT NULL,
  "shippingDate" DATETIME NOT NULL,
  "estimatedArrival" DATETIME NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Document" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fileName" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileType" TEXT NOT NULL,
  "shipmentId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
`;

async function main() {
  console.log("Pushing schema to Turso...");
  const statements = schema.split(";").filter(s => s.trim());
  for (const stmt of statements) {
    if (stmt.trim()) {
      await client.execute(stmt.trim());
    }
  }
  console.log("Schema pushed successfully!");
}

main().catch(console.error);
