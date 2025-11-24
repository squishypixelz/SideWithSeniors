from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import bcrypt
from bson.objectid import ObjectId


baseDirectory = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(baseDirectory, ".env"))
print("aa")
app = Flask(__name__)
CORS(app)
DBKEY = os.getenv("DBKEY")
print("retrieved env value")
client = MongoClient(DBKEY, connectTimeoutMS = 30000, socketTimeoutMS = None, connect = False, maxPoolSize = 1)
print("connected to mongo client")
db = client["SWS"]
users = db["credentials"]
opportunities = db["opportunities"]

from urllib.parse import urlparse

@app.route("/health")
def health_check():
    db_uri = os.getenv("DBKEY")
    if not db_uri:
        return {"status": "error", "message": "DBKEY not found in environment"}, 500

    parsed = urlparse(db_uri)
    safe_uri = f"{parsed.scheme}://{parsed.hostname}/{parsed.path.lstrip('/')}"
    
    return {
        "status": "ok",
        "db_uri": safe_uri,
        "connected": test_db_connection()
    }, 200

def test_db_connection():
    try:
        client.server_info() 
        return True
    except Exception as e:
        return str(e)

@app.route("/")
def home():
    return jsonify(message="Hello from Flask!")

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    if users.find_one({"email": email}):
        return jsonify({"success": False, "error": "Email already registered"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users.insert_one({"email": email, "password": hashed_pw.decode("utf-8")})

    return jsonify({"success": True, "message": "User registered successfully"})

@app.route("/api/signin", methods=["POST"])
def signin():
    print("reached signin")
    data = request.get_json()
    print(data)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    user = users.find_one({"email": email})
    if not user:
        return jsonify({"success": False, "error": "Invalid email or password"}), 401

    if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"success": True, "message": "Signed in successfully"})
    else:
        return jsonify({"success": False, "error": "Invalid email or password"}), 401

@app.route("/api/opportunities", methods=["POST"])
def create_opportunity():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    category = data.get("category")
    location = data.get("location")
    time = data.get("time")
    slots = data.get("slots")

    if not all([title, description, category, location, time, slots]):
        return jsonify({"success": False, "error": "Missing fields"}), 400

    if int(slots) < 2 or int(slots) > 5:
        return jsonify({"success": False, "error": "Slots must be between 2 and 5"}), 400

    opportunity = {
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "time": time,
        "slots": int(slots),
        "participants": [] 
    }
    opportunities.insert_one(opportunity)
    return jsonify({"success": True, "message": "Opportunity created!"}), 201

@app.route("/api/opportunities", methods=["GET"])
def get_opportunities():
    data = []
    for op in opportunities.find():
        data.append({
            "_id": str(op["_id"]),
            "title": op["title"],
            "description": op["description"],
            "category": op["category"],
            "location": op["location"],
            "time": op["time"],
            "slots": op["slots"],
            "participants": op.get("participants", [])
        })
    return jsonify({"success": True, "opportunities": data})

@app.route("/api/opportunities/<op_id>/signup", methods=["POST"])
def signup_opportunity(op_id):
    data = request.get_json()
    user_email = data.get("email")
    if not user_email:
        return jsonify({"success": False, "error": "Email is required"}), 400

    op = opportunities.find_one({"_id": ObjectId(op_id)})
    if not op:
        return jsonify({"success": False, "error": "Opportunity not found"}), 404

    if len(op.get("participants", [])) >= op["slots"]:
        return jsonify({"success": False, "error": "No slots available"}), 400

    if user_email in op.get("participants", []):
        return jsonify({"success": False, "error": "User already signed up"}), 400

    opportunities.update_one(
        {"_id": ObjectId(op_id)},
        {"$push": {"participants": user_email}}
    )
    return jsonify({"success": True, "message": "Signed up successfully"})

if __name__ == "__main__":
    app.run(debug=True)
