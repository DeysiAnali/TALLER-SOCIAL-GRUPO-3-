import { ScanBarcode, CalendarSearch, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ScanSectionProps = {
  productName: string
  expirationDate: string
  originalPrice: number
  onScanProduct: () => void
  onScanDate: () => void
  onPriceChange: (price: number) => void
  onDateChange: (date: string) => void
}

export function ScanSection({
  productName,
  expirationDate,
  originalPrice,
  onScanProduct,
  onScanDate,
  onPriceChange,
  onDateChange,
}: ScanSectionProps) {
  return (
    <Card className="shadow-md border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground">
          Registro de Producto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scan Product Button */}
        <div className="space-y-2">
          <button
            onClick={onScanProduct}
            className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 
                       rounded-xl border-2 border-dashed border-border transition-all duration-200
                       hover:border-primary/50 active:scale-[0.99] group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center 
                            group-hover:bg-primary/20 transition-colors">
              <ScanBarcode className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <span className="font-medium text-foreground block">
                Escanear Producto (Simulado)
              </span>
              <span className="text-sm text-muted-foreground">
                Toca para escanear código de barras
              </span>
            </div>
          </button>

          {productName && (
            <div className="px-4 py-3 bg-accent/10 rounded-lg border border-accent/30">
              <p className="text-sm text-muted-foreground">Producto detectado:</p>
              <p className="font-semibold text-foreground">{productName}</p>
            </div>
          )}
        </div>

        {/* Scan Date Button */}
        <div className="space-y-2">
          <button
            onClick={onScanDate}
            className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 
                       rounded-xl border-2 border-dashed border-border transition-all duration-200
                       hover:border-primary/50 active:scale-[0.99] group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center 
                            group-hover:bg-primary/20 transition-colors">
              <CalendarSearch className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <span className="font-medium text-foreground block">
                Tomar Foto a Fecha (Simulado)
              </span>
              <span className="text-sm text-muted-foreground">
                IA extrae la fecha de vencimiento
              </span>
            </div>
          </button>

          {expirationDate && (
            <div className="space-y-2">
              <div className="px-4 py-3 bg-accent/10 rounded-lg border border-accent/30">
                <p className="text-sm text-muted-foreground">Fecha extraída por IA:</p>
                <p className="font-semibold text-foreground">
                  {new Date(expirationDate + "T00:00:00").toLocaleDateString("es-PE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="px-4">
                <label className="text-sm text-muted-foreground block mb-1">
                  Ajustar fecha manualmente:
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg 
                             text-foreground focus:outline-none focus:ring-2 focus:ring-ring
                             transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="w-4 h-4 text-primary" />
            Precio Original (S/.)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              S/.
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={originalPrice}
              onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl 
                         text-foreground text-lg font-semibold
                         focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                         transition-all placeholder:text-muted-foreground"
              placeholder="10.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
