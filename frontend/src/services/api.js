const API_BASE_URL = "http://localhost:8000/api";

export const getStoredToken = () => localStorage.getItem("smarthire_token");
export const setStoredToken = (token) => localStorage.setItem("smarthire_token", token);
export const removeStoredToken = () => localStorage.removeItem("smarthire_token");

export const getStoredUser = () => {
  const u = localStorage.getItem("smarthire_user");
  return u ? JSON.parse(u) : { id: 1, full_name: "Demo Candidate", email: "candidate@infosys.com", role: "candidate" };
};
export const setStoredUser = (user) => localStorage.setItem("smarthire_user", JSON.stringify(user));

// Default Mock Fallback State for offline/instant evaluation
export const mockData = {
  candidateDashboard: {
    user_name: "Demo Candidate",
    total_interviews: 6,
    completed_interviews: 6,
    average_overall_score: 84.5,
    resumes_uploaded: 2,
    skill_breakdown: [
      { skill: "Communication", score: 86.0 },
      { skill: "Confidence", score: 82.0 },
      { skill: "Technical Accuracy", score: 85.5 },
      { skill: "Professionalism", score: 89.0 }
    ],
    recent_sessions: [
      { id: 101, title: "Full Stack Engineer Technical Interview", category: "Technical", difficulty: "Medium", overall_score: 88.5, performance_rating: "Good", created_at: "2026-07-25 14:30" },
      { id: 102, title: "HR Behavioral & Team Culture Mock", category: "Behavioral", difficulty: "Easy", overall_score: 92.0, performance_rating: "Excellent", created_at: "2026-07-22 10:15" },
      { id: 103, title: "Data Structures & Systems Architecture", category: "Technical", difficulty: "Hard", overall_score: 73.0, performance_rating: "Average", created_at: "2026-07-18 16:45" }
    ]
  },
  recruiterAnalytics: {
    total_candidates: 24,
    average_platform_score: 79.2,
    candidates: [
      { id: 1, full_name: "Rahul Sharma", email: "rahul.s@example.com", interviews_attended: 4, highest_score: 91.5, status: "Ready for Hire" },
      { id: 2, full_name: "Ananya Verma", email: "ananya.v@example.com", interviews_attended: 3, highest_score: 87.0, status: "Ready for Hire" },
      { id: 3, full_name: "Vikram Patel", email: "vikram.p@example.com", interviews_attended: 2, highest_score: 74.5, status: "In Preparation" },
      { id: 4, full_name: "Priya Nair", email: "priya.n@example.com", interviews_attended: 5, highest_score: 84.0, status: "Ready for Hire" }
    ]
  },
  adminMetrics: {
    total_users: 148,
    total_sessions: 520,
    total_resumes_parsed: 210,
    system_status: "Healthy / Operational",
    ai_engine_version: "SmartHire AI v2.4 (OpenAI/Whisper/Vision Active)"
  }
};

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setStoredToken(data.access_token);
      setStoredUser(data.user);
      return data;
    }
  } catch (e) {
    console.warn("Backend API offline, using mock login.");
  }
  
  // Mock login fallback
  const mockUser = {
    id: 1,
    full_name: email.split("@")[0].toUpperCase() || "Candidate User",
    email: email,
    role: email.includes("admin") ? "admin" : (email.includes("recruiter") ? "recruiter" : "candidate")
  };
  setStoredToken("mock_jwt_token_12345");
  setStoredUser(mockUser);
  return { access_token: "mock_jwt_token_12345", user: mockUser };
}

export async function registerUser(email, full_name, password, role = "candidate") {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, full_name, password, role })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, using mock register.");
  }
  const user = { id: Date.now(), email, full_name, role };
  setStoredUser(user);
  return user;
}

