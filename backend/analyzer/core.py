
import os
import hashlib
from .utils import AnalysisResult
from .exe_analyzer import analyze_exe
from .apk_analyzer import analyze_apk
from .doc_analyzer import analyze_document

def get_file_hash(file_path: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def analyze_file(file_path: str, original_filename: str) -> dict:
    ext = os.path.splitext(original_filename)[1].lower()
    
    # Determine type
    file_type = "unknown"
    if ext == ".exe" or ext == ".dll":
        file_type = "exe"
    elif ext == ".apk":
        file_type = "apk"
    elif ext == ".pdf":
        file_type = "pdf"
    elif ext == ".txt":
        file_type = "txt"
        
    result = AnalysisResult(original_filename, file_type)
    
    # Add basic generic metadata
    try:
        size_bytes = os.path.getsize(file_path)
        result.metadata["file_size"] = f"{size_bytes / (1024 * 1024):.2f} MB"
        result.metadata["sha256"] = get_file_hash(file_path)
    except Exception as e:
        print(f"Error getting file info: {e}")
    
    if file_type == "exe":
        result = analyze_exe(file_path, result)
    elif file_type == "apk":
        result = analyze_apk(file_path, result)
    elif file_type in ["pdf", "txt"]:
        # Adapt dict response to AnalysisResult object
        doc_data = analyze_document(file_path)
        result.risk_score = doc_data["risk_score"]
        result.risk_level = doc_data["risk_level"]
        result.is_malicious = doc_data["is_malicious"]
        for findings in doc_data["findings"]:
            result.add_finding(findings, 0)
        result.metadata.update(doc_data["metadata"])
    else:
        result.add_finding(f"Unsupported file type: {ext}", 0)
        
    return result.to_dict()
