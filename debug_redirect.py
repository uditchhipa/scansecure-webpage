import requests
from urllib.parse import urlparse, parse_qs

try:
    resp = requests.get("https://mysecurescan.onrender.com/auth/google/login", allow_redirects=False)
    loc = resp.headers.get('Location')
    print(f"Full Loction: {loc}")
    
    parsed = urlparse(loc)
    qs = parse_qs(parsed.query)
    print("--- PARSED PARAMS ---")
    print(f"redirect_uri: >{qs.get('redirect_uri')[0]}<")
    print(f"client_id: >{qs.get('client_id')[0]}<")
except Exception as e:
    print(e)
