from db import db

parent_patient = db.Table(
    'parent_patient',
    db.Column('parent_id', db.Integer, db.ForeignKey('parents.id')),
    db.Column('patient_id', db.Integer, db.ForeignKey('patients.id'))
)

class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    israeli_id = db.Column(db.String(9), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True)

    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    doctor = db.relationship("Doctor", back_populates="patients")

    parents = db.relationship("Parent", secondary=parent_patient, back_populates="patients")
    tasks = db.relationship("Task", backref="patient", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "israeli_id": self.israeli_id,
            "email": self.email,
            "doctor_id": self.doctor_id,
            "parents": [p.serialize() for p in self.parents]
        }
