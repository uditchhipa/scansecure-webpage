
import re
import urllib.parse
from .utils import AnalysisResult

# Heuristics for suspicious keywords in URLs
SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "secure", "account", "update", "bank", "alert",
    "confirm", "wallet", "crypto", "paypal", "support", "admin", "password"
]

# Heuristics for suspicious TLDs (often used for spam)
SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".gq", ".tk", ".ml", ".ga", ".cf", ".cn", ".ru", ".rest", ".fit"
]

def analyze_url(url: str) -> AnalysisResult:
    """
    Analyzes a URL for potential phishing or safety risks using static heuristics.
    """
    result = AnalysisResult(filename=url, file_type="url")
    
    # Ensure URL has a scheme
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()
    except Exception as e:
        result.add_finding(f"Invalid URL format: {str(e)}", 10)
        return result

    # 1. Check Scheme (HTTPS vs HTTP)
    if parsed.scheme == "http":
        result.add_finding("URL is using insecure HTTP protocol", 3)
    else:
        result.add_finding("URL is using secure HTTPS protocol", 0)

    # 2. Keyword Analysis
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in domain or kw in path]
    if found_keywords:
        result.add_finding(f"Suspicious keywords found in URL: {', '.join(found_keywords)}", 5)

    # 3. TLD Analysis
    if any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
        result.add_finding(f"URL uses a potentially suspicious Top Level Domain (TLD)", 4)

    # 4. Length Analysis (Long URLs are often phishing)
    if len(url) > 75:
        result.add_finding("URL is suspiciously long (>75 chars)", 2)

    # 5. IP Address Check (Host is IP instead of domain)
    if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", domain):
        result.add_finding("URL uses a raw IP address instead of a domain name", 6)

    # 6. Typosquatting Analysis (Brand Impersonation)
    import difflib
    # Common targets for phishing
    SAFE_DOMAINS = ['facebook.com', 'instagram.com', 'google.com', 'twitter.com', 'linkedin.com', 'paypal.com', 'microsoft.com', 'netflix.com', 'amazon.com', 'apple.com']
    
    # Check if domain looks like a safe domain but is NOT a safe domain
    # e.g. "lnstagram.com" vs "instagram.com"
    if domain not in SAFE_DOMAINS:
        for safe in SAFE_DOMAINS:
            # Check similarity ratio
            ratio = difflib.SequenceMatcher(None, domain, safe).ratio()
            if ratio > 0.8: # >80% similar
                result.add_finding(f"High Risk: Domain '{domain}' impersonates '{safe}' (Typosquatting)", 8)

    # 7. Active Content Analysis (Deep Scan)
    try:
        import requests
        
        # Only scan if not a known safe domain
        is_safe_domain = any(safe in domain for safe in SAFE_DOMAINS)
        
        if not is_safe_domain:
            try:
                # Short timeout to avoid hanging
                response = requests.get(url, timeout=3, headers={'User-Agent': 'SecureScan-Bot/1.0'})
                content = response.text.lower()
                
                # Check for Login Forms
                has_password_field = 'type="password"' in content or "type='password'" in content
                has_login_text = "login" in content or "sign in" in content or "log in" in content
                
                if has_password_field:
                    result.add_finding("Suspicious: Password entry field detected on unverified domain", 6)
                elif has_login_text and "password" in content:
                    result.add_finding("Suspicious: Page contains 'Login' and 'Password' keywords", 4)
                    
                # Check for cloned titles
                if "<title>instagram" in content or "<title>facebook" in content:
                    result.add_finding("High Risk: Page title suggests potential brand impersonation", 7)
                    
                result.metadata["http_status"] = response.status_code
            except requests.Timeout:
                result.add_finding("Warning: URL analysis timed out (could be unreachable)", 1)
            except Exception as req_e:
                # result.add_finding(f"Could not fetch page content: {str(req_e)}", 0) # Too noisy
                pass

    except ImportError:
        pass

    # 8. Default Safe Finding
    if result.risk_score == 0:
        result.add_finding("No obvious suspicious indicators found", 0)

    return result
