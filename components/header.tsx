import { Store } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm mb-6">
      <div className="max-w-lg mx-auto px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Store className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              App Mermas
            </h1>
            <p className="text-sm text-muted-foreground">
              Panel del Comerciante
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
