# 🛡️ SecureScan - AI Malware Detection Web App

A powerful web application to scan `.exe` and `.apk` files for malware using static analysis. It detects dangerous permissions, suspicious API imports, and high-entropy sections to keep you safe.


## ✨ Features
- **APK Analysis**: Scans Android apps for dangerous permissions and lists all internal files.
- **EXE Analysis**: Checks Windows apps for suspicious API calls (keyloggers, injection) and packing.
- **Deep Dive**: Inspect internally imported functions, sections, and file structures.
- **Safety Recommendations**: actionable advice on whether to install or avoid a file.
- **Modern UI**: Beautiful, animated Glassmorphism interface.

---

## 🚀 How to Run (Step-by-Step)

You need to run the **Backend** (Python) and **Frontend** (Node.js) separately.

### 1. Prerequisites
- **Python** (v3.8 or higher) installed.
- **Node.js** (v18 or higher) installed.

### 2. Setup Backend (The Brain 🧠)
Open a terminal and run:

```bash
# 1. Go to the backend folder
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Start the Backend Server
python -m uvicorn main:app --reload --port 8000
```
*You should see: `Uvicorn running on http://127.0.0.1:8000`*

### 3. Setup Frontend (The Interface 🎨)
Open a **new** terminal window (keep the backend running!) and run:

```bash
# 1. Go to the frontend folder
cd frontend

# 2. Install Node dependencies (do this only once)
npm install

# 3. Start the Frontend Website
npm run dev
```
*You should see: `Ready in ... http://localhost:3000`*

---

## 🎮 How to Use
1. Open your browser and go to **[http://localhost:3000](http://localhost:3000)**.
2. Drag & Drop an `.exe` or `.apk` file.
3. Wait for the magic! 🪄
4. Read the report, check the **Safety Recommendation**, and decide if you want to install it.

## 🛠️ Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python, pefile
