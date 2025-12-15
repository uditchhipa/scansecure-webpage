import requests
import socket
from urllib.parse import urlparse

def analyze_site(url: str) -> dict:
    if not url.startswith("http"):
        url = "https://" + url

    result = {
        "url": url,
        "score": 100,
        "grade": "A",
        "checks": [],
        "server_leak": None,
        "ssl": False
    }

    try:
        # 1. SSL/Connection Check
        try:
            response = requests.get(url, timeout=5, allow_redirects=True)
            result["ssl"] = response.url.startswith("https")
            if not result["ssl"]:
                result["score"] -= 30
                result["checks"].append({"name": "SSL Encryption", "status": "fail", "msg": "Site is using HTTP instead of HTTPS"})
            else:
                result["checks"].append({"name": "SSL Encryption", "status": "pass", "msg": "Secure Connection (HTTPS)"})
        except requests.exceptions.SSLError:
            result["score"] -= 40
            result["checks"].append({"name": "SSL Encryption", "status": "fail", "msg": "SSL Certificate is Invalid"})
            return result
        except Exception as e:
            return {"error": f"Could not reach site: {str(e)}"}

        headers = response.headers

        # 2. Server Leaks
        server = headers.get("Server", "")
        if server:
            result["server_leak"] = server
            # Minor penalty for leaking exact version
            if any(char.isdigit() for char in server):
                result["score"] -= 5
                result["checks"].append({"name": "Server Privacy", "status": "warn", "msg": f"Server version leaked: {server}"})
            else:
                 result["checks"].append({"name": "Server Privacy", "status": "pass", "msg": "Server header present but generic"})
        else:
             result["checks"].append({"name": "Server Privacy", "status": "pass", "msg": "Server header hidden (Good)"})

        # 3. Security Headers
        security_headers = [
            ("Strict-Transport-Security", "HSTS", 15),
            ("X-Content-Type-Options", "No-Sniff", 10),
            ("X-Frame-Options", "Clickjacking Protection", 15),
            ("Content-Security-Policy", "XSS Protection (CSP)", 20),
            ("X-XSS-Protection", "Legacy XSS Filter", 5) # Optional
        ]

        for header, name, weight in security_headers:
            if header in headers:
                result["checks"].append({"name": name, "status": "pass", "msg": "Header is present"})
            else:
                result["score"] -= weight
                result["checks"].append({"name": name, "status": "fail", "msg": "Missing security header"})

        # Calculate Grade
        score = max(0, result["score"])
        result["score"] = score
        if score >= 90: result["grade"] = "A"
        elif score >= 80: result["grade"] = "B"
        elif score >= 60: result["grade"] = "C"
        elif score >= 40: result["grade"] = "D"
        else: result["grade"] = "F"

        return result

    except Exception as e:
        return {"error": str(e)}
