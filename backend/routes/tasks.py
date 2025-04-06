from flask import Blueprint, request, jsonify
from models import Task
from db import db
from datetime import datetime, timedelta

tasks_bp = Blueprint('tasks_bp', __name__)


@tasks_bp.route('/<int:patient_id>', methods=['GET'])
def get_tasks_for_patient(patient_id):
    # פרמטר מספר ימים – ברירת מחדל 10
    days = int(request.args.get('days', 10))
    cutoff = datetime.utcnow().date() - timedelta(days=days)

    tasks = Task.query.filter(
        Task.patient_id == patient_id,
        Task.date >= cutoff
    ).order_by(Task.date.desc()).all()

    return jsonify([t.serialize() for t in tasks])@tasks_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
@tasks_bp.route('/tasks/<int:task_id>', methods=['PATCH', 'OPTIONS'])
def update_task(task_id):
    if request.method == 'OPTIONS':
        return '', 200  # ← preflight support

    print(f"🟢 Received PATCH for task {task_id}")
    task = Task.query.get_or_404(task_id)
    data = request.json

    if 'completed' in data:
        raw_value = data['completed']
        task.completed = str(raw_value).lower() == 'true' or raw_value is True

        if not task.completed:
            task.reason_not_completed = data.get('reason_not_completed', '')
            task.allergy_reaction = None
        else:
            task.reason_not_completed = None
            task.allergy_reaction = data.get('allergy_reaction', 0)

    if 'allergy_reaction' in data:
        task.allergy_reaction = data['allergy_reaction']

    if 'notes' in data:
        task.notes = data['notes']

    db.session.commit()
    return jsonify(task.serialize()), 200


