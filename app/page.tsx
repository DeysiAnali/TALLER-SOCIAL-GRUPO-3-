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
}

export default function Home() {
  const [productName, setProductName] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [originalPrice, setOriginalPrice] = useState(10.0)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleScanProduct = () => {
    setProductName("Yogurt Gloria Familiar 1L")
  }

  const handleScanDate = () => {
    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + 2)
    const formattedDate = futureDate.toISOString().split("T")[0]
    setExpirationDate(formattedDate)
  }

  const calculateStrategy = () => {
    if (!productName || !expirationDate) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expDate = new Date(expirationDate)
    expDate.setHours(0, 0, 0, 0)

    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let analysisResult: AnalysisResult

    if (diffDays <= 0) {
      analysisResult = {
        status: "DONACIÓN INMEDIATA",
        badge: "red",
        message:
          "Este producto ya no es comercializable. Generando manifiesto para Olla Común local.",
        salePrice: 0,
        productName,
      }
    } else if (diffDays <= 2) {
      analysisResult = {
        status: "LIQUIDACIÓN FLASH",
        badge: "orange",
        message: "Alto riesgo de pérdida. Aplicando 50% de descuento.",
        salePrice: originalPrice * 0.5,
        productName,
      }
    } else if (diffDays <= 7) {
      analysisResult = {
        status: "OFERTA VECINAL",
        badge: "yellow",
        message: "Riesgo medio. Aplicando 20% de descuento sugerido.",
        salePrice: originalPrice * 0.8,
        productName,
      }
    } else {
      analysisResult = {
        status: "ESTADO ÓPTIMO",
        badge: "green",
        message:
          "Producto con tiempo de vida suficiente. Mantener precio regular.",
        salePrice: originalPrice,
        productName,
      }
    }

    setResult(analysisResult)
  }

  const canCalculate = productName && expirationDate && originalPrice > 0

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
                     shadow-lg shadow-primary/25"
        >
          Calcular Estrategia de Liquidación
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
