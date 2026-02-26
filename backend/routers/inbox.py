from fastapi import APIRouter

from mock_data.inbox import INBOX_RECORDINGS, INBOX_METRICS, INBOX_RECORDING_DETAIL

router = APIRouter()


@router.get("/inbox")
def list_inbox():
    return {
        "recordings": INBOX_RECORDINGS,
        "metrics": INBOX_METRICS,
        "pagination": {"page": 1, "totalPages": 1},
    }


@router.get("/inbox/{recording_id}")
def get_inbox_recording(recording_id: str):
    return INBOX_RECORDING_DETAIL
