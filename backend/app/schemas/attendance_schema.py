from typing import Optional
from datetime import datetime, date as Date
from pydantic import BaseModel, Field


class AttendanceBase(BaseModel):
    employee_id: str = Field(..., example="EMP101")
    status: str = Field(default="present", example="present")
    date: Date = Field(default_factory=Date.today, example="2025-10-15")


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
    date: Optional[Date] = None


class AttendanceResponse(AttendanceBase):
    id: Optional[str] = Field(default=None, description="Mongo document id")

    class Config:
        from_attributes = True