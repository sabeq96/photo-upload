import face_recognition
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import cv2
from PIL import Image
import io
import requests
from typing import List

from models import (
    FaceDetectionResponse,
    FaceDetectionFromUrlRequest,
    CompareEmbeddingsRequest,
    CompareEmbeddingsResponse,
    ErrorResponse,
    FaceLocation,
    ExistingEmbedding
)

app = FastAPI(
    title="Face Recognition Microservice",
    description="A simple microservice for face detection and embedding comparison",
    version="1.0.0"
)


def load_image_from_upload(upload_file: UploadFile) -> np.ndarray:
    """Load image from uploaded file"""
    try:
        # Read image file
        contents = upload_file.file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB (face_recognition needs RGB)
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(pil_image)
        
        return image_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")


def load_image_from_url(image_url: str) -> np.ndarray:
    """Load image from URL"""
    try:
        # Download image from URL
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()
        
        # Check if content type is an image
        content_type = response.headers.get('content-type', '')
        if not content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="URL does not point to an image")
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(response.content))
        
        # Convert to RGB (face_recognition needs RGB)
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(pil_image)
        
        return image_array
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to download image from URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image from URL: {str(e)}")


def _detect_faces_in_image(image_array: np.ndarray) -> FaceDetectionResponse:
    """Private method to detect faces in image array and return response"""
    try:
        # Find face locations (bounding boxes)
        face_locations = face_recognition.face_locations(image_array)
        
        if not face_locations:
            return FaceDetectionResponse(
                success=True,
                message="No faces detected in the image",
                faces_found=0,
                faces=[]
            )
        
        # Get face encodings (embeddings)
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        # Prepare response data
        faces_data = []
        for i, (location, encoding) in enumerate(zip(face_locations, face_encodings)):
            top, right, bottom, left = location
            faces_data.append({
                "face_id": i,
                "location": {
                    "top": top,
                    "right": right,
                    "bottom": bottom,
                    "left": left
                },
                "embedding": encoding.tolist()  # Convert numpy array to list
            })
        
        return FaceDetectionResponse(
            success=True,
            message=f"Successfully detected {len(faces_data)} face(s)",
            faces_found=len(faces_data),
            faces=faces_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "face-recognition-microservice"}


@app.post("/detect-face", response_model=FaceDetectionResponse)
async def detect_face(image: UploadFile = File(...)):
    """
    Detect faces in an uploaded image and return coordinates + embeddings.
    
    Returns:
    - Face bounding box coordinates (top, right, bottom, left)
    - 128-dimensional face embedding for each detected face
    """
    try:
        # Validate file type
        if not image.content_type or not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Load image
        image_array = load_image_from_upload(image)
        
        # Use private method for face detection
        return _detect_faces_in_image(image_array)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing uploaded image: {str(e)}")


@app.post("/detect-face-from-url", response_model=FaceDetectionResponse)
async def detect_face_from_url(request: FaceDetectionFromUrlRequest):
    """
    Detect faces in an image from URL and return coordinates + embeddings.
    
    Args:
    - image_url: URL of the image to process
    
    Returns:
    - Face bounding box coordinates (top, right, bottom, left)
    - 128-dimensional face embedding for each detected face
    """
    try:
        # Load image from URL
        image_array = load_image_from_url(str(request.image_url))
        
        # Use private method for face detection
        return _detect_faces_in_image(image_array)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image from URL: {str(e)}")


@app.post("/compare-faces", response_model=CompareEmbeddingsResponse)
async def compare_faces(request: CompareEmbeddingsRequest):
    """
    Compare one face embedding to multiple existing face embeddings to determine if any match.
    Returns as soon as a match is found for better performance.
    
    Args:
    - new_embedding: 128-dimensional face embedding vector of the new face
    - existing_embeddings: List of objects with id and 128-dimensional embedding vectors
    - threshold: Distance threshold for matching (default: 0.6)
    
    Returns:
    - distance: Euclidean distance to the closest matching embedding (lower = more similar)
    - is_same_person: Boolean indicating if the new face matches any existing face
    - confidence: Similarity confidence (1 - distance)
    - matched_id: ID of the matched embedding if a match is found
    """
    try:
        # Validate new embedding
        if len(request.new_embedding) != 128:
            raise HTTPException(status_code=400, detail="new_embedding must be 128-dimensional")
        
        # Validate existing embeddings
        if not request.existing_embeddings:
            raise HTTPException(status_code=400, detail="existing_embeddings cannot be empty")
        
        for i, existing_emb_obj in enumerate(request.existing_embeddings):
            if len(existing_emb_obj.embedding) != 128:
                raise HTTPException(status_code=400, detail=f"existing_embeddings[{i}].embedding must be 128-dimensional")
        
        # Convert new embedding to numpy array
        new_emb = np.array(request.new_embedding)
        
        # Compare against each existing embedding, return early on match
        for existing_emb_obj in request.existing_embeddings:
            existing_emb = np.array(existing_emb_obj.embedding)
            
            # Calculate distance using face_recognition's built-in function
            distance = face_recognition.face_distance([existing_emb], new_emb)[0]
            
            # Check if this is a match
            if distance <= request.threshold:
                # Calculate confidence (inverse of distance, capped at 1.0)
                confidence = max(0.0, min(1.0, 1.0 - distance))
                
                return CompareEmbeddingsResponse(
                    success=True,
                    message="Face embeddings compared successfully - match found",
                    distance=float(distance),
                    is_same_person=True,
                    confidence=float(confidence),
                    matched_id=existing_emb_obj.id
                )
        
        # If we reach here, no match was found
        # Calculate the best (lowest) distance for reporting purposes
        existing_embs = [np.array(emb_obj.embedding) for emb_obj in request.existing_embeddings]
        distances = face_recognition.face_distance(existing_embs, new_emb)
        best_distance = float(min(distances))
        
        # Calculate confidence for the best match
        confidence = max(0.0, min(1.0, 1.0 - best_distance))
        
        return CompareEmbeddingsResponse(
            success=True,
            message="Face embeddings compared successfully - no match found",
            distance=best_distance,
            is_same_person=False,
            confidence=confidence
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing embeddings: {str(e)}")


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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
