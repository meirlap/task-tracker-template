from flask import Flask
from flask_cors import CORS
from db import db
from routes.tasks import tasks_bp
from routes.doctors import doctors_bp
from routes.parents import parents_bp
from routes.users import users_bp  # ✅ חדש

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# 📌 הרשמת כל ה־blueprints עם prefix אחיד
app.register_blueprint(tasks_bp, url_prefix='/api')
app.register_blueprint(doctors_bp, url_prefix='/api')
app.register_blueprint(parents_bp, url_prefix='/api/parent')
app.register_blueprint(users_bp, url_prefix='/api')  # ✅ חדש

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
