from flask import Blueprint, request, render_template, jsonify  # Ensure jsonify
from .ai_engine import analyze_topic
from .utils import success_response, error_response  # Remove if utils missing

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/api/analyze', methods=['POST'])  # This must exist
def analyze():
    data = request.json
    topic = data.get('topic')
    perspective = data.get('perspective', 'base')
    
    if not topic:
        return jsonify({"success": False, "error": "Topic is required"}), 400
    
    try:
        result = analyze_topic(topic, perspective)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500