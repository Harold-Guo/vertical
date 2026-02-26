from fastapi import APIRouter

from mock_data.coaching import COACHING_DATA

router = APIRouter()


@router.get("/coaching")
def get_coaching():
    return COACHING_DATA
