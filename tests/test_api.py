import os
import sys
import json
import time
import tempfile
import pytest
from unittest.mock import patch, MagicMock

# Ensure workspace root is in sys.path
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if WORKSPACE_DIR not in sys.path:
    sys.path.insert(0, WORKSPACE_DIR)

from app import (
    app,
    db,
    generate_auth_token,
    verify_auth_token,
    cleanup_old_audio_files,
    ALLOWED_ORIGINS,
)
import sevabot_backend as backend


@pytest.fixture(scope="session")
def test_app():
    """Session fixture creating an isolated SQLite test database to prevent modifying real user data."""
    temp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    temp_db.close()
    db_path = temp_db.name.replace("\\", "/")

    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Disconnect any old engine and re-initialize SQLAlchemy with the isolated test database
    app.extensions.pop("sqlalchemy", None)
    backend.db.init_app(app)

    with app.app_context():
        backend.db.create_all()
        backend.seed_schemes()
        # Initialize semantic engine index against isolated test database
        backend.semantic_engine._build_index()

    yield app

    # Teardown: close session and dispose connection pool before removing temp file
    with app.app_context():
        backend.db.session.remove()
        backend.db.engine.dispose()

    if os.path.exists(temp_db.name):
        try:
            os.unlink(temp_db.name)
        except Exception:
            pass


@pytest.fixture
def client(test_app):
    """Flask test client fixture."""
    return test_app.test_client()


# ============================================================================
# 1. /api/health ENDPOINT TESTS
# ============================================================================

class TestHealthEndpoint:
    def test_health_check_success(self, client):
        """GET /api/health returns 200 with ok status and running message."""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert "running" in data["message"].lower()

    def test_health_check_method_not_allowed(self, client):
        """POST /api/health should return 405 Method Not Allowed with JSON error."""
        response = client.post("/api/health")
        assert response.status_code == 405
        data = response.get_json()
        assert data["code"] == "METHOD_NOT_ALLOWED"


# ============================================================================
# 2. /api/schemes ENDPOINT TESTS
# ============================================================================

class TestSchemesEndpoint:
    def test_get_schemes_success(self, client):
        """GET /api/schemes returns 200 and a populated list of scheme records."""
        response = client.get("/api/schemes")
        assert response.status_code == 200
        schemes = response.get_json()
        assert isinstance(schemes, list)
        assert len(schemes) >= 16

        # Check required schema fields on first scheme
        first = schemes[0]
        expected_keys = [
            "name", "benefits", "state", "organization", "type",
            "category", "target", "income", "link", "steps", "documents"
        ]
        for key in expected_keys:
            assert key in first, f"Missing key '{key}' in scheme payload"

        assert isinstance(first["steps"], list)
        assert isinstance(first["documents"], list)

    def test_get_schemes_cors_header(self, client):
        """GET /api/schemes restricts CORS to allowed frontend origins and sets security headers."""
        # 1. Allowed origin gets Access-Control-Allow-Origin matching its origin
        response = client.get("/api/schemes", headers={"Origin": "http://localhost:5173"})
        assert response.headers.get("Access-Control-Allow-Origin") == "http://localhost:5173"
        assert response.headers.get("X-Content-Type-Options") == "nosniff"

        # 2. Unauthorized origin does not receive Access-Control-Allow-Origin
        unauth_response = client.get("/api/schemes", headers={"Origin": "http://malicious-site.example.com"})
        assert unauth_response.headers.get("Access-Control-Allow-Origin") is None


# ============================================================================
# 3. /api/semantic-search ENDPOINT TESTS
# ============================================================================

