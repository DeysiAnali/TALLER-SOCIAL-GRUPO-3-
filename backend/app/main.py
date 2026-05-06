from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta

# Importaciones de Base de Datos
from app.database import engine, Base, get_db
from app.models import ProductoInventario as DBProductoInventario

# Esto crea las tablas en PostgreSQL al arrancar el servidor 
# (Basado en el diseño de models.py)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="App Mermas API",
    description="Backend asíncrono de optimización de mermas",
)

# Configuración de CORS para Next.js (Puerto 3000)
app.add_middleware(
    CORSMiddleware,
   # allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origins=["*"],  # Permitir todas las fuentes para desarrollo (ajustar en producción)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ESQUEMAS DE DATOS ---
class ProductoInventario(BaseModel):
    ean_13: str
    nombre_si_nuevo: Optional[str] = None
    categoria_si_nuevo: Optional[str] = None
    fecha_vencimiento: date
    cantidad: int
    precio_base: float

class RespuestaMockOCR(BaseModel):
    status: str
    data: dict

# --- ENDPOINTS ---
@app.post("/api/ia/extraer-fecha", response_model=RespuestaMockOCR)
async def mock_gemini_ocr():
    return {
        "status": "success",
        "data": {
            "fecha_vencimiento_detectada": (date.today() + timedelta(days=2)).strftime("%Y-%m-%d"),
            "confianza_ocr": 0.98
        }
    }

@app.post("/api/inventario/")
async def registrar_producto(item: ProductoInventario, db: Session = Depends(get_db)):
    """
    Guarda en PostgreSQL y aplica el motor heurístico.
    """
    try:
        # 1. Guardar en Base de Datos
        nuevo_producto = DBProductoInventario(
            ean_13=item.ean_13,
            nombre=item.nombre_si_nuevo or "Producto Desconocido",
            categoria=item.categoria_si_nuevo,
            fecha_vencimiento=item.fecha_vencimiento,
            cantidad=item.cantidad,
            precio_base=item.precio_base
        )
        db.add(nuevo_producto)
        db.commit()
        db.refresh(nuevo_producto)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error en BD: {str(e)}")

    # 2. Reglas Heurísticas
    dias_para_vencer = (item.fecha_vencimiento - date.today()).days
    descuento_sugerido = 0
    if dias_para_vencer <= 1: descuento_sugerido = 50
    elif dias_para_vencer <= 3: descuento_sugerido = 30
    elif dias_para_vencer <= 7: descuento_sugerido = 10

    precio_final = item.precio_base * (1 - (descuento_sugerido / 100))

    # 3. Enlace wa.me
    mensaje_oferta = (
        f"¡Oferta BioShare! {item.nombre_si_nuevo} a S/{precio_final:.2f} "
        f"({descuento_sugerido}% dcto). Vence en {dias_para_vencer} días."
    )
    mensaje_url = mensaje_oferta.replace(" ", "%20")
    link_whatsapp = f"https://wa.me/?text={mensaje_url}"

    return {
        "status": "success",
        "producto_id": nuevo_producto.id, # Confirmación de que se guardó
        "analisis_heuristico": {
            "dias_restantes": dias_para_vencer,
            "descuento_aplicado": f"{descuento_sugerido}%",
            "precio_final_sugerido": precio_final
        },
        "canal_salida": {
            "link_compartir_whatsapp": link_whatsapp
        }
    }