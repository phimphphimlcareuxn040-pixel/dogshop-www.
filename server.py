import http.server
import socketserver
import os
import json
import mimetypes
from email.parser import BytesParser
from email.policy import default

mimetypes.init()
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('image/avif', '.avif')
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('video/x-matroska', '.mkv')
mimetypes.add_type('video/mp4', '.mp4')

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PawParadiseRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_POST(self):
        # API Endpoint 1: File Upload Handler
        if self.path == '/api/upload':
            try:
                content_type = self.headers.get('content-type', '')
                content_length = int(self.headers.get('content-length', 0))
                body = self.rfile.read(content_length)

                # Parse multipart form data
                msg = BytesParser(policy=default).parsebytes(
                    b'Content-Type: ' + content_type.encode('utf-8') + b'\r\n\r\n' + body
                )

                file_data = None
                file_name = f"upload_{os.urandom(4).hex()}"
                file_type = "images"

                for part in msg.iter_parts():
                    cd = part.get('Content-Disposition')
                    if cd and cd.params:
                        name = cd.params.get('name')
                        if name == 'file':
                            file_data = part.get_payload(decode=True)
                            original_filename = cd.params.get('filename')
                            if original_filename:
                                file_name = original_filename
                        elif name == 'filetype':
                            file_type = part.get_payload(decode=True).decode('utf-8').strip()
                        elif name == 'filename':
                            param_filename = part.get_payload(decode=True).decode('utf-8').strip()
                            if param_filename:
                                file_name = param_filename

                if not file_data:
                    raise ValueError("No file content received")

                # Ensure destination folder exists on disk
                target_dir = os.path.join(DIRECTORY, 'uploads', file_type)
                os.makedirs(target_dir, exist_ok=True)

                # Clean filename to avoid path traversal
                file_name = os.path.basename(file_name)
                target_file_path = os.path.join(target_dir, file_name)

                # Save file directly onto hard drive!
                with open(target_file_path, 'wb') as f:
                    f.write(file_data)

                relative_url = f"uploads/{file_type}/{file_name}"
                print(f"[Upload Server] Saved file to disk: {target_file_path}")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                resp_payload = json.dumps({
                    "success": True,
                    "url": relative_url,
                    "message": f"File saved directly to disk: {relative_url}"
                })
                self.wfile.write(resp_payload.encode('utf-8'))
                return

            except Exception as e:
                print(f"[Upload Server Error] {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        # API Endpoint 2: Save JSON Database to file data/dogs.json
        if self.path == '/api/save-json':
            try:
                content_length = int(self.headers.get('content-length', 0))
                body = self.rfile.read(content_length)
                
                json_path = os.path.join(DIRECTORY, 'data', 'dogs.json')
                os.makedirs(os.path.dirname(json_path), exist_ok=True)

                # Format and save JSON file
                parsed_json = json.loads(body.decode('utf-8'))
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(parsed_json, f, ensure_ascii=False, indent=2)

                print(f"[Database Server] Updated data/dogs.json file on disk!")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
                return

        self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    print(f"==================================================")
    print(f"Paw Paradise Server running on http://localhost:{PORT}")
    print(f"Root Directory: {DIRECTORY}")
    print(f"==================================================")
    with socketserver.TCPServer(("", PORT), PawParadiseRequestHandler) as httpd:
        httpd.serve_forever()
