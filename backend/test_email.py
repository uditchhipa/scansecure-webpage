import os
import asyncio
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

load_dotenv()

async def test_smtp():
    print("--- Starting SMTP Connection Test ---")
    
    username = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    
    print(f"Username found: {'Yes' if username else 'No'}")
    print(f"Password found: {'Yes' if password else 'No'}")
    
    conf = ConnectionConfig(
        MAIL_USERNAME=username,
        MAIL_PASSWORD=password,
        MAIL_FROM=os.getenv("MAIL_FROM", "noreply@scansecure.io"),
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )

    message = MessageSchema(
        subject="SecureScan SMTP Test",
        recipients=[username], # Send to self
        body="If you see this, your SMTP configuration is working perfectly! 🚀",
        subtype=MessageType.html
    )

    print("Attempting to connect to Gmail...")
    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        print("✅ SUCCESS: Email sent successfully!")
    except Exception as e:
        print(f"❌ FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(test_smtp())
