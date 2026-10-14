import importlib.util
import os
import sys
import json
import hmac
import hashlib
import time
import re
import uuid
from gtts import gTTS
from flask import request, jsonify

# Point working directory to backend folder so existing relative paths remain functional
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SevaBots-main")
os.chdir(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Load the backend Flask app directly from SevaBots-main/app.py
spec = importlib.util.spec_from_file_location("sevabot_backend", os.path.join(backend_dir, "app.py"))
backend_module = importlib.util.module_from_spec(spec)
sys.modules["sevabot_backend"] = backend_module
spec.loader.exec_module(backend_module)

app = backend_module.app
db = backend_module.db

# ============================================================================
# SECURITY CONFIGURATION & HELPERS
# ============================================================================

# Secret key for HMAC token signing (configurable via env var)
SECRET_KEY = os.environ.get("SEVABOT_SECRET_KEY", "sevabot-secure-token-key-2026").encode("utf-8")

# Strict Allowed Origins for CORS
ALLOWED_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
}
env_origins = os.environ.get("ALLOWED_ORIGINS")
if env_origins:
    for o in env_origins.split(","):
        if o.strip():
            ALLOWED_ORIGINS.add(o.strip())


def normalize_phone(phone: str) -> str:
    """Normalize phone number by removing spaces, hyphens, and parentheses."""
    if not phone:
        return ""
    return re.sub(r'[\s\-()]', '', str(phone).strip())


def is_valid_phone(phone: str) -> bool:
    """Validate that phone number is a valid string of 7 to 15 digits with optional leading +."""
    norm = normalize_phone(phone)
    return bool(re.match(r"^\+?[0-9]{7,15}$", norm))


def sanitize_text(text: any, max_len: int = 200) -> str:
    """Sanitize and clamp string length to prevent buffer/payload bloat."""
    if text is None:
        return ""
    cleaned = str(text).strip()
    return cleaned[:max_len]


def sanitize_error_message(msg: str) -> str:
    """Redact sensitive keys, tokens, or internal absolute paths from error strings."""
    if not msg:
        return "An internal error occurred."
    s = str(msg)
    
    # Redact any configured environment keys
    for env_var in ("GEMINI_API_KEY", "OPENAI_API_KEY", "SECRET_KEY"):
        val = os.environ.get(env_var)
        if val and len(val) >= 8 and val in s:
            s = s.replace(val, "[REDACTED]")
            
    # Redact URL query parameter keys: ?key=... or &key=...
    s = re.sub(r'([?&]key=)[^& \t\r\n"\'<>]+', r'\1[REDACTED]', s)
    # Redact Google / Gemini API keys matching AIza pattern
    s = re.sub(r'AIza[A-Za-z0-9_\-]{20,}', '[REDACTED]', s)
    # Redact Bearer tokens
    s = re.sub(r'(Bearer\s+)[A-Za-z0-9_\-\.]+', r'\1[REDACTED]', s)
    # Redact Windows / Unix absolute system file paths
    s = re.sub(r'[A-Za-z]:\\[^:\s"\']+', '[PATH]', s)
    s = re.sub(r'/home/[^/\s"\']+', '[PATH]', s)
    return s


