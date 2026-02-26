from fastapi import APIRouter, Body

from mock_data.recordings import CALL_ANALYSIS

router = APIRouter()


@router.get("/recordings/{recording_id}")
def get_recording_analysis(recording_id: str):
    return CALL_ANALYSIS


@router.post("/todos/{todo_id}/email")
def generate_email(todo_id: str, body: dict = Body(...)):
    return {
        "subject": "Revised Pricing Proposal — Phased Implementation Option",
        "body": """Hi Sarah,

Thank you for the detailed discussion yesterday regarding pricing and implementation timelines. I appreciate your transparency about the budget constraints, and I've put together a revised proposal that addresses your concerns.

Based on our conversation, I'd like to propose a phased approach:

Phase 1 (Q1-Q2): Core platform deployment — $180,000
Phase 2 (Q3): Analytics & reporting add-on — $60,000
Annual commitment discount: 11% applied to total

This structure allows your team to validate ROI before committing to the full suite, and keeps the effective annual cost well within the $300-$350K range we discussed.

For detailed ROI breakdown, Would Thursday work for a quick 15-minute call to walk through the numbers with your CFO?

Best regards,
Alex""",
    }