export async function uploadResumeFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, using mock resume parser.");
  }
  
  return {
    id: Date.now(),
    filename: file.name,
    parsed_skills: ["Python", "React.js", "FastAPI", "SQL", "Docker", "Machine Learning", "Git"],
    parsed_experience: "2+ Years Software Developer Experience",
    parsed_education: "B.Tech Computer Science & Engineering",
    parsed_summary: "Demonstrated skills in full-stack web application engineering, REST API architecture, and modern cloud deployment."
  };
}

export async function startInterviewSession(category, difficulty, domain, num_questions = 5) {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/interview/start`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ category, difficulty, domain, num_questions })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend API offline, generating local interview session.");
  }

  // Dynamic client-side question generator fallback
  const mockQuestions = [
    {
      id: 1,
      category,
      difficulty,
      domain,
      skill_focus: "System Design & Async",
      question_text: `Explain how you would design a scalable backend for a ${domain} application handling asynchronous events.`
    },
    {
      id: 2,
      category,
      difficulty,
      domain,
      skill_focus: "Data Structures & API Security",
      question_text: "What are JWT access tokens, how do they differ from session cookies, and how do you prevent token theft?"
    },
    {
      id: 3,
      category,
      difficulty,
      domain,
      skill_focus: "Problem Solving & Conflict Resolution",
      question_text: "Describe a situation where a technical deployment failed in production. How did you diagnose and resolve it?"
    },
    {
      id: 4,
      category,
      difficulty,
      domain,
      skill_focus: "Code Performance",
      question_text: "How do you identify and fix database query N+1 problems in web applications?"
    },
    {
      id: 5,
      category,
      difficulty,
      domain,
      skill_focus: "Professional Discipline",
      question_text: "Where do you see yourself technically in 3 years, and how do you continuously expand your domain skills?"
    }
  ];

  return {
    session_id: Date.now(),
    title: `${category} Mock Interview (${domain})`,
    category,
    difficulty,
    domain,
    questions: mockQuestions
  };
}

export async function submitQuestionAnswer(payload) {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/interview/submit-answer`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend offline, recording answer locally.");
  }

  return {
    status: "recorded",
    question_index: payload.question_index,
    speech_metrics: {
      filler_count: payload.candidate_answer.split(" um ").length - 1,
      words_per_minute: 138.0,
      pace_rating: "Optimal Pace",
      clarity_score: 88.0,
      grammar_score: 90.0
    },
    vision_metrics: {
      eye_contact_percentage: 87.5,
      facial_engagement: 88.0,
      hesitation_score: 90.0,
      computed_confidence_score: 88.2
    }
  };
}

export async function finishInterviewSession(sessionId) {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/interview/finish/${sessionId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Backend offline, generating final report evaluation.");
  }

  return {
    session_id: sessionId,
    communication_score: 88.5,
    confidence_score: 84.0,
    technical_score: 86.0,
    professionalism_score: 90.0,
    overall_score: 87.1,
    performance_rating: "Good",
    filler_word_count: 2,
    words_per_minute: 138.5,
    eye_contact_ratio: 0.88,
    strengths: [
      "Clear verbal articulation with well-structured technical answers",
      "High eye-contact consistency during key summary statements",
      "Disciplined time management across all 5 interview questions"
    ],
    weaknesses: [
      "Minor filler word usage during transition pauses ('you know')",
      "Could expand on specific architectural trade-offs in system design"
    ],
    improvement_tips: [
      "Use 2-second silent pauses to maintain an optimal 140 WPM pace.",
      "Incorporate the STAR methodology for behavioral questions.",
      "Recommended Study: Advanced System Design & API Security Patterns."
    ]
  };
}

export async function fetchCandidateDashboard() {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/candidate/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using candidate dashboard mock data.");
  }
  return mockData.candidateDashboard;
}

export async function fetchRecruiterAnalytics() {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/recruiter/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using recruiter analytics mock data.");
  }
  return mockData.recruiterAnalytics;
}

export async function fetchAdminMetrics() {
  try {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Using admin metrics mock data.");
  }
  return mockData.adminMetrics;
}
