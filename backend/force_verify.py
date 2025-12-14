from database import SessionLocal
import models
db = SessionLocal()
user = db.query(models.User).filter(models.User.email == "udit7852@gmail.com").first()
if user:
    user.verified = True
    db.commit()
    print("User verified!")
else:
    print("User not found via script")
db.close()
