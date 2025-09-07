#!/usr/bin/env python3
"""
Startup script for Face Recognition Microservice v2
"""

import uvicorn
import sys
import os

def main():
    """Main startup function"""
    
    # Default configuration
    config = {
        "app": "main:app",
        "host": "0.0.0.0",
        "port": 8001,
        "reload": True,
        "log_level": "info"
    }
    
    # Override with environment variables if present
    if os.getenv("HOST"):
        config["host"] = os.getenv("HOST")
    
    if os.getenv("PORT"):
        try:
            config["port"] = int(os.getenv("PORT"))
        except ValueError:
            print(f"Invalid PORT environment variable: {os.getenv('PORT')}")
            sys.exit(1)
    
    if os.getenv("RELOAD"):
        config["reload"] = os.getenv("RELOAD").lower() in ["true", "1", "yes"]
    
    if os.getenv("LOG_LEVEL"):
        config["log_level"] = os.getenv("LOG_LEVEL").lower()
    
    print("=" * 60)
    print("Face Recognition Microservice v2 Starting...")
    print("=" * 60)
    print(f"Host: {config['host']}")
    print(f"Port: {config['port']}")
    print(f"Reload: {config['reload']}")
    print(f"Log Level: {config['log_level']}")
    print("=" * 60)
    
    # Start the server
    uvicorn.run(**config)

if __name__ == "__main__":
    main()
