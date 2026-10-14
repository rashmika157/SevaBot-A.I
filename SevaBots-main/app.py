import json
import os
import re
import uuid
import requests
import torch
import soundfile as sf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy

# Load environment variables from .env if present
def _load_env_file():
    for p in ['.env', '../.env', os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')]:
        if os.path.exists(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            k, v = k.strip(), v.strip().strip('"\'')
                            if k not in os.environ:
                                os.environ[k] = v
            except Exception:
                pass
_load_env_file()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sevabots.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure CORS for local React dev server (Vite on http://localhost:5173)
try:
    from flask_cors import CORS
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
except ImportError:
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response


# -----------------------------
# DB Model
# -----------------------------
class ChatSession(db.Model):
    session_id = db.Column(db.String(50), primary_key=True)
    state = db.Column(db.String(50), default="init")

class UserProfile(db.Model):
    phone = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100))
    age = db.Column(db.String(10))
    address = db.Column(db.String(200))
    pin = db.Column(db.String(20))

class Scheme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    benefits = db.Column(db.Text)
    state = db.Column(db.String(100))
    organization = db.Column(db.String(100))
    type = db.Column(db.String(100))
    category = db.Column(db.String(100))
    target = db.Column(db.String(100))
    income = db.Column(db.String(100))
    link = db.Column(db.String(500))
    steps = db.Column(db.Text)
    documents = db.Column(db.Text)
    
    def to_dict(self):
        return {
            "name": self.name,
            "benefits": self.benefits,
            "state": self.state,
            "organization": self.organization,
            "type": self.type,
            "category": self.category,
            "target": self.target,
            "income": self.income,
            "link": self.link,
            "steps": json.loads(self.steps) if self.steps else [],
            "documents": json.loads(self.documents) if self.documents else []
        }

class UserApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20))
    scheme_name = db.Column(db.String(255))
    status = db.Column(db.String(50), default="Applied")

def seed_schemes():
    if Scheme.query.count() == 0:
        try:
            file_path = os.path.join(os.path.dirname(__file__), 'schemes.json')
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    all_schemes = json.load(f)
                    for s in all_schemes:
                        scheme = Scheme(
                            name=s.get('name'),
                            benefits=s.get('benefits'),
                            state=s.get('state'),
                            organization=s.get('organization'),
                            type=s.get('type'),
                            category=s.get('category'),
                            target=s.get('target'),
                            income=s.get('income'),
                            link=s.get('link'),
                            steps=json.dumps(s.get('steps', [])),
                            documents=json.dumps(s.get('documents', []))
                        )
                        db.session.add(scheme)
                    db.session.commit()
                    print("[OK] schemes.json successfully seeded to SQLite Database")
        except Exception as e:
            print(f"Seed Error: {e}")

with app.app_context():
    db.create_all()
    seed_schemes()

# -----------------------------
# STT + TTS MODELS (Lazy Loaded)
# -----------------------------
_stt_pipeline = None
_tts_model = None
_tts_tokenizer = None

def get_stt():
    global _stt_pipeline
    if _stt_pipeline is None:
        from transformers import pipeline
        print("Lazy-loading STT model (Whisper)...")
        _stt_pipeline = pipeline("automatic-speech-recognition", model="openai/whisper-small")
    return _stt_pipeline

def get_tts_components():
    global _tts_model, _tts_tokenizer
    if _tts_model is None or _tts_tokenizer is None:
        from transformers import VitsModel, AutoTokenizer
        print("Lazy-loading TTS model (MMS)...")
        _tts_model = VitsModel.from_pretrained("facebook/mms-tts-kan")
        _tts_tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-kan")
    return _tts_model, _tts_tokenizer

def generate_tts(text):
    model, tokenizer = get_tts_components()
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        output = model(**inputs).waveform

    os.makedirs("audio", exist_ok=True)
    filename = f"audio_{uuid.uuid4().hex}.wav"
    filepath = os.path.join("audio", filename)

    sf.write(filepath, output.squeeze().cpu().numpy(), 16000)
    return filename

