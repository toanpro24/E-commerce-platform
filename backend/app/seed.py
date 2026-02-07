from sqlalchemy.orm import Session

from app.database import SessionLocal, engine, Base
from app.models.customer import Customer
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order
from app.models.order_detail import OrderDetail
from app.models.cart import CartItem  # noqa: F401 - needed for relationship resolution
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
        Customer(first_name="John", last_name="Doe", phone="1234567890",
                 address="123 Main St", city="Springfield", zip_code="62701",
                 username="johndoe", password_hash=hash_password("password1"), role="customer"),
        Customer(first_name="Jane", last_name="Smith", phone="0987654321",
                 address="456 Elm St", city="Shelbyville", zip_code="62702",
                 username="janesmith", password_hash=hash_password("password2"), role="customer"),
        Customer(first_name="Bob", last_name="Johnson", phone="5551234567",
                 address="789 Oak Ave", city="Capital City", zip_code="62703",
                 username="bobjohnson", password_hash=hash_password("password3"), role="customer"),
        Customer(first_name="Admin", last_name="User", phone="0000000000",
                 address="1 Admin Blvd", city="AdminCity", zip_code="00000",
                 username="admin", password_hash=hash_password("admin123"), role="admin"),
    ]
    db.add_all(customers)
    db.flush()

    # ── Categories ──────────────────────────────────────────────────
    categories = [
        Category(name="Electronics", sort_order=1),
        Category(name="Clothing", sort_order=2),
        Category(name="Books", sort_order=3),
        Category(name="Home & Garden", sort_order=4),
        Category(name="Sports", sort_order=5),
    ]
    db.add_all(categories)
    db.flush()

    # ── Products ────────────────────────────────────────────────────
    products = [
        Product(name="Wireless Headphones", price=49.99, quantity=100,
                category_id=1, image="product1.jpg"),
        Product(name="Smartphone Case", price=19.99, quantity=200,
                category_id=1, image="product2.jpg"),
        Product(name="USB-C Cable", price=9.99, quantity=500,
                category_id=1, image="product3.jpg"),
        Product(name="Bluetooth Speaker", price=79.99, quantity=75,
                category_id=1, image="product4.jpg"),
        Product(name="Laptop Stand", price=39.99, quantity=150,
                category_id=1, image="product5.jpg"),
        Product(name="Cotton T-Shirt", price=14.99, quantity=300,
                category_id=2, image="product6.jpg"),
        Product(name="Denim Jeans", price=34.99, quantity=200,
                category_id=2, image="product7.jpg"),
        Product(name="Running Shoes", price=59.99, quantity=100,
                category_id=5, image="product8.jpg"),
        Product(name="Winter Jacket", price=89.99, quantity=80,
                category_id=2, image="product9.jpg"),
        Product(name="Python Programming", price=29.99, quantity=50,
                category_id=3, image="product10.jpg"),
        Product(name="Data Structures & Algorithms", price=34.99, quantity=40,
                category_id=3, image="product11.jpg"),
        Product(name="Desk Lamp", price=24.99, quantity=120,
                category_id=4, image="product12.jpg"),
        Product(name="Plant Pot Set", price=19.99, quantity=200,
                category_id=4, image="product13.jpg"),
        Product(name="Yoga Mat", price=22.99, quantity=150,
                category_id=5, image="product14.jpg"),
        Product(name="Water Bottle", price=12.99, quantity=400,
                category_id=5, image="product15.jpg"),
        Product(name="Mechanical Keyboard", price=69.99, quantity=90,
                category_id=1, image="product16.jpg"),
        Product(name="Webcam HD", price=44.99, quantity=110,
                category_id=1, image="product17.jpg"),
        Product(name="Garden Tool Set", price=54.99, quantity=60,
                category_id=4, image="product18.jpg"),
    ]
    db.add_all(products)
    db.flush()

    # ── Sample Orders ───────────────────────────────────────────────
    order1 = Order(customer_id=1, status="Delivered")
    order2 = Order(customer_id=2, status="Shipped")
    order3 = Order(customer_id=1, status="Pending")
    db.add_all([order1, order2, order3])
    db.flush()

    order_details = [
        OrderDetail(order_id=order1.id, product_id=1, quantity=1, price=49.99),
        OrderDetail(order_id=order1.id, product_id=3, quantity=2, price=19.98),
        OrderDetail(order_id=order2.id, product_id=6, quantity=3, price=44.97),
        OrderDetail(order_id=order3.id, product_id=10, quantity=1, price=29.99),
        OrderDetail(order_id=order3.id, product_id=14, quantity=1, price=22.99),
    ]
    db.add_all(order_details)

    db.commit()
    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
