import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_query(q):
    print(f"\n--- TEST: {q} ---")
    try:
        resp = requests.post('http://127.0.0.1:8001/api/chat/query', json={'query': q}, stream=True)
        for line in resp.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                if decoded.startswith('data: '):
                    try:
                        data = json.loads(decoded[6:])
                        if 'chunk' in data:
                            print(data['chunk'], end='', flush=True)
                    except json.JSONDecodeError:
                        pass
        print()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_query("Xin chào, bạn là ai?")
    print("\n----------------------")
    test_query("Làm giấy khai sinh ở đâu?")
