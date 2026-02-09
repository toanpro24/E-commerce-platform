from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.customer import Customer
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.models.cart import CartItem  # noqa: F401 - needed for relationship resolution
from app.models.contact import ContactInquiry  # noqa: F401 - needed for table creation
from app.auth.jwt import hash_password


def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    if db.query(Customer).first():
        print("Database already seeded.")
        db.close()
        return

    # ── Customers ───────────────────────────────────────────────────
    customers = [
        Customer(first_name="Admin", last_name="User", phone="0000000000",
                 address="Ba Dinh District", city="Hanoi", zip_code="100000",
                 username="admin", password_hash=hash_password("admin123"), role="admin"),
    ]
    db.add_all(customers)
    db.flush()

    # ── Categories ──────────────────────────────────────────────────
    categories = [
        Category(name="Vật tư sản xuất", sort_order=1),
        Category(name="Sản phẩm nội thất", sort_order=2),
    ]
    db.add_all(categories)
    db.flush()

    # ── Products ────────────────────────────────────────────────────
    products = [
        # Vật tư sản xuất
        Product(name="Mầu vàng in men GPP392", price=450000, quantity=100,
                category_id=1, image="Màu_vàng_in men_GPP392.jpg",
                origin="China"),
        Product(name="Chất bảo quản men 623", price=380000, quantity=80,
                category_id=1, image="Chất_bảo_quản_men_623.jpg",
                origin="Indonesia"),
        Product(name="Bột men chảy flux 101652", price=520000, quantity=60,
                category_id=1, image="Bột_men_chảy_flux_101652.jpg",
                origin="Germany"),
        Product(name="Mầu vàng vẽ men GG501/11", price=490000, quantity=75,
                category_id=1, image="Màu_vàng_vẽ_men_GG501.jpg",
                origin="Germany"),

        # Sản phẩm nội thất
        Product(name="Bình gốm hút lộc vẽ vàng đường kính 45cm cao 48cm", price=2500000, quantity=15,
                category_id=2, image="Bình_gốm_hút_lộc_vẽ_vàng_đường_kính_45cm_cao_48cm.jpg",
                origin="Việt Nam"),
        Product(name="Bình gốm cắm đào vẽ vàng đường kính 40cm cao 48cm", price=2800000, quantity=10,
                category_id=2, image="Bình_gốm_cắm_đào_vẽ_vàng_đường_kính_40cm_cao_48cm.mp4",
                origin="Việt Nam"),
    ]
    db.add_all(products)
    db.flush()

    db.commit()
    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
