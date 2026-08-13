import { Package } from "lucide-react";

interface AuthTemplateProps {
  children: React.ReactNode;
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col items-start justify-center p-12 pl-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-3 rounded-xl">
              <Package className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold">ShipManager</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Sistema de Embarques Profesional
            </h2>
            <p className="text-white/80 leading-relaxed">
              Gestiona tus envíos de paquetería de forma eficiente. 
              Crea embarques, rastrea documentos y exporta reportes en Excel.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-white/70 text-sm">Envíos diarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99%</div>
              <div className="text-white/70 text-sm">Entregas a tiempo</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-white/70 text-sm">Disponibilidad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 pr-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