# -----------------------------
# Static
# -----------------------------
@app.route("/")
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route("/<path:path>")
def serve_static(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404
    return send_from_directory('.', path)

@app.route("/audio/<path:filename>")
def serve_audio(filename):
    return send_from_directory("audio", filename)

# -----------------------------
# Health Check API
# -----------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "SevaBot backend is running"})

# -----------------------------
# Schemes API
# -----------------------------
@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    try:
        schemes = [s.to_dict() for s in Scheme.query.all()]
        resp = jsonify(schemes)
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# AI Scheme Search API
# -----------------------------
def _call_gemini_search(api_key, query, schemes_data):
    # Supported active Gemini models (deprecated gemini-pro / 1.5 / 2.0 replaced)
    models_to_try = [
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.8-flash"
    ]
    last_error = ""

    prompt = f"""You are an expert AI welfare scheme advisor for SevaBot.
User query: "{query}"

Available Schemes:
{json.dumps(schemes_data, indent=2)}

Task:
1. Interpret the user's intent and situation from their natural-language query.
2. Select the IDs of the most relevant schemes that apply. If no schemes are relevant, return an empty list.
3. Provide a clear, concise explanation (1-3 sentences) explaining why these schemes match the user's situation.

Return strictly a valid JSON object with this exact structure:
{{
  "scheme_ids": [list of integer IDs],
  "explanation": "concise explanation"
}}
"""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json"
        }
    }

    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        try:
            resp = requests.post(url, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    return candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")

            # Parse error details from Google API
            err_msg = resp.text
            try:
                err_json = resp.json()
                err_msg = err_json.get("error", {}).get("message", err_msg)
            except Exception:
                pass

            if resp.status_code == 400:
                raise RuntimeError(
                    f"Gemini API key error (HTTP 400): {err_msg}. Please verify your GEMINI_API_KEY."
                )
            elif resp.status_code == 403:
                raise RuntimeError(
                    f"Gemini API access denied (HTTP 403): {err_msg}. Check your API key permissions."
                )
            elif resp.status_code in (404, 503):
                last_error = f"{model_name} (HTTP {resp.status_code}): {err_msg}"
                continue
            else:
                last_error = f"{model_name} (HTTP {resp.status_code}): {err_msg}"
                continue

        except requests.exceptions.RequestException as e:
            last_error = f"Network error connecting to {model_name}: {str(e)}"
            continue

    raise RuntimeError(
        f"Selected Gemini models are currently unavailable: {last_error}. Verified models: {', '.join(models_to_try)}."
    )

def _call_openai_search(api_key, query, schemes_data):
    url = "https://api.openai.com/v1/chat/completions"
    prompt = f"""You are an expert AI welfare scheme advisor for SevaBot.
User query: "{query}"

Available Schemes:
{json.dumps(schemes_data, indent=2)}

Task:
1. Interpret the user's intent and situation from their natural-language query.
2. Select the IDs of the most relevant schemes that apply. If no schemes are relevant, return an empty list.
3. Provide a clear, concise explanation (1-3 sentences) explaining why these schemes match the user's situation.

Return strictly a valid JSON object with this exact structure:
{{
  "scheme_ids": [list of integer IDs],
  "explanation": "concise explanation"
}}
"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful government welfare scheme advisor. Respond only with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }
    resp = requests.post(url, json=payload, headers=headers, timeout=25)
    if resp.status_code != 200:
        err_msg = resp.text
        try:
            err_json = resp.json()
            err_msg = err_json.get("error", {}).get("message", err_msg)
        except Exception:
            pass
        raise RuntimeError(f"OpenAI API error (HTTP {resp.status_code}): {err_msg}")
    
    data = resp.json()
    return data["choices"][0]["message"]["content"]

def _parse_llm_json(raw_text):
    text = (raw_text or "").strip()
    if text.startswith("```"):
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except Exception:
        import re
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise ValueError("Could not parse valid JSON from LLM output")

@app.route("/api/ai-search", methods=["POST", "OPTIONS"])
def ai_search():
    if request.method == "OPTIONS":
        resp = jsonify({"status": "ok"})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        resp.headers.add("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization")
        resp.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return resp, 200

    data = request.get_json(silent=True) or {}
    query = (data.get("query") or data.get("message") or "").strip()

    # 1. Validate query
    if not query:
        resp = jsonify({
            "error": "Query cannot be empty. Please provide a non-empty 'query' in the JSON body.",
            "code": "EMPTY_QUERY"
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 400

    # 2. Check for configured LLM API key
    gemini_key = os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if not gemini_key and not openai_key:
        resp = jsonify({
            "error": "LLM API key is not configured. Please set the GEMINI_API_KEY (or OPENAI_API_KEY) environment variable on the server.",
            "code": "LLM_CONFIG_MISSING"
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 503

    try:
        # 3. Retrieve available schemes from SQLite
        all_schemes = Scheme.query.all()
        schemes_data = [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "target": s.target,
                "benefits": s.benefits,
                "income": s.income,
                "state": s.state
            }
            for s in all_schemes
        ]

        # 4. Invoke LLM provider
        if gemini_key:
            raw_response = _call_gemini_search(gemini_key, query, schemes_data)
        else:
            raw_response = _call_openai_search(openai_key, query, schemes_data)

        # 5. Parse and validate LLM output
        parsed = _parse_llm_json(raw_response)
        raw_ids = parsed.get("scheme_ids", [])
        explanation = parsed.get("explanation", "")

        valid_scheme_ids = []
        for sid in raw_ids:
            try:
                valid_scheme_ids.append(int(sid))
            except (ValueError, TypeError):
                continue

        # Fetch matching scheme records
        matching_schemes = []
        for sid in valid_scheme_ids:
            scheme_obj = db.session.get(Scheme, sid)
            if scheme_obj:
                matching_schemes.append(scheme_obj.to_dict())

        resp = jsonify({
            "query": query,
            "scheme_ids": valid_scheme_ids,
            "explanation": explanation,
            "matching_schemes": matching_schemes,
            "count": len(matching_schemes)
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 200

    except requests.exceptions.RequestException as req_err:
        resp = jsonify({
            "error": f"Failed to communicate with LLM provider: {str(req_err)}",
            "code": "LLM_REQUEST_FAILED"
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 502
    except ValueError as val_err:
        resp = jsonify({
            "error": f"Invalid response from LLM provider: {str(val_err)}",
            "code": "LLM_INVALID_RESPONSE"
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 502
    except Exception as err:
        resp = jsonify({
            "error": f"AI search failed: {str(err)}",
            "code": "AI_SEARCH_ERROR"
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 500

# -----------------------------
# SEMANTIC SCHEME SEARCH ENGINE
# -----------------------------
SEMANTIC_CLUSTERS = {
    # Medical & Healthcare
    'hospital': ['medical', 'surgery', 'health', 'healthcare', 'treatment', 'patient', 'doctor', 'clinic', 'checkup', 'hospitalization'],
    'doctor': ['medical', 'healthcare', 'checkup', 'hospital', 'health', 'doctor', 'treatment'],
    'bills': ['costs', 'expenses', 'cover', 'financial', 'subsidy', 'aid'],
    'treatment': ['medical', 'surgery', 'hospitalization', 'health', 'disease', 'checkup'],
    'medicine': ['medical', 'healthcare', 'checkups', 'treatment', 'medicines'],
    'medicines': ['medical', 'healthcare', 'checkups', 'treatment', 'medicine'],
    'surgery': ['hospitalization', 'medical', 'surgery', 'health', 'treatment'],
    'disease': ['medical', 'healthcare', 'checkup', 'treatment', 'health'],
    'health': ['medical', 'healthcare', 'checkup', 'hospitalization', 'coverage'],
    'illness': ['medical', 'healthcare', 'treatment', 'hospitalization'],
    'clinic': ['medical', 'healthcare', 'checkup', 'doorstep'],
    'operation': ['surgery', 'hospitalization', 'medical', 'treatment'],
    'aarogya': ['health', 'medical', 'healthcare'],
    'ಆರೋಗ್ಯ': ['health', 'medical', 'healthcare'],
    'ಆಸ್ಪತ್ರೆ': ['hospital', 'medical', 'healthcare'],

    # Education & Youth
    'daughter': ['girl', 'child', 'female', 'women', 'education', 'family', 'marriage'],
    'girl': ['daughter', 'child', 'female', 'women', 'education', 'marriage'],
    'college': ['education', 'student', 'youth', 'tuition', 'studies', 'school'],
    'tuition': ['education', 'fee', 'school', 'student', 'studies'],
    'fees': ['tuition', 'education', 'financial', 'assistance'],
    'school': ['education', 'student', 'tuition', 'child'],
    'student': ['education', 'youth', 'tuition', 'scholarship', 'studies'],
    'students': ['education', 'youth', 'tuition', 'scholarship', 'studies'],
    'classes': ['education', 'lessons', 'course', 'training'],
    'english': ['spoken', 'english', 'course', 'lessons', 'employability', 'skills'],
    'job': ['employability', 'work', 'skills', 'youth', 'spoken'],
    'jobs': ['employability', 'work', 'skills', 'youth', 'spoken'],
    'skills': ['employability', 'lessons', 'course', 'training', 'youth'],
    'vidyarthi': ['student', 'education', 'tuition'],
    'ವಿದ್ಯಾರ್ಥಿ': ['student', 'education', 'tuition'],

    # Business & Enterprise
    'shop': ['business', 'entrepreneurs', 'loan', 'start', 'enterprise', 'micro'],
    'store': ['business', 'entrepreneurs', 'loan', 'start', 'shop'],
    'startup': ['entrepreneurs', 'business', 'start', 'loan', 'capital', 'support'],
    'business': ['entrepreneurs', 'start', 'loan', 'support', 'enterprise', 'shop'],
    'entrepreneur': ['business', 'loan', 'start', 'enterprise', 'mudra'],
    'entrepreneurs': ['business', 'loan', 'start', 'enterprise', 'mudra'],
    'vendor': ['business', 'entrepreneurs', 'micro', 'loan', 'support'],
    'vendors': ['business', 'entrepreneurs', 'micro', 'loan', 'support'],
    'enterprise': ['business', 'entrepreneurs', 'micro', 'mudra', 'loan'],
    'enterprises': ['business', 'entrepreneurs', 'micro', 'mudra', 'loan'],

    # Agriculture & Farming
    'tractor': ['equipment', 'mechanization', 'machinery', 'agriculture', 'farming', 'subsidies'],
    'tractors': ['equipment', 'mechanization', 'machinery', 'agriculture', 'farming', 'subsidies'],
    'machinery': ['equipment', 'mechanization', 'subsidies', 'tools', 'tractors'],
    'tools': ['equipment', 'mechanization', 'machinery', 'agriculture'],
    'rain': ['weather', 'dry', 'spells', 'irrigation', 'water', 'crop', 'failure'],
    'drought': ['dry', 'spells', 'crop', 'failure', 'relief', 'assistance', 'irrigation'],
    'destroyed': ['crop', 'failure', 'loss', 'insurance', 'damage', 'relief'],
    'damaged': ['crop', 'failure', 'loss', 'insurance', 'damage'],
    'damage': ['crop', 'failure', 'loss', 'insurance', 'damage'],
    'ruined': ['crop', 'failure', 'loss', 'insurance'],
    'flood': ['crop', 'failure', 'loss', 'insurance', 'relief'],
    'insurance': ['crop', 'premium', 'fasal', 'bima', 'loss', 'coverage'],
    'harvest': ['crop', 'agriculture', 'farming', 'produce', 'yield'],
    'crops': ['crop', 'agriculture', 'farming', 'produce', 'yield'],
    'crop': ['agriculture', 'farming', 'produce', 'yield', 'insurance'],
    'cultivator': ['farmer', 'agriculture', 'landless', 'laborer', 'farming', 'kalia'],
    'cultivators': ['farmer', 'agriculture', 'landless', 'laborer', 'farming', 'kalia'],
    'farmers': ['farmer', 'agriculture', 'farming', 'kisan'],
    'farmer': ['agriculture', 'farming', 'kisan', 'cultivator'],
    'farming': ['agriculture', 'farmer', 'kisan', 'cultivator'],
    'agriculture': ['farming', 'farmer', 'kisan', 'cultivator'],
    'raitha': ['farmer', 'agriculture', 'farming'],
    'raitharu': ['farmer', 'agriculture', 'farming'],
    'ರೈತ': ['farmer', 'agriculture', 'farming'],
    'krishi': ['agriculture', 'farming', 'farmer'],
    'ಕೃಷಿ': ['agriculture', 'farming', 'farmer'],
    'bima': ['insurance', 'crop', 'coverage'],

    # Finance, Loans & Debt
    'debt': ['loan', 'crises', 'karjmukti', 'relief', 'repay', 'credit', 'financial', 'waiver'],
    'waiver': ['debt', 'relief', 'loan', 'karjmukti', 'crises', 'farmers'],
    'repay': ['debt', 'loan', 'crises', 'karjmukti', 'credit'],
    'bank': ['credit', 'loan', 'passbook', 'branch', 'dbt'],
    'loan': ['credit', 'subsidized', 'farming', 'business', 'financial'],
    'loans': ['credit', 'subsidized', 'farming', 'business', 'financial'],
    'credit': ['loan', 'kcc', 'subsidized', 'card', 'bank'],
    'money': ['financial', 'assistance', 'grant', 'direct', 'benefit', 'transfer', 'subsidized'],
    'cash': ['financial', 'assistance', 'direct', 'benefit', 'transfer', 'grant'],
    'fund': ['financial', 'assistance', 'loan', 'grant', 'subsidy'],
    'funds': ['financial', 'assistance', 'loan', 'grant', 'subsidy'],
    'subsidy': ['subsidies', 'equipment', 'subsidized', 'financial', 'assistance'],
    'subsidies': ['subsidy', 'equipment', 'mechanization', 'financial'],
    'grant': ['financial', 'assistance', 'investment', 'transfer'],
    'grants': ['financial', 'assistance', 'investment', 'transfer'],
    'saala': ['loan', 'credit', 'debt'],
    'ಸಾಲ': ['loan', 'credit', 'debt'],
    'karz': ['loan', 'debt', 'karjmukti'],

    # Energy & Solar
    'solar': ['solar', 'pumps', 'power', 'renewable', 'energy', 'grid', 'kusum'],
    'sun': ['solar', 'pumps', 'power', 'energy'],
    'electricity': ['solar', 'power', 'grid', 'energy'],
    'energy': ['solar', 'renewable', 'power', 'grid'],
    'pump': ['irrigation', 'solar', 'pumps', 'water', 'equipment'],
    'pumps': ['irrigation', 'solar', 'pump', 'water', 'equipment'],
    'water': ['irrigation', 'rainwater', 'harvesting', 'pump', 'dry'],
    'irrigation': ['water', 'rainwater', 'pumps', 'critical', 'dry'],

    # Market & Mandi
    'market': ['trading', 'portal', 'apmc', 'mandi', 'sell', 'enam'],
    'mandi': ['market', 'apmc', 'trading', 'portal', 'sell'],
    'mandis': ['market', 'apmc', 'trading', 'portal', 'sell'],
    'sell': ['trading', 'market', 'apmc', 'electronic', 'portal'],
    'selling': ['trading', 'market', 'apmc', 'electronic', 'portal'],
    'trading': ['market', 'apmc', 'electronic', 'portal', 'sell']
}

def expand_semantic_query(query):
    if not query:
        return ""
    tokens = re.findall(r'\b\w+\b', query.lower())
    expanded = list(tokens)
    for t in tokens:
        if t in SEMANTIC_CLUSTERS:
            expanded.extend(SEMANTIC_CLUSTERS[t])
    return " ".join(expanded)

class SchemeSemanticSearch:
    def __init__(self):
        self.vectorizer = None
        self.tfidf_matrix = None
        self.scheme_ids = []
        self.last_scheme_count = -1

    def _build_index(self):
        schemes = Scheme.query.all()
        if not schemes:
            self.vectorizer = None
            self.tfidf_matrix = None
            self.scheme_ids = []
            self.last_scheme_count = 0
            return

        corpus = []
        self.scheme_ids = []
        for s in schemes:
            steps_text = " ".join(json.loads(s.steps)) if (s.steps and s.steps.startswith("[")) else (s.steps or "")
            docs_text = " ".join(json.loads(s.documents)) if (s.documents and s.documents.startswith("[")) else (s.documents or "")
            doc_text = f"{s.name} {s.category} {s.target} {s.benefits} {s.organization} {s.state} {steps_text} {docs_text}"
            corpus.append(doc_text)
            self.scheme_ids.append(s.id)

        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        self.last_scheme_count = len(schemes)

    def search(self, query, top_k=10, min_score=0.03):
        if not query or not query.strip():
            return []

        current_count = Scheme.query.count()
        if self.vectorizer is None or current_count != self.last_scheme_count:
            self._build_index()

        if self.vectorizer is None or self.tfidf_matrix is None or not self.scheme_ids:
            return []

        expanded = expand_semantic_query(query)
        q_vec = self.vectorizer.transform([expanded])
        sims = cosine_similarity(q_vec, self.tfidf_matrix)[0]

        matches = []
        for idx, score in enumerate(sims):
            if score >= min_score:
                matches.append((self.scheme_ids[idx], float(score)))

        matches.sort(key=lambda x: x[1], reverse=True)
        if top_k and top_k > 0:
            matches = matches[:top_k]

        return matches

semantic_engine = SchemeSemanticSearch()

@app.route("/api/semantic-search", methods=["GET", "POST", "OPTIONS"])
def semantic_search():
    if request.method == "OPTIONS":
        resp = jsonify({"status": "ok"})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        resp.headers.add("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization")
        resp.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return resp, 200

    if request.method == "GET":
        query = request.args.get("query") or request.args.get("q") or ""
        limit = request.args.get("limit", 10, type=int)
        threshold = request.args.get("threshold", 0.03, type=float)
    else:
        data = request.get_json(silent=True) or {}
        query = data.get("query") or data.get("q") or data.get("message") or ""
        limit = data.get("limit", 10)
        threshold = data.get("threshold", 0.03)

    query = str(query).strip()

    # 1. Handle empty query gracefully
    if not query:
        resp = jsonify({
            "error": "Query cannot be empty. Please provide a non-empty search query.",
            "code": "EMPTY_QUERY",
            "scheme_ids": [],
            "results": []
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 400

    try:
        limit = int(limit) if limit else 10
        threshold = float(threshold) if threshold is not None else 0.03
    except (ValueError, TypeError):
        limit = 10
        threshold = 0.03

    try:
        raw_matches = semantic_engine.search(query, top_k=limit, min_score=threshold)

        results = []
        matching_ids = []
        max_score = raw_matches[0][1] if raw_matches else 1.0

        for sid, score in raw_matches:
            scheme_obj = db.session.get(Scheme, sid)
            if scheme_obj:
                matching_ids.append(sid)
                norm_score = round(score / max_score, 4) if max_score > 0 else round(score, 4)
                results.append({
                    "scheme_id": sid,
                    "score": round(score, 4),
                    "relevance_score": norm_score,
                    "scheme": scheme_obj.to_dict()
                })

        resp = jsonify({
            "query": query,
            "count": len(results),
            "scheme_ids": matching_ids,
            "results": results
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 200

    except Exception as err:
        resp = jsonify({
            "error": f"Semantic search failed: {str(err)}",
            "code": "SEMANTIC_SEARCH_ERROR",
            "scheme_ids": [],
            "results": []
        })
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 500

# -----------------------------
# JSON Error Handlers for API
# -----------------------------
@app.errorhandler(400)
def handle_bad_request(e):
    resp = jsonify({"error": "Bad request", "code": "BAD_REQUEST"})
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp, 400

@app.errorhandler(404)
def handle_not_found(e):
    if request.path.startswith("/api/"):
        resp = jsonify({"error": f"API endpoint not found: {request.path}", "code": "NOT_FOUND"})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 404
    return send_from_directory('.', 'index.html')

@app.errorhandler(405)
def handle_method_not_allowed(e):
    resp = jsonify({"error": f"Method {request.method} not allowed for {request.path}", "code": "METHOD_NOT_ALLOWED"})
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp, 405

@app.errorhandler(500)
def handle_server_error(e):
    resp = jsonify({"error": "Internal server error", "code": "INTERNAL_SERVER_ERROR"})
    resp.headers.add("Access-Control-Allow-Origin", "*")
    return resp, 500

# -----------------------------
# User Profile API
# -----------------------------
@app.route("/api/user/save", methods=["POST"])
def save_user_profile():
    data = request.get_json() or {}
    phone = data.get("phone")
    if not phone:
        return jsonify({"error": "Phone number is required"}), 400
    
    try:
        user = db.session.get(UserProfile, phone)
        if not user:
            user = UserProfile(phone=phone)
            db.session.add(user)
            
        user.name = data.get("name", user.name)
        user.age = data.get("age", user.age)
        user.address = data.get("address", user.address)
        user.pin = data.get("pin", user.pin)
        
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/schemes_add", methods=["POST"])
def add_user_scheme():
    data = request.get_json() or {}
    phone = data.get("phone")
    scheme_name = data.get("scheme_name")
    
    if not phone or not scheme_name:
        return jsonify({"error": "Missing data"}), 400
        
    try:
        existing = UserApplication.query.filter_by(phone=phone, scheme_name=scheme_name).first()
        if not existing:
            app_req = UserApplication(phone=phone, scheme_name=scheme_name)
            db.session.add(app_req)
            db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/schemes_get", methods=["GET"])
def get_user_schemes():
    phone = request.args.get("phone")
    if not phone:
        return jsonify([])
        
    try:
        apps = UserApplication.query.filter_by(phone=phone).all()
        results = []
        for a in apps:
            scheme = Scheme.query.filter_by(name=a.scheme_name).first()
            if scheme:
                s_dict = scheme.to_dict()
                s_dict["status"] = a.status
                results.append(s_dict)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Match API
# -----------------------------
from gtts import gTTS

@app.route("/api/tts", methods=["POST"])
def enhanced_tts():
    data = request.get_json() or {}
    text = data.get("text")
    lang_code = data.get("lang", "en")
    
    if not text:
        return jsonify({"error": "No text"}), 400
        
    try:
        lang = lang_code.split("-")[0]
        tts = gTTS(text=text, lang=lang)
        
        os.makedirs("audio", exist_ok=True)
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join("audio", filename)
        tts.save(filepath)
        
        return jsonify({"audio_url": f"/audio/{filename}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/match", methods=["POST"])
def match_schemes():
    data = request.get_json() or {}
    occupation = data.get("occupation", "")
    user_answers = data.get("userAnswers", {})

    try:
        all_schemes = Scheme.query.all()
        results = []
        
        # Determine strict category requirement dynamically based on occupation rules
        required_category = "Not Applicable"
        income_bracket = "Any"
        
        if occupation == "Agriculture Sector":
            required_category = user_answers.get("What kind of support do you need?", "Not Applicable")
            income_bracket = user_answers.get("What is your annual family income?", "Any")
        elif occupation == "Medical Sector":
            required_category = user_answers.get("What is your primary healthcare requirement?", "Not Applicable")
            income_bracket = user_answers.get("What is your annual family income?", "Any")
        elif occupation == "Education Sector":
            required_category = user_answers.get("Are you seeking support for tuition or hostel fees?", "Not Applicable")
            income_bracket = user_answers.get("What is your annual family income?", "Any")
        elif occupation == "Others":
            required_category = user_answers.get("What is your primary objective?", "Not Applicable")
            income_bracket = user_answers.get("What is your annual family income?", "Any")

        for scheme_model in all_schemes:
            scheme = scheme_model.to_dict()
            if scheme.get('target') == 'General':
                continue
                
            # Primary filter: Must match occupation sector exactly 
            if scheme.get('target') != occupation:
                continue
                
            # Secondary filter: Must map to their primary category need
            if required_category != "Not Applicable" and required_category != "Not sure":
                if scheme.get('category') != required_category:
                    continue
                    
            # Tertiary filter: Check income brackets roughly
            if scheme.get('income') != "Any" and income_bracket != "Any":
                if scheme.get('income') != income_bracket:
                    continue
                    
            results.append(scheme)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# CHAT SESSION HISTORY & LLM HELPER
# -----------------------------
_chat_sessions_history = {}

def generate_llm_chat_reply(user_message, session_id=None):
    """Generate a conversational, scheme-grounded response using Gemini LLM."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None

    msg_clean = (user_message or "").strip()
    if not msg_clean:
        return None

    # Fetch available schemes from SQLite for grounding
    try:
        all_schemes = Scheme.query.all()
        schemes_data = [
            {
                "name": s.name,
                "benefits": s.benefits,
                "category": s.category,
                "target": s.target,
                "income": s.income,
                "state": s.state,
                "organization": s.organization,
                "steps": json.loads(s.steps) if s.steps and s.steps.startswith("[") else s.steps,
                "documents": json.loads(s.documents) if s.documents and s.documents.startswith("[") else s.documents
            }
            for s in all_schemes
        ]
    except Exception:
        schemes_data = []

    system_prompt = f"""You are SevaBot, a polite, helpful, and knowledgeable AI assistant for Indian government welfare schemes.
Your mission is to guide citizens, farmers, students, workers, and families to discover and apply for government schemes.

Ground your answers in the following official government scheme database:
{json.dumps(schemes_data, indent=2)}

Guidelines:
1. Ground your answers accurately in the provided scheme database. Mention relevant scheme names, benefits, and eligibility criteria clearly.
2. If the user asks how to apply or what documents are needed, explain the specific application steps and documents from the scheme database.
3. Keep your answers clear, conversational, and concise (typically 2-4 sentences or short bullet points), suitable for chat reading and text-to-speech. Avoid excessive markdown symbols like raw asterisks or markdown tables.
4. If the user greets you or asks an open-ended question, greet them warmly and suggest the main sectors you can help with (e.g., Agriculture, Healthcare, Education, Financial/Business support).
5. If the user asks in a specific language (such as Kannada or Hindi), reply in that language; otherwise reply in clear English.
6. If the user's inquiry does not match any scheme in the database, politely clarify what is available and suggest checking official government portals like myscheme.gov.in.
"""

    # Prepare multi-turn contents
    contents = []
    if session_id and session_id in _chat_sessions_history:
        # Include recent turns (max 6)
        contents.extend(_chat_sessions_history[session_id][-6:])
    contents.append({"role": "user", "parts": [{"text": msg_clean}]})

    models_to_try = [
        "gemini-3.5-flash-lite",
        "gemini-3.5-flash",
        "gemini-3.8-flash"
    ]

    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        payload = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": contents,
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 600
            }
        }
        try:
            resp = requests.post(url, json=payload, timeout=20)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    reply_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                    if reply_text:
                        # Record history for multi-turn conversational flow
                        if session_id:
                            if session_id not in _chat_sessions_history:
                                _chat_sessions_history[session_id] = []
                            _chat_sessions_history[session_id].append({"role": "user", "parts": [{"text": msg_clean}]})
                            _chat_sessions_history[session_id].append({"role": "model", "parts": [{"text": reply_text}]})
                            # Keep only last 10 items in history
                            if len(_chat_sessions_history[session_id]) > 10:
                                _chat_sessions_history[session_id] = _chat_sessions_history[session_id][-10:]
                        return reply_text
            # If 404 or transient error, proceed to try fallback model
            continue
        except requests.exceptions.RequestException:
            continue
        except Exception:
            continue

    return None

