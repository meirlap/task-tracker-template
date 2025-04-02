from flask import Blueprint, jsonify
from models.models import Parent, Patient, Task
from datetime import datetime, timedelta

parents_bp = Blueprint('parents', __name__, url_prefix='/api/parent')


@parents_bp.route('/<string:parent_email>/children-tasks', methods=['GET'])
def get_children_tasks(parent_email):
    days = 10
    cutoff = datetime.utcnow().date() - timedelta(days=days)

    parent = Parent.query.filter_by(email=parent_email).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404

    result = []
    for child in parent.children:
        child_tasks = Task.query.filter(
            Task.patient_id == child.id,
            Task.date >= cutoff
        ).order_by(Task.date.desc()).all()

        result.append({
            "patient": child.serialize(),
            "tasks": [t.serialize() for t in child_tasks]
        })

    return jsonify(result)
