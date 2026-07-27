import random
from typing import List, Dict

QUESTION_BANK = {
    "Technical": {
        "Easy": [
            "What is the difference between synchronous and asynchronous programming in Python/JavaScript?",
            "Can you explain the main principles of Object-Oriented Programming (OOP)?",
            "What are REST APIs and what are the standard HTTP methods used?",
            "Explain the difference between SQL relational databases and NoSQL databases.",
            "How does Git version control work, and what is the difference between git fetch and git pull?"
        ],
        "Medium": [
            "How would you optimize a database query that is taking too long to execute?",
            "Explain how JWT (JSON Web Token) authentication works end-to-end.",
            "What is state management in React, and when would you use Context API vs Redux?",
            "How do microservices communicate with each other, and what are the trade-offs of microservices vs monoliths?",
            "Explain the concept of CORS (Cross-Origin Resource Sharing) and how to handle it securely."
        ],
        "Hard": [
            "How would you design a rate-limiting system for a high-traffic REST API backend?",
            "Explain memory management, garbage collection, and how memory leaks occur in web applications.",
            "How do you ensure data consistency across distributed database systems using the CAP theorem?",
            "Design a scalable real-time chat architecture using WebSockets and Redis pub/sub.",
            "Explain neural network overfitting and what techniques (regularization, dropout, early stopping) prevent it."
        ]
    },
    "HR": {
        "Easy": [
            "Tell me about yourself and your professional background.",
            "Why do you want to join our organization as a candidate?",
            "What are your greatest strengths and areas where you are working to improve?",
            "Where do you see yourself in 3 to 5 years?",
            "What environment helps you perform at your best?"
        ],
        "Medium": [
            "Describe a project you worked on that you are most proud of, and your exact contribution.",
            "How do you prioritize your tasks when handling multiple tight deadlines?",
            "Why are you looking to make a transition or take on this role at this stage of your career?",
            "How do you stay updated with rapid technological developments in your domain?",
            "What motivates you to deliver high-quality work consistently under pressure?"
        ],
        "Hard": [
            "Describe a time when you received constructive criticism from a mentor or peer. How did you react?",
            "If your project requirements change drastically two days before a launch, how do you handle it?",
            "What would you do if you disagreed strongly with an engineering decision made by a senior team member?",
            "Tell me about a time you made a significant mistake in a production environment. How did you resolve it?",
            "How do you handle working with team members who have communication or work style conflicts?"
        ]
    },
    "Behavioral": {
        "Medium": [
            "Give an example of a situation where you had to lead a project or initiative.",
            "Tell me about a time when you solved a complex problem using a creative approach.",
            "Describe a scenario where you failed to meet a target. What did you learn?",
            "How do you build trust when collaborating with cross-functional teams (e.g. Design, Product, QA)?",
            "Describe a situation where you had to explain a complex technical concept to a non-technical stakeholder."
        ]
    },
    "Aptitude": {
        "Medium": [
            "If 5 servers process 500 requests in 5 minutes, how many servers are needed to process 2,000 requests in 10 minutes?",
            "A project timeline is reduced by 25%. By what percentage must team efficiency increase to finish on time?",
            "In a system with 99.9% uptime requirement, how many minutes of downtime are allowed per year (approx 525,600 min/yr)?",
            "If an algorithm runs in O(N log N) time, how does execution time grow when input size increases from 1,000 to 10,000 items?",
            "You have 8 identical-looking balls, 1 of which is slightly heavier. Using a balance scale, what is the minimum number of weighings needed to find the heavy ball?"
        ]
    }
}

def generate_interview_questions(category: str, difficulty: str, domain: str, num_questions: int = 5, skills: List[str] = None) -> List[Dict]:
    cat_pool = QUESTION_BANK.get(category, QUESTION_BANK["Technical"])
    diff_pool = cat_pool.get(difficulty, list(cat_pool.values())[0])

    selected_questions = random.sample(diff_pool, min(num_questions, len(diff_pool)))

    # Skill personalization
    result = []
    for i, q in enumerate(selected_questions):
        skill_tag = skills[i % len(skills)] if skills else domain
        result.append({
            "id": i + 1,
            "category": category,
            "difficulty": difficulty,
            "domain": domain,
            "skill_focus": skill_tag,
            "question_text": q
        })
    return result
