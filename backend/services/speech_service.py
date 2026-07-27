import re
from typing import Dict, List

FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "sort of", "kind of", "i mean"]

def analyze_speech_communication(transcript: str, duration_seconds: float = 45.0) -> Dict:
    if not transcript:
        return {
            "filler_count": 0,
            "detected_fillers": [],
            "words_per_minute": 0,
            "pace_rating": "Too Slow",
            "clarity_score": 50.0,
            "grammar_score": 60.0
        }

    words = transcript.strip().split()
    total_words = len(words)
    
    # Calculate WPM
    minutes = max(duration_seconds / 60.0, 0.1)
    wpm = round(total_words / minutes, 1)

    # Pace classification (Optimal speaking pace is 120 - 160 WPM)
    if wpm < 100:
        pace_rating = "Slightly Slow"
    elif 100 <= wpm <= 165:
        pace_rating = "Optimal Pace"
    else:
        pace_rating = "Fast / Rushed"

    # Filler word count
    transcript_lower = transcript.lower()
    detected_fillers = {}
    total_fillers = 0
    for filler in FILLER_WORDS:
        matches = len(re.findall(r'\b' + re.escape(filler) + r'\b', transcript_lower))
        if matches > 0:
            detected_fillers[filler] = matches
            total_fillers += matches

    # Clarity and grammar heuristic metrics
    clarity_score = max(100.0 - (total_fillers * 4.0), 40.0)
    grammar_score = 90.0 if total_words > 15 else 70.0

    return {
        "filler_count": total_fillers,
        "detected_fillers": detected_fillers,
        "words_per_minute": wpm,
        "pace_rating": pace_rating,
        "clarity_score": round(clarity_score, 1),
        "grammar_score": round(grammar_score, 1)
    }
