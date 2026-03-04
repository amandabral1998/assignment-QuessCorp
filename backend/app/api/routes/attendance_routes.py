from typing import List
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from app.db.mongoDB import db
from app.schemas.attendance_schema import AttendanceCreate, AttendanceResponse

router = APIRouter(prefix="/api/attendance", tags=["Attendance Management"])


def to_attendance(doc: dict) -> AttendanceResponse:
    return AttendanceResponse(
        id=str(doc.get("_id")),
        employee_id=doc.get("employee_id", ""),
        status=doc.get("status", "present"),
        date=doc.get("date"),
    )


def employee_exists(employee_id: str) -> bool:
    return db.employees.find_one({"employee_id": employee_id}) is not None


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(payload: AttendanceCreate) -> AttendanceResponse:
    if not employee_exists(payload.employee_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    data = payload.model_dump()
    data["date"] = data["date"].isoformat()  # Convert date to ISO string for MongoDB
    inserted = db.attendance.insert_one(data)
    doc = db.attendance.find_one({"_id": inserted.inserted_id})
    return to_attendance(doc)


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(employee_id: str) -> List[AttendanceResponse]:
    if not employee_exists(employee_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return [to_attendance(doc) for doc in db.attendance.find({"employee_id": employee_id}).sort("date", -1)]
