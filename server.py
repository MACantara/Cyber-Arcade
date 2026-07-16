#!/usr/bin/env python3
"""Development server for Cyber-Arcade.

Serves static files with CORS headers and falls back to index.html for SPA routes.
Run with: python server.py [port]
"""

import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        file_path = os.path.join(ROOT, path.lstrip('/').replace('/', os.sep))
        if path != '/' and not os.path.exists(file_path) and not os.path.isdir(file_path):
            self.path = '/index.html'
        return super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(('localhost', port), SPAHandler)
    print(f'Serving Cyber-Arcade at http://localhost:{port}/')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