# -----------------------------
# CHAT API (LLM POWERED WITH FALLBACK)
# -----------------------------
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        resp = jsonify({"status": "ok"})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        resp.headers.add("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization")
        resp.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return resp, 200

    data = request.get_json(silent=True) or {}
    user_input = (data.get("message") or "").strip()
    session_id = data.get("session_id", "default")

    if not user_input:
        resp = jsonify({"reply": "Hello! How can I help you find government welfare schemes today?"})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 200

    # 1. Try Gemini LLM generated response grounded in scheme database
    try:
        llm_reply = generate_llm_chat_reply(user_input, session_id=session_id)
        if llm_reply:
            chat_session = db.session.get(ChatSession, session_id)
            if not chat_session:
                chat_session = ChatSession(session_id=session_id, state="llm")
                db.session.add(chat_session)
            else:
                chat_session.state = "llm"
            db.session.commit()

            resp = jsonify({"reply": llm_reply})
            resp.headers.add("Access-Control-Allow-Origin", "*")
            return resp, 200
    except Exception as e:
        db.session.rollback()

    # 2. Seamless fallback to existing rule-based state machine
    try:
        chat_session = db.session.get(ChatSession, session_id)
        if not chat_session:
            chat_session = ChatSession(session_id=session_id, state="init")
            db.session.add(chat_session)
            db.session.commit()

        state = chat_session.state
        response = ""
        lowered = user_input.lower()

        if state == "init":
            if "farmer" in lowered or "agriculture" in lowered:
                response = "I can help with agricultural schemes. Are you a small or large farmer?"
                chat_session.state = "farmer_size"
            elif "medical" in lowered or "health" in lowered:
                response = "I can help with medical schemes. Are you looking for hospitalization coverage or maternity care?"
                chat_session.state = "medical_need"
            elif "education" in lowered or "student" in lowered:
                response = "I see you are interested in educational schemes. Are you primarily seeking help with tuition fees or hostel fees?"
                chat_session.state = "education_need"
            else:
                response = "Please tell me your requirement."

        elif state == "farmer_size":
            response = "Do you own your agricultural land?"
            chat_session.state = "farmer_land"

        elif state == "farmer_land":
            response = "You may qualify for financial assistance schemes for farmers."
            chat_session.state = "init"

        db.session.commit()

        resp = jsonify({"reply": response})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 200

    except Exception as e:
        db.session.rollback()
        resp = jsonify({"error": str(e), "reply": "Sorry, I encountered an error. Please try again."})
        resp.headers.add("Access-Control-Allow-Origin", "*")
        return resp, 500

