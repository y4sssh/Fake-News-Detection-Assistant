from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import request, jsonify
import bcrypt
import json
import os
from pathlib import Path

jwt = JWTManager()

# Simple file-based user storage (fallback when MongoDB is not available)
USERS_FILE = Path(__file__).parent / "users.json"

def load_users():
    """Load users from JSON file"""
    if USERS_FILE.exists():
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users):
    """Save users to JSON file"""
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

def init_auth(app):
    app.config['JWT_SECRET_KEY'] = app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-in-env')
    jwt.init_app(app)

def init_db(client, app):
    pass  # Not needed for file-based storage

def register():
    """Register a new user"""
    try:
        data = request.get_json() or {}
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        users = load_users()
        
        if email in users:
            return jsonify({'error': 'User already exists'}), 400

        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users[email] = hashed.decode('utf-8')
        
        save_users(users)
        return jsonify({'message': 'User created successfully', 'email': email}), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

def login():
    """Login a user and return JWT token"""
    try:
        data = request.get_json() or {}
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        users = load_users()
        
        if email not in users:
            return jsonify({'error': 'Invalid credentials'}), 401

        stored_hash = users[email]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
        
        if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=email)
        return jsonify({'access_token': access_token, 'email': email}), 200
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

def require_auth(f):
    """Decorator to require JWT authentication"""
    from functools import wraps
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated

