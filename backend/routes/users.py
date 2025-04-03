from flask import Blueprint, jsonify
from models.models import Parent, Patient

users_bp = Blueprint('users', __name__)

@users_bp.route('/user-role/<email>', methods=['GET'])
def get_user_role(email):
    parent = Parent.query.filter_by(email=email).first()
    if parent:
        return jsonify({'role': 'parent'})

    patient = Patient.query.filter_by(email=email).first()
    if patient:
        return jsonify({'role': 'patient'})

    return jsonify({'role': 'unknown'}), 404
