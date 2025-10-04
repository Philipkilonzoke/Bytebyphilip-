// Main application JavaScript - handles header, sidebar, cart, theme, and global functionality
import { getProducts, getArticles } from './firestore-helpers.js';

// ===== GLOBAL STATE =====
let cart = [];
const CART_KEY = 'byte_cart';
const THEME_KEY = 'byte_theme';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    initTheme();
    initHeader();
    initSidebar();
    initFooter();
    initSplashScreen();
    updateCartCount();
    loadProductCounts();
});

// ===== SPLASH SCREEN =====
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.querySelector('.main-content');
    const footer = document.querySelector('.site-footer');
    const enterBtn = document.getElementById('enter-site-btn');

    if (!splashScreen) return;

    // Auto-redirect after 3 seconds
    const autoRedirect = setTimeout(() => {
        hideSplash();
    }, 3000);

    // Manual click to enter
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            clearTimeout(autoRedirect);
            hideSplash();
        });
    }

    function hideSplash() {
        splashScreen.classList.remove('active');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            if (mainContent) mainContent.classList.remove('hidden');
            if (footer) footer.classList.remove('hidden');
        }, 500);
    }
}

// ===== HEADER =====
function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // Search toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', () => {
            searchBar.classList.toggle('hidden');
            if (!searchBar.classList.contains('hidden')) {
                searchInput?.focus();
            }
        });
    }

    if (searchClose && searchBar) {
        searchClose.addEventListener('click', () => {
            searchBar.classList.add('hidden');
            if (searchInput) searchInput.value = '';
        });
    }
}

// ===== SIDEBAR =====
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (!sidebar) {
        renderSidebar();
    }

    // Toggle sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.add('open');
            document.getElementById('sidebar-overlay')?.classList.add('active');
        });
    }

    // Close sidebar
    const closeSidebar = () => {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
    };

    document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    // Submenu toggles
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.classList.toggle('open');
            const submenu = toggle.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('open');
            }
        });
    });
}

function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.innerHTML.trim() !== '') return;

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <h2>Menu</h2>
            <button id="sidebar-close" class="icon-btn" aria-label="Close menu" data-testid="button-sidebar-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <ul class="sidebar-menu" data-testid="list-sidebar-menu">
            <li><a href="/" data-testid="link-sidebar-home">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                Home
            </a></li>
            <li class="has-submenu">
                <button class="submenu-toggle" data-testid="button-products-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Products <span class="submenu-count" id="total-products-count">(0)</span>
                    <svg class="submenu-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <ul class="submenu">
                    <li><a href="products.html?category=PDF" data-testid="link-category-pdf">PDFs <span class="count" id="pdf-count">(0)</span></a></li>
                    <li><a href="products.html?category=App" data-testid="link-category-app">Apps <span class="count" id="app-count">(0)</span></a></li>
                    <li><a href="products.html?category=Tools" data-testid="link-category-tools">Tools & Scripts <span class="count" id="tools-count">(0)</span></a></li>
                    <li><a href="products.html?category=Course" data-testid="link-category-course">Courses <span class="count" id="course-count">(0)</span></a></li>
                    <li><a href="products.html?category=Template" data-testid="link-category-template">Templates & UI Kits <span class="count" id="template-count">(0)</span></a></li>
                    <li><a href="products.html?category=Plugin" data-testid="link-category-plugin">Plugins & Extensions <span class="count" id="plugin-count">(0)</span></a></li>
                    <li><a href="products.html?category=AI" data-testid="link-category-ai">AI Models & Demos <span class="count" id="ai-count">(0)</span></a></li>
                    <li><a href="products.html?category=Service" data-testid="link-category-service">Services & Consultations <span class="count" id="service-count">(0)</span></a></li>
                </ul>
            </li>
            <li class="has-submenu">
                <button class="submenu-toggle" data-testid="button-news-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
                    News
                    <svg class="submenu-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <ul class="submenu">
                    <li><a href="news.html?filter=tech" data-testid="link-news-tech">Tech News</a></li>
                    <li><a href="news.html?filter=ai" data-testid="link-news-ai">AI News</a></li>
                    <li><a href="news.html?filter=custom" data-testid="link-news-custom">My Articles</a></li>
                </ul>
            </li>
            <li><a href="products.html" data-testid="link-sidebar-all-products">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                AI/ML Resources
            </a></li>
            <li><a href="cart.html" data-testid="link-sidebar-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Cart
            </a></li>
            <li><a href="admin.html" data-testid="link-sidebar-admin">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Admin Dashboard
            </a></li>
        </ul>
        <div class="sidebar-footer">
            <p class="sidebar-hint">Admin: click to login</p>
        </div>
    `;

    // Re-initialize sidebar events
    document.getElementById('sidebar-close')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
    });

    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.classList.toggle('open');
            const submenu = toggle.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('open');
            }
        });
    });
}

// ===== FOOTER =====
function initFooter() {
    const footer = document.querySelector('.site-footer');
    if (!footer || footer.innerHTML.trim() !== '') return;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <img src="assets/logo.png" alt="Byte by Philip" class="footer-logo">
                    <p class="footer-tagline">Byte by Philip — Tech, AI & ML hub</p>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <div class="footer-links">
                        <a href="/" data-testid="link-footer-home">Home</a>
                        <a href="products.html" data-testid="link-footer-products">Products</a>
                        <a href="news.html" data-testid="link-footer-news">News</a>
                        <a href="#about" data-testid="link-footer-about">About</a>
                        <a href="#contact" data-testid="link-footer-contact">Contact</a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Connect</h4>
                    <div class="footer-social">
                        <a href="https://instagram.com/bytebyphilip" target="_blank" rel="noopener" data-testid="link-social-instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>
                            Instagram
                        </a>
                        <a href="https://facebook.com/bytebyphilip" target="_blank" rel="noopener" data-testid="link-social-facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
                            Facebook
                        </a>
                        <a href="https://tiktok.com/@bytebyphilip" target="_blank" rel="noopener" data-testid="link-social-tiktok">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                            TikTok
                        </a>
                        <a href="https://wa.me/254791943551" target="_blank" rel="noopener" data-testid="link-social-whatsapp">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 Byte by Philip. All rights reserved.</p>
                <p class="footer-note">Checkout via WhatsApp. Secure payment support coming soon.</p>
            </div>
        </div>
    `;
}

