from pydantic import BaseModel
from typing import List, Optional

class DetectFacesRequest(BaseModel):
    """Request model for face detection from photo ID"""
    photo_id: int
    user_id: Optional[str] = None

class DetectFacesResponse(BaseModel):
    """Response model for face detection endpoint"""
    success: bool
    message: str
    photo_id: int
    faces: List[int]

class ProcessFaceRequest(BaseModel):
    """Request model for webhook-like face processing"""
    face_id: int
    threshold: Optional[float] = 0.6
    user_id: Optional[str] = None  # If provided, limit search to this user's faces

class ProcessFaceResponse(BaseModel):
    """Response model for face processing endpoint"""
    success: bool
    message: str
    face_id: int
    person_id: int
    is_existing_person: bool  # True if matched existing person, False if created new
    distance: Optional[float] = None  # Distance to matched face (if any) - lower is better (0.0-2.0)
    matched_face_id: Optional[int] = None  # ID of the face that was matched (if any)

class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool
    error: str
    details: Optional[str] = None
