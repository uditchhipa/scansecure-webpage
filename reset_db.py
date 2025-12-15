from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from backend import models

# Connect to DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./scansecure.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def reset_database():
    print("WARNING: Deleting ALL Users and Scans...")
    
    try:
        # Delete Scans first due to Foreign Key
        deleted_scans = db.query(models.Scan).delete()
        print(f"Deleted {deleted_scans} Scans.")
        
        # Delete Users
        deleted_users = db.query(models.User).delete()
        print(f"Deleted {deleted_users} Users.")
        
        db.commit()
        print("✅ Database Reset Successfully.")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
