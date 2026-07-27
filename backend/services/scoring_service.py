from typing import Dict, List

def calculate_overall_assessment(
    communication_score: float,
    confidence_score: float,
    technical_score: float,
    professionalism_score: float,
    filler_word_count: int,
    words_per_minute: float,
    eye_contact_ratio: float
) -> Dict:
    """
    Computes overall weighted assessment score according to SmartHire AI rubric:
    Overall = (Communication * 30%) + (Confidence * 25%) + (Technical * 30%) + (Professionalism * 15%)
    """
    comm = max(min(communication_score, 100.0), 0.0)
    conf = max(min(confidence_score, 100.0), 0.0)
    tech = max(min(technical_score, 100.0), 0.0)
    prof = max(min(professionalism_score, 100.0), 0.0)

    overall = (comm * 0.30) + (conf * 0.25) + (tech * 0.30) + (prof * 0.15)
    overall = round(overall, 1)

    # Determine Rating Rubric
    if overall >= 90.0:
        rating = "Excellent"
    elif overall >= 75.0:
        rating = "Good"
    elif overall >= 60.0:
        rating = "Average"
    elif overall >= 40.0:
        rating = "Needs Improvement"
    else:
        rating = "Poor"

    # AI Strengths Identification
    strengths = []
    if comm >= 80:
        strengths.append("Clear verbal expression with structured sentences")
    if conf >= 80:
        strengths.append("High eye contact consistency and steady facial posture")
    if tech >= 80:
        strengths.append("Accurate technical terminology and comprehensive domain answers")
    if prof >= 80:
        strengths.append("Disciplined time management and professional interview etiquette")
    if not strengths:
        strengths.append("Active participation and adherence to interview flow")

    # AI Weaknesses & Predictions
    weaknesses = []
    if filler_word_count > 5:
        weaknesses.append(f"Frequent use of filler words ({filler_word_count} occurrences detected)")
    if eye_contact_ratio < 0.65:
        weaknesses.append("Intermittent gaze deviation from camera during technical explanations")
    if tech < 70:
        weaknesses.append("Answers lacked specific architectural examples and keyword depth")
    if words_per_minute > 170:
        weaknesses.append("Speaking pace was rushed, which can reduce listener comprehension")
    elif words_per_minute < 95:
        weaknesses.append("Speaking pace was slow with extended pause durations")
    if not weaknesses:
        weaknesses.append("Minor polish needed in concise summary transitions")

    # Actionable Improvement Recommendations & Learning Resources
    improvement_tips = [
        "Practice 2-second silent pauses instead of defaulting to filler words ('um', 'like').",
        "Maintain focus on the camera lens during key summary statements to boost eye-contact rating.",
        "Use the STAR method (Situation, Task, Action, Result) for behavioral and HR responses.",
        "Recommended Resource: High-Frequency System Design & Data Structures Interview Guide."
    ]

    return {
        "communication_score": round(comm, 1),
        "confidence_score": round(conf, 1),
        "technical_score": round(tech, 1),
        "professionalism_score": round(prof, 1),
        "overall_score": overall,
        "performance_rating": rating,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvement_tips": improvement_tips
    }
