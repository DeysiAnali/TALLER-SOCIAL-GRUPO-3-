from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class ProductoInventario(Base):
    __tablename__ = "inventario_bodega"

    id = Column(Integer, primary_key=True, index=True)
    ean_13 = Column(String, index=True, nullable=False)
    nombre = Column(String, nullable=False)
    categoria = Column(String)
    fecha_vencimiento = Column(Date, nullable=False)
    cantidad = Column(Integer, default=1)
    precio_base = Column(Float, nullable=False)