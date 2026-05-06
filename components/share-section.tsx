import { MessageCircle, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import type { AnalysisResult } from "@/app/page"


type ShareSectionProps = {
  result: AnalysisResult
}

export function ShareSection({ result }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)

  // Extraemos el texto limpio del enlace que nos mandó el backend (Python).
  // Si por alguna razón no hay enlace (ej. Donación), usamos un texto por defecto.
  const whatsappMessage = result.whatsappLink
    ? (result.whatsappLink.split("text=")[1] || "").replaceAll("%20", " ")
    : result.salePrice > 0
    ? `¡Oferta en Bodega Don Pepe! ${result.productName} a solo S/. ${result.salePrice.toFixed(2)}.`
    : `Estimados vecinos, donamos ${result.productName} para la Olla Común. Recojo hoy.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(whatsappMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="shadow-md border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          Difusión Vecinal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <textarea
            readOnly
            value={whatsappMessage}
            className="w-full p-4 bg-secondary rounded-xl text-foreground text-sm 
                       resize-none border border-border min-h-[100px]
                       focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-card hover:bg-muted rounded-lg 
                       border border-border transition-all duration-200 group"
            title="Copiar mensaje"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            )}
          </button>
        </div>

        {/* CAMBIO CLAVE: Reemplazamos el <button> deshabilitado por un <a> funcional */}
        <a
          href={result.whatsappLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center gap-3 py-4 px-6 
                     font-semibold rounded-xl transition-all duration-200 shadow-md
                     ${result.whatsappLink 
                        ? 'bg-[#25D366] text-white hover:bg-[#128C7E] active:scale-[0.98] shadow-[#25D366]/20' 
                        : 'bg-green-600 text-white opacity-60 cursor-not-allowed pointer-events-none'}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Compartir en WhatsApp (wa.me)
        </a>

        {/* Mensaje de estado actualizado */}
        <p className="text-xs text-muted-foreground text-center">
          {result.whatsappLink ? "El botón abrirá WhatsApp con el enlace generado por el backend." : "Calculando enlace..."}
        </p>
      </CardContent>
    </Card>
  )
}