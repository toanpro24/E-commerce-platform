from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.models import customer, category, product, order, order_detail, cart as cart_model  # noqa: F401
from app.seed import seed_database
from app.routes import auth, products, categories, cart, orders, admin

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app):
    seed_database()
    yield


app = FastAPI(title="E-Commerce Platform API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve product images
images_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Images")
if os.path.exists(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")

# Register routes
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "E-Commerce Platform API", "docs": "/docs"}
