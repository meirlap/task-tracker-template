import os
from dotenv import load_dotenv

load_dotenv()

FCM_SERVER_KEY = os.getenv("FCM_SERVER_KEY")
