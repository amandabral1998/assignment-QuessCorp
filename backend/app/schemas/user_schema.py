from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., example="EMP101")
    full_name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    department: str = Field(..., example="Engineering")


class EmployeeUpdate(BaseModel):
    employee_id: Optional[str] = Field(default=None, description="Updated employee ID")
    full_name: Optional[str] = Field(default=None, description="Updated full name")
    email: Optional[EmailStr] = Field(default=None, description="Updated email address")
    department: Optional[str] = Field(default=None, description="Updated department")


class EmployeeResponse(EmployeeCreate):
    id: Optional[str] = Field(default=None, description="Mongo document id")

    class Config:
        from_attributes = True