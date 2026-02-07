from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.models.cart import CartItem
from app.models.customer import Customer
from app.schemas.order import OrderOut, OrderDetailOut
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


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


@router.post("/checkout", response_model=OrderOut)
def checkout(
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_items = db.query(CartItem).filter(CartItem.customer_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order = Order(customer_id=current_user.id)
    db.add(order)
    db.flush()

    for item in cart_items:
        detail = OrderDetail(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price * item.quantity,
        )
        db.add(detail)

    db.query(CartItem).filter(CartItem.customer_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return _order_to_out(order)


@router.get("/my-orders", response_model=list[OrderOut])
def my_orders(
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.customer_id == current_user.id)
        .order_by(Order.order_date.desc())
        .all()
    )
    return [_order_to_out(o) for o in orders]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.customer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return _order_to_out(order)
