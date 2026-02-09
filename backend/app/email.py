import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings


def send_order_confirmation(to_email: str, order_id: int, order_details: list, total: float) -> bool:
    if not settings.SMTP_USER:
        print(f"[EMAIL] SMTP not configured. Skipping email for order #{order_id} to {to_email}")
        return False

    items_html = ""
    for item in order_details:
        items_html += f"""
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">{item['name']}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">{item['quantity']}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">{item['price']:,.0f} VND</td>
        </tr>"""

    html = f"""
    <div style="font-family:Segoe UI,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a56db;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="margin:0;font-size:24px">Order Confirmed</h1>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
            <p>Thank you for your order! Here is your order summary:</p>
            <p style="font-weight:700;color:#1e3a5f">Order #{order_id}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
                <thead>
                    <tr style="background:#f8fafc">
                        <th style="padding:8px;text-align:left">Product</th>
                        <th style="padding:8px;text-align:center">Qty</th>
                        <th style="padding:8px;text-align:right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>{items_html}</tbody>
            </table>
            <p style="font-size:18px;font-weight:700;text-align:right;color:#1e3a5f">
                Total: {total:,.0f} VND
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
            <p style="color:#64748b;font-size:14px">
                We will process your order shortly. If you have any questions, please contact us at info@thuanphat.com.
            </p>
        </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Order Confirmation - #{order_id} | Thuan Phat"
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
        print(f"[EMAIL] Confirmation sent for order #{order_id} to {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send for order #{order_id}: {e}")
        return False
