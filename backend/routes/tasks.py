from flask import Blueprint, request, jsonify
from models.models import Task
from db import db
from datetime import datetime, timedelta

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')


@tasks_bp.route('/<int:patient_id>', methods=['GET'])
def get_tasks_for_patient(patient_id):
    # פרמטר מספר ימים – ברירת מחדל 10
    days = int(request.args.get('days', 10))
    cutoff = datetime.utcnow().date() - timedelta(days=days)

    tasks = Task.query.filter(
        Task.patient_id == patient_id,
        Task.date >= cutoff
    ).order_by(Task.date.desc()).all()

    return jsonify([t.serialize() for t in tasks])
