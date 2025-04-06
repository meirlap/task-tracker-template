from db import db

class DeviceToken(db.Model):
    __tablename__ = 'device_tokens'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    token = db.Column(db.String(256), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "token": self.token
        }
