from datetime import date, timedelta
from app import app
from db import db
from models.parent import Parent
from models.patient import Patient
from models.task import Task
from models.user import User
from models.doctor import Doctor

with app.app_context():
    db.drop_all()
    db.create_all()

    # 👨‍⚕️ דוקטור
    doctor1 = Doctor(full_name="ד\"ר ראובן שפירא", email="jlm.tech.solution.ml@gmail.com")
    db.session.add(doctor1)

    # 👨👩 הורים
    parent1 = Parent(full_name="אמונה לפיד", email="emunalapid@gmail.com")
    parent2 = Parent(full_name="מאיר לפיד", email="meirlapid@gmail.com")
    db.session.add_all([parent1, parent2])

    # 👶 שלושה מטופלים משותפים לשני ההורים
    p1 = Patient(full_name="יעל לפיד", israeli_id="123456781", doctor=doctor1)
    p2 = Patient(full_name="אורי לפיד", israeli_id="123456782", doctor=doctor1)
    p3 = Patient(full_name="תמר לפיד", israeli_id="123456783", doctor=doctor1)
    for p in [p1, p2, p3]:
        p.parents.extend([parent1, parent2])
    db.session.add_all([p1, p2, p3])

    # 🧍‍♂️ מטופל עצמאי
    p4 = Patient(full_name="אליה לפיד", israeli_id="123456784", email="eliyalapid@gmail.com", doctor=doctor1)
    db.session.add(p4)

    db.session.commit()

    # 📆 משימות ל-7 ימים (כולל היום)
    patients = [p1, p2, p3, p4]
    for patient in patients:
        for offset in range(7):
            task_date = date.today() + timedelta(days=offset)
            task = Task(
                patient=patient,
                date=task_date,
                description=f"נטילת כדור X בוקר עבור {patient.full_name}",
                completed=(offset % 2 == 0),
                allergy_reaction=3 if offset % 2 == 0 else None,
                reason_not_completed="שכחתי" if offset % 2 != 0 else None,
                notes="משימה אוטומטית לדיבוג"
            )
            db.session.add(task)

    # 👥 משתמשים (User) - תואם ל־Google login
    users = [
        User(email="jlm.tech.solution.ml@gmail.com", full_name="ד\"ר ראובן שפירא", role="doctor"),
        User(email="emunalapid@gmail.com", full_name="אמונה לפיד", role="parent"),
        User(email="meirlapid@gmail.com", full_name="מאיר לפיד", role="parent"),
        User(email="eliyalapid@gmail.com", full_name="אליה לפיד", role="patient"),
    ]
    db.session.add_all(users)

    db.session.commit()
    print("✅ Sample data inserted successfully.")
