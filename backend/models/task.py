from db import db

class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(250), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    reason_not_completed = db.Column(db.String(250), nullable=True)
    allergy_reaction = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "description": self.description,
            "completed": self.completed,
            "reason_not_completed": self.reason_not_completed,
            "allergy_reaction": self.allergy_reaction,
            "notes": self.notes
        }