class TestSemanticSearchEndpoint:
    def test_semantic_search_empty_query_get(self, client):
        """GET /api/semantic-search with empty query returns 400 EMPTY_QUERY."""
        response = client.get("/api/semantic-search?query=")
        assert response.status_code == 400
        data = response.get_json()
        assert data["code"] == "EMPTY_QUERY"
        assert data["results"] == []

    def test_semantic_search_empty_query_post(self, client):
        """POST /api/semantic-search with empty JSON payload returns 400."""
        response = client.post("/api/semantic-search", json={"query": "   "})
        assert response.status_code == 400
        data = response.get_json()
        assert data["code"] == "EMPTY_QUERY"

    def test_semantic_search_invalid_payload(self, client):
        """POST /api/semantic-search with non-dict/null body returns 400."""
        response = client.post("/api/semantic-search", data="invalid json string", content_type="application/json")
        assert response.status_code in (400, 500)

    def test_semantic_search_valid_get(self, client):
        """GET /api/semantic-search with 'tractor' query returns relevant farming equipment schemes."""
        response = client.get("/api/semantic-search?query=tractor&limit=5")
        assert response.status_code == 200
        data = response.get_json()
        assert data["query"] == "tractor"
        assert data["count"] > 0
        assert len(data["results"]) <= 5
        # Verify result item structure
        first_match = data["results"][0]
        assert "scheme_id" in first_match
        assert "score" in first_match
        assert "relevance_score" in first_match
        assert "scheme" in first_match

    def test_semantic_search_valid_post(self, client):
        """POST /api/semantic-search with healthcare concept returns medical schemes."""
        response = client.post("/api/semantic-search", json={"query": "hospital treatment surgery", "limit": 3})
        assert response.status_code == 200
        data = response.get_json()
        assert data["count"] > 0
        scheme_names = [r["scheme"]["name"] for r in data["results"]]
        assert any("Ayushman" in name or "Maruthuvam" in name for name in scheme_names)

    def test_semantic_search_options_preflight(self, client):
        """OPTIONS /api/semantic-search returns 200 for CORS preflight."""
        response = client.options("/api/semantic-search")
        assert response.status_code == 200


# ============================================================================
# 4. /api/ai-search ENDPOINT TESTS (MOCKED GEMINI / LLM)
# ============================================================================

class TestAiSearchEndpoint:
    def test_ai_search_empty_query(self, client):
        """POST /api/ai-search with empty query returns 400 EMPTY_QUERY."""
        response = client.post("/api/ai-search", json={"query": ""})
        assert response.status_code == 400
        data = response.get_json()
        assert data["code"] == "EMPTY_QUERY"

    def test_ai_search_missing_api_keys(self, client):
        """POST /api/ai-search when no LLM API keys are configured returns 503 LLM_CONFIG_MISSING."""
        with patch.dict(os.environ, {}, clear=True):
            response = client.post("/api/ai-search", json={"query": "need farming grant"})
            assert response.status_code == 503
            data = response.get_json()
            assert data["code"] == "LLM_CONFIG_MISSING"

    def test_ai_search_success_with_mocked_gemini(self, client):
        """POST /api/ai-search with mocked Gemini LLM response returns 200 and parsed schemes."""
        mock_llm_json = json.dumps({
            "scheme_ids": [1, 2],
            "explanation": "These central farming schemes provide subsidized credit and direct income support."
        })
        with patch.dict(os.environ, {"GEMINI_API_KEY": "fake_gemini_test_key"}):
            with patch("sevabot_backend._call_gemini_search", return_value=mock_llm_json):
                response = client.post("/api/ai-search", json={"query": "small farmer needing cash support"})
                assert response.status_code == 200
                data = response.get_json()
                assert data["count"] == 2
                assert data["scheme_ids"] == [1, 2]
                assert "income support" in data["explanation"]
                assert len(data["matching_schemes"]) == 2

    def test_ai_search_invalid_llm_json_response(self, client):
        """POST /api/ai-search with invalid JSON from LLM returns 502 LLM_INVALID_RESPONSE."""
        with patch.dict(os.environ, {"GEMINI_API_KEY": "fake_gemini_test_key"}):
            with patch("sevabot_backend._call_gemini_search", return_value="Not valid JSON response"):
                response = client.post("/api/ai-search", json={"query": "farmer scheme"})
                assert response.status_code == 502
                data = response.get_json()
                assert data["code"] == "LLM_INVALID_RESPONSE"

    def test_ai_search_network_failure(self, client):
        """POST /api/ai-search handles upstream request exception returning 502 LLM_REQUEST_FAILED."""
        import requests
        with patch.dict(os.environ, {"GEMINI_API_KEY": "fake_gemini_test_key"}):
            with patch("sevabot_backend._call_gemini_search", side_effect=requests.exceptions.ConnectTimeout("Timeout")):
                response = client.post("/api/ai-search", json={"query": "farmer scheme"})
                assert response.status_code == 502
                data = response.get_json()
                assert data["code"] == "LLM_REQUEST_FAILED"

    def test_ai_search_options_preflight(self, client):
        """OPTIONS /api/ai-search returns 200 for CORS preflight."""
        response = client.options("/api/ai-search")
        assert response.status_code == 200


# ============================================================================
# 5. /api/match ENDPOINT TESTS (QUESTIONNAIRE ELIGIBILITY)
# ============================================================================

