from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend import models

# Connect to DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./scansecure.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def view_database():
    print("="*60)
    print(" 📂 DATABASE VIEWER: scansecure.db")
    print("="*60)
    
    # 1. Users
    users = db.query(models.User).all()
    print(f"\n👤 USERS ({len(users)})")
    print("-" * 60)
    print(f"{'ID':<5} {'Email':<30} {'Verified':<10} {'Role/Plan'}")
    print("-" * 60)
    for u in users:
        print(f"{u.id:<5} {u.email:<30} {str(u.verified):<10} Free")
    
    # 2. Scans
    scans = db.query(models.Scan).all()
    print(f"\n🔍 SCANS ({len(scans)})")
    print("-" * 60)
    print(f"{'ID':<5} {'User ID':<8} {'Type':<6} {'Verdict':<12} {'Filename'}")
    print("-" * 60)
    for s in scans:
        print(f"{s.id:<5} {s.user_id:<8} {s.file_type:<6} {s.verdict:<12} {s.filename}")
    
    print("\n" + "="*60)
    db.close()

if __name__ == "__main__":
    view_database()
