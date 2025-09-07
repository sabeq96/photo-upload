#!/usr/bin/env python3
"""
Simple startup script for the Face Recognition Microservice
"""

import uvicorn
import sys
import subprocess
import os

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import face_recognition
        import fastapi
        import cv2
        import PIL
        import numpy
        print("✅ All dependencies are installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def main():
    print("🚀 Starting Face Recognition Microservice...")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("\n📚 API Documentation will be available at:")
    print("   http://localhost:8000/docs")
    print("\n🔍 Health check:")
    print("   http://localhost:8000/health")
    print("\n" + "=" * 50)
    print("Press Ctrl+C to stop the service")
    print("=" * 50 + "\n")
    
    # Start the server
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Face Recognition Microservice stopped!")
    except Exception as e:
        print(f"❌ Error starting service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