class TestMatchEndpoint:
    def test_match_agriculture_sector_success(self, client):
        """POST /api/match for Agriculture Sector returns relevant crop insurance scheme."""
        payload = {
            "occupation": "Agriculture Sector",
            "userAnswers": {
                "What kind of support do you need?": "Crop insurance",
                "What is your annual family income?": "Any"
            }
        }
        response = client.post("/api/match", json=payload)
        assert response.status_code == 200
        schemes = response.get_json()
        assert len(schemes) == 1
        assert schemes[0]["name"] == "Pradhan Mantri Fasal Bima Yojana"
        assert schemes[0]["target"] == "Agriculture Sector"

    def test_match_medical_sector_success(self, client):
        """POST /api/match for Medical Sector returns hospitalization schemes."""
        payload = {
            "occupation": "Medical Sector",
            "userAnswers": {
                "What is your primary healthcare requirement?": "Hospitalization / Surgery",
                "What is your annual family income?": "Below ₹1 Lakh"
            }
        }
        response = client.post("/api/match", json=payload)
        assert response.status_code == 200
        schemes = response.get_json()
        assert len(schemes) >= 1
        assert any(s["name"] == "Ayushman Bharat PMJAY" for s in schemes)

    def test_match_education_sector_success(self, client):
        """POST /api/match for Education Sector returns tuition fee schemes."""
        payload = {
            "occupation": "Education Sector",
            "userAnswers": {
                "Are you seeking support for tuition or hostel fees?": "Tuition Fee",
                "What is your annual family income?": "Below ₹2 Lakhs"
            }
        }
        response = client.post("/api/match", json=payload)
        assert response.status_code == 200
        schemes = response.get_json()
        assert len(schemes) >= 1
        assert any(s["name"] == "Gujarat Vhali Dikri Yojana" for s in schemes)

    def test_match_empty_payload(self, client):
        """POST /api/match with empty JSON body returns 200 with empty list."""
        response = client.post("/api/match", json={})
        assert response.status_code == 200
        assert response.get_json() == []

    def test_match_unknown_occupation(self, client):
        """POST /api/match with an unknown occupation returns empty list."""
        response = client.post("/api/match", json={"occupation": "Astronaut", "userAnswers": {}})
        assert response.status_code == 200
        assert response.get_json() == []


# ============================================================================
# 6. /chat ENDPOINT TESTS (LLM & RULE-BASED FALLBACK)
# ============================================================================

class TestChatEndpoint:
    def test_chat_empty_message(self, client):
        """POST /chat with empty message returns a friendly greeting."""
        response = client.post("/chat", json={"message": "", "session_id": "test_empty_sess"})
        assert response.status_code == 200
        data = response.get_json()
        assert "Hello!" in data["reply"]

    def test_chat_mocked_llm_response(self, client):
        """POST /chat when LLM responds returns the generated answer and updates session state."""
        mock_reply = "Based on official records, the PM KISAN scheme provides 6000 INR per year."
        with patch("sevabot_backend.generate_llm_chat_reply", return_value=mock_reply):
            response = client.post("/chat", json={"message": "tell me about PM KISAN", "session_id": "sess_llm_1"})
            assert response.status_code == 200
            data = response.get_json()
            assert data["reply"] == mock_reply

    def test_chat_rule_based_fallback_state_machine(self, client):
        """POST /chat falls back to rule-based state machine when LLM is unavailable."""
        with patch("sevabot_backend.generate_llm_chat_reply", return_value=None):
            # Step 1: Farmer inquiry
            sess_id = "test_farmer_fsm"
            resp1 = client.post("/chat", json={"message": "I am a farmer", "session_id": sess_id})
            assert resp1.status_code == 200
            assert "small or large farmer" in resp1.get_json()["reply"]

            # Step 2: Next turn in state machine
            resp2 = client.post("/chat", json={"message": "small", "session_id": sess_id})
            assert resp2.status_code == 200
            assert "own your agricultural land" in resp2.get_json()["reply"]

            # Step 3: Final confirmation turn
            resp3 = client.post("/chat", json={"message": "yes", "session_id": sess_id})
            assert resp3.status_code == 200
            assert "financial assistance" in resp3.get_json()["reply"]

    def test_chat_options_preflight(self, client):
        """OPTIONS /chat returns 200 for CORS preflight."""
        response = client.options("/chat")
        assert response.status_code == 200


