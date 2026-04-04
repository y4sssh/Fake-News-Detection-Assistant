from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import bcrypt

jwt = JWTManager()

def init_auth(app):
    app.config['JWT_SECRET_KEY'] = app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-in-env')
    jwt.init_app(app)

users_collection = None

def init_db(client):
    global users_collection
    db = client[app.config.get('MONGO_DB_NAME', 'fake_news_ai')]
    users_collection = db['users']

def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({
        'email': email,
        'password': hashed
    })

    return jsonify({'message': 'User created successfully'})

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)


def require_auth(f):
    @jwt_required()
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated

