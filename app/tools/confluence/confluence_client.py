import urllib.request
import urllib.parse
import json
import ssl
import os
import time

class ConfluenceClient:
    def __init__(self, base_url, token, space_key="EDUS"):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.space_key = space_key
        self.ctx = ssl._create_unverified_context()

    def _request(self, method, endpoint, data=None, max_retries=3):
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
            'X-Atlassian-Token': 'no-check'
        }
        encoded_data = json.dumps(data).encode('utf-8') if data is not None else None
        
        last_error = None
        for attempt in range(max_retries):
            req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, context=self.ctx, timeout=30) as resp:
                    return json.loads(resp.read().decode('utf-8'))
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8')
                raise RuntimeError(f"HTTP {e.code} on {method} {url}: {err_body}")
            except Exception as e:
                last_error = e
                time.sleep(1.0 * (attempt + 1))
                
        raise RuntimeError(f"Network error after {max_retries} attempts on {method} {url}: {last_error}")

    def get_page_by_title(self, title):
        encoded_title = urllib.parse.quote(title)
        endpoint = f"/rest/api/content?title={encoded_title}&spaceKey={self.space_key}&expand=version,ancestors"
        res = self._request("GET", endpoint)
        results = res.get('results', [])
        return results[0] if results else None

    def get_page(self, page_id):
        endpoint = f"/rest/api/content/{page_id}?expand=version,ancestors,body.storage"
        return self._request("GET", endpoint)

    def create_page(self, title, parent_id, html_content):
        payload = {
            'type': 'page',
            'title': title,
            'space': {'key': self.space_key},
            'body': {
                'storage': {
                    'value': html_content,
                    'representation': 'storage'
                }
            }
        }
        if parent_id is not None:
            payload['ancestors'] = [{'id': int(parent_id)}]
        return self._request("POST", "/rest/api/content/", payload)

    def update_page(self, page_id, title, parent_id, html_content, current_version):
        payload = {
            'id': str(page_id),
            'type': 'page',
            'title': title,
            'space': {'key': self.space_key},
            'version': {'number': current_version + 1},
            'body': {
                'storage': {
                    'value': html_content,
                    'representation': 'storage'
                }
            }
        }
        if parent_id is not None:
            payload['ancestors'] = [{'id': int(parent_id)}]
        return self._request("PUT", f"/rest/api/content/{page_id}", payload)

    def create_or_update_page(self, title, parent_id, html_content):
        existing = self.get_page_by_title(title)
        if existing:
            page_id = existing['id']
            curr_ver = existing['version']['number']
            res = self.update_page(page_id, title, parent_id, html_content, curr_ver)
            return {'action': 'updated', 'id': res['id'], 'title': title, 'version': curr_ver + 1, 'webui': res.get('_links', {}).get('webui', '')}
        else:
            res = self.create_page(title, parent_id, html_content)
            return {'action': 'created', 'id': res['id'], 'title': title, 'version': 1, 'webui': res.get('_links', {}).get('webui', '')}

    def upload_attachment(self, page_id, file_path, filename=None, max_retries=3):
        if not os.path.exists(file_path):
            return None
        if filename is None:
            filename = os.path.basename(file_path)
            
        with open(file_path, "rb") as f:
            file_bytes = f.read()

        boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
        body = (
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
            f'Content-Type: image/png\r\n\r\n'
        ).encode('utf-8') + file_bytes + f'\r\n--{boundary}--\r\n'.encode('utf-8')

        url = f"{self.base_url}/rest/api/content/{page_id}/child/attachment"
        
        last_error = None
        for attempt in range(max_retries):
            req = urllib.request.Request(url, data=body, method='POST')
            req.add_header('Authorization', f'Bearer {self.token}')
            req.add_header('X-Atlassian-Token', 'nocheck')
            req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
            try:
                with urllib.request.urlopen(req, context=self.ctx, timeout=30) as resp:
                    return json.loads(resp.read().decode('utf-8'))
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8')
                return {'error': f"HTTP {e.code}: {err_body}"}
            except Exception as e:
                last_error = e
                time.sleep(1.0 * (attempt + 1))
                
        return {'error': f"Network error after {max_retries} attempts: {last_error}"}

