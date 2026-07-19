"""Vercel entrypoint for the same-domain catalogue API."""
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse

from backend.app.main import app as catalogue_app

app = FastAPI()
app.mount("/api", catalogue_app)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_file_path(filename: str) -> str:
    return os.path.join(ROOT_DIR, filename)

@app.get("/")
async def read_index():
    return FileResponse(get_file_path("index.html"))

@app.get("/admin.html")
@app.get("/admin")
async def read_admin():
    return FileResponse(get_file_path("admin.html"))

@app.get("/styles.css")
async def read_styles():
    return FileResponse(get_file_path("styles.css"))

@app.get("/script.js")
async def read_js():
    return FileResponse(get_file_path("script.js"))

@app.get("/Logo.png")
async def read_logo():
    return FileResponse(get_file_path("Logo.png"))

@app.get("/placeholder.svg")
async def read_placeholder():
    return FileResponse(get_file_path("placeholder.svg"))
