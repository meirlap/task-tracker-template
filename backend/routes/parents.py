from flask import Blueprint, jsonify
from models.models import Parent, Patient, Task
from db import db

parents_bp = Blueprint('parents', __name__)

@parents_bp.route("/<string:parent_email>/children-tasks", methods=["GET"])
def get_children_and_tasks(parent_email):
    parent = Parent.query.filter_by(email=parent_email).first()
    if not parent:
        return jsonify({"error": "Parent not found"}), 404

    children = Patient.query.filter_by(parent_id=parent.id).all()
    print(children)

    result = []
    for child in children:
        tasks = Task.query.filter_by(patient_id=child.id).order_by(Task.date.desc()).all()
        result.append({
            "id": child.id,
            "name": child.name,
            "israeli_id": child.israeli_id,
            "tasks": [t.serialize() for t in tasks]
        })

    return jsonify(result)
