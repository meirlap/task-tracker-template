from flask import Blueprint, jsonify
from models.doctor import Doctor
from models.parent import Parent
from models.patient import Patient

users_bp = Blueprint('users', __name__)

# בקובץ users.py
@users_bp.route('/user-role/<email>', methods=['GET'])
def get_user_role(email):
    email = email.lower()
    if (doctor := Doctor.query.filter_by(email=email).first()):
        return jsonify({"role": "doctor", "full_name": doctor.full_name})
    elif (parent := Parent.query.filter_by(email=email).first()):
        return jsonify({"role": "parent", "full_name": parent.full_name})
    elif (patient := Patient.query.filter_by(email=email).first()):
        return jsonify({"role": "patient", "full_name": patient.full_name})
    else:
        return jsonify({"role": "unknown"})

