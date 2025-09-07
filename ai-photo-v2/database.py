import sqlite3
import sqlite_vec
import json
import numpy as np
from typing import List, Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timezone
import os

# Database path - configurable via environment variable
DB_PATH = os.getenv(
    "DB_PATH", 
    "/Users/dawid.szafranski/code/personal/photo-upload/directus/database/data.db"
)

# Uploads directory path - configurable via environment variable  
UPLOADS_PATH = os.getenv(
    "UPLOADS_PATH",
    "/Users/dawid.szafranski/code/personal/photo-upload/directus/uploads"
)

def embedding_to_blob(embedding: List[float]) -> bytes:
    """Convert face embedding list to binary blob for sqlite_vec"""
    # Convert to numpy array and then to bytes
    np_array = np.array(embedding, dtype=np.float32)
    return np_array.tobytes()

def blob_to_embedding(blob: bytes) -> List[float]:
    """Convert binary blob back to face embedding list"""
    # Convert bytes back to numpy array and then to list
    np_array = np.frombuffer(blob, dtype=np.float32)
    return np_array.tolist()



class DatabaseManager:
    """Database manager for SQLite operations with vector support"""
    
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        
    def get_connection(self) -> sqlite3.Connection:
        """Get database connection with sqlite-vec loaded"""
        conn = sqlite3.connect(self.db_path)
        # conn = sqlite3.connect(":memory:")

        # Load sqlite-vec extension
        conn.enable_load_extension(True)
        
        # Load sqlite-vec extension (installed via pip)
        try:
            sqlite_vec.load(conn)
            vec_version, = conn.execute("select vec_version()").fetchone()
            print(f"vec_version={vec_version}")
            print("✅ Successfully loaded sqlite-vec extension")
        except Exception as e:
            conn.close()
            raise RuntimeError(
                f"❌ CRITICAL: sqlite-vec extension is required but not available. "
            )
            
        conn.enable_load_extension(False)
        return conn
    
    def get_photo_file_path(self, photo_id: int) -> Optional[Dict[str, Any]]:
        """Get the file path and metadata for a photo by photo ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                SELECT df.id, df.filename_disk, p.date_created, p.user_created
                FROM photos p
                JOIN directus_files df ON p.photo = df.id
                WHERE p.id = ?
            """, (photo_id,))
            result = cursor.fetchone()
            
            if result:
                file_id, filename, date_created, user_created = result
                # Construct the full path to the uploaded file using configurable path
                uploads_path = Path(UPLOADS_PATH)
                return {
                    'file_path': str(uploads_path / filename),
                    'file_id': file_id,
                    'filename': filename,
                    'date_created': date_created,
                    'user_created': user_created
                }
            return None
    
    def save_face(self, photo_id: int, location: Dict[str, int], 
                  embedding: List[float], user_id: Optional[str] = None,
                  person_id: Optional[int] = None) -> int:
        """Save a detected face to the database with both JSON and vector format"""
        current_time = datetime.now(timezone.utc).isoformat()
        
        # Convert embedding to vector blob
        vector_blob = embedding_to_blob(embedding)
        
        with self.get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO faces (user_created, photo_id, location, embedding, embedding_vector, person_id, date_created)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                photo_id,
                json.dumps(location),
                json.dumps(embedding),
                vector_blob,
                person_id,
                current_time
            ))
            conn.commit()
            return cursor.lastrowid
    
    def get_face_embedding(self, face_id: int) -> Optional[Dict[str, Any]]:
        """Get face data including embedding by face ID"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                SELECT id, photo_id, location, embedding, person_id, user_created, date_created
                FROM faces
                WHERE id = ?
            """, (face_id,))
            result = cursor.fetchone()
            
            if result:
                face_id, photo_id, location_json, embedding_json, person_id, user_created, date_created = result
                return {
                    'id': face_id,
                    'photo_id': photo_id,
                    'location': json.loads(location_json),
                    'embedding': json.loads(embedding_json),
                    'person_id': person_id,
                    'user_created': user_created,
                    'date_created': date_created
                }
            return None
    
    def update_face_person(self, face_id: int, person_id: int) -> bool:
        """Update the person_id for a face"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                UPDATE faces
                SET person_id = ?
                WHERE id = ?
            """, (person_id, face_id))
            conn.commit()
            return cursor.rowcount > 0
    
    def create_person(self, user_id: Optional[str] = None) -> int:
        """Create a new person record"""
        current_time = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO personas (user_created, date_created)
                VALUES (?, ?)
            """, (user_id, current_time))
            conn.commit()
            return cursor.lastrowid
    
    def get_photo_exists(self, photo_id: int) -> bool:
        """Check if a photo exists in the database"""
        with self.get_connection() as conn:
            cursor = conn.execute("""
                SELECT 1 FROM photos WHERE id = ?
            """, (photo_id,))
            result = cursor.fetchone()
            return result is not None

    def find_similar_faces_vector(self, target_embedding: List[float], 
                                  threshold: float = 0.6, 
                                  user_id: Optional[str] = None,
                                  limit: int = 1) -> List[Dict[str, Any]]:
        """Find similar faces using sqlite_vec vector similarity search"""
        try:
            with self.get_connection() as conn:
                # Convert target embedding to blob
                target_blob = embedding_to_blob(target_embedding)
                
                # Build query with optional user filtering
                if user_id:
                    query = """
                        SELECT id, photo_id, location, person_id, user_created, date_created,
                               vec_distance_cosine(embedding_vector, ?) as distance
                        FROM faces
                        WHERE user_created = ? 
                        AND person_id IS NOT NULL
                        AND embedding_vector IS NOT NULL
                        AND vec_distance_cosine(embedding_vector, ?) <= ?
                        ORDER BY distance ASC
                        LIMIT ?
                    """
                    params = (target_blob, user_id, target_blob, threshold, limit)
                else:
                    query = """
                        SELECT id, photo_id, location, person_id, user_created, date_created,
                               vec_distance_cosine(embedding_vector, ?) as distance
                        FROM faces
                        WHERE person_id IS NOT NULL
                        AND embedding_vector IS NOT NULL
                        AND vec_distance_cosine(embedding_vector, ?) <= ?
                        ORDER BY distance ASC
                        LIMIT ?
                    """
                    params = (target_blob, target_blob, threshold, limit)
                
                cursor = conn.execute(query, params)
                results = cursor.fetchall()
                
                matches = []
                for result in results:
                    face_id, photo_id, location_json, person_id, user_created, date_created, distance = result
                    matches.append({
                        'id': face_id,
                        'photo_id': photo_id,
                        'location': json.loads(location_json),
                        'person_id': person_id,
                        'user_created': user_created,
                        'date_created': date_created,
                        'distance': float(distance)
                    })
                
                return matches
                
        except Exception as e:
            print(f"Vector search failed: {e}")
            return []


# Global database manager instance
db = DatabaseManager()
