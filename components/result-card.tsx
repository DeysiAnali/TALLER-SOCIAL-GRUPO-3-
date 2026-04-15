import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AnalysisResult } from "@/app/page"

type ResultCardProps = {
  result: AnalysisResult
}

const badgeConfig = {
  red: {
    icon: "⛔",
    bgClass: "bg-destructive",
    textClass: "text-destructive-foreground",
    borderClass: "border-destructive/30",
    cardBgClass: "bg-destructive/5",
  },
  orange: {
    icon: "🔥",
    bgClass: "bg-orange-500",
    textClass: "text-white",
    borderClass: "border-orange-500/30",
    cardBgClass: "bg-orange-50",
  },
  yellow: {
    icon: "🏷️",
    bgClass: "bg-warning",
    textClass: "text-warning-foreground",
    borderClass: "border-warning/30",
    cardBgClass: "bg-warning/5",
  },
  green: {
    icon: "✅",
    bgClass: "bg-accent",
    textClass: "text-accent-foreground",
    borderClass: "border-accent/30",
    cardBgClass: "bg-accent/5",
  },
}

export function ResultCard({ result }: ResultCardProps) {
  const config = badgeConfig[result.badge]

  return (
    <Card
      className={`shadow-lg border ${config.borderClass} ${config.cardBgClass} animate-in fade-in slide-in-from-bottom-4 duration-500`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          Resultado del Análisis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${config.bgClass} ${config.textClass}`}
          >
            {result.status}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Producto:</p>
          <p className="font-semibold text-foreground">{result.productName}</p>
        </div>

        <p className="text-foreground/80 leading-relaxed">{result.message}</p>

        <div className="pt-4 border-t border-border">
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground">Precio de Venta:</span>
            <span className="text-3xl font-bold text-foreground">
              S/. {result.salePrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
