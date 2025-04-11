from flask import Blueprint, request, jsonify
from models import Task
from db import db
from datetime import datetime, timedelta, date

tasks_bp = Blueprint('tasks_bp', __name__)
print("✅ tasks.py LOADED")

@tasks_bp.route('/<int:task_id>', methods=['PATCH', 'OPTIONS'])
def update_task(task_id):
    if request.method == 'OPTIONS':
        return '', 200  # ← preflight support

    print(f"🟢 Received PATCH for task {task_id}")
    task = Task.query.get_or_404(task_id)
    data = request.json

    # עידכון שדות תשובה יומית
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

    # עידכון שדות כלליים נוספים (לעריכת משימה)
    if 'description' in data:
        task.description = data['description']
    if 'due_date' in data:
        task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
    if 'target_date' in data:
        task.target_date = datetime.strptime(data['target_date'], '%Y-%m-%d').date()

    db.session.commit()
    return jsonify(task.serialize()), 200

@tasks_bp.route('/bulk', methods=['POST'])
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
        task = Task.query.filter_by(patient_id=patient_id, date=date).first()
        if task:
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

@tasks_bp.route('/replace-from-date', methods=['POST', 'OPTIONS'])
def replace_tasks_from_date():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    patient_id = data.get('patient_id')
    description = data.get('description')
    start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
    end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()

    if not all([patient_id, description, start_date, end_date]):
        return jsonify({"error": "Missing fields"}), 400

    today = date.today()
    Task.query.filter(
        Task.patient_id == patient_id,
        Task.date > today
    ).delete(synchronize_session=False)

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

@tasks_bp.route('/patients/<int:patient_id>/tasks', methods=['GET'])
def get_tasks_for_patient_by_id(patient_id):
    days = int(request.args.get('days', 30))
    cutoff = datetime.utcnow().date() - timedelta(days=days)

    tasks = Task.query.filter(
        Task.patient_id == patient_id,
        Task.date >= cutoff
    ).order_by(Task.date.desc()).all()

    return jsonify([t.serialize() for t in tasks])
@tasks_bp.route('/update-today', methods=['POST', 'OPTIONS'])
def update_today_task():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    patient_id = data.get('patient_id')

    # ⬅️ כאן השינוי המרכזי:
    task_date_str = data.get('task_date')
    task_date = date.today()
    if task_date_str:
        try:
            task_date = datetime.strptime(task_date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400

    task = Task.query.filter_by(patient_id=patient_id, date=task_date).first()
    if not task:
        return jsonify({'error': 'No task found for this date'}), 404

    task.completed = data.get('completed', task.completed)
    task.reason_not_completed = data.get('reason_not_completed', task.reason_not_completed)
    task.allergy_reaction = data.get('allergy_reaction', task.allergy_reaction)
    task.notes = data.get('notes', task.notes)

    db.session.commit()
    return jsonify(task.serialize()), 200

@tasks_bp.route('/debug-route', methods=['POST', 'OPTIONS'])
def debug_route():
    print("✅ debug-route called", request.method)
    return jsonify({'ok': True})
