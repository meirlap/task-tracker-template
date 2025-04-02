from app import app
from db import db
from models.models import Doctor, Parent, Patient, Task
from datetime import date, timedelta

with app.app_context():
    db.drop_all()
    db.create_all()

    # 👨‍⚕️ רופא ראשי
    doctor1 = Doctor(name="ד\"ר ראובן שפירא", email="jlm.tech.solution.ml@gmail.com")
    # 👨‍⚕️ רופא נוסף
    doctor2 = Doctor(name="ד\"ר משה לוין", email="second.doctor@example.com")
    db.session.add_all([doctor1, doctor2])
    db.session.commit()

    # 👩‍👧 הורה 1 - אמונה
    parent1 = Parent(name="אמונה לפיד", email="emunalapid@gmail.com")
    # 👨‍👧 הורה 2 - מאיר
    parent2 = Parent(name="מאיר לפיד", email="meirlapid@gmail.com")
    # 👩‍👦 הורה 3
    parent3 = Parent(name="הודיה אברהם", email="parent3@example.com")
    # 👨‍👧 הורה 4
    parent4 = Parent(name="נתנאל בורוכוב", email="parent4@example.com")

    db.session.add_all([parent1, parent2, parent3, parent4])
    db.session.commit()

    # 🧒 ילדים של הורה 1
    p1 = Patient(name="יעל לפיד", israeli_id="123456781", parent=parent1, doctor=doctor1)
    p2 = Patient(name="אורי לפיד", israeli_id="123456782", parent=parent1, doctor=doctor1)
    p3 = Patient(name="תמר לפיד", israeli_id="123456783", parent=parent1, doctor=doctor1)

    # 🧒 ילדים של הורה 2
    p4 = Patient(name="אליהו לפיד", israeli_id="123456784", parent=parent2, doctor=doctor1)
    p5 = Patient(name="רוני לפיד", israeli_id="123456785", parent=parent2, doctor=doctor1)
    p6 = Patient(name="דני לפיד", israeli_id="123456786", parent=parent2, doctor=doctor1)

    # 🧒 ילד של הורה 3
    p7 = Patient(name="יונתן אברהם", israeli_id="123456787", parent=parent3, doctor=doctor2)
    # 🧒 ילד של הורה 4
    p8 = Patient(name="שרה בורוכוב", israeli_id="123456788", parent=parent4, doctor=doctor2)

    # 🧍‍♂️ מטופל עצמאי
    p9 = Patient(name="אליה לפיד", israeli_id="123456789", email="eliyalapid@gmail.com", doctor=doctor1)
    # 🧍 מטופלי דמה
    p10 = Patient(name="עומר דמה", israeli_id="123456790", email="dummy1@example.com", doctor=doctor2)
    p11 = Patient(name="רוני דמה", israeli_id="123456791", email="dummy2@example.com", doctor=doctor2)

    all_patients = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11]
    db.session.add_all(all_patients)
    db.session.commit()

    # 📆 הוספת משימות ל־3 ימים אחרונים
    def add_tasks(patient):
        for i in range(3):
            task = Task(
                patient=patient,
                date=date.today() - timedelta(days=i),
                description=f"משימה {i+1} עבור {patient.name}",
                completed=(i % 2 == 0)
            )
            db.session.add(task)

    for patient in all_patients:
        add_tasks(patient)

    db.session.commit()
    print("✅ DONE: doctors, parents, patients, tasks.")
