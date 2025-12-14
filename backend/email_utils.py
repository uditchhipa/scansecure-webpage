import os
from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel
from dotenv import load_dotenv

load_dotenv()

# Configuration for SMTP (Gmail Example by default, user can change env vars)
# For "App Password" in Gmail: Account -> Security -> 2-Step Verification -> App Passwords
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your-email@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@scansecure.io"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_otp_email(email: EmailStr, otp: str):
    """
    Sends an OTP email to the user.
    If credentials are dummy/default, it prints to console for Dev Mode.
    """
    
    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
        <h2 style="color: #10b981;">SecureScan Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px; border-radius: 5px;">{otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
    </div>
    """

    message = MessageSchema(
        subject="Your SecureScan Verification Code",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    # Dev Mode Fallback: If password is "your-app-password", don't crash, just print.
    if conf.MAIL_PASSWORD == "your-app-password":
        print(f"\n[DEV MODE] 📧 EMAIL SIMULATOR 📧\nTo: {email}\nSubject: Verify Account\nCode: {otp}\n[END SIMULATION]\n")
        return True

    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        # Return True anyway to not block reg in dev, but ideally handle error
        return False
