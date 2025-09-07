# Face Recognition Microservice

A simple FastAPI-based microservice for face detection and embedding comparison. This service provides endpoints to detect faces in images, extract face embeddings, and compare embeddings to determine if faces belong to the same person.

## Features

- 🔍 **Face Detection**: Detect faces in uploaded images or from URLs and return bounding box coordinates
- 🧠 **Face Embeddings**: Extract 128-dimensional face embeddings 
- 🔄 **Face Comparison**: Compare face embeddings to identify if they belong to the same person
- 🌐 **URL Support**: Process images directly from URLs without manual download
- 📚 **Auto Documentation**: Interactive API documentation with Swagger UI
- ✅ **Error Handling**: Comprehensive error handling and validation

## Quick Start

### Option 1: Docker (Recommended)

#### Prerequisites
- Docker and Docker Compose installed

#### Run with Docker Compose
```bash
# Build and start the service (always rebuild)
docker compose up --build

# Or run in background (always rebuild)
docker compose up -d --build

# Stop the service
docker compose down
```

#### Run with Docker only
```bash
# Build the image
docker build -t face-recognition-api .

# Run the container
docker run -p 8054:8000 face-recognition-api
```

### Option 2: Local Development

#### 1. Create and Activate Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Run the Service

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Access the API

- **API Base URL**: http://localhost:8054
- **Interactive Docs**: http://localhost:8054/docs
- **OpenAPI Schema**: http://localhost:8054/openapi.json

## API Endpoints

### Health Check
```http
GET /health
```
Returns service health status.

### Face Detection (Upload)
```http
POST /detect-face
Content-Type: multipart/form-data

{
  "image": <image_file>
}
```

### Face Detection (URL)
```http
POST /detect-face-from-url
Content-Type: application/json

{
  "image_url": "https://example.com/path/to/image.jpg"
}
```

**Response (both endpoints):**
```json
{
  "success": true,
  "message": "Successfully detected 1 face(s)",
  "faces_found": 1,
  "faces": [
    {
      "face_id": 0,
      "location": {
        "top": 84,
        "right": 156,
        "bottom": 178,
        "left": 62
      },
      "embedding": [0.123, -0.456, 0.789, ...] // 128 float values
    }
  ]
}
```

### Face Comparison
```http
POST /compare-faces
Content-Type: application/json

{
  "embedding1": [0.123, -0.456, ...], // 128 float values
  "embedding2": [0.789, 0.012, ...], // 128 float values
  "threshold": 0.6 // optional, default: 0.6
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face embeddings compared successfully",
  "distance": 0.45,
  "is_same_person": true,
  "confidence": 0.55
}
```

## Usage Examples

### Using cURL

#### 1. Detect faces in uploaded image:
```bash
curl -X POST "http://localhost:8054/detect-face" \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg"
```

#### 2. Detect faces from URL:
```bash
curl -X POST "http://localhost:8054/detect-face-from-url" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/path/to/image.jpg"
  }'
```

#### 3. Compare face embeddings:
```bash
curl -X POST "http://localhost:8054/compare-faces" \
  -H "Content-Type: application/json" \
  -d '{
    "embedding1": [0.123, -0.456, ...],
    "embedding2": [0.789, 0.012, ...],
    "threshold": 0.6
  }'
```

### Using Python

```python
import requests

# 1a. Detect faces from uploaded file
with open('image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8054/detect-face',
        files={'image': f}
    )
face_data = response.json()

# 1b. Detect faces from URL
response = requests.post(
    'http://localhost:8054/detect-face-from-url',
    json={'image_url': 'https://example.com/image.jpg'}
)
face_data = response.json()

# 2. Compare embeddings
if len(face_data['faces']) >= 2:
    embedding1 = face_data['faces'][0]['embedding']
    embedding2 = face_data['faces'][1]['embedding']
    
    comparison = requests.post(
        'http://localhost:8054/compare-faces',
        json={
            'embedding1': embedding1,
            'embedding2': embedding2,
            'threshold': 0.6
        }
    )
    print(comparison.json())
```

## How It Works

### Face Detection
1. Image is uploaded via multipart form data
2. Image is processed using the `face_recognition` library
3. Face locations (bounding boxes) are detected
4. Face encodings (128-dimensional embeddings) are extracted
5. Results are returned with coordinates and embeddings

### Face Comparison
1. Two face embeddings are received (128-dimensional vectors)
2. Euclidean distance is calculated between embeddings
3. Distance is compared against threshold (default: 0.6)
4. Results include distance, match decision, and confidence score

### Threshold Guidelines
- **Distance < 0.6**: Likely same person (default threshold)
- **Distance < 0.4**: Very likely same person (high confidence)
- **Distance > 0.8**: Likely different person

## Technical Details

- **Face Detection**: Uses HOG-based detector from `face_recognition` library
- **Face Encoding**: Deep neural network produces 128-dimensional embeddings
- **Comparison Method**: Euclidean distance between embedding vectors
- **Image Formats**: Supports JPEG, PNG, and other common image formats
- **Performance**: ~1-3 seconds per image for detection (CPU-dependent)

## Docker Details

### Container Features
- **Base Image**: Python 3.9 slim
- **Security**: Runs as non-root user
- **Health Check**: Built-in health monitoring
- **Optimized Build**: Multi-layer caching for faster rebuilds
- **Size**: ~800MB (includes face_recognition dependencies)

### Container Environment
- **Exposed Port**: 8000
- **Working Directory**: /app
- **Health Check**: GET /health every 30s
- **Restart Policy**: unless-stopped

### Development with Docker
For development with hot reload, uncomment the volume mounts in docker-compose.yml:
```yaml
volumes:
  - ./main.py:/app/main.py
  - ./models.py:/app/models.py
```

## Dependencies

- **FastAPI**: Modern web framework for APIs
- **face_recognition**: Face detection and encoding (built on dlib)
- **OpenCV**: Image processing utilities
- **Pillow**: Image file handling
- **NumPy**: Numerical operations
- **Uvicorn**: ASGI server for FastAPI
- **Requests**: HTTP library for fetching images from URLs

## Error Handling

The API includes comprehensive error handling for:
- Invalid image files
- Unsupported image formats
- Missing faces in images
- Invalid embedding dimensions
- Server errors

All errors return standardized error responses with appropriate HTTP status codes.

## Deployment Notes

### Docker Production Deployment
The provided Docker setup is production-ready with:
- Security: Non-root user execution
- Health checks for container orchestration
- Optimized image layers
- Proper signal handling

For production scaling, consider:
- Using Docker Swarm or Kubernetes
- Adding authentication/authorization
- Implementing rate limiting
- Adding logging and monitoring
- Using a reverse proxy (nginx/traefik)
- Database for embedding storage

### Traditional Deployment
For non-Docker deployment, consider:
- Using Gunicorn with Uvicorn workers for better performance
- Process managers (systemd, supervisor)
- Load balancing
- SSL termination
