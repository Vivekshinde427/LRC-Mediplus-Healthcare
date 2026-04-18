# 🔥 Firebase Setup Guide — LRC Medi+ Healthcare

## Step 1: Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `lrc-medi-plus`
3. Disable Google Analytics (optional) → Click **"Create Project"**

---

## Step 2: Register Web App & Get Config

1. In your project → Click the **Web icon** `</>`
2. Register app name: `LRC Healthcare Web`
3. Copy the `firebaseConfig` object shown
4. Open `js/firebase.js` and **replace** the placeholder values:

```js
const firebaseConfig = {
    apiKey: "AIza...",            // ← paste your real key
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123:web:abc123"
};
```

---

## Step 3: Enable Authentication

1. Firebase Console → **Authentication** → **Get Started**
2. **Sign-in method** → Enable **Email/Password**
3. Click **Save**

---

## Step 4: Enable Firestore Database

1. Firebase Console → **Firestore Database** → **Create Database**
2. Choose **"Start in production mode"** → Select your region (e.g. `asia-south1` for India)
3. Click **Done**

---

## Step 5: Upload Security Rules

1. Firestore → **Rules** tab
2. Delete the existing rules and paste the contents of `firestore.rules`
3. Click **Publish**

---

## Step 6: Create Admin Account

1. Firebase Console → **Authentication** → **Users** → **Add User**
2. Email: `mediiplus.healthcare@gmail.com`
3. Set a strong password
4. Click **Add User**

---

## Step 7: Test the App

Open `index.html` in your browser (via a local server like VS Code Live Server).

✅ Homepage loads with trending products  
✅ Register / Login works  
✅ Cart and checkout places orders in Firestore  
✅ Admin panel accessible at `admin.html`  
✅ Dark / Light mode toggle persists  

---

## ⚠️ Common Issues

| Problem | Fix |
|---------|-----|
| "Permission denied" error | Re-upload `firestore.rules` from Step 5 |
| Products not showing | Check Firebase config in `js/firebase.js` |
| Admin panel redirects to login | Make sure admin email matches `ADMIN_EMAIL` in `firebase.js` |
| Orders not saving | Check Firestore rules allow `create` for authenticated users |
| Red warning banner at top | Firebase config still has placeholder values |
