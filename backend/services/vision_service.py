from typing import Dict

def process_vision_metrics(eye_contact_ratio: float, facial_engagement: float = 0.85, hesitation_events: int = 1) -> Dict:
    """
    Evaluates visual confidence metrics gathered during webcam monitoring.
    """
    eye_contact_pct = min(max(eye_contact_ratio * 100.0, 0.0), 100.0)
    
    # Confidence Score formula components:
    # 1. Eye contact consistency (40%)
    # 2. Facial engagement (35%)
    # 3. Low hesitation (25%)
    
    eye_score = eye_contact_pct
    engagement_score = min(facial_engagement * 100.0, 100.0)
    hesitation_score = max(100.0 - (hesitation_events * 10.0), 40.0)

    confidence_score = round(
        (eye_score * 0.40) + (engagement_score * 0.35) + (hesitation_score * 0.25), 1
    )

    return {
        "eye_contact_percentage": round(eye_contact_pct, 1),
        "facial_engagement": round(engagement_score, 1),
        "hesitation_score": round(hesitation_score, 1),
        "computed_confidence_score": confidence_score
    }
