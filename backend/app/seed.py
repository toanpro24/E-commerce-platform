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
        Category(name="Liquid Lustres & Ceramic Inks", sort_order=1),
        Category(name="Paints & Coatings", sort_order=2),
        Category(name="Glass Tubes & Rods", sort_order=3),
        Category(name="Raw Materials & Chemicals", sort_order=4),
    ]
    db.add_all(categories)
    db.flush()

    # ── Products ────────────────────────────────────────────────────
    products = [
        # Liquid Lustres & Ceramic Inks
        Product(name="Gold Liquid Lustre", price=0, quantity=0,
                category_id=1, image=""),
        Product(name="Silver Liquid Lustre", price=0, quantity=0,
                category_id=1, image=""),
        Product(name="Platinum Liquid Lustre", price=0, quantity=0,
                category_id=1, image=""),
        Product(name="Ceramic Printing Ink - Red", price=0, quantity=0,
                category_id=1, image=""),
        Product(name="Ceramic Printing Ink - Blue", price=0, quantity=0,
                category_id=1, image=""),
        Product(name="Ceramic Decal Transfer Paper", price=0, quantity=0,
                category_id=1, image=""),

        # Paints & Coatings
        Product(name="Acrylic Polymer Varnish", price=0, quantity=0,
                category_id=2, image=""),
        Product(name="Vinyl Polymer Coating", price=0, quantity=0,
                category_id=2, image=""),
        Product(name="Industrial Enamel Paint", price=0, quantity=0,
                category_id=2, image=""),
        Product(name="Heat-Resistant Ceramic Coating", price=0, quantity=0,
                category_id=2, image=""),
        Product(name="Glass Enamel Frit", price=0, quantity=0,
                category_id=2, image=""),

        # Glass Tubes & Rods
        Product(name="Borosilicate Glass Tube", price=0, quantity=0,
                category_id=3, image=""),
        Product(name="Soda-Lime Glass Rod", price=0, quantity=0,
                category_id=3, image=""),
        Product(name="Quartz Glass Tube", price=0, quantity=0,
                category_id=3, image=""),
        Product(name="Colored Glass Rod", price=0, quantity=0,
                category_id=3, image=""),

        # Raw Materials & Chemicals
        Product(name="Bentonite Clay", price=0, quantity=0,
                category_id=4, image=""),
        Product(name="Kaolin (China Clay)", price=0, quantity=0,
                category_id=4, image=""),
        Product(name="Feldspar Powder", price=0, quantity=0,
                category_id=4, image=""),
        Product(name="Silica Sand", price=0, quantity=0,
                category_id=4, image=""),
        Product(name="Zinc Oxide", price=0, quantity=0,
                category_id=4, image=""),
    ]
    db.add_all(products)
    db.flush()

    db.commit()
    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
