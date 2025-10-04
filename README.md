# Byte by Philip

A modern tech products marketplace and news hub built with vanilla JavaScript, Firebase, and designed for GitHub Pages deployment.

![Byte by Philip](assets/logo.png)

## 🚀 Features

### 🛍️ **E-Commerce Platform**
- **Product Catalog**: Browse PDFs, apps, tools, courses, templates, plugins, AI models, and services
- **Advanced Filtering**: Filter by category, subcategory, price range, and search
- **Smart Sorting**: Sort by newest, price (low to high, high to low)
- **Pagination**: Clean pagination for easy browsing
- **Product Details**: Rich product pages with image galleries and preview modals
- **Shopping Cart**: Full cart management with localStorage persistence
- **WhatsApp Checkout**: Seamless checkout via WhatsApp (+254791943551)

### 📰 **Tech News Hub**
- **RSS Integration**: Aggregates news from 6 Google News feeds (Technology, AI, ML, Programming, Cybersecurity, Gadgets)
- **Custom Articles**: Publish your own tech articles via Firestore
- **Smart Merging**: Combines RSS feeds with custom articles, deduplicates content
- **Category Filtering**: Filter news by topic
- **Rich Article Display**: Beautiful article pages with full content

### 🔐 **Admin Dashboard**
- **Password Protected**: Secure access with password: `@bytebyphilip7619ke`
- **Product Management**: Full CRUD for products
- **Article Management**: Create, edit, and delete articles
- **Category Management**: Manage product categories and subcategories
- **RSS Management**: Manual refresh of RSS feeds
- **Settings**: Configure WhatsApp number and social media handles

### 🎨 **Design & UX**
- **Dark Theme**: Modern dark theme (#07070a background, #00e0ff primary, #9b59ff secondary)
- **Responsive**: Fully responsive design for all devices
- **Animated Splash Screen**: 3-second logo animation on homepage
- **Smooth Animations**: Fade-ins, slide-ins, and hover effects
- **Theme Toggle**: Light/dark mode support (coming soon)

## 🛠️ Technologies

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (for image uploads)
- **Authentication**: Simple password-based admin access
- **RSS**: RSS2JSON API for feed aggregation
- **Deployment**: GitHub Pages

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/byte-by-philip.git
cd byte-by-philip
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Copy your Firebase config
5. Update `firebase.js` with your credentials:

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

### 3. Firestore Database Setup

Create the following collections in Firestore:

#### Products Collection
```javascript
{
  title: string,
  slug: string,
  category: string,
  subcategory: string,
  shortDescription: string,
  description: string,
  price: number,
  currency: string,
  image: string,
  previewPages: array,
  fileSize: number,
  format: string,
  license: string,
  published: boolean,
  tags: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Articles Collection
```javascript
{
  title: string,
  slug: string,
  excerpt: string,
  body: string,
  author: string,
  category: string,
  image: string,
  publishedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Categories Collection
```javascript
{
  name: string,
  subcategories: array,
  createdAt: timestamp
}
```

### 4. Add Sample Data

You can import the sample data from the `data/` directory:
- `data/sample-products.json` - 6 sample products
- `data/sample-articles.json` - 4 sample articles

### 5. Add Images

Replace placeholder images with actual images:
- See `assets/IMAGE_ASSETS_NEEDED.md` for complete list
- Use stock images from Unsplash/Pexels or generate with AI
- Recommended sizes: Products (800x600px), News (1200x630px)

### 6. Local Development

Simply open `index.html` in a browser or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code Live Server
# Right-click index.html > Open with Live Server
```

Visit `http://localhost:8000`

## 🚀 GitHub Pages Deployment

### Method 1: GitHub Pages Settings

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select branch: `main`
4. Select folder: `/ (root)`
5. Click Save
6. Your site will be live at `https://yourusername.github.io/byte-by-philip/`

### Method 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 🔑 Admin Access

1. Navigate to `/admin.html`
2. Enter password: `@bytebyphilip7619ke`
3. Access full admin dashboard

### Admin Features:
- **Overview**: View statistics (total products, articles, categories)
- **Products**: Add, edit, delete products
- **Articles**: Manage your blog posts
- **Categories**: Organize product categories
- **RSS Feeds**: Manually refresh news feeds
- **Settings**: Update WhatsApp number and social media handles

## 📱 WhatsApp Integration

Products can be purchased via WhatsApp:
- **Number**: +254791943551
- **Process**: 
  1. Add items to cart
  2. Click "Checkout via WhatsApp"
  3. Review order details
  4. Message sent to WhatsApp with order details
  5. Complete payment details via chat

## 🎨 Customization

### Colors
Update CSS variables in `style.css`:

```css
:root {
  --color-bg: #07070a;           /* Dark background */
  --color-primary: #00e0ff;      /* Cyan accent */
  --color-secondary: #9b59ff;    /* Purple accent */
}
```

### Social Media
Update handles in admin settings or directly in:
- `app.js` - Footer social links
- `admin.html` - Settings panel

### WhatsApp Number
Change in admin settings or update:
- Product pages checkout links
- Cart checkout functionality

## 📊 RSS Feeds

The site aggregates news from:
1. Technology News
2. Artificial Intelligence
3. Machine Learning
4. Programming
5. Cybersecurity
6. Tech Gadgets

Feeds refresh automatically every 30 minutes or manually via admin panel.

## 🐛 Troubleshooting

### Firebase Issues
- Verify API keys are correct
- Check Firestore security rules allow read/write
- Ensure Firebase Storage CORS is configured

### RSS Not Loading
- Check RSS2JSON API quota
- Verify CORS proxy is working
- Use manual refresh in admin panel

### Images Not Showing
- Verify image paths are correct
- Check Firebase Storage permissions
- Ensure images are uploaded to correct folders

## 📝 File Structure

```
byte-by-philip/
├── index.html              # Homepage with splash screen
├── products.html           # Product listing page
├── product.html            # Product detail page
├── news.html              # News aggregation page
├── article.html           # Article detail page
├── cart.html              # Shopping cart
├── admin.html             # Admin dashboard
├── style.css              # Global styles
├── firebase.js            # Firebase configuration
├── firestore-helpers.js   # Firestore CRUD functions
├── app.js                 # Main application logic
├── admin.js               # Admin functionality
├── rss.js                 # RSS feed integration
├── data/
│   ├── sample-products.json
│   └── sample-articles.json
└── assets/
    ├── logo.png
    ├── products/          # Product images
    ├── news/             # Article images
    └── IMAGE_ASSETS_NEEDED.md
```

## 🔒 Security Notes

- Admin password is stored in plain text (client-side only)
- For production, implement proper authentication
- Add Firestore security rules to prevent unauthorized access
- Consider using Firebase Authentication for real user accounts

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Stripe, M-Pesa)
- [ ] User accounts and order history
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Philip**
- Instagram: [@bytebyphilip](https://instagram.com/bytebyphilip)
- Facebook: [@bytebyphilip](https://facebook.com/bytebyphilip)
- TikTok: [@bytebyphilip](https://tiktok.com/@bytebyphilip)
- WhatsApp: [+254791943551](https://wa.me/254791943551)

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Google News RSS for news aggregation
- Open source community for inspiration

---

**Built with ❤️ by Philip | Byte by Philip - Tech, AI & ML Hub**
