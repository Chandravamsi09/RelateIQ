#!/usr/bin/env python3
"""
RelateIQ Enterprise CRM - Python Service Entrypoint & CLI Daemon
Provides programmatic CLI access, webhook listeners, and pipeline synchronization.
"""

import sys
import os
import json
import http.server
import socketserver

PORT = int(os.environ.get("PYTHON_CLI_PORT", 8080))

class RelateIQHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = {
                "status": "HEALTHY",
                "service": "RelateIQ Python Gateway",
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            super().do_GET()

def main():
    print(f"RelateIQ Python Microservice Gateway starting on port {PORT}...")
    try:
        with socketserver.TCPServer(("", PORT), RelateIQHandler) as httpd:
            print(f"Serving at http://localhost:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down cleanly.")

if __name__ == "__main__":
    main()
