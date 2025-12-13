
## ☁️ How to Host for FREE

To join affiliate programs, you need a live website link. Here is the best $0 tech stack:

### 1. Backend (Python/FastAPI) -> **Render.com**
*   **Why**: It has a "Free Tier" that supports Python.
*   **Steps**:
    1.  Push your code to GitHub (you already did this!).
    2.  Sign up at [render.com](https://render.com).
    3.  Click **New +** -> **Web Service**.
    4.  Connect your GitHub repo: `SecureScane`.
    5.  Settings:
        *   **Root Directory**: `backend`
        *   **Build Command**: `pip install -r requirements.txt`
        *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
    6.  Click **Deploy**. You will get a link like `https://securescane-backend.onrender.com`.

### 2. Frontend (Next.js) -> **Vercel**
*   **Why**: The creators of Next.js, perfectly optimized and 100% free for hobby.
*   **Steps**:
    1.  Sign up at [vercel.com](https://vercel.com).
    2.  Click **Add New...** -> **Project**.
    3.  Import your `SecureScane` repo.
    4.  **IMPORTANT**: In 'Project Settings', change the **Root Directory** to `frontend`.
    5.  **Environment Variables**:
        *   Name: `NEXT_PUBLIC_API_URL`
        *   Value: `https://securescane-backend.onrender.com` (The link you got from Render).
    6.  Click **Deploy**. You will get your final website link!

### 3. Apply for Affiliates
Use your **Vercel Link** (e.g., `https://secure-scan.vercel.app`) when filling out the NordVPN application.

---

## 🎓 GitHub Student Developer Pack (BEST OPTION)

Since you have the **Student Pack**, you are sitting on a goldmine! usage these credits is much better than the "Free Tiers" above because your server will be faster and won't "sleep" (turn off) when inactive.

### Option A: DigitalOcean ($200 Credit) 🏆
*   **Perk**: You get **$200** in credits (valid for 1 year).
*   **How to use**:
    1.  Claim your offer at [education.github.com/pack](https://education.github.com/pack).
    2.  Sign up for **DigitalOcean**.
    3.  Use **App Platform** (it's the same simple UI as Render/Vercel).
    4.  Deploy your Backend there. It will remain active 24/7 and be very fast.

### Option B: Microsoft Azure (Free + $100 Credit)
*   **Perk**: Free App Service tier + $100 credit.
*   **Why**: Good if you want to learn "Enterprise" clouds, but the dashboard is more complex than DigitalOcean.

**Recommendation**: Use **DigitalOcean App Platform** for the Backend with your $200 credit. Keep Frontend on Vercel (it's unbeatable for Next.js).
