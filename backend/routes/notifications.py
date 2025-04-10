import firebase_admin
from firebase_admin import credentials, messaging
from flask import Blueprint
from models.token import DeviceToken
from models.patient import Patient
from models.task import Task
from datetime import date

notifications_bp = Blueprint("notifications", __name__)

# ✅ אתחול ה־Firebase Admin SDK רק פעם אחת
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("credentials/firebase-admin-key.json")
    firebase_admin.initialize_app(cred)


def send_fcm(to_token, title, body):
    message = messaging.Message(
        token=to_token,
        notification=messaging.Notification(
            title=title,
            body=body
        )
    )
    try:
        response = messaging.send(message)
        print(f"📤 Push sent to {to_token[:10]}... → ✅ {response}")
    except Exception as e:
        print(f"❌ Failed to send to {to_token[:10]}... → {e}")


@notifications_bp.route('/send-daily-pushes', methods=["POST"])
def send_daily_pushes():
    today = date.today()
    tokens = DeviceToken.query.all()
    sent_count = 0

    for token in tokens:
        patient = Patient.query.get(token.patient_id)
        if not patient:
            continue

        # משימת היום
        today_task = Task.query.filter_by(patient_id=patient.id, date=today).first()

        if not today_task or today_task.completed:
            continue

        if patient.parents:
            send_fcm(token.token, "מעקב משימות", f"הילד {patient.full_name} עדיין לא השלים את המשימה של היום")
        else:
            send_fcm(token.token, "תזכורת למשימה", "זכור להשלים את המשימה שלך להיום")

        sent_count += 1

    return {"message": f"✔️ Sent {sent_count} push notifications"}, 200
