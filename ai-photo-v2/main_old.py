import face_recognition
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import cv2
from PIL import Image
import os
from typing import List, Optional

from models import (
    DetectFacesRequest,
    DetectFacesResponse,
    ProcessFaceRequest,
    ProcessFaceResponse,
    ErrorResponse
)
from database import db

app = FastAPI(
    title="Face Recognition Microservice v2",
    description="Database-integrated face recognition service with photo and face ID support",
    version="2.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Run migrations and verify sqlite-vec on startup"""
    try:
        # Test database connection and sqlite-vec extension
        print("🔍 Verifying database connection and sqlite-vec extension...")
        conn = db.get_connection()
        conn.close()
        print("✅ Database connection and sqlite-vec extension verified")
        
        # Run migrations
        print("🔄 Running database migrations...")
        from migrations import run_migrations
        run_migrations()
        print("✅ Database migrations completed")
        
    except Exception as e:
        print(f"❌ STARTUP FAILED: {e}")
        raise RuntimeError(f"Application startup failed: {e}") from e

def load_image_from_file_path(file_path: str) -> np.ndarray:
    """Load image from file path"""
    try:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Image file not found: {file_path}")
        
        # Load image with PIL
        pil_image = Image.open(file_path)
        
        # Convert to RGB (face_recognition needs RGB)
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(pil_image)
        
        return image_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")



@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "face-recognition-microservice-v2"}


@app.post("/detect-faces", response_model=DetectFacesResponse)
async def detect_faces(request: DetectFacesRequest):
    """
    Detect faces in a photo by photo ID and save them to the database.
    
    Args:
    - photo_id: ID of the photo in the database
    - user_id: Optional user ID for tracking
    
    Returns:
    - List of face IDs for detected faces
    - Face data is automatically saved to the database
    """
    try:
        # Check if photo exists
        if not db.get_photo_exists(request.photo_id):
            raise HTTPException(status_code=404, detail="Photo not found")
        
        # Get photo file path and metadata
        photo_info = db.get_photo_file_path(request.photo_id)
        if not photo_info:
            raise HTTPException(status_code=404, detail="Photo file not found")
        
        # Load image
        image_array = load_image_from_file_path(photo_info['file_path'])
        
        # Find face locations and encodings
        face_locations = face_recognition.face_locations(image_array)
        
        if not face_locations:
            return DetectFacesResponse(
                success=True,
                message="No faces detected in the photo",
                photo_id=request.photo_id,
                faces=[]
            )
        
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        # Save faces to database and collect face IDs
        face_ids = []
        for location, encoding in zip(face_locations, face_encodings):
            top, right, bottom, left = location
            
            # Save to database
            face_id = db.save_face(
                photo_id=request.photo_id,
                location={
                    "top": int(top),
                    "right": int(right),
                    "bottom": int(bottom),
                    "left": int(left)
                },
                embedding=encoding.tolist(),
                user_id=request.user_id
            )
            
            face_ids.append(face_id)
        
        return DetectFacesResponse(
            success=True,
            message=f"Successfully detected and saved {len(face_ids)} face(s)",
            photo_id=request.photo_id,
            faces=face_ids
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting faces: {str(e)}")

@app.post("/process-face", response_model=ProcessFaceResponse)
async def process_face(request: ProcessFaceRequest):
    """
    Webhook-like endpoint that automatically processes face recognition and assignment.
    Compares the face against existing persons and assigns it immediately when a match is found.
    Creates a new person if no match is found.
    
    Args:
    - face_id: ID of the face to process
    - threshold: Distance threshold for matching (default: 0.6)
    - user_id: Optional - limit search to faces created by this user
    
    Returns:
    - Information about the face processing result including person assignment
    """
    try:
        # Get the face to process
        target_face = db.get_face_embedding(request.face_id)
        if not target_face:
            raise HTTPException(status_code=404, detail="Face not found")
        
        target_embedding = target_face['embedding']
        
        # Use vector search to find similar faces (much faster than manual comparison)
        similar_faces = db.find_similar_faces_vector(
            target_embedding, 
            threshold=request.threshold, 
            user_id=request.user_id,
            limit=1  # We only need the first match
        )
        
        # If we found a similar face, assign to that person immediately
        if similar_faces:
            matched_face = similar_faces[0]  # Take the best match
            
            # Assign the face to the matched person
            success = db.update_face_person(request.face_id, matched_face['person_id'])
            
            if not success:
                raise HTTPException(status_code=500, detail="Failed to assign face to person")
            
            return ProcessFaceResponse(
                success=True,
                message=f"Face matched and assigned to existing person {matched_face['person_id']}",
                face_id=request.face_id,
                person_id=matched_face['person_id'],
                is_existing_person=True,
                distance=matched_face['distance'],
                matched_face_id=matched_face['id']
            )
        
        # No match found - create new person and assign face
        person_id = db.create_person(request.user_id)
        success = db.update_face_person(request.face_id, person_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to assign face to new person")
        
        return ProcessFaceResponse(
            success=True,
            message=f"No match found - created new person {person_id} and assigned face",
            face_id=request.face_id,
            person_id=person_id,
            is_existing_person=False
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing face: {str(e)}")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            success=False,
            error=exc.detail,
            details=None
        ).model_dump()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
