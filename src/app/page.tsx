"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ArrowRight,
  Truck,
  FileSpreadsheet,
  Shield,
  Clock,
  MapPin,
  BarChart3,
  Star,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ShipManager</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC0ydjJoLTJ2LTJoMnptOC00VjE4SDI0djJoMTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <Truck className="h-4 w-4" />
              Plataforma de Gestión Logística
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Gestiona tus envíos de paquetería{" "}
              <span className="text-blue-400">de forma profesional</span>
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 max-w-xl leading-relaxed">
              Crea embarques, sube documentos, rastrea tus envíos y exporta
              reportes en Excel. Todo en una sola plataforma.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg"
              >
                Comenzar Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
              >
                Ya tengo cuenta
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-12 text-sm text-blue-100/60">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Sin tarjeta de crédito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Setup en 2 minutos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Soporte 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Envíos procesados" },
              { value: "99.8%", label: "Entregas a tiempo" },
              { value: "500+", label: "Empresas activas" },
              { value: "24/7", label: "Soporte disponible" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas para tus envíos
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Herramientas poderosas pero fáciles de usar para gestionar
              toda tu operación de paquetería.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Crear Embarques",
                description:
                  "Registra envíos con información completa: remitente, destinatario, peso, dimensiones y valor declarado.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: FileSpreadsheet,
                title: "Subir Documentos",
                description:
                  "Adjunta PDFs, imágenes, Word y Excel a cada embarque. Toda tu documentación organizada.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: BarChart3,
                title: "Exportar a Excel",
                description:
                  "Genera reportes completos o resumidos con filtros por estado, servicio y fechas.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: MapPin,
                title: "Rastreo en Tiempo Real",
                description:
                  "Actualiza el estado de cada envío: pendiente, en tránsito, entregado o cancelado.",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: Shield,
                title: "Seguridad Total",
                description:
                  "Autenticación segura con JWT. Tus datos protegidos con encriptación de extremo a extremo.",
                color: "bg-red-50 text-red-600",
              },
              {
                icon: Clock,
                title: "Historial Completo",
                description:
                  "Consulta todo el historial de envíos con fechas, montos y documentos adjuntos.",
                color: "bg-indigo-50 text-indigo-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border bg-white hover:shadow-lg transition-shadow group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para optimizar tus envíos?
          </h2>
          <p className="text-xl text-blue-100/70 mb-10 max-w-2xl mx-auto">
            Únete a cientos de empresas que ya gestionan sus embarques
            con ShipManager.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg text-lg"
          >
            Crear Cuenta Gratis
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Package className="h-4 w-4" />
            ShipManager &copy; {new Date().getFullYear()}
          </div>
          <div className="text-sm text-slate-400">
            Sistema de Gestión de Embarques
          </div>
        </div>
      </footer>
    </div>
  );
}