# -----------------------------
# 🎤 VOICE API (MAIN)
# -----------------------------
@app.route("/voice", methods=["POST"])
def voice():
    try:
        if "input_audio" not in request.files:
            return jsonify({"error": "No audio"}), 400

        file = request.files["input_audio"]

        # Save audio
        temp_file = f"temp_{uuid.uuid4().hex}.wav"
        file.save(temp_file)

        # 1️⃣ STT
        stt_processor = get_stt()
        result = stt_processor(temp_file)
        user_text = result["text"]

        # 2️⃣ PASS TO CHAT ENGINE
        chat_response = chat_internal(user_text)

        # 3️⃣ TTS
        audio_file = generate_tts(chat_response)

        return jsonify({
            "transcribed_text": user_text,
            "response_text": chat_response,
            "audio_url": f"/audio/{audio_file}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------
# INTERNAL CHAT HELPER
# -----------------------------
def chat_internal(user_text, session_id=None):
    try:
        llm_reply = generate_llm_chat_reply(user_text, session_id=session_id)
        if llm_reply:
            return llm_reply
    except Exception:
        pass

    text = user_text.lower()

    if "farmer" in text or "agriculture" in text or "ರೈತ" in user_text:
        return "ನೀವು ರೈತರಿಗೆ ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು."

    elif "student" in text or "ವಿದ್ಯಾರ್ಥಿ" in user_text:
        return "ನೀವು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು."

    elif "health" in text or "medical" in text or "ಆರೋಗ್ಯ" in user_text:
        return "ನೀವು ಆರೋಗ್ಯ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು."

    else:
        return "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ."

# -----------------------------
# RUN
# -----------------------------
if __name__ == "__main__":
    app.run(port=5000)