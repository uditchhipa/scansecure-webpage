from database import SessionLocal, engine
from models import Base
import models

print("Testing Database Connection...")
try:
    Base.metadata.create_all(bind=engine)
    print("Tables Created Successfully.")
    
    db = SessionLocal()
    print("Session Created.")
    db.close()
    print("DB Check Complete.")
except Exception as e:
    print(f"DB INITIALIZATION ERROR: {e}")
