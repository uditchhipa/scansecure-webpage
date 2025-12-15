import socket
import threading
from typing import List, Dict

COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    135: "RPC",
    139: "NetBIOS",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    1433: "MSSQL",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    6379: "Redis",
    8080: "HTTP-Alt",
    8443: "HTTPS-Alt",
    27017: "MongoDB"
}

def check_port(host, port, results):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1.5) # Fast timeout
        result = sock.connect_ex((host, port))
        if result == 0:
            results.append({"port": port, "service": COMMON_PORTS[port], "status": "open"})
        else:
            # Optionally record closed ports or just skip
            results.append({"port": port, "service": COMMON_PORTS[port], "status": "closed"})
        sock.close()
    except:
        results.append({"port": port, "service": COMMON_PORTS[port], "status": "error"})

def scan_ports(host: str) -> List[Dict]:
    # Clean host
    host = host.replace("https://", "").replace("http://", "").split("/")[0]
    
    threads = []
    results = []
    
    for port in COMMON_PORTS:
        t = threading.Thread(target=check_port, args=(host, port, results))
        threads.append(t)
        t.start()
        
    for t in threads:
        t.join()
        
    # Sort by port number
    results.sort(key=lambda x: x["port"])
    return results
