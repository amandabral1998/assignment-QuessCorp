from typing import List
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from app.db.mongoDB import db
from app.schemas.user_schema import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/api/employees", tags=["Employee Management"])


def to_employee(doc: dict) -> EmployeeResponse:
    return EmployeeResponse(
        id=str(doc.get("_id")),
        employee_id=doc.get("employee_id", ""),
        full_name=doc.get("full_name", ""),
        email=doc.get("email", ""),
        department=doc.get("department", ""),
    )


def parse_object_id(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid employee id")
    return ObjectId(value)


@router.get("/", response_model=List[EmployeeResponse])
def list_employees() -> List[EmployeeResponse]:
    return [to_employee(doc) for doc in db.employees.find().sort("full_name", 1)]


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate) -> EmployeeResponse:
    data = payload.model_dump()
    data["email"] = data["email"].lower()
    if db.employees.find_one({"employee_id": data["employee_id"]}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee ID already exists")
    if db.employees.find_one({"email": data["email"]}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    inserted = db.employees.insert_one(data)
    doc = db.employees.find_one({"_id": inserted.inserted_id})
    return to_employee(doc)


@router.delete("/{employee_id}")
def delete_employee(employee_id: str) -> dict:
    result = db.employees.delete_one({"_id": parse_object_id(employee_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return {"message": "Employee removed"}
