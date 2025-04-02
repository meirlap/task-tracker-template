from db import db
from datetime import date

class Doctor(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    patients = db.relationship('Patient', backref='doctor', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Parent(db.Model):
    __tablename__ = 'parents'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    children = db.relationship('Patient', backref='parent', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_super = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_super": self.is_super
        }


class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    israeli_id = db.Column(db.String(9), unique=True, nullable=False)  # ת"ז
    email = db.Column(db.String(120), unique=True, nullable=True)      # רק אם עצמאי
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=True)

    tasks = db.relationship('Task', backref='patient', lazy=True)
    tokens = db.relationship('DeviceToken', backref='patient', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "israeli_id": self.israeli_id,
            "email": self.email,
            "parent_id": self.parent_id,
            "doctor_id": self.doctor_id
        }


class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    date = db.Column(db.Date, default=date.today, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "date": self.date.isoformat(),
            "description": self.description,
            "completed": self.completed
        }


class DeviceToken(db.Model):
    __tablename__ = 'device_tokens'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    token = db.Column(db.String(256), nullable=False)
    platform = db.Column(db.String(20))  # android / ios / web
    last_updated = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "token": self.token,
            "platform": self.platform,
            "last_updated": self.last_updated.isoformat()
        }
