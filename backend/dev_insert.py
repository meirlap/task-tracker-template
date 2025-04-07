from app import app
from db import db
from models.doctor import Doctor
from models.parent import Parent
from models.patient import Patient
from models.task import Task
from datetime import date, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    # יצירת רופאים
    doctor1 = Doctor(full_name="ד\"ר ראובן שפירא", email="jlm.tech.solution.ml@gmail.com")
    doctor2 = Doctor(full_name="ד\"ר משה לוין", email="second.doctor@example.com")
    db.session.add_all([doctor1, doctor2])
    db.session.commit()

    # יצירת הורים
    parent1 = Parent(full_name="אמונה לפיד", email="emunalapid@gmail.com")
    parent2 = Parent(full_name="מאיר לפיד", email="meirlapid@gmail.com")
    db.session.add_all([parent1, parent2])
    db.session.commit()

    # יצירת מטופלים - 3 ילדים משותפים לשני ההורים
    p1 = Patient(full_name="יעל לפיד", israeli_id="123456781", doctor=doctor1)
    p2 = Patient(full_name="אורי לפיד", israeli_id="123456782", doctor=doctor1)
    p3 = Patient(full_name="תמר לפיד", israeli_id="123456783", doctor=doctor1)
    for p in [p1, p2, p3]:
        p.parents.extend([parent1, parent2])

    # מטופל עצמאי
    p4 = Patient(full_name="אליה לפיד", israeli_id="123456784", email="eliyalapid@gmail.com", doctor=doctor1)

    db.session.add_all([p1, p2, p3, p4])
    db.session.commit()

    # הזרקת משימות ל־7 ימים אחורה וקדימה לכל מטופל
    all_patients = [p1, p2, p3, p4]
    for patient in all_patients:
        for i in range(-3, 4):
            task = Task(
                patient_id=patient.id,
                date=date.today() + timedelta(days=i),
                description=f"משימה ליום {date.today() + timedelta(days=i)}",
                completed=False
            )
            db.session.add(task)

    db.session.commit()
    print("✅ נתונים הוזרקו בהצלחה")
