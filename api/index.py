"""Vercel entrypoint for the same-domain catalogue API."""

from fastapi import FastAPI

from backend.app.main import app as catalogue_app

app = FastAPI()
app.mount("/api", catalogue_app)
