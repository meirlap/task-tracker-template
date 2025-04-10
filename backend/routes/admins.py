from flask import Blueprint, request, jsonify
from models.admin import Admin
from models.doctor import Doctor
from db import db

admins_bp = Blueprint("admins", __name__)

@admins_bp.route("/", methods=["GET"])
def get_all_admins():
    admins = Admin.query.all()
    return jsonify([a.serialize() for a in admins])

@admins_bp.route("/add-admin", methods=["POST"])
def add_admin():
    data = request.json
    name = data.get("full_name")
    email = data.get("email")
    if not name or not email:
        return jsonify({"error": "Missing name or email"}), 400
    new_admin = Admin(full_name=name, email=email.lower())
    db.session.add(new_admin)
    db.session.commit()
    return jsonify(new_admin.serialize()), 201

@admins_bp.route("/add-doctor", methods=["POST"])
def add_doctor():
    data = request.json
    name = data.get("full_name")
    email = data.get("email")
    if not name or not email:
        return jsonify({"error": "Missing name or email"}), 400
    new_doctor = Doctor(full_name=name, email=email.lower())
    db.session.add(new_doctor)
    db.session.commit()
    return jsonify(new_doctor.serialize()), 201
@admins_bp.route('/<int:admin_id>', methods=['PATCH'])
def update_admin(admin_id):
    admin = Admin.query.get_or_404(admin_id)
    data = request.json
    admin.full_name = data.get("full_name", admin.full_name)
    admin.email = data.get("email", admin.email)
    db.session.commit()
    return jsonify(admin.serialize())

@admins_bp.route('/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    admin = Admin.query.get_or_404(admin_id)
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"message": "Admin deleted"})
