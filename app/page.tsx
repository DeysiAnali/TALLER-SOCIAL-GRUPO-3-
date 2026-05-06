"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ScanSection } from "@/components/scan-section"
import { ResultCard } from "@/components/result-card"
import { ShareSection } from "@/components/share-section"

export type AnalysisResult = {
  status: string
  badge: "red" | "orange" | "yellow" | "green"
  message: string
  salePrice: number
  productName: string
  whatsappLink?: string
}

export default function Home() {
  const [productName, setProductName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [originalPrice, setOriginalPrice] = useState(10.0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  
  // Estados para manejar la carga visual
  const [isLoadingDate, setIsLoadingDate] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleScanProduct = () => {
    // Simulamos el escaneo de un código de barras por ahora
    setProductName("Yogurt Gloria Familiar 1L")
  }

  const handleScanDate = async () => {
    setIsLoadingDate(true)
    try {
      // 1. Integración con el endpoint Mock de Gemini OCR
      const response = await fetch("http://192.168.1.9:8000/api/ia/extraer-fecha", {
        method: "POST",
      })
      const data = await response.json()
      
      if (data.status === "success") {
        setExpirationDate(data.data.fecha_vencimiento_detectada)
      }
    } catch (error) {
      console.error("Error al conectar con el motor de IA:", error)
      alert("No se pudo conectar con el backend de IA.")
    } finally {
      setIsLoadingDate(false)
    }
  }

  const calculateStrategy = async () => {
    if (!productName || !expirationDate) return
    setIsCalculating(true)

    try {
      // 2. Integración con el Motor Heurístico y de Inventario
      const payload = {
        ean_13: "7751234567890", // Código simulado hasta tener el escáner real
        nombre_si_nuevo: productName,
        categoria_si_nuevo: "Lácteos",
        fecha_vencimiento: expirationDate,
        cantidad: 1,
        precio_base: originalPrice
      }

      const response = await fetch("http://192.168.1.9:8000/api/inventario/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      // 3. Mapeo de la respuesta del backend a la interfaz de Next.js
      if (data.status === "success") {
        const dias = data.analisis_heuristico.dias_restantes
        let badge: "red" | "orange" | "yellow" | "green" = "green"
        let status = "ESTADO ÓPTIMO"
        let message = "Producto con tiempo de vida suficiente."

        if (dias <= 0) {
          badge = "red"
          status = "DONACIÓN INMEDIATA"
          message = "Generando manifiesto para Olla Común."
        } else if (dias <= 2) {
          badge = "orange"
          status = "LIQUIDACIÓN FLASH"
          message = `Alto riesgo. Descuento aplicado: ${data.analisis_heuristico.descuento_aplicado}`
        } else if (dias <= 7) {
          badge = "yellow"
          status = "OFERTA VECINAL"
          message = `Riesgo medio. Descuento aplicado: ${data.analisis_heuristico.descuento_aplicado}`
        }

        setResult({
          status,
          badge,
          message,
          salePrice: data.analisis_heuristico.precio_final_sugerido,
          productName,
          whatsappLink: data.canal_salida.link_compartir_whatsapp
        })
      }
    } catch (error) {
      console.error("Error al calcular estrategia en el backend:", error)
      alert("Error de conexión con el servidor principal.")
    } finally {
      setIsCalculating(false)
    }
  }

  const canCalculate = productName && expirationDate && originalPrice > 0 && !isCalculating

  return (
    <main className="min-h-screen pb-8">
      <Header />

      <div className="max-w-lg mx-auto px-4 space-y-6">
        <ScanSection
          productName={productName}
          expirationDate={expirationDate}
          originalPrice={originalPrice}
          onScanProduct={handleScanProduct}
          onScanDate={handleScanDate}
          onPriceChange={setOriginalPrice}
          onDateChange={setExpirationDate}
        />

        <button
          onClick={calculateStrategy}
          disabled={!canCalculate}
          className="w-full py-4 px-6 bg-primary text-primary-foreground font-semibold rounded-xl 
                     transition-all duration-200 hover:opacity-90 active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                     shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          {isCalculating ? "Procesando en Backend..." : "Calcular Estrategia de Liquidación"}
        </button>

        {result && (
          <>
            <ResultCard result={result} />
            <ShareSection result={result} />
          </>
        )}
      </div>
    </main>
  )
}