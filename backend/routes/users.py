from flask import Blueprint, jsonify
from models.doctor import Doctor
from models.parent import Parent
from models.patient import Patient
from flask import request
from models.token import DeviceToken
from db import db
from models.admin import Admin


users_bp = Blueprint('users', __name__)

@users_bp.route('/register-token', methods=['POST'])
def register_device_token():
    data = request.get_json()
    token = data.get("token")
    patient_id = data.get("patient_id")

    if not token or not patient_id:
        return {"error": "Missing token or patient_id"}, 400

    # מחיקה של טוקנים ישנים עבור אותו מטופל (שמירה על אחד)
    DeviceToken.query.filter_by(patient_id=patient_id).delete()
    
    new_token = DeviceToken(token=token, patient_id=patient_id)
    db.session.add(new_token)
    db.session.commit()

    return {"message": "Token registered successfully"}
# בקובץ users.py
@users_bp.route('/user-role/<email>', methods=['GET'])
def get_user_role(email):
    email = email.lower()
    if (admin := Admin.query.filter_by(email=email).first()):
        return jsonify({"role": "admin", "full_name": admin.full_name})
    elif (doctor := Doctor.query.filter_by(email=email).first()):
        return jsonify({"role": "doctor", "full_name": doctor.full_name})
    elif (parent := Parent.query.filter_by(email=email).first()):
        return jsonify({"role": "parent", "full_name": parent.full_name})
    elif (patient := Patient.query.filter_by(email=email).first()):
        return jsonify({
            "role": "patient",
            "full_name": patient.full_name,
            "patient": patient.serialize()
        })
    else:
        return jsonify({"role": "unknown"})
