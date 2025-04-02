from flask import Flask
from flask_cors import CORS
from db import db
from routes.tasks import tasks_bp
from routes.doctors import doctors_bp
from routes.parents import parents_bp

app = Flask(__name__)
CORS(app)

# שימוש ב-PostgreSQL connection string (Render/Railway)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(tasks_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(parents_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
