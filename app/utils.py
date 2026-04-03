from flask import jsonify

def success_response(data):
    return jsonify({"success": True, "data": data})

def error_response(message):
    return jsonify({"success": False, "error": message}), 400