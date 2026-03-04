import uuid

from fastapi import APIRouter
from pydantic import BaseModel

from mock_data.projects import (
    PROJECTS,
    PROJECTS_METRICS,
    PROJECT_DETAIL,
    MEDDIC_DATA,
    TODO_ITEMS,
    PROJECT_RECORDINGS,
    PROJECT_SETTINGS,
)
from mock_data.templates import TEMPLATES

router = APIRouter()


class SkillConfig(BaseModel):
    name: str
    enabled: bool


class AppConfig(BaseModel):
    name: str
    connected: bool


class CreateProjectBody(BaseModel):
    templateId: str | None = None
    name: str
    company: str
    status: str = "discovery"
    dealValue: int | None = None
    description: str | None = None
    skills: list[SkillConfig] = []
    apps: list[AppConfig] = []
    customPrompt: str | None = None


@router.get("/templates")
def list_templates():
    return {"templates": TEMPLATES}


@router.post("/projects")
def create_project(body: CreateProjectBody):
    project_id = str(uuid.uuid4())[:8]
    new_project = {
        "id": project_id,
        "company": body.company,
        "subtitle": body.name,
        "status": body.status,
        "dealValue": body.dealValue or 0,
        "reps": "0/5",
        "aiInsight": "New",
        "activity": "Just created",
        "forecast": body.dealValue or 0,
    }
    PROJECTS.insert(0, new_project)
    return {"id": project_id}


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
