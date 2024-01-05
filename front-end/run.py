from flask import Flask,jsonify, request
from flask_cors import CORS
from flask import Blueprint
from flask import render_template

app = Flask(__name__, template_folder='template')
cors = CORS(app)

frontend_app = Blueprint('frontend_app', __name__)
CORS(frontend_app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')



if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8080,debug=True)