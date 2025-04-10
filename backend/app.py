from flask import Flask
from flask_cors import CORS
from db import db
from routes.tasks import tasks_bp
from routes.doctors import doctors_bp
from routes.parents import parents_bp
from routes.users import users_bp
from routes.notifications import notifications_bp  
from routes.admins import admins_bp

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# הרשמת Blueprints עם פרפיקסים אחידים
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
app.register_blueprint(parents_bp, url_prefix='/api/parents')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
app.register_blueprint(admins_bp, url_prefix='/api/admins')

def schedule_daily_pushes():
    from routes.notifications import send_daily_pushes
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_daily_pushes, 'cron', hour=20, minute=0)
    scheduler.start()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        schedule_daily_pushes()
    app.run(debug=True)
