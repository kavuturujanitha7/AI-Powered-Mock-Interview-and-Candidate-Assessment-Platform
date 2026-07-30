# SmartHire AI: AI-Powered Mock Interview & Candidate Assessment Platform

SmartHire AI is an end-to-end, state-of-the-art AI mock interview platform that conducts interactive conversational Technical, HR, Behavioral, and Aptitude interview simulations. It evaluates candidates through automated speech analysis, webcam vision/eye-contact tracking, resume skill parsing, multi-criteria scoring rubrics, and downloadable assessment reports.

---

## 📌 Quick Verification Sitemap for Mentors & Evaluators

Instead of navigating through every folder, mentors can verify all modules and feature implementations directly using this quick index:

### 📁 Codebase Directory Index
- **Backend Architecture**: [`backend/main.py`](backend/main.py)
- **Database Schema**: [`backend/models.py`](backend/models.py)
- **AI Resume & Skill Parser**: [`backend/services/resume_service.py`](backend/services/resume_service.py)
- **AI Adaptive Question Generator**: [`backend/services/question_service.py`](backend/services/question_service.py)
- **Speech-to-Text & WPM Telemetry**: [`backend/services/speech_service.py`](backend/services/speech_service.py)
- **MediaPipe Vision & Eye-Tracking**: [`backend/services/vision_service.py`](backend/services/vision_service.py)
- **AI Scoring Rubric Engine**: [`backend/services/scoring_service.py`](backend/services/scoring_service.py)
- **Conversational Interview Room UI**: [`frontend/src/pages/InterviewRoomPage.jsx`](frontend/src/pages/InterviewRoomPage.jsx)
- **Webcam Eye-Contact Canvas**: [`frontend/src/components/WebcamMonitor.jsx`](frontend/src/components/WebcamMonitor.jsx)
- **Candidate Analytics Hub**: [`frontend/src/pages/CandidateDashboard.jsx`](frontend/src/pages/CandidateDashboard.jsx)
- **PDF Report Generator**: [`frontend/src/pages/InterviewReportPage.jsx`](frontend/src/pages/InterviewReportPage.jsx)

---

## 🌟 Module & Feature Implementation Matrix

| Module ID | Feature Name | Description & Verification Specs | Source File Reference | Status |
|---|---|---|---|---|
| **MOD-01** | User Authentication & Security | JWT Token Auth, bcrypt password hashing, and user session management | [`backend/auth.py`](backend/auth.py) | ✅ Verified |
| **MOD-02** | Resume PDF Skill Extraction | Extracts technical skills, experience level, and summary from PDF resumes | [`backend/services/resume_service.py`](backend/services/resume_service.py) | ✅ Verified |
| **MOD-03** | Conversational Question Engine | Adaptive AI questions for Technical, HR, Behavioral, and Aptitude across 3 difficulties | [`backend/services/question_service.py`](backend/services/question_service.py) | ✅ Verified |
| **MOD-04** | Live Interview Simulation | Conversational AI Hiring Manager Persona ("Sarah"), webcam feed & audio visualizer | [`frontend/src/pages/InterviewRoomPage.jsx`](frontend/src/pages/InterviewRoomPage.jsx) | ✅ Verified |
| **MOD-05** | Speech-to-Text & WPM Telemetry | Live STT transcription, filler-word detector (`"um"`, `"like"`), WPM pace tracking | [`backend/services/speech_service.py`](backend/services/speech_service.py) | ✅ Verified |
| **MOD-06** | MediaPipe Vision & Posture | Real-time eye-contact consistency %, head posture tracking, and emotion indicator | [`frontend/src/components/WebcamMonitor.jsx`](frontend/src/components/WebcamMonitor.jsx) | ✅ Verified |
| **MOD-07** | AI Multi-Criteria Scoring | Evaluates candidate using rubric: Comm 30%, Conf 25%, Tech 30%, Prof 15% | [`backend/services/scoring_service.py`](backend/services/scoring_service.py) | ✅ Verified |
| **MOD-08** | Performance Hub & PDF Export | Candidate radar charts, weak-area diagnostic, and 1-click downloadable PDF report | [`frontend/src/pages/InterviewReportPage.jsx`](frontend/src/pages/InterviewReportPage.jsx) | ✅ Verified |

---

## 📐 Scoring Formula & Performance Rubric

```math
\text{Overall Score} = (0.30 \times \text{Communication}) + (0.25 \times \text{Confidence}) + (0.30 \times \text{Technical Relevance}) + (0.15 \times \text{Professionalism})
```

### Performance Rating Scale:
- **90–100**: Excellent
- **75–89**: Good
- **60–74**: Average
- **40–59**: Needs Improvement
- **Below 40**: Poor

---

## 🚀 How to Run Locally (1-Click or Manual)

### Option A: 1-Click Execution (Recommended for Windows)
Simply double-click **`start_app.bat`** in the project root folder. It automatically launches the FastAPI backend, React frontend, and opens `http://localhost:3000` in your web browser.

### Option B: Manual Execution

#### 1. Running the Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Interactive API Documentation available at: `http://localhost:8000/docs`

#### 2. Running the Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Web Application running at: `http://localhost:3000`

---

## 📦 GitHub Repository Sync

To sync this codebase with your GitHub repository:
```bash
git add .
git commit -m "Update platform: Conversational AI interviewer flow, clean navbar, and expanded README index"
git push origin main
```
