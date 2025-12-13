
import zipfile
import re
from .utils import AnalysisResult

# Mapping permissions to risk scores
DANGEROUS_PERMISSIONS = {
    "android.permission.SEND_SMS": 5,
    "android.permission.RECEIVE_SMS": 4,
    "android.permission.READ_SMS": 4,
    "android.permission.READ_CONTACTS": 3,
    "android.permission.RECORD_AUDIO": 3,
    "android.permission.CAMERA": 3,
    "android.permission.ACCESS_FINE_LOCATION": 2,
    "android.permission.SYSTEM_ALERT_WINDOW": 4, # Overlay attacks
    "android.permission.INSTALL_PACKAGES": 5,
    "android.permission.READ_PHONE_STATE": 2, # IMEI access
}

def analyze_apk(file_path: str, result: AnalysisResult) -> AnalysisResult:
    try:
        # APKs are just ZIP files
        with zipfile.ZipFile(file_path, 'r') as z:
            # Check for AndroidManifest.xml
            if 'AndroidManifest.xml' not in z.namelist():
                result.add_finding("Invalid APK: No AndroidManifest.xml found", 1)
                return result
            
            # Read Manifest
            # Note: real APK manifests are binary XML. 
            # For this MVP, we use a simple heuristic: 
            # Permissions often appear in plain text or simple encoding even in binary XML 
            # if we grep safely. If not, we'd need a binary parser like `androguard`.
            # To be robust without heavy deps, we scan the raw bytes for the permission strings.
            
            manifest_data = z.read('AndroidManifest.xml')
            
            # Simple string scraping for permissions from binary data
            # This works surprisingly often because the strings are pooled.
            content_str = str(manifest_data) # wildly inefficient but works for searching specific strings
            
            permissions_found = []
            
            for perm, score in DANGEROUS_PERMISSIONS.items():
                if perm.encode('utf-8') in manifest_data: # Search bytes directly
                    result.add_finding(f"Dangerous Permission request: {perm}", score)
                    permissions_found.append(perm)
                    
            result.metadata["permissions_count"] = len(permissions_found)
            
            # Extract full file list
            file_list = z.namelist()
            result.metadata["file_structure"] = file_list
            
            # Check for suspicious files inside the APK
            suspicious_exts = ['.exe', '.bat', '.sh', '.vbs', '.ps1', '.cmd']
            suspicious_files = [f for f in file_list if any(f.lower().endswith(ext) for ext in suspicious_exts)]
            
            if suspicious_files:
                for suspicious_file in suspicious_files:
                    result.add_finding(f"Suspicious file detected inside APK: {suspicious_file}", 5)
                    
            # Deep Scan: Analyze content of script/code files
            deep_scan_exts = ['.xml', '.smali', '.js', '.html', '.sh', '.py']
            dangerous_patterns = {
                b"eval(": "Dynamic Code Execution (eval)",
                b"exec(": "Dynamic Code Execution (exec)",
                b"base64_decode": "Obfuscated Data (Base64)",
                b"getRuntime().exec": "Shell Command Execution",
                b"http://": "Insecure Network Call (HTTP)",
                b"192.168.": "Private IP Address Reference"
            }
            
            scanned_count = 0
            MAX_SCAN_FILES = 50 # Limit to avoid timeouts on large APKs
            
            for file_name in file_list:
                if any(file_name.lower().endswith(ext) for ext in deep_scan_exts):
                    if scanned_count > MAX_SCAN_FILES: break
                    scanned_count += 1
                    
                    try:
                        with z.open(file_name) as f:
                            content = f.read(4096) # Read first 4kb
                            for pattern, desc in dangerous_patterns.items():
                                if pattern in content:
                                    result.add_finding(f"Malicious Code ({desc}) found in {file_name}", 4)
                    except:
                        pass
            
            # Check for 'classes.dex' (Standard Android Code)
            if 'classes.dex' in file_list:
                 result.metadata["has_dex"] = True
            else:
                 result.add_finding("Suspicious: No classes.dex found (no code?)", 2)


    except zipfile.BadZipFile:
        result.add_finding("File is not a valid ZIP/APK archive", 1)
    except Exception as e:
        result.add_finding(f"Error analyzing APK: {str(e)}", 1)
        
    return result
