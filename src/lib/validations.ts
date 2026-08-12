import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const shipmentSchema = z.object({
  senderName: z.string().min(2, "Nombre requerido"),
  senderAddress: z.string().min(5, "Dirección requerida"),
  senderCity: z.string().min(2, "Ciudad requerida"),
  senderState: z.string().min(2, "Estado requerido"),
  senderZip: z.string().min(5, "Código postal requerido"),
  senderPhone: z.string().min(10, "Teléfono requerido"),
  senderEmail: z.string().email("Email inválido"),

  recipientName: z.string().min(2, "Nombre requerido"),
  recipientAddress: z.string().min(5, "Dirección requerida"),
  recipientCity: z.string().min(2, "Ciudad requerida"),
  recipientState: z.string().min(2, "Estado requerido"),
  recipientZip: z.string().min(5, "Código postal requerido"),
  recipientPhone: z.string().min(10, "Teléfono requerido"),
  recipientEmail: z.string().email("Email inválido"),

  weight: z.coerce.number().positive("El peso debe ser mayor a 0"),
  length: z.coerce.number().positive("El largo debe ser mayor a 0"),
  width: z.coerce.number().positive("El ancho debe ser mayor a 0"),
  height: z.coerce.number().positive("El alto debe ser mayor a 0"),
  description: z.string().min(3, "Descripción requerida"),
  declaredValue: z.coerce.number().positive("El valor declarado debe ser mayor a 0"),

  serviceType: z.enum(["express", "standard", "economy"], {
    message: "Seleccione un tipo de servicio",
  }),
  shippingDate: z.string().min(1, "Fecha de envío requerida"),
  estimatedArrival: z.string().min(1, "Fecha estimada requerida"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ShipmentInput = z.infer<typeof shipmentSchema>;
