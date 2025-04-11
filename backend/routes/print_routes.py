# print_routes.py
from app import app

with app.app_context():
    print("📍 Registered Flask Routes:")
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        print(f"{rule.endpoint:30s} | {methods:20s} | {rule.rule}")
