import uvicorn

# Importamos la app desde el archivo index en la carpeta api
from api.index import app

if __name__ == "__main__":
    # Ejecuta el servidor en http://127.0.0.1:8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)