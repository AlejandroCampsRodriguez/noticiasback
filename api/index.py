from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# Creamos la instancia de FastAPI
app = FastAPI()

# Configuración de CORS para permitir peticiones desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de datos simulada
WEB_SOURCES = [
    {"id": "web-1", "type": "web", "title": "Noticias para desarrolladores", "description": "Actualidad sobre desarrollo web y software", "url": "https://dev.to"},
    {"id": "web-2", "type": "web", "title": "Frontend y JavaScript", "description": "Tendencias del frontend moderno", "url": "https://midu.dev"},
    {"id": "web-3", "type": "web", "title": "Mobile y tecnología", "description": "Noticias sobre desarrollo móvil", "url": "https://www.reactnative.dev/blog"}
]

YOUTUBE_SOURCES = [
    {"id": "yt-1", "type": "youtube", "title": "Midudev", "url": "https://www.youtube.com/@midudev"},
    {"id": "yt-2", "type": "youtube", "title": "React Native Oficial", "url": "https://www.youtube.com/@reactnative"}
]

@app.get("/api/search")
def search(q: str = Query(None, min_length=1)):
    if not q:
        return {"query": "", "count": 0, "results": []}

    query = q.lower()
    
    # Filtrado en Web Sources
    web_results = [
        item for item in WEB_SOURCES 
        if query in item["title"].lower() or query in item["description"].lower()
    ]
    
    # Filtrado en YouTube Sources
    yt_results = [
        item for item in YOUTUBE_SOURCES 
        if query in item["title"].lower()
    ]
    
    results = web_results + yt_results
    
    return {
        "query": q,
        "count": len(results),
        "results": results
    }

@app.get("/api/healthcheck")
def healthcheck():
    return {"status": "ok", "message": "API is running"}