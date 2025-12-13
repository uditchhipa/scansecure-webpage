
import re
import os

def analyze_document(file_path):
    """
    Analyzes document files (PDF, TXT) for potential malware indicators.
    Returns a dictionary report.
    """
    filename = os.path.basename(file_path)
    extension = filename.split('.')[-1].lower()
    
    findings = []
    risk_score = 0
    metadata = {}
    
    try:
        if extension == 'txt':
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Check for dangerous command-line patterns
            dangerous_keywords = [
                "powershell", "cmd.exe", "base64", "invoke-expression", 
                "wget", "curl", "format c:", "rm -rf"
            ]
            
            found_keywords = [kw for kw in dangerous_keywords if kw in content.lower()]
            
            if found_keywords:
                findings.append(f"Suspicious commands detected: {', '.join(found_keywords)}")
                risk_score += len(found_keywords) * 2
            
            metadata["analyzed_size"] = len(content)

        elif extension == 'pdf':
            with open(file_path, 'rb') as f:
                content = f.read()
                
            # PDF analysis often looks for JS or embedding actions
            # We look for binary signatures of these actions
            pdf_dangers = {
                b"/JavaScript": "Embedded JavaScript found",
                b"/JS": "Short JavaScript tag found",
                b"/OpenAction": "Auto-open action detected (potential exploit)",
                b"/Launch": "Launch action detected (can run external programs)",
                b"/URI": "External URI links detected"
            }
            
            for signature, desc in pdf_dangers.items():
                if signature in content:
                    findings.append(desc)
                    risk_score += 2
            
            metadata["has_js"] = b"/JavaScript" in content or b"/JS" in content

    except Exception as e:
        findings.append(f"Analysis error: {str(e)}")
        
    # Cap risk score
    risk_score = min(risk_score, 10)
    
    return {
        "filename": filename,
        "is_malicious": risk_score >= 5,
        "risk_score": risk_score,
        "risk_level": "CRITICAL" if risk_score >= 8 else "HIGH" if risk_score >= 5 else "SAFE",
        "findings": findings,
        "metadata": metadata,
        "type": extension
    }
