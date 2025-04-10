from app import app
from db import db
from models.doctor import Doctor
from models.parent import Parent
from models.patient import Patient
from models.task import Task
from models.admin import Admin  # ✅ חדש
from datetime import date, timedelta
import random

with app.app_context():
    db.drop_all()
    db.create_all()

    # ✅ אדמין מערכת
    admin = Admin(full_name="Irina Cherbakov", email="irinacherbakov@gmail.com")
    db.session.add(admin)

    # רופאים
    doctor1 = Doctor(full_name="ד\"ר ראובן שפירא", email="jlm.tech.solution.ml@gmail.com")
    doctor2 = Doctor(full_name="ד\"ר משה לוין", email="second.doctor@example.com")
    db.session.add_all([doctor1, doctor2])
    db.session.commit()

    # הורים
    parent1 = Parent(full_name="אמונה לפיד", email="emunalapid@gmail.com")
    parent2 = Parent(full_name="מאיר לפיד", email="meirlapid@gmail.com")
    db.session.add_all([parent1, parent2])
    db.session.commit()

    # מטופלים
    p1 = Patient(full_name="יעל לפיד", israeli_id="123456781", doctor=doctor1)
    p2 = Patient(full_name="אורי לפיד", israeli_id="123456782", doctor=doctor1)
    p3 = Patient(full_name="תמר לפיד", israeli_id="123456783", doctor=doctor1)
    for p in [p1, p2, p3]:
        p.parents.extend([parent1, parent2])

    p4 = Patient(full_name="אליה לפיד", israeli_id="123456784", email="eliyalapid@gmail.com", doctor=doctor1)

    db.session.add_all([p1, p2, p3, p4])
    db.session.commit()

    all_patients = [p1, p2, p3, p4]
    valid_reasons = ["שכחה", "מחסור ברכיב", "מחלה", "אחר"]

    for patient in all_patients:
        # 10 ימים אחורה עם ערכים משתנים
        for i in range(1, 11):
            d = date.today() - timedelta(days=i)
            completed = random.choice([True, False])
            task = Task(
                patient_id=patient.id,
                date=d,
                description=f"משימה ל-{d.isoformat()}",
                completed=completed
            )

            if completed:
                task.allergy_reaction = random.choice([0, 1, 2, 3])
                task.notes = f"הערה לדוגמה {i}"
            else:
                task.reason_not_completed = random.choice(valid_reasons)

            db.session.add(task)

        # 10 ימים קדימה
        for i in range(0, 10):
            d = date.today() + timedelta(days=i)
            task = Task(
                patient_id=patient.id,
                date=d,
                description=f"משימה עתידית ל-{d.isoformat()}",
                completed=False
            )
            db.session.add(task)

    db.session.commit()
    print("✅ בסיס הנתונים הוכן והוזרק בהצלחה 🎉")