def generate_auth_token(phone: str, expires_in_seconds: int = 86400 * 30) -> str:
    """
    Generate an HMAC-SHA256 signed access token for a phone number.
    Format: <normalized_phone>:<timestamp>:<signature>
    """
    phone_clean = normalize_phone(phone)
    timestamp = int(time.time())
    payload = f"{phone_clean}:{timestamp}"
    signature = hmac.new(SECRET_KEY, payload.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{payload}:{signature}"


def verify_auth_token(token: str, expected_phone: str = None, max_age_seconds: int = 86400 * 30):
    """
    Verify an HMAC-SHA256 signed access token.
    Returns: (is_valid: bool, authenticated_phone: str, error_message: str)
    """
    if not token or not isinstance(token, str):
        return False, None, "Authentication token is required"
        
    parts = token.strip().split(":")
    if len(parts) != 3:
        return False, None, "Invalid authentication token format"
        
    phone, timestamp_str, signature = parts
    try:
        timestamp = int(timestamp_str)
    except ValueError:
        return False, None, "Invalid token timestamp"
        
    now = int(time.time())
    if now - timestamp > max_age_seconds:
        return False, None, "Authentication token has expired"
    if timestamp > now + 300:
        return False, None, "Token timestamp is in the future"
        
    payload = f"{phone}:{timestamp}"
    expected_sig = hmac.new(SECRET_KEY, payload.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected_sig):
        return False, None, "Invalid authentication token signature"
        
    if expected_phone:
        expected_norm = normalize_phone(expected_phone)
        if phone != expected_norm:
            return False, phone, "Authentication token does not match the requested phone identity"
            
    return True, phone, None


def extract_token_from_request(req, body_data=None) -> str:
    """Extract auth token from Authorization header (Bearer), X-Auth-Token, or JSON/Query params."""
    auth_header = req.headers.get("Authorization", "").strip()
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
    if "X-Auth-Token" in req.headers:
        return req.headers["X-Auth-Token"].strip()
    if body_data and isinstance(body_data, dict) and "token" in body_data:
        return str(body_data["token"]).strip()
    if "token" in req.args:
        return req.args.get("token", "").strip()
    return ""


def cleanup_old_audio_files(max_age_seconds: int = 86400, audio_dir: str = None) -> int:
    """
    Safely delete generated audio files older than max_age_seconds (default 24h).
    Does NOT delete active (< 24h) audio files or non-generated assets.
    """
    if audio_dir is None:
        audio_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SevaBots-main", "audio")
        
    if not os.path.exists(audio_dir):
        return 0
        
    now = time.time()
    deleted_count = 0
    
    try:
        for filename in os.listdir(audio_dir):
            # Only clean up files matching generated audio prefixes
            if not (filename.startswith("tts_") or filename.startswith("audio_") or filename.startswith("temp_")):
                continue
                
            filepath = os.path.join(audio_dir, filename)
            try:
                if os.path.isfile(filepath):
                    file_age = now - os.path.getmtime(filepath)
                    if file_age > max_age_seconds:
                        os.unlink(filepath)
                        deleted_count += 1
            except Exception:
                # Silently skip file lock or permission issues on active files
                pass
    except Exception:
        pass
        
    return deleted_count


# ============================================================================
# SECURED API VIEW FUNCTIONS
# ============================================================================

def secured_save_user_profile():
    """Save or update user profile with access-control enforcement and phone validation."""
    data = request.get_json(silent=True) or {}
    phone_raw = data.get("phone")
    if not phone_raw:
        return jsonify({"error": "Phone number is required", "code": "MISSING_PHONE"}), 400
        
    if not is_valid_phone(phone_raw):
        return jsonify({
            "error": "Invalid phone number format. Please provide a valid 7-15 digit phone number.",
            "code": "INVALID_PHONE"
        }), 400
        
    phone = normalize_phone(phone_raw)
    user = db.session.get(backend_module.UserProfile, phone)
    token = extract_token_from_request(request, data)
    
    # Access control: If user already exists, require valid token matching this phone
    if user is not None:
        if not token:
            return jsonify({
                "error": "Unauthorized: Valid authentication token is required to update an existing profile.",
                "code": "UNAUTHORIZED"
            }), 401
            
        valid, token_phone, err = verify_auth_token(token, expected_phone=phone)
        if not valid:
            return jsonify({
                "error": f"Unauthorized: {err}",
                "code": "UNAUTHORIZED"
            }), 401
    else:
        user = backend_module.UserProfile(phone=phone)
        db.session.add(user)
        
    try:
        user.name = sanitize_text(data.get("name", user.name), max_len=100)
        user.age = sanitize_text(data.get("age", user.age), max_len=10)
        user.address = sanitize_text(data.get("address", user.address), max_len=200)
        user.pin = sanitize_text(data.get("pin", user.pin), max_len=10)
        
        db.session.commit()
        
        # Issue / refresh token for this verified profile
        auth_token = generate_auth_token(phone)
        return jsonify({
            "success": True,
            "token": auth_token,
            "phone": phone,
            "message": "Profile saved successfully."
        }), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to save profile due to an internal error.", "code": "DB_ERROR"}), 500


def secured_add_user_scheme():
    """Add a scheme to a user profile with access-control verification."""
    data = request.get_json(silent=True) or {}
    phone_raw = data.get("phone")
    scheme_name = (data.get("scheme_name") or "").strip()
    
    if not phone_raw or not scheme_name:
        return jsonify({"error": "Missing data", "code": "MISSING_DATA"}), 400
        
    if not is_valid_phone(phone_raw):
        return jsonify({"error": "Invalid phone number format.", "code": "INVALID_PHONE"}), 400
        
    phone = normalize_phone(phone_raw)
    scheme_name = sanitize_text(scheme_name, max_len=255)
    
    token = extract_token_from_request(request, data)
    if not token:
        return jsonify({
            "error": "Unauthorized: Authentication token is required.",
            "code": "UNAUTHORIZED"
        }), 401
        
    valid, token_phone, err = verify_auth_token(token, expected_phone=phone)
    if not valid:
        return jsonify({
            "error": f"Unauthorized: {err}",
            "code": "UNAUTHORIZED"
        }), 401
        
    try:
        existing = backend_module.UserApplication.query.filter_by(phone=phone, scheme_name=scheme_name).first()
        if not existing:
            app_req = backend_module.UserApplication(phone=phone, scheme_name=scheme_name)
            db.session.add(app_req)
            db.session.commit()
        return jsonify({"success": True}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to add scheme due to an internal error.", "code": "DB_ERROR"}), 500


def secured_get_user_schemes():
    """Retrieve saved schemes for an authenticated user."""
    phone_raw = request.args.get("phone")
    if not phone_raw:
        return jsonify([]), 200
        
    if not is_valid_phone(phone_raw):
        return jsonify({"error": "Invalid phone number format.", "code": "INVALID_PHONE"}), 400
        
    phone = normalize_phone(phone_raw)
    
    token = extract_token_from_request(request)
    if not token:
        return jsonify({
            "error": "Unauthorized: Authentication token is required to view saved schemes.",
            "code": "UNAUTHORIZED"
        }), 401
        
    valid, token_phone, err = verify_auth_token(token, expected_phone=phone)
    if not valid:
        return jsonify({
            "error": f"Unauthorized: {err}",
            "code": "UNAUTHORIZED"
        }), 401
        
    try:
        apps = backend_module.UserApplication.query.filter_by(phone=phone).all()
        results = []
        for a in apps:
            scheme = backend_module.Scheme.query.filter_by(name=a.scheme_name).first()
            if scheme:
                s_dict = scheme.to_dict()
                s_dict["status"] = a.status
                results.append(s_dict)
        return jsonify(results), 200
    except Exception:
        return jsonify({"error": "Failed to fetch user schemes due to an internal error.", "code": "DB_ERROR"}), 500


def secured_enhanced_tts():
    """TTS synthesis with safe 24-hour cleanup and input validation."""
    cleanup_old_audio_files(max_age_seconds=86400)
    
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    lang_code = (data.get("lang") or "en").strip()
    
    if not text:
        return jsonify({"error": "No text"}), 400
        
    if len(text) > 1000:
        return jsonify({"error": "Text exceeds maximum allowable length of 1000 characters.", "code": "TEXT_TOO_LONG"}), 400
        
    if not re.match(r"^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$", lang_code):
        lang_code = "en"
        
    try:
        lang = lang_code.split("-")[0]
        tts = gTTS(text=text, lang=lang)
        
        audio_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SevaBots-main", "audio")
        os.makedirs(audio_dir, exist_ok=True)
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(audio_dir, filename)
        tts.save(filepath)
        
        return jsonify({"audio_url": f"/audio/{filename}"}), 200
    except Exception as e:
        sanitized = sanitize_error_message(str(e))
        return jsonify({"error": sanitized, "code": "TTS_ERROR"}), 500


orig_ai_search = app.view_functions.get('ai_search')
def secured_ai_search():
    """AI Search with input validation and sensitive key redaction."""
    data = request.get_json(silent=True) or {}
    query = (data.get("query") or data.get("message") or "").strip()
    if query and len(query) > 500:
        return jsonify({"error": "Search query exceeds maximum length of 500 characters.", "code": "QUERY_TOO_LONG"}), 400
        
    if orig_ai_search:
        try:
            res = orig_ai_search()
            resp_obj = res[0] if isinstance(res, tuple) else res
            status_code = res[1] if isinstance(res, tuple) else getattr(resp_obj, "status_code", 200)
            if hasattr(resp_obj, "get_json") and resp_obj.is_json:
                json_data = resp_obj.get_json(silent=True)
                if isinstance(json_data, dict) and "error" in json_data and isinstance(json_data["error"], str):
                    json_data["error"] = sanitize_error_message(json_data["error"])
                    return jsonify(json_data), status_code
            return res
        except Exception as e:
            sanitized = sanitize_error_message(str(e))
            return jsonify({"error": sanitized, "code": "AI_SEARCH_ERROR"}), 500
    return jsonify({"error": "AI search not available", "code": "NOT_AVAILABLE"}), 503


orig_semantic_search = app.view_functions.get('semantic_search')
def secured_semantic_search():
    """Semantic search with query length constraints."""
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        query = str(data.get("query") or data.get("q") or "").strip()
        if len(query) > 500:
            return jsonify({"error": "Search query exceeds maximum length of 500 characters.", "code": "QUERY_TOO_LONG"}), 400
    elif request.method == "GET":
        query = str(request.args.get("query") or request.args.get("q") or "").strip()
        if len(query) > 500:
            return jsonify({"error": "Search query exceeds maximum length of 500 characters.", "code": "QUERY_TOO_LONG"}), 400
            
    if orig_semantic_search:
        return orig_semantic_search()
    return jsonify({"error": "Semantic search not available"}), 503


# Replace vulnerable view functions with secured handlers
app.view_functions['save_user_profile'] = secured_save_user_profile
app.view_functions['add_user_scheme'] = secured_add_user_scheme
app.view_functions['get_user_schemes'] = secured_get_user_schemes
app.view_functions['enhanced_tts'] = secured_enhanced_tts
app.view_functions['ai_search'] = secured_ai_search
app.view_functions['semantic_search'] = secured_semantic_search


# ============================================================================
# NEW ACCESS CONTROL & MAINTENANCE ROUTES
# ============================================================================

@app.route("/api/user/token", methods=["POST"])
def get_user_token():
    """Issue a secure device access token for a valid phone number."""
    data = request.get_json(silent=True) or {}
    phone_raw = data.get("phone")
    if not phone_raw or not is_valid_phone(phone_raw):
        return jsonify({"error": "Valid phone number is required (7-15 digits)", "code": "INVALID_PHONE"}), 400
        
    phone = normalize_phone(phone_raw)
    token = generate_auth_token(phone)
    return jsonify({"success": True, "token": token, "phone": phone}), 200


@app.route("/api/admin/cleanup-audio", methods=["POST"])
def trigger_audio_cleanup():
    """Safely delete generated audio files older than 24 hours."""
    data = request.get_json(silent=True) or {}
    max_age = int(data.get("max_age_seconds", 86400))
    deleted = cleanup_old_audio_files(max_age_seconds=max_age)
    return jsonify({"success": True, "deleted_count": deleted}), 200


# ============================================================================
# STRICT CORS & SECURITY HEADERS MIDDLEWARE
# ============================================================================

@app.after_request
def enforce_security_and_cors(response):
    """Enforce strict origin matching, strip wildcard CORS, and inject security headers."""
    origin = request.headers.get("Origin")
    if origin and origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Auth-Token, Accept"
        response.headers["Access-Control-Allow-Credentials"] = "true"
    elif origin:
        # Strip wildcard * or unauthorized origin
        if "Access-Control-Allow-Origin" in response.headers:
            del response.headers["Access-Control-Allow-Origin"]
            
    # Sanitize any error response body to prevent secret or system path leakage
    if response.is_json and response.status_code >= 400:
        try:
            body_data = response.get_json(silent=True)
            if isinstance(body_data, dict) and "error" in body_data and isinstance(body_data["error"], str):
                cleaned_error = sanitize_error_message(body_data["error"])
                if cleaned_error != body_data["error"]:
                    body_data["error"] = cleaned_error
                    response.set_data(json.dumps(body_data))
        except Exception:
            pass

    # Inject standard modern defense-in-depth security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


if __name__ == "__main__":
    print("Starting SevaBot Flask backend on http://localhost:5000 ...")
    app.run(port=5000)
