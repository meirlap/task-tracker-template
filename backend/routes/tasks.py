from flask import Blueprint, request, jsonify
from models import Task
from db import db
from datetime import datetime, timedelta, date

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

    return jsonify([t.serialize() for t in tasks])

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


@tasks_bp.route('/tasks/bulk', methods=['POST'])
def create_bulk_tasks():
    data = request.get_json()
    patient_id = data.get('patient_id')
    description = data.get('description')
    start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
    end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()

    if not all([patient_id, description, start_date, end_date]):
        return jsonify({"error": "Missing required fields"}), 400

    if end_date < start_date:
        return jsonify({"error": "End date must be after start date"}), 400

    delta = (end_date - start_date).days + 1
    updated_tasks = []

    for i in range(delta):
        date = start_date + timedelta(days=i)

        # בדוק אם כבר קיימת משימה בתאריך הזה
        task = Task.query.filter_by(patient_id=patient_id, date=date).first()
        if task:
            # עדכן את התיאור ואפס את שדות הביצוע
            task.description = description
            task.completed = False
            task.reason_not_completed = None
            task.notes = None
            task.allergy_reaction = None
        else:
            task = Task(
                patient_id=patient_id,
                date=date,
                description=description,
                completed=False
            )
            db.session.add(task)

        updated_tasks.append(task)

    db.session.commit()
    return jsonify([t.serialize() for t in updated_tasks]), 200
@tasks_bp.route('/tasks/replace-from-date', methods=['POST'])
def replace_tasks_from_date():
    data = request.get_json()
    patient_id = data.get('patient_id')
    description = data.get('description')
    start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
    end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()

    if not all([patient_id, description, start_date, end_date]):
        return jsonify({"error": "Missing fields"}), 400

    # 🧹 מחיקת כל הטאסקים מהיום ואילך
    cutoff_date = date.today() - timedelta(days=1)
    Task.query.filter(
        Task.patient_id == patient_id,
        Task.date > cutoff_date
    ).delete(synchronize_session=False)

    # 🆕 יצירה מחדש
    delta = (end_date - start_date).days + 1
    new_tasks = []
    for i in range(delta):
        d = start_date + timedelta(days=i)
        task = Task(
            patient_id=patient_id,
            date=d,
            description=description,
            completed=False
        )
        db.session.add(task)
        new_tasks.append(task)

    db.session.commit()
    return jsonify([t.serialize() for t in new_tasks]), 201
