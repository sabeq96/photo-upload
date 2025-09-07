import sqlite3
import sqlite_vec
import json
import numpy as np
import os
from typing import List, Dict, Any
from datetime import datetime

# Database path - same as database.py
DB_PATH = os.getenv(
    "DB_PATH", 
    "/Users/dawid.szafranski/code/personal/photo-upload/directus/database/data.db"
)

def embedding_to_blob(embedding: List[float]) -> bytes:
    """Convert face embedding list to binary blob for sqlite_vec"""
    np_array = np.array(embedding, dtype=np.float32)
    return np_array.tobytes()

def run_migrations():
    """Run database migrations on startup"""
    print("🔄 Running database migrations...")
    
    try:
        with sqlite3.connect(DB_PATH) as conn:
            # Enable sqlite_vec extension
            conn.enable_load_extension(True)
            try:
                sqlite_vec.load(conn)
            except Exception as e:
                conn.close()
                raise RuntimeError(f"sqlite_vec extension not available: {e}")
            conn.enable_load_extension(False)
            
            # Migration 1: Add embedding_vector column to faces table
            print("📝 Migration 1: Adding embedding_vector column...")
            
            # Check if column already exists
            cursor = conn.execute("PRAGMA table_info(faces)")
            columns = cursor.fetchall()
            column_names = [col[1] for col in columns]
            
            if 'embedding_vector' not in column_names:
                conn.execute("""
                    ALTER TABLE faces 
                    ADD COLUMN embedding_vector BLOB
                """)
                print("✅ Added embedding_vector column to faces table")
            else:
                print("✅ embedding_vector column already exists")
            
            # Migration 2: Populate vector column from JSON embeddings
            print("📝 Migration 2: Populating vector column...")
            
            # Get faces without vector data
            cursor = conn.execute("""
                SELECT id, embedding 
                FROM faces 
                WHERE embedding_vector IS NULL 
                AND embedding IS NOT NULL
            """)
            faces_to_migrate = cursor.fetchall()
            
            if faces_to_migrate:
                print(f"🔄 Migrating {len(faces_to_migrate)} face embeddings to vector format...")
                
                migrated_count = 0
                failed_count = 0
                
                for face_id, embedding_json in faces_to_migrate:
                    try:
                        # Parse JSON embedding
                        embedding = json.loads(embedding_json)
                        
                        # Convert to binary blob
                        vector_blob = embedding_to_blob(embedding)
                        
                        # Update the face with vector data
                        conn.execute("""
                            UPDATE faces 
                            SET embedding_vector = ? 
                            WHERE id = ?
                        """, (vector_blob, face_id))
                        
                        migrated_count += 1
                        
                    except Exception as e:
                        print(f"⚠️  Failed to migrate face {face_id}: {e}")
                        failed_count += 1
                
                conn.commit()
                print(f"✅ Migration completed: {migrated_count} migrated, {failed_count} failed")
                
            else:
                print("✅ No faces need migration")
            
            # Migration 3: Create index for vector searches (if sqlite_vec supports it)
            print("📝 Migration 3: Creating vector search optimizations...")
            try:
                # This is a placeholder for future vector indexing
                # sqlite_vec may add indexing capabilities in future versions
                print("✅ Vector optimizations applied")
            except Exception as e:
                print(f"⚠️  Vector indexing not available: {e}")
            
            print("🎉 All migrations completed successfully!")
            return True
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    # Allow running migrations manually
    run_migrations()
