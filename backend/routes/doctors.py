from flask import Blueprint, jsonify, request
from db import db
from models import Doctor, Patient, Task
from datetime import datetime, timedelta

doctors_bp = Blueprint('doctors', __name__, url_prefix='/api/doctors')

@doctors_bp.route('/<path:email>/patients', methods=['GET'])
def get_doctor_patients_by_email(email):
    doctor = Doctor.query.filter_by(email=email.lower()).first_or_404()
    patients_data = []
    for p in doctor.patients:
        parent = p.parents[0] if p.parents else None
        patients_data.append({
            "id": p.id,
            "name": p.full_name,
            "israeli_id": p.israeli_id,
            "email": p.email,
            "parent_name": parent.full_name if parent else None,
            "parent_email": parent.email if parent else None
        })
    return jsonify(patients_data)

@doctors_bp.route('/<path:email>/patients', methods=['POST'])
def add_patient_to_doctor_by_email(email):
    doctor = Doctor.query.filter_by(email=email.lower()).first_or_404()
    data = request.json
    name = data.get("name")
    israeli_id = data.get("israeli_id")
    email_patient = data.get("email")
    if not name or not israeli_id or not email_patient:
        return jsonify({"error": "Missing required fields"}), 400
    new_patient = Patient(full_name=name, israeli_id=israeli_id, email=email_patient, doctor=doctor)
    db.session.add(new_patient)
    db.session.commit()
    return jsonify(new_patient.serialize()), 201

@doctors_bp.route('/<path:email>/patients-tasks', methods=['GET'])
def get_patients_tasks_by_email(email):
    days = int(request.args.get('days', 10))
    cutoff = datetime.utcnow().date() - timedelta(days=days)
    doctor = Doctor.query.filter_by(email=email.lower()).first_or_404()
    result = []
    for patient in doctor.patients:
        patient_tasks = Task.query.filter(
            Task.patient_id == patient.id,
            Task.date >= cutoff
        ).order_by(Task.date.desc()).all()
        result.append({
            "patient": {
                "id": patient.id,
                "name": patient.full_name,
                "israeli_id": patient.israeli_id,
                "parents": [p.serialize() for p in patient.parents],
                "email": patient.email
            },
            "tasks": [t.serialize() for t in patient_tasks]
        })
    return jsonify(result)

@doctors_bp.route('/patient/<int:patient_id>', methods=['PUT', 'PATCH'])
def update_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    data = request.json
    patient.full_name = data.get("name", patient.full_name)
    patient.israeli_id = data.get("israeli_id", patient.israeli_id)
    patient.email = data.get("email", patient.email)
    db.session.commit()
    return jsonify(patient.serialize())

@doctors_bp.route('/patient/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": "Patient deleted"})

@doctors_bp.route('', methods=['GET'])
def get_all_doctors():
    doctors = Doctor.query.order_by(Doctor.full_name).all()
    return jsonify([{"id": d.id, "full_name": d.full_name, "email": d.email} for d in doctors])

@doctors_bp.route('', methods=['POST'])
def create_doctor():
    data = request.json
    full_name = data.get('full_name')
    email = data.get('email')
    if not full_name or not email:
        return jsonify({"error": "Missing full_name or email"}), 400
    existing = Doctor.query.filter_by(email=email.lower()).first()
    if existing:
        return jsonify({"error": "Doctor already exists"}), 400
    new_doctor = Doctor(full_name=full_name, email=email.lower())
    db.session.add(new_doctor)
    db.session.commit()
    return jsonify(new_doctor.serialize()), 201
@doctors_bp.route('/<int:doctor_id>', methods=['PATCH'])
def update_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    data = request.json
    doctor.full_name = data.get("full_name", doctor.full_name)
    doctor.email = data.get("email", doctor.email)
    db.session.commit()
    return jsonify(doctor.serialize())

@doctors_bp.route('/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    doctor = Doctor.query.get_or_404(doctor_id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor deleted"})
