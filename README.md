# SmartHire AI: AI-Powered Mock Interview & Candidate Assessment Platform
> **Infosys Springboard 8-Week Internship Project**

SmartHire AI is an end-to-end, state-of-the-art AI mock interview platform that conducts technical, HR, behavioral, and aptitude interview simulations. It evaluates candidates through automated speech analysis, webcam vision/eye-contact tracking, resume skill parsing, and a multi-criteria scoring rubric.

---

## 🌟 Key Features & Implemented Modules

1. **User Authentication & Role-Based Access Control (RBAC)**
   - JWT authentication & OAuth2 architecture.
   - Roles: **Candidate**, **Recruiter**, and **Admin**.

2. **Resume Upload & AI Skill Extraction**
   - Automated PDF parsing engine extracting skills, technologies, experience levels, and generating candidate executive summaries.

3. **Adaptive AI Interview Question Engine**
   - Domain-customizable questions (Full Stack, Data Science, DevOps, HR) across 3 difficulty levels (Easy, Medium, Hard).

4. **Speech-to-Text & Communication Analysis**
   - Real-time STT speech transcription.
   - Filler word frequency counter (`"um"`, `"uh"`, `"like"`, `"you know"`).
   - Speaking pace measurement in Words Per Minute (WPM).

5. **Eye-Contact & Vision Tracking**
   - Real-time webcam face-mesh monitoring tracking eye contact consistency %, facial posture, and candidate confidence.

6. **Multi-Criteria Scoring Engine**
   - Formula: `Overall = (Communication × 30%) + (Confidence × 25%) + (Technical × 30%) + (Professionalism × 15%)`
   - Rubric: Excellent (90-100), Good (75-89), Average (60-74), Needs Improvement (40-59), Poor (<40).

7. **Dashboards & Analytics**
   - Candidate performance hub with radar breakdown & weak-area diagnostics.
   - Recruiter candidate evaluation directory & readiness matrix.
   - Admin platform health & AI model telemetry.

8. **PDF Report Export**
   - Instant downloadable candidate assessment reports.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Running the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

### 2. Running the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend web application running at: `http://localhost:3000`

---

## 📦 Pushing Code to Infosys Mentor GitHub Repository

To sync this codebase with your assigned GitHub repository: `https://github.com/springboardmentor441p-coderr/AI-Powered-Mock-Interview-and-Candidate-Assessment-Platform`

Run the following commands in terminal inside `SmartHire-AI`:
```bash
git init
git add .
git commit -m "Initial commit: Complete SmartHire AI platform implementation for Infosys Internship"
git branch -M main
git remote add origin https://github.com/kavuturujanitha7/AI-Powered-Mock-Interview-and-Candidate-Assessment-Platform.git
git push -u origin main
```

---

## 📜 License
Developed for the Infosys Springboard Internship Program.
