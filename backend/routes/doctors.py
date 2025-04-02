from flask import Blueprint, jsonify, request
from models.models import Doctor, Patient, Task
from datetime import datetime, timedelta

doctors_bp = Blueprint('doctors', __name__, url_prefix='/api/doctor')


@doctors_bp.route('/<int:doctor_id>/patients-tasks', methods=['GET'])
def get_patients_tasks(doctor_id):
    days = int(request.args.get('days', 10))
    cutoff = datetime.utcnow().date() - timedelta(days=days)

    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    result = []
    for patient in doctor.patients:
        patient_tasks = Task.query.filter(
            Task.patient_id == patient.id,
            Task.date >= cutoff
        ).order_by(Task.date.desc()).all()

        result.append({
            "patient": {
                "id": patient.id,
                "name": patient.name
            },
            "tasks": [t.serialize() for t in patient_tasks]
        })

    return jsonify(result)
