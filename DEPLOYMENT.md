
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
*   **How to use (All-in-One Method)**:
    1.  Claim your offer at [education.github.com/pack](https://education.github.com/pack).
    2.  Sign up for **DigitalOcean**.
    3.  Click **Create** -> **Apps** (App Platform).
    4.  Connect your GitHub repo (`scansecure-webpage`).
    5.  DigitalOcean is smart! It will likely detect **two** components:
        *   **backend**: Select "Web Service". Settings:
            *   Run Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
            *   Port: `8080`
        *   **frontend**: Select "Web Service" or "Static Site". Settings:
            *   Build Command: `npm run build`
            *   Run Command: `npm start`
            *   Port: `3000`
    6.  Click **Next**. It might cost ~$10/month, but your **$200 credit** covers it for free!
    7.  Click **Create Resources**. Both sites are now live on one dashboard.

### Option B: Microsoft Azure (Free + $100 Credit) 🥈
*   **Perk**: Free App Service tier + $100 credit.
*   **Why**: Since DigitalOcean rejected your card, Azure is the best alternative. It is very trusted and verification is often easier for students.
*   **How to use (All-in-One)**:
    1.  Go to [education.github.com/pack](https://education.github.com/pack).
    2.  Find **Microsoft Azure** and claim the code.
    3.  Sign up at [portal.azure.com](https://portal.azure.com) (Use your student email if possible).
    4.  Search for **"Static Web Apps"** (This is the easiest way).
    5.  Click **Create**.
    6.  Connect GitHub (`scansecure-webpage`).
    7.  **Build Details**:
        *   **App location**: `frontend`
        *   **Api location**: `backend` (Azure handles Python APIs automatically too!)
        *   **Output location**: `.next` (or leave default if it detects Next.js)
    8.  Click **Review + Create**. Azure is huge, so this puts everything in one place.

### Option C: Render.com (The "No Credit Card" Savior) 🥉
*   **Perk**: Free tier for both Web Services (Python) and Static Sites (React).
*   **Why**: **NO CREDIT CARD REQUIRED.** If banks/verification block you, this is your home.
*   **How to use (All-in-One)**:
    1.  Sign up at [render.com](https://render.com) (Login with GitHub).
    2.  **Deploy Backend (Python)**:
        *   Click **New +** -> **Web Service**.
        *   Connect `scansecure-webpage`.
        *   Root Directory: `backend`.
        *   Build Command: `pip install -r requirements.txt`.
        *   Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`.
        *   Select **"Free"** instance type.
        *   Click **Deploy**. Copy the URL (e.g., `https://securescan-backend.onrender.com`).
    3.  **Deploy Frontend (Next.js)**:
        *   Click **New +** -> **Web Service** (Yes, Web Service is easier for SSR Next.js, or use Static Site if you export).
        *   *Better Path*: Use **Vercel** for frontend (easiest), BUT if you want everything on Render:
        *   Connect `scansecure-webpage`.
        *   Root Directory: `frontend`.
        *   Add Environment Variable: `NEXT_PUBLIC_API_URL` = `Your Backend URL`.
        *   Click **Deploy**.

**Final Verdict**: Use **Option C (Render)**. It bypasses all your account/bank issues immediately.

---

## 🎁 Bonus: Free Domains (Student Pack)

Yes! Your Student Pack also gives you **free domains** (names like `www.securescan.me` instead of `.vercel.app`).

### 1. Namecheap (Free 1-year `.me` domain)
*   **Offer**: 1 year free registration for a `.me` domain (Great for personal projects!).
*   **How**:
    1.  Go to [education.github.com/pack](https://education.github.com/pack).
    2.  Find **Namecheap**.
    3.  Click to reveal your code/link.
    4.  Search for `securescan.me` (or similar).
    5.  Checkout for $0.

### 2. .TECH Domains (Free 1-year `.tech` domain)
*   **Offer**: 1 year free standard `.tech` domain.
*   **How**: Find the **.TECH** card in your Student Pack dashboard.

### 🔌 How to connect the domain?
Once you "buy" the domain:
1.  Go to **Vercel** -> Project Settings -> **Domains**.
2.  Type your new domain (e.g., `securescan.me`).
3.  Vercel will give you "Nameservers" (like `ns1.vercel-dns.com`).
4.  Go to **Namecheap** -> Domain List -> Manage -> Nameservers.
5.  Paste the Vercel nameservers there.
### 🔌 How to connect `mysecurescan.tech` to Vercel? (Recommended for Frontend)
If you hosted your frontend on **Vercel** (Option B):

1.  **On Vercel**:
    *   Go to your Project -> **Settings** -> **Domains**.
    *   Type `mysecurescan.tech` and click **Add**.
    *   Vercel will say "Invalid Configuration" and give you **Nameservers**.
    *   They look like: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`.

2.  **On your Domain Site** (get.tech or Namecheap):
    *   Log in and find **DNS Management** or **Nameservers**.
    *   Select **"Custom DNS"**.
    *   Paste the two Vercel nameservers from step 1.
    *   Click **Save**.

3.  **Wait**: It can take 1-2 hours. Once the "Invalid" error turns green on Vercel, your site is live!
