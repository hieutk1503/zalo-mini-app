import urllib.request, json
data = json.dumps({'query': 'Xin chao'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/chat/query', data=data, headers={'Content-Type': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    print(e.read().decode('utf-8'))
