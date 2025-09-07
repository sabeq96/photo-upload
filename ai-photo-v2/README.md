# Face Recognition Microservice v2

A database-integrated face recognition service that works with photo and face IDs instead of direct embeddings.

## Features

- **Database Integration**: Works directly with SQLite database storing photos, faces, and person data
- **Face Detection**: Detect faces in photos by photo ID and automatically save to database
- **Automatic Face Processing**: Webhook-like endpoint that automatically recognizes and assigns faces to persons
- **Person Management**: Automatic person creation and face assignment with intelligent matching
- **High-Performance Vector Search**: Uses sqlite-vec for lightning-fast similarity search directly in the database

## Database Schema

### directus_files
- `id` - File identifier (GUID)
- `uploaded_by` - User who uploaded (directus_users.id GUID)
- `filename_disk` - Physical filename on disk for file storage

### photos
- `id` - Photo identifier (integer)
- `user_created` - User who created (directus_users.id GUID)
- `photo` - File reference (directus_files.id GUID)
- `date_created` - Timestamp when photo was created

### faces
- `id` - Face identifier (integer)
- `user_created` - User who created (directus_users.id GUID)
- `photo_id` - Photo reference (photos.id integer)
- `location` - JSON with face bounding box (top, right, bottom, left)
- `embedding` - JSON with 128-dimensional face embedding (for compatibility)
- `embedding_vector` - Binary vector for high-performance sqlite-vec similarity search
- `person_id` - Person reference (personas.id integer)
- `date_created` - Timestamp when face was detected/created

### personas
- `id` - Person identifier (integer)
- `user_created` - User who created (directus_users.id GUID)
- `date_created` - Timestamp when person was created

## API Endpoints

### POST /detect-faces

Detect faces in a photo by photo ID and save them to the database. Returns a simple list of face IDs.

**Request:**
```json
{
  "photo_id": 123,
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  // optional GUID
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully detected and saved 2 face(s)",
  "photo_id": 123,
  "faces": [789, 790]
}
```

### POST /process-face

Webhook-like endpoint that automatically processes face recognition and assignment. Compares the face against existing persons (using their first face as representative) and immediately assigns the face when a match is found. Creates a new person if no match is found.

**Request:**
```json
{
  "face_id": 789,
  "threshold": 0.6,  // optional - default 0.6
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"     // optional GUID - limit to user's faces
}
```

**Response (matched existing person):**
```json
{
  "success": true,
  "message": "Face matched and assigned to existing person 101",
  "face_id": 789,
  "person_id": 101,
  "is_existing_person": true,
  "distance": 0.23,
  "matched_face_id": 790
}
```

**Response (created new person):**
```json
{
  "success": true,
  "message": "No match found - created new person 102 and assigned face",
  "face_id": 789,
  "person_id": 102,
  "is_existing_person": false,
  "distance": null,
  "matched_face_id": null
}
```

## Vector Search Optimization

The service uses sqlite-vec for high-performance vector similarity search:

### Performance Benefits
- **Database-level search**: Vector comparisons happen directly in SQLite
- **Early termination**: Search stops as soon as a match is found  
- **Memory efficient**: No need to load all embeddings into memory
- **Indexing**: sqlite-vec provides optimized vector indexing
- **Scalable**: Performance doesn't degrade significantly with more faces
- **Direct distance metric**: Returns cosine distance (0.0 = identical, 1.0+ = different)

### How it works
1. Face embeddings are stored in both JSON format (for compatibility) and as binary vectors in the `embedding_vector` column
2. When processing faces, the service queries the faces table directly using sqlite-vec's `vec_distance_cosine` function
3. Only faces below the distance threshold are returned, sorted by distance (lower = more similar)
4. The first match triggers immediate person assignment

### Automatic Migration

The service automatically runs database migrations on startup:

- **Column Addition**: Adds `embedding_vector` column to faces table if missing
- **Data Migration**: Converts existing JSON embeddings to binary vector format
- **Vector-Only Search**: Requires sqlite-vec for optimal performance

Migration runs automatically when the service starts, so no manual intervention is needed.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Ensure the database is accessible at `/directus/database/data.db`

3. Run the service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

## Docker

### Using Docker Compose (Recommended)

The service is configured in the root `docker-compose.yml` alongside Directus:

```bash
# Build and start all services including ai-photo-v2
docker-compose up --build

# Or start just ai-photo-v2 (requires Directus to be running)
docker-compose up ai-photo-v2
```

The ai-photo-v2 service will be available at `http://localhost:8056`

### Docker Volume Mounting

The service requires access to:
- **Database**: Read-write access to `/directus/database` for storing face and person data
- **Uploads**: **Read-only** access to `/directus/uploads` for accessing photo files

### Manual Docker Build

If building manually:

```bash
docker build -t face-recognition-v2 .
docker run -p 8001:8001 \
  -v ./directus/database:/directus/database \
  -v ./directus/uploads:/directus/uploads:ro \
  -e DB_PATH=/directus/database/data.db \
  -e UPLOADS_PATH=/directus/uploads \
  face-recognition-v2
```

### Environment Variables

- `DB_PATH`: Path to SQLite database (default: `/directus/database/data.db`)
- `UPLOADS_PATH`: Path to uploads directory (default: `/directus/uploads`)
- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `8001`)

## Troubleshooting

### sqlite-vec Extension Issues

**CRITICAL**: This service requires sqlite-vec extension and will **fail to start** without it.

If you see errors like `"sqlite-vec extension is required but not available"`:

**For Docker (Recommended):**
sqlite-vec is automatically installed via pip during image build:
```bash
docker-compose build ai-photo-v2
```

**For Local Development:**
sqlite-vec is installed automatically via pip:
```bash
pip install sqlite-vec==0.1.6
# or
pip install -r requirements.txt
```

**Verification:**
The service will show this message on successful startup:
- ✅ `Successfully loaded sqlite-vec extension` - Service ready
- ❌ If extension fails to load, the service will **crash with detailed error message**

sqlite-vec v0.1.6 is **mandatory** for high-performance vector similarity search.



## Key Differences from v1

- **Database-first approach**: All operations work with database IDs instead of direct embeddings
- **Automatic persistence**: Face detection automatically saves results to database
- **Webhook-like processing**: Single endpoint that automatically handles face recognition and assignment
- **High-performance vector search**: sqlite-vec enables database-level similarity search with early termination
- **Automatic person creation**: Creates new persons when no match is found
- **Optimized architecture**: No Python loops for face comparison, all handled by database engine
- **File path resolution**: Automatically resolves photo IDs to file paths
