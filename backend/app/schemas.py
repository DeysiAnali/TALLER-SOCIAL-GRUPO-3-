from pydantic import BaseModel
from datetime import date
from typing import Optional

class ProductoBase(BaseModel):
    ean_13: str
    nombre: str
    categoria: str

class InventarioCreate(BaseModel):
    ean_13: str
    nombre_si_nuevo: Optional[str] = None
    categoria_si_nuevo: Optional[str] = None
    fecha_vencimiento: date
    cantidad: int
    precio_base: float