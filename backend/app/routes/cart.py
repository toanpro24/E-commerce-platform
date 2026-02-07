from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.cart import CartItemOut, CartItemCreate, CartItemUpdate
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/cart", tags=["cart"])


def _cart_item_to_out(item: CartItem) -> CartItemOut:
    return CartItemOut(
        id=item.id,
        product_id=item.product_id,
        quantity=item.quantity,
        product_name=item.product.name if item.product else "",
        product_price=item.product.price if item.product else 0.0,
        product_image=item.product.image if item.product else "",
    )


@router.get("/", response_model=list[CartItemOut])
def get_cart(
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = db.query(CartItem).filter(CartItem.customer_id == current_user.id).all()
    return [_cart_item_to_out(item) for item in items]


@router.post("/", response_model=CartItemOut)
def add_to_cart(
    req: CartItemCreate,
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == req.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(CartItem).filter(
        CartItem.customer_id == current_user.id,
        CartItem.product_id == req.product_id,
    ).first()

    if existing:
        existing.quantity += req.quantity
        db.commit()
        db.refresh(existing)
        return _cart_item_to_out(existing)

    item = CartItem(
        customer_id=current_user.id,
        product_id=req.product_id,
        quantity=req.quantity,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _cart_item_to_out(item)


@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(
    item_id: int,
    req: CartItemUpdate,
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.customer_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    item.quantity = req.quantity
    db.commit()
    db.refresh(item)
    return _cart_item_to_out(item)


@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.customer_id == current_user.id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return {"detail": "Item removed from cart"}


@router.delete("/")
def clear_cart(
    current_user: Customer = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(CartItem).filter(CartItem.customer_id == current_user.id).delete()
    db.commit()
    return {"detail": "Cart cleared"}
