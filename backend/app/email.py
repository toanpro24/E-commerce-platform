from fastapi_mail import FastMail, MessageSchema, MessageType

from app.config import mail_config, settings


fm = FastMail(mail_config)


async def send_order_confirmation(to_email: str, order_id: int, order_details: list, total: float) -> bool:
    smtp_user = settings.SMTP_USER.strip()
    smtp_pass = settings.SMTP_PASSWORD.strip()
    if not smtp_user or not smtp_pass:
        print(f"[EMAIL] SMTP not configured. Skipping email for order #{order_id} to {to_email}")
        return False

    message = MessageSchema(
        subject=f"Order Confirmation - #{order_id} | Thuan Phat",
        recipients=[to_email],
        template_body={
            "order_id": order_id,
            "order_details": order_details,
            "total": total,
        },
        subtype=MessageType.html,
    )

    try:
        await fm.send_message(message, template_name="order_confirmation.html")
        print(f"[EMAIL] Confirmation sent for order #{order_id} to {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send for order #{order_id}: {e}")
        return False
