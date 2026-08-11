"""Vercel entrypoint for the same-domain catalogue API."""
import os
from fastapi import FastAPI
from fastapi.responses import FileResponse

from backend.app.main import app as catalogue_app

app = FastAPI()
app.mount("/api", catalogue_app)

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Since the v3 "Heritage Gold & Forest" migration the static frontend lives in
# frontend/ (index.html, styles.css, script.js, admin.html, Logo.png, placeholder.svg).
# vercel.json rewrites non-API root paths to /frontend/*; these routes are the
# FastAPI fallback for the same paths.
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")

def get_file_path(filename: str) -> str:
    return os.path.join(FRONTEND_DIR, filename)

@app.get("/")
@app.get("/index.html")
@app.get("/index")
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

@app.get("/favicon.ico")
async def read_favicon():
    return FileResponse(get_file_path("Logo.png"))
