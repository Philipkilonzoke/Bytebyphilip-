# Deployment Guide for Byte by Philip

## ⚠️ Important: This is a Static Site for GitHub Pages

This project contains a **static vanilla JavaScript website** designed specifically for GitHub Pages deployment. All the website files are in the **root directory**.

### What You're Deploying

The following files in the **root directory** make up your static website:

```
Root Directory (Deploy These):
├── index.html              ← Homepage with splash screen
├── products.html           ← Product listing
├── product.html            ← Product details
├── news.html              ← News aggregation
├── article.html           ← Article viewer
├── cart.html              ← Shopping cart
├── admin.html             ← Admin dashboard
├── style.css              ← All styles
├── firebase.js            ← Firebase config
├── firestore-helpers.js   ← Database helpers
├── app.js                 ← Main app logic
├── admin.js               ← Admin functionality
├── rss.js                 ← RSS feed integration
├── assets/                ← Images and media
└── data/                  ← Sample JSON data
```

### ❌ What NOT to Deploy

The `client/` and `server/` directories contain a React/Vite development environment that is **NOT part of your static site**. Ignore these folders for GitHub Pages deployment.

## 📤 Step-by-Step GitHub Pages Deployment

### Method 1: Direct GitHub Pages (Recommended)

1. **Create a new repository on GitHub**
   ```bash
   # Create repo on GitHub.com, then:
   git init
   git add index.html products.html product.html news.html article.html cart.html admin.html style.css firebase.js firestore-helpers.js app.js admin.js rss.js assets/ data/ README.md
   git commit -m "Initial commit: Byte by Philip static site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/byte-by-philip.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select branch: **main**
   - Under "Folder", select: **/ (root)**
   - Click **Save**
   - Wait 1-2 minutes for deployment

3. **Access your site**
   - URL: `https://YOUR_USERNAME.github.io/byte-by-philip/`

### Method 2: Using .nojekyll (If you have issues)

If assets don't load properly, add a `.nojekyll` file:

```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for proper asset loading"
git push
```

## 🔥 Firebase Setup

Before your site works properly, configure Firebase:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enable Firestore Database
   - Enable Firebase Storage

2. **Get Configuration**
   - Project Settings → General → Your apps
   - Click Web app (</>) → Register app
   - Copy the configuration object

3. **Update firebase.js**
   - Replace the firebaseConfig in `firebase.js` with your config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Configure Firestore Rules** (Important!)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null; // Or customize as needed
       }
     }
   }
   ```

5. **Add Sample Data**
   - You can manually add products/articles via the admin panel
   - Or import from `data/sample-products.json` and `data/sample-articles.json`

## 📸 Adding Images

Your site references several images. Add them to make it complete:

1. **Product Images** → `assets/products/`
2. **News Images** → `assets/news/`  
3. **Default Placeholder** → `assets/default-news.jpg`

See `assets/IMAGE_ASSETS_NEEDED.md` for complete list.

## 🧪 Testing Locally

To test the site locally before deploying:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Option 3: VS Code Live Server
# Install Live Server extension, right-click index.html → Open with Live Server
```

Then visit `http://localhost:8000`

## ✅ Deployment Checklist

- [ ] Firebase project created and configured
- [ ] `firebase.js` updated with your config
- [ ] Firestore security rules configured
- [ ] Images added to `assets/` folders
- [ ] Repository created on GitHub
- [ ] Files pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Site accessible at GitHub Pages URL
- [ ] Admin login works (`/admin.html` with password: `@bytebyphilip7619ke`)
- [ ] Products page loads
- [ ] News page loads with RSS feeds or fallback data
- [ ] Cart functionality works
- [ ] WhatsApp checkout links work

## 🔧 Troubleshooting

### Images Don't Load
- Check if paths are correct (`assets/products/image.jpg`)
- Ensure images exist in the repository
- Add `.nojekyll` file to root

### Firebase Errors
- Verify API keys in `firebase.js`
- Check browser console for errors (F12)
- Ensure Firestore rules allow reads

### RSS Feeds Not Loading
- Check browser console for CORS errors
- Fallback data should display even if RSS fails
- Try manual refresh in admin panel

### 404 Errors on GitHub Pages
- Ensure branch and folder are correct in Pages settings
- Wait 1-2 minutes after enabling Pages
- Check repository is public (or you have Pro for private)

## 🌐 Custom Domain (Optional)

To use a custom domain like `bytebyphilip.com`:

1. Add a `CNAME` file to root with your domain:
   ```
   bytebyphilip.com
   ```

2. In your domain registrar (Namecheap, GoDaddy, etc.):
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
   - Add A records for apex domain:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. In GitHub: Settings → Pages → Custom domain → Enter your domain

## 📞 Support

If you encounter issues:
- Check browser console (F12) for errors
- Review Firebase console for database issues
- Verify all files are committed to GitHub
- Ensure GitHub Pages is enabled in settings

---

**Your static site is ready for deployment! 🚀**

Built with ❤️ for GitHub Pages