# ============================================================================
# 7. /api/tts ENDPOINT TESTS (MOCKED TEXT-TO-SPEECH)
# ============================================================================

class TestTtsEndpoint:
    def test_tts_empty_text(self, client):
        """POST /api/tts with empty text returns 400."""
        response = client.post("/api/tts", json={"text": ""})
        assert response.status_code == 400
        assert response.get_json()["error"] == "No text"

    def test_tts_missing_payload(self, client):
        """POST /api/tts with empty JSON payload returns 400."""
        response = client.post("/api/tts", json={})
        assert response.status_code == 400
        assert response.get_json()["error"] == "No text"

    def test_tts_success_mocked_gtts(self, client):
        """POST /api/tts with mocked gTTS returns 200 and an audio_url."""
        with patch("app.gTTS") as mock_gtts_class:
            mock_gtts_instance = MagicMock()
            mock_gtts_class.return_value = mock_gtts_instance

            response = client.post("/api/tts", json={"text": "Welcome to SevaBot", "lang": "en"})
            assert response.status_code == 200
            data = response.get_json()
            assert "audio_url" in data
            assert data["audio_url"].startswith("/audio/tts_")
            assert data["audio_url"].endswith(".mp3")
            mock_gtts_instance.save.assert_called_once()

    def test_tts_service_error_handling(self, client):
        """POST /api/tts handles gTTS exception returning 500 error JSON."""
        with patch("app.gTTS", side_effect=Exception("TTS synthesis error")):
            response = client.post("/api/tts", json={"text": "Fail test", "lang": "en"})
            assert response.status_code == 500
            data = response.get_json()
            assert "TTS synthesis error" in data["error"]


# ============================================================================
# 8. USER PROFILE & SAVED SCHEMES ENDPOINTS (WITH AUTH ACCESS CONTROL)
# ============================================================================

class TestUserProfileAndSavedSchemes:
    def test_save_profile_missing_phone(self, client):
        """POST /api/user/save with missing phone returns 400."""
        response = client.post("/api/user/save", json={"name": "No Phone"})
        assert response.status_code == 400
        assert "Phone number is required" in response.get_json()["error"]

    def test_save_and_update_profile_success(self, client):
        """POST /api/user/save creates a profile and securely updates existing user data with token."""
        phone = "9876543210"
        payload = {
            "phone": phone,
            "name": "Ramesh Kumar",
            "age": "42",
            "address": "Gandhi Nagar, Bengaluru",
            "pin": "560001"
        }
        # 1. Create initial profile (returns auth token)
        resp1 = client.post("/api/user/save", json=payload)
        assert resp1.status_code == 200
        data1 = resp1.get_json()
        assert data1["success"] is True
        assert "token" in data1
        auth_token = data1["token"]

        # Verify in isolated test database
        with client.application.app_context():
            user = backend.db.session.get(backend.UserProfile, phone)
            assert user is not None
            assert user.name == "Ramesh Kumar"
            assert user.age == "42"

        # 2. Update profile name using the issued auth token
        update_payload = {"phone": phone, "name": "Ramesh K."}
        headers = {"Authorization": f"Bearer {auth_token}"}
        resp2 = client.post("/api/user/save", json=update_payload, headers=headers)
        assert resp2.status_code == 200

        with client.application.app_context():
            updated_user = backend.db.session.get(backend.UserProfile, phone)
            assert updated_user.name == "Ramesh K."
            assert updated_user.pin == "560001"  # Preserved

    def test_add_user_scheme_missing_fields(self, client):
        """POST /api/user/schemes_add missing phone or scheme_name returns 400."""
        resp1 = client.post("/api/user/schemes_add", json={"phone": "9876543210"})
        assert resp1.status_code == 400
        assert resp1.get_json()["error"] == "Missing data"

        resp2 = client.post("/api/user/schemes_add", json={"scheme_name": "KCC"})
        assert resp2.status_code == 400
        assert resp2.get_json()["error"] == "Missing data"

    def test_add_and_get_user_schemes(self, client):
        """POST /api/user/schemes_add saves scheme and GET /api/user/schemes_get retrieves it with token."""
        phone = "9123456789"
        scheme_name = "Kisan Credit Card (KCC)"
        token = generate_auth_token(phone)
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Add scheme
        add_resp = client.post(
            "/api/user/schemes_add",
            json={"phone": phone, "scheme_name": scheme_name},
            headers=headers
        )
        assert add_resp.status_code == 200
        assert add_resp.get_json()["success"] is True

        # 2. Add duplicate scheme (should be idempotent)
        dup_resp = client.post(
            "/api/user/schemes_add",
            json={"phone": phone, "scheme_name": scheme_name},
            headers=headers
        )
        assert dup_resp.status_code == 200
        assert dup_resp.get_json()["success"] is True

        # 3. Retrieve user schemes
        get_resp = client.get(f"/api/user/schemes_get?phone={phone}", headers=headers)
        assert get_resp.status_code == 200
        schemes = get_resp.get_json()
        assert len(schemes) == 1
        assert schemes[0]["name"] == scheme_name
        assert schemes[0]["status"] == "Applied"

    def test_get_user_schemes_empty_phone(self, client):
        """GET /api/user/schemes_get with empty phone returns empty list."""
        resp = client.get("/api/user/schemes_get?phone=")
        assert resp.status_code == 200
        assert resp.get_json() == []

    def test_get_user_schemes_unknown_user(self, client):
        """GET /api/user/schemes_get for phone with no saved schemes returns empty list."""
        phone = "0000000000"
        token = generate_auth_token(phone)
        headers = {"Authorization": f"Bearer {token}"}
        resp = client.get(f"/api/user/schemes_get?phone={phone}", headers=headers)
        assert resp.status_code == 200
        assert resp.get_json() == []


