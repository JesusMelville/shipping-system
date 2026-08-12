"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { AuthTemplate } from "@/components/templates";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contraseña incorrectos");
        setIsLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Error de conexión");
      setIsLoading(false);
    }
  };

  return (
    <AuthTemplate>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Ingresando..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthTemplate>
  );
}