// ===== THEME TOGGLE =====
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const newTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, newTheme);
        });
    }
}

// ===== CART MANAGEMENT =====
function initCart() {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

export function getCart() {
    return cart;
}

export function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.title} added to cart!`, 'success');
}

export function updateCart(productId, quantity) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
    }
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showToast('Item removed from cart', 'success');
}

export function clearCart() {
    cart = [];
    saveCart();
    showToast('Cart cleared', 'success');
}

// ===== TOAST NOTIFICATIONS =====
export function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== PRODUCT COUNTS =====
async function loadProductCounts() {
    try {
        const products = await getProducts();
        const counts = {};
        
        products.forEach(p => {
            if (!p.published) return;
            counts[p.category] = (counts[p.category] || 0) + 1;
        });

        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        
        document.getElementById('total-products-count')?.textContent = `(${total})`;
        document.getElementById('pdf-count')?.textContent = `(${counts['PDF'] || 0})`;
        document.getElementById('app-count')?.textContent = `(${counts['App'] || 0})`;
        document.getElementById('tools-count')?.textContent = `(${counts['Tools'] || 0})`;
        document.getElementById('course-count')?.textContent = `(${counts['Course'] || 0})`;
        document.getElementById('template-count')?.textContent = `(${counts['Template'] || 0})`;
        document.getElementById('plugin-count')?.textContent = `(${counts['Plugin'] || 0})`;
        document.getElementById('ai-count')?.textContent = `(${counts['AI'] || 0})`;
        document.getElementById('service-count')?.textContent = `(${counts['Service'] || 0})`;
    } catch (error) {
        console.error('Error loading product counts:', error);
    }
}

// ===== LOAD HOME PAGE CONTENT =====
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    loadHomePage();
}

async function loadHomePage() {
    try {
        const [products, articles] = await Promise.all([getProducts(), getArticles()]);
        
        // Featured products
        const featured = products.filter(p => p.published).slice(0, 6);
        const grid = document.getElementById('featured-products-grid');
        if (grid && featured.length > 0) {
            grid.innerHTML = featured.map(product => `
                <div class="product-card" data-testid="card-product-${product.slug}">
                    <div style="position: relative;">
                        <img src="${product.image || 'assets/products/placeholder.jpg'}" alt="${product.title}" class="product-image" loading="lazy">
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-description">${product.shortDescription}</p>
                        <p class="product-price">${product.currency} ${product.price.toLocaleString()}</p>
                        <div class="product-actions">
                            <a href="product.html?slug=${product.slug}" class="btn btn-outline" data-testid="button-view-${product.slug}">View Details</a>
                            <button class="btn btn-primary add-to-cart-btn" data-product='${JSON.stringify(product)}' data-testid="button-add-cart-${product.slug}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const product = JSON.parse(e.target.dataset.product);
                    addToCart(product);
                });
            });
        }

        // Latest news
        const latest = articles.slice(0, 4);
        const newsGrid = document.getElementById('latest-news-grid');
        if (newsGrid && latest.length > 0) {
            newsGrid.innerHTML = latest.map((item, i) => {
                const isExternal = item.isExternal || item.externalUrl;
                const url = isExternal ? item.link || item.externalUrl : `article.html?slug=${item.slug}`;
                return `
                    <a href="${url}" target="${isExternal ? '_blank' : '_self'}" class="news-card" data-testid="card-news-${i}">
                        <img src="${item.image || 'assets/default-news.jpg'}" alt="${item.title}" class="news-thumbnail" loading="lazy">
                        <div class="news-content">
                            <div class="news-meta">
                                <span class="news-source">${item.source || 'Byte by Philip'}</span>
                                <span class="news-time">Recent</span>
                            </div>
                            <h3 class="news-title">${item.title.substring(0, 80)}${item.title.length > 80 ? '...' : ''}</h3>
                            <p class="news-excerpt">${(item.excerpt || item.summary || '').substring(0, 100)}...</p>
                        </div>
                    </a>
                `;
            }).join('');
        }

        // Hero carousel
        renderHeroCarousel(featured.slice(0, 3));
    } catch (error) {
        console.error('Error loading home page:', error);
    }
}

function renderHeroCarousel(products) {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel || products.length === 0) return;

    carousel.innerHTML = products.map(p => `
        <div style="min-width: 100%; border-radius: var(--radius-xl); overflow: hidden;">
            <img src="${p.image}" alt="${p.title}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">
        </div>
    `).join('');

    let currentSlide = 0;
    const totalSlides = products.length;

    document.querySelector('.carousel-prev')?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    document.querySelector('.carousel-next')?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    });

    // Auto-rotate
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }, 5000);
}
