"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { AuthTemplate } from "@/components/templates";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || "Error al crear la cuenta");
        setIsLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Error de conexión");
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para empezar a gestionar tus embarques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Input
              label="Nombre completo"
              placeholder="Tu nombre"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Creando cuenta..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Cuenta
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthTemplate>
  );
}
