import asyncio
from backend.analyzer.port_scanner import scan_ports

async def main():
    target = "scanme.nmap.org"
    print(f"Scanning {target}...")
    results = await asyncio.to_thread(scan_ports, target)
    
    print("\nResults:")
    for r in results:
        print(f"Port {r['port']} ({r['service']}): {r['status']}")

if __name__ == "__main__":
    asyncio.run(main())
