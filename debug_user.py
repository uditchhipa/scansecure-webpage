from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend import models, auth

# Connect to DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./scansecure.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def list_users():
    users = db.query(models.User).all()
    print(f"\n--- Found {len(users)} Users ---")
    for u in users:
        print(f"ID: {u.id}")
        print(f"   Email: {u.email}")
        print(f"   Verified: {u.verified}")
        print(f"   OTP: {u.otp_code}")
        print("-" * 20)

def check_password(email, password):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        print(f"\n[Error] User {email} not found.")
        return
    
    print(f"\n--- Checking User: {email} ---")
    print(f"Stored Hash: {user.hashed_password[:20]}...")
    
    is_valid = auth.verify_password(password, user.hashed_password)
    print(f"Password '{password}' is VALID: {is_valid}")

    # Re-hash check
    reheashed = auth.get_password_hash(password)
    # print(f"New Hash would be: {reheashed}")

if __name__ == "__main__":
    list_users()
    
    # Simple interactive check if you want, or just hardcode for the user's likely email
    # Assuming user might be 'test@example.com' or similar based on typical flows
    # For now, just listing is helpful.
