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
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Auto-configure for Port 465 (SSL)
# Auto-configure Resend
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
if RESEND_API_KEY:
    import resend
    resend.api_key = RESEND_API_KEY

async def send_otp_email(email: EmailStr, otp: str):
    """
    Sends an OTP email to the user.
    Prioritizes Resend API (Reliable on Render).
    Fallbacks to SMTP (Gmail) if API Key missing.
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

    # 1. Try Resend API (HTTP - Not blocked by firewall)
    if RESEND_API_KEY:
        print(f"DEBUG: Attempting to send via Resend API to {email}...")
        try:
            r = resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": email,
                "subject": "Your SecureScan Verification Code",
                "html": html
            })
            print(f"DEBUG: Resend API Success: {r}")
            return True
        except Exception as e:
            print(f"ERROR: Resend API Failed: {e}")
            # Fallthrough to SMTP or Log
            
    # 2. Try SMTP (Fall-back or Dev Mode)
    # Dev Mode Fallback: If password is "your-app-password", don't crash, just print.
    if conf.MAIL_PASSWORD == "your-app-password":
        print(f"\n[DEV MODE] 📧 EMAIL SIMULATOR 📧\nTo: {email}\nSubject: Verify Account\nCode: {otp}\n[END SIMULATION]\n")
        return True

    print(f"DEBUG: Attempting to send email to {email} via SMTP {conf.MAIL_SERVER}...")
    try:
        fm = FastMail(conf)
        message = MessageSchema(
            subject="Your SecureScan Verification Code",
            recipients=[email],
            body=html,
            subtype=MessageType.html
        )
        await fm.send_message(message)
        print("DEBUG: Email sent successfully!")
        return True
    except Exception as e:
        print(f"ERROR: Failed to send email via SMTP: {e}")
        print(f"⚠️  FALLBACK OTP (Use this to verify): {otp}")
        return False
