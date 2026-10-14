# SevaBot AI

SevaBot AI is an intelligent, multilingual welfare assistance platform designed to help citizens, farmers, students, and workers discover, evaluate, and apply for central and state government schemes across India.

## Key Features

- **Full-App Multilingual Switcher:** Real-time UI and speech translation across **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिंदी)**.
- **Personalized Scheme Matching:** Step-by-step interactive questionnaire matching applicants against verified eligibility rules.
- **Multilingual AI & Voice Assistant:** Conversational AI chatbot powered by LLM and state-machine fallback, supporting Speech-to-Text and Text-to-Speech in English, Kannada, and Hindi.
- **Semantic & AI Search:** Natural language search and TF-IDF semantic search to find relevant welfare schemes based on situation descriptions.
- **User Dashboard & Scheme Tracking:** Save schemes, view mandatory document checklists, and track application steps.
- **Automated Test Suite:** Comprehensive test coverage for all API endpoints, access control, and sanitization.

## Architecture

- **Frontend (`frontend/`):** React 19 + Vite modern UI with custom glassmorphic styling, responsive layout, and dedicated `LanguageProvider`.
- **Backend (`app.py` & `SevaBots-main/`):** Python Flask with SQLAlchemy SQLite database, HMAC token security, TF-IDF vectorization, Gemini LLM integration, Whisper STT, and Google TTS.
- **Tests (`tests/`):** Pytest test suite validating security, endpoints, and data isolation.

## Getting Started

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+ and `npm`

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r SevaBots-main/requirements.txt
pip install pytest pytest-mock gTTS

# Run the Flask backend server (port 5000)
python app.py
```

### 3. Frontend Setup
```bash
# Navigate to the React frontend
cd frontend

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

### 4. Running Backend Tests
```bash
python -m pytest tests/test_api.py -v
```

## License
MIT
