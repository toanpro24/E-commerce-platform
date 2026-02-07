from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.customer import Customer
from app.schemas.product import ProductOut, ProductCreate, ProductUpdate
from app.schemas.order import OrderOut, OrderDetailOut, OrderStatusUpdate
from app.schemas.customer import CustomerOut
from app.auth.jwt import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


# ── Product Management ──────────────────────────────────────────────

@router.get("/products", response_model=list[ProductOut])
def list_all_products(
    search: str = Query(None),
    category_id: int = Query(None),
    include_inactive: bool = Query(True),
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    query = db.query(Product)
    if not include_inactive:
        query = query.filter(Product.is_active == True)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.all()


@router.post("/products", response_model=ProductOut)
def create_product(
    req: ProductCreate,
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    product = Product(**req.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    req: ProductUpdate,
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = False
    db.commit()
    return {"detail": "Product deactivated"}


# ── Order Management ────────────────────────────────────────────────

def _order_to_out(order: Order) -> OrderOut:
    return OrderOut(
        id=order.id,
        customer_id=order.customer_id,
        order_date=order.order_date,
        status=order.status,
        customer_name=f"{order.customer.first_name} {order.customer.last_name}",
        details=[
            OrderDetailOut(
                id=d.id,
                product_id=d.product_id,
                quantity=d.quantity,
                price=d.price,
                product_name=d.product.name if d.product else "",
            )
            for d in order.details
        ],
    )


@router.get("/orders", response_model=list[OrderOut])
def list_all_orders(
    status: str = Query(None),
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    query = db.query(Order).order_by(Order.order_date.desc())
    if status:
        query = query.filter(Order.status == status)
    return [_order_to_out(o) for o in query.all()]


@router.put("/orders/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    req: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    if req.status not in ("Pending", "Shipped", "Delivered"):
        raise HTTPException(status_code=400, detail="Invalid status")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = req.status
    db.commit()
    db.refresh(order)
    return _order_to_out(order)


# ── Customer Management ────────────────────────────────────────────

@router.get("/customers", response_model=list[CustomerOut])
def list_customers(
    db: Session = Depends(get_db),
    _admin: Customer = Depends(require_admin),
):
    return db.query(Customer).all()
