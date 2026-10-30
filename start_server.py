# -*- coding: utf-8 -*-
"""
LinguaMaster - Private Personal App Launcher & Audio Streaming Engine
"""

import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import socket
import webbrowser
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import qrcode

PORT = 8080

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def generate_qr(url, output_path):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1e293b", back_color="white")
    img.save(output_path)
    return qr

# Audio in-memory cache to prevent re-fetching
AUDIO_CACHE = {}

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_HEAD(self):
        if self.path.startswith('/tts'):
            self.do_GET()
            return
        return super().do_HEAD()

    def do_GET(self):
        # Handle High Quality TTS Audio Proxy
        if self.path.startswith('/tts'):
            try:
                parsed = urllib.parse.urlparse(self.path)
                params = urllib.parse.parse_qs(parsed.query)
                text = params.get('text', [''])[0].strip()
                lang = params.get('lang', ['zh'])[0].strip()

                if not text:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Missing text parameter")
                    return

                cache_key = f"{lang}_{text}"
                audio_bytes = AUDIO_CACHE.get(cache_key)

                if not audio_bytes:
                    lang_code = 'zh-CN' if lang == 'zh' else 'en'
                    tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={lang_code}&client=tw-ob&q={urllib.parse.quote(text)}"
                    req = urllib.request.Request(
                        tts_url,
                        headers={
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    )
                    with urllib.request.urlopen(req, timeout=5) as resp:
                        audio_bytes = resp.read()
                        if len(audio_bytes) > 0:
                            AUDIO_CACHE[cache_key] = audio_bytes

                if audio_bytes:
                    self.send_response(200)
                    self.send_header('Content-Type', 'audio/mpeg')
                    self.send_header('Content-Length', str(len(audio_bytes)))
                    self.send_header('Accept-Ranges', 'bytes')
                    self.end_headers()
                    self.wfile.write(audio_bytes)
                    return
                else:
                    self.send_response(500)
                    self.end_headers()
                    return

            except Exception as e:
                print(f"[TTS Error] {e}")
                self.send_response(500)
                self.end_headers()
                return

        return super().do_GET()

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(current_dir)

    local_ip = get_local_ip()
    app_url = f"http://{local_ip}:{PORT}"
    install_url = f"http://{local_ip}:{PORT}/install.html"

    qr_path = os.path.join(current_dir, 'qr_code.png')
    generate_qr(app_url, qr_path)

    print("=" * 60)
    print(">> LINGUAMASTER & HANYUGO SERVER DANG CHAY...")
    print(f">> Dia chi IP may tinh trong mang WiFi: {local_ip}")
    print(f">> Link ung dung tren dien thoai:        {app_url}")
    print("=" * 60)

    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, CustomHTTPHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung may chu.")
        httpd.server_close()

if __name__ == '__main__':
    main()
