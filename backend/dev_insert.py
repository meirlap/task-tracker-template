from app import app
from db import db
from models.models import Doctor, Parent, Patient, Task
from datetime import date, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    # 👨‍⚕️ רופאים
    doctor1 = Doctor(name="ד\"ר ראובן שפירא", email="jlm.tech.solution.ml@gmail.com")
    doctor2 = Doctor(name="ד\"ר משה לוין", email="second.doctor@example.com")
    db.session.add_all([doctor1, doctor2])
    db.session.commit()

    # 👨‍👩‍ הורים
    parent1 = Parent(name="אמונה לפיד", email="emunalapid@gmail.com")
    parent2 = Parent(name="מאיר לפיד", email="meirlapid@gmail.com")
    parent3 = Parent(name="הודיה אברהם", email="parent3@example.com")
    parent4 = Parent(name="נתנאל בורוכוב", email="parent4@example.com")
    db.session.add_all([parent1, parent2, parent3, parent4])
    db.session.commit()

    # שליפת ישויות לפי מייל לזיהוי אמין
    doctor1 = Doctor.query.filter_by(email="jlm.tech.solution.ml@gmail.com").first()
    doctor2 = Doctor.query.filter_by(email="second.doctor@example.com").first()
    parent1 = Parent.query.filter_by(email="emunalapid@gmail.com").first()
    parent2 = Parent.query.filter_by(email="meirlapid@gmail.com").first()
    parent3 = Parent.query.filter_by(email="parent3@example.com").first()
    parent4 = Parent.query.filter_by(email="parent4@example.com").first()

    # 🧒 מטופלים עם שיוך תקני לפי מייל
    patients = [
        Patient(name="יעל לפיד", israeli_id="123456781", parent=parent1, doctor=doctor1),
        Patient(name="אורי לפיד", israeli_id="123456782", parent=parent1, doctor=doctor1),
        Patient(name="תמר לפיד", israeli_id="123456783", parent=parent1, doctor=doctor1),

        Patient(name="אליהו לפיד", israeli_id="123456784", parent=parent2, doctor=doctor1),
        Patient(name="רוני לפיד", israeli_id="123456785", parent=parent2, doctor=doctor1),
        Patient(name="דני לפיד", israeli_id="123456786", parent=parent2, doctor=doctor1),

        Patient(name="יונתן אברהם", israeli_id="123456787", parent=parent3, doctor=doctor2),
        Patient(name="שרה בורוכוב", israeli_id="123456788", parent=parent4, doctor=doctor2),

        Patient(name="אליה לפיד", israeli_id="123456789", email="eliyalapid@gmail.com", doctor=doctor1),
        Patient(name="עומר דמה", israeli_id="123456790", email="dummy1@example.com", doctor=doctor2),
        Patient(name="רוני דמה", israeli_id="123456791", email="dummy2@example.com", doctor=doctor2),
    ]

    db.session.add_all(patients)
    db.session.commit()
    # 📆 משימות להיום, 3 ימים אחורה ו־7 ימים קדימה (סה"כ 11 ימים)
    def add_tasks(patient):
        for offset in range(-3, 8):  # -3 עד +7 כולל היום
            task_date = date.today() + timedelta(days=offset)
            is_completed = offset < 0  # רק משימות מהעבר מסומנות כבוצעות
            task = Task(
                patient=patient,
                date=task_date,
                description=f"משימה לתאריך {task_date} עבור {patient.name}",
                completed=is_completed,
                allergy_reaction=4 if is_completed else None,
                reason_not_completed=None if is_completed else "",
                notes="הוזן על ידי dev_insert"
            )
            db.session.add(task)


    for patient in patients:
        add_tasks(patient)

    db.session.commit()

    for task in Task.query.all():
        print(f"✅ Task ID: {task.id} | {task.description} | Patient: {task.patient.name} | Completed: {task.completed}")

    print("✅ DB seeded successfully.")
