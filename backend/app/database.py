# # from sqlalchemy import create_engine
# # from sqlalchemy.ext.declarative import declarative_base
# # from sqlalchemy.orm import sessionmaker

# # # Credenciales basadas en tu docker-compose.yml
# # # Nota: Usamos localhost porque al ejecutar FastAPI fuera de Docker, 
# # # se conecta al puerto 5432 expuesto por el contenedor en tu máquina host.
# # # SQLALCHEMY_DATABASE_URL = "postgresql://appmermas_user:adminpassword@localhost:5432/appmermas_db"

# # SQLALCHEMY_DATABASE_URL = "postgresql://appmermas_user:adminpassword@127.0.0.1:5432/appmermas_db?client_encoding=utf8"

# # engine = create_engine(SQLALCHEMY_DATABASE_URL)
# # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base = declarative_base()

# # # Dependencia para inyectar la sesión de base de datos en los endpoints
# # def get_db():
# #     db = SessionLocal()
# #     try:
# #         yield db
# #     finally:
# #         db.close()

# # app/database.py
# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # app/database.py
# # Eliminamos la contraseña de la URL ya que usamos 'trust' en Docker
# SQLALCHEMY_DATABASE_URL = "postgresql+pg8000://postgres@127.0.0.1:5432/appmermas_db"

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Usamos SQLite (creará un archivo 'bioshare.db' en tu carpeta backend)
SQLALCHEMY_DATABASE_URL = "sqlite:///./bioshare.db"

# 2. Argumento necesario solo para SQLite en FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()