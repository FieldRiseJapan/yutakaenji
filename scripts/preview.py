"""Serve dist at /yutakaenji/ with GitHub-Pages-like 404 semantics; local only."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import os
ROOT = Path(__file__).resolve().parents[1] / 'dist'
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        decoded = unquote(urlsplit(path).path)
        relative = decoded.removeprefix('/yutakaenji/')
        target = (ROOT / relative).resolve()
        return str(target) if target.is_relative_to(ROOT) else str(ROOT / '__missing__')
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/yutakaenji':
            self.send_response(301); self.send_header('Location','/yutakaenji/'); self.end_headers(); return
        if not path.startswith('/yutakaenji/'):
            self.send_error(404); return
        return super().do_GET()
    def send_error(self, code, message=None, explain=None):
        if code == 404 and (ROOT / '404.html').exists():
            data = (ROOT / '404.html').read_bytes()
            self.send_response(404); self.send_header('Content-Type','text/html; charset=utf-8'); self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)
        else: super().send_error(code,message,explain)
if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 4173), Handler).serve_forever()
