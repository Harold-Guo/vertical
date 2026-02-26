from fastapi import APIRouter

from mock_data.projects import (
    PROJECTS,
    PROJECTS_METRICS,
    PROJECT_DETAIL,
    MEDDIC_DATA,
    TODO_ITEMS,
    PROJECT_RECORDINGS,
    PROJECT_SETTINGS,
)

router = APIRouter()


@router.get("/projects")
def list_projects():
    return {
        "projects": PROJECTS,
        "metrics": PROJECTS_METRICS,
        "pagination": {"page": 1, "totalPages": 2},
    }


@router.get("/projects/{project_id}")
def get_project(project_id: str):
    return PROJECT_DETAIL


@router.get("/projects/{project_id}/meddic")
def get_meddic(project_id: str):
    return MEDDIC_DATA


@router.get("/projects/{project_id}/todos")
def get_todos(project_id: str):
    return {"todos": TODO_ITEMS}


@router.get("/projects/{project_id}/recordings")
def get_project_recordings(project_id: str):
    return {"recordings": PROJECT_RECORDINGS}


@router.get("/projects/{project_id}/settings")
def get_project_settings(project_id: str):
    return PROJECT_SETTINGS
