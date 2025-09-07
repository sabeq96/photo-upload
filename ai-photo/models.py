from pydantic import BaseModel, HttpUrl
from typing import List, Tuple, Optional, Union


class FaceDetectionFromUrlRequest(BaseModel):
    """Request model for face detection from URL"""
    image_url: HttpUrl
    

class ExistingEmbedding(BaseModel):
    """Model for existing embedding with ID"""
    id: Union[str, int]
    embedding: List[float]


class FaceLocation(BaseModel):
    """Face bounding box coordinates (top, right, bottom, left)"""
    top: int
    right: int
    bottom: int
    left: int


class FaceDetectionResponse(BaseModel):
    """Response model for face detection endpoint"""
    success: bool
    message: str
    faces_found: int
    faces: List[dict]  # List of {location: FaceLocation, encoding: List[float]}


class CompareEmbeddingsRequest(BaseModel):
    """Request model for embedding comparison"""
    new_embedding: List[float]
    existing_embeddings: List[ExistingEmbedding]
    threshold: Optional[float] = 0.6  # Default threshold for face matching


class CompareEmbeddingsResponse(BaseModel):
    """Response model for embedding comparison"""
    success: bool
    message: str
    distance: float
    is_same_person: bool
    confidence: float  # 1 - distance, higher means more similar
    matched_id: Optional[Union[str, int]] = None  # ID of the matched embedding if found


class ErrorResponse(BaseModel):
    """Error response model"""
    success: bool
    error: str
    details: Optional[str] = None
