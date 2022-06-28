import os
from flask import Flask

app = Flask(__name__)
base_dir = os.path.abspath(os.path.dirname(__file__))

from app import routes