# ============================================================================
# 9. API ERROR HANDLERS (404 & 405)
# ============================================================================

class TestApiErrorHandlers:
    def test_api_not_found_returns_json(self, client):
        """GET an unmapped /api/ endpoint returns 404 with standard JSON structure."""
        response = client.get("/api/unknown-endpoint-xyz")
        assert response.status_code == 404
        data = response.get_json()
        assert "error" in data
        assert "not found" in data["error"].lower()

    def test_api_method_not_allowed_returns_json(self, client):
        """PUT /api/schemes returns 405 with standard JSON structure."""
        response = client.put("/api/schemes")
        assert response.status_code == 405
        data = response.get_json()
        assert data["code"] == "METHOD_NOT_ALLOWED"


# ============================================================================
# 10. SECURITY & ACCESS CONTROL TESTS (NEW DEDICATED SUITE)
# ============================================================================

class TestSecurityAndAccessControl:
    def test_unauthorized_profile_update_blocked(self, client):
        """Attempting to update an existing user's profile without an auth token returns 401."""
        phone = "9555123456"
        # Create profile first
        resp1 = client.post("/api/user/save", json={"phone": phone, "name": "Original Name"})
        assert resp1.status_code == 200
        assert "token" in resp1.get_json()

        # Attacker tries to overwrite name without providing token
        resp2 = client.post("/api/user/save", json={"phone": phone, "name": "Hacked Name"})
        assert resp2.status_code == 401
        assert resp2.get_json()["code"] == "UNAUTHORIZED"

        # Attacker tries with a fake or someone else's token
        fake_token = generate_auth_token("9111111111")
        resp3 = client.post(
            "/api/user/save",
            json={"phone": phone, "name": "Hacked Name"},
            headers={"Authorization": f"Bearer {fake_token}"}
        )
        assert resp3.status_code == 401
        assert resp3.get_json()["code"] == "UNAUTHORIZED"

    def test_unauthorized_schemes_get_blocked(self, client):
        """Attempting to view another user's saved schemes without a token returns 401."""
        phone = "9555987654"
        token = generate_auth_token(phone)
        # Add a scheme
        client.post(
            "/api/user/schemes_add",
            json={"phone": phone, "scheme_name": "Kisan Credit Card (KCC)"},
            headers={"Authorization": f"Bearer {token}"}
        )

        # Attacker requests schemes with no token
        unauth_resp = client.get(f"/api/user/schemes_get?phone={phone}")
        assert unauth_resp.status_code == 401
        assert unauth_resp.get_json()["code"] == "UNAUTHORIZED"

        # Attacker requests with mismatched token
        other_token = generate_auth_token("9222222222")
        mismatch_resp = client.get(
            f"/api/user/schemes_get?phone={phone}",
            headers={"Authorization": f"Bearer {other_token}"}
        )
        assert mismatch_resp.status_code == 401
        assert mismatch_resp.get_json()["code"] == "UNAUTHORIZED"

    def test_unauthorized_schemes_add_blocked(self, client):
        """Attempting to add a scheme without an auth token returns 401."""
        phone = "9777123456"
        resp = client.post("/api/user/schemes_add", json={"phone": phone, "scheme_name": "KCC"})
        assert resp.status_code == 401
        assert resp.get_json()["code"] == "UNAUTHORIZED"

    def test_tampered_token_rejected(self, client):
        """A tampered or modified signature in the auth token is rejected with 401."""
        phone = "9888123456"
        token = generate_auth_token(phone)
        tampered_token = token[:-5] + "00000"

        resp = client.get(
            f"/api/user/schemes_get?phone={phone}",
            headers={"Authorization": f"Bearer {tampered_token}"}
        )
        assert resp.status_code == 401
        assert resp.get_json()["code"] == "UNAUTHORIZED"

    def test_invalid_phone_formats_rejected(self, client):
        """Invalid phone formats (SQL injection, scripts, too long) are rejected with 400."""
        malicious_phones = [
            "98765' OR '1'='1",
            "<script>alert(1)</script>",
            "123",  # Too short
            "123456789012345678901234567890",  # Too long
            "phone_number_abc"
        ]
        for bad_phone in malicious_phones:
            resp = client.post("/api/user/save", json={"phone": bad_phone, "name": "Test"})
            assert resp.status_code == 400
            assert resp.get_json()["code"] == "INVALID_PHONE"

    def test_query_length_validation(self, client):
        """Massive queries exceeding 500 chars are rejected to protect against resource exhaustion."""
        long_query = "a" * 501
        resp_ai = client.post("/api/ai-search", json={"query": long_query})
        assert resp_ai.status_code == 400
        assert resp_ai.get_json()["code"] == "QUERY_TOO_LONG"

        resp_semantic = client.post("/api/semantic-search", json={"query": long_query})
        assert resp_semantic.status_code == 400
        assert resp_semantic.get_json()["code"] == "QUERY_TOO_LONG"

    def test_tts_text_length_validation(self, client):
        """TTS requests exceeding 1000 characters are rejected with 400."""
        long_text = "Hello " * 250  # > 1000 chars
        resp = client.post("/api/tts", json={"text": long_text})
        assert resp.status_code == 400
        assert resp.get_json()["code"] == "TEXT_TOO_LONG"

    def test_safe_audio_cleanup_preserves_active_files(self):
        """Audio cleanup deletes files older than 24 hours while strictly preserving active ones."""
        with tempfile.TemporaryDirectory() as temp_audio_dir:
            now = time.time()

            # 1. Old generated file (> 24 hours old)
            old_file = os.path.join(temp_audio_dir, "tts_old_sample.mp3")
            with open(old_file, "w") as f:
                f.write("old audio content")
            os.utime(old_file, (now - 90000, now - 90000))

            # 2. Fresh generated file (< 24 hours old, active)
            new_file = os.path.join(temp_audio_dir, "tts_fresh_sample.mp3")
            with open(new_file, "w") as f:
                f.write("new audio content")
            os.utime(new_file, (now - 100, now - 100))

            # 3. Non-generated file (should NEVER be deleted even if old)
            static_file = os.path.join(temp_audio_dir, "system_sound.mp3")
            with open(static_file, "w") as f:
                f.write("system sound")
            os.utime(static_file, (now - 90000, now - 90000))

            deleted = cleanup_old_audio_files(max_age_seconds=86400, audio_dir=temp_audio_dir)
            assert deleted == 1

            # Assert old file deleted
            assert not os.path.exists(old_file), "Old TTS file was not deleted"
            # Assert fresh file preserved
            assert os.path.exists(new_file), "Active TTS file was erroneously deleted"
            # Assert non-generated file preserved
            assert os.path.exists(static_file), "Non-generated file was erroneously deleted"

    def test_api_key_redaction_in_error_responses(self, client):
        """Ensure Google/Gemini API keys are never exposed in error responses."""
        fake_secret_key = "AIzaSyD-FakeSecretKeyForTestingLeakage123"
        leaking_error = f"Connection failed to https://generativelanguage.googleapis.com/v1beta/models/gemini?key={fake_secret_key}"

        with patch.dict(os.environ, {"GEMINI_API_KEY": fake_secret_key}):
            with patch("sevabot_backend._call_gemini_search", side_effect=Exception(leaking_error)):
                response = client.post("/api/ai-search", json={"query": "farmer scheme"})
                data = response.get_json()
                response_text = json.dumps(data)
                # Verify secret key was redacted
                assert fake_secret_key not in response_text
                assert "[REDACTED]" in response_text
