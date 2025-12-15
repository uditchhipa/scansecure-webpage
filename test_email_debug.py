import asyncio
import os
from dotenv import load_dotenv
# Manually load env to be sure
load_dotenv("backend/.env")

from backend.email_utils import send_otp_email

async def main():
    email = os.getenv("MAIL_USERNAME")
    print(f"Testing email to: {email}")
    print(f"Using Password: {os.getenv('MAIL_PASSWORD')}")
    
    success = await send_otp_email(email, "123456")
    if success:
        print("✅ Email Sent Successfully!")
    else:
        print("❌ Email Failed to Send.")

if __name__ == "__main__":
    asyncio.run(main())
