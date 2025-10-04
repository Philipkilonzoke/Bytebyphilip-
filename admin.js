// Admin dashboard functionality
import { 
    getProducts, addProduct, updateProduct, deleteProduct,
    getArticles, addArticle, updateArticle, deleteArticle,
    getCategories, addCategory, updateCategory, deleteCategory
} from './firestore-helpers.js';
import { storage } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

// Check authentication
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    // Handled by admin.html inline script
}

// Load stats
loadStats();

// Load data for each tab
document.querySelector('[data-tab="products"]')?.addEventListener('click', loadProducts);
document.querySelector('[data-tab="articles"]')?.addEventListener('click', loadArticles);
document.querySelector('[data-tab="categories"]')?.addEventListener('click', loadCategories);

// ===== STATS =====
async function loadStats() {
    try {
        const [products, articles, categories] = await Promise.all([
            getProducts(),
            getArticles(),
            getCategories()
        ]);

        document.getElementById('stat-products').textContent = products.length;
        document.getElementById('stat-articles').textContent = articles.length;
        document.getElementById('stat-categories').textContent = categories.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ===== PRODUCTS =====
async function loadProducts() {
    try {
        const products = await getProducts();
        const container = document.getElementById('products-list');
        
        if (products.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: 2rem 0;">No products yet. Add your first product!</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.title}</td>
                            <td>${product.category}</td>
                            <td>${product.currency} ${product.price?.toLocaleString() || 0}</td>
                            <td><span class="badge ${product.published ? 'badge-success' : 'badge-error'}">${product.published ? 'Published' : 'Draft'}</span></td>
                            <td>
                                <button class="btn btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;" onclick="editProduct('${product.id}')">Edit</button>
                                <button class="btn" style="background: var(--color-error); color: white; padding: 0.5rem 1rem;" onclick="deleteProductConfirm('${product.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    }
}

window.editProduct = function(id) {
    showToast('Edit functionality - implement product form modal', 'success');
};

window.deleteProductConfirm = async function(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(id);
            showToast('Product deleted successfully', 'success');
            loadProducts();
            loadStats();
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Failed to delete product', 'error');
        }
    }
};

document.getElementById('add-product-btn')?.addEventListener('click', () => {
    showToast('Add product form - implement modal with all fields', 'success');
});

// ===== ARTICLES =====
async function loadArticles() {
    try {
        const articles = await getArticles();
        const container = document.getElementById('articles-list');
        
        if (articles.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: 2rem 0;">No articles yet. Write your first article!</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Published</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${articles.map(article => `
                        <tr>
                            <td>${article.title}</td>
                            <td>${article.author || 'Philip'}</td>
                            <td>${article.category || 'General'}</td>
                            <td>${article.publishedAt ? new Date(article.publishedAt?.seconds * 1000 || article.publishedAt).toLocaleDateString() : 'Not published'}</td>
                            <td>
                                <button class="btn btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;" onclick="editArticle('${article.id}')">Edit</button>
                                <button class="btn" style="background: var(--color-error); color: white; padding: 0.5rem 1rem;" onclick="deleteArticleConfirm('${article.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading articles:', error);
        showToast('Failed to load articles', 'error');
    }
}

window.editArticle = function(id) {
    showToast('Edit functionality - implement article editor', 'success');
};

window.deleteArticleConfirm = async function(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        try {
            await deleteArticle(id);
            showToast('Article deleted successfully', 'success');
            loadArticles();
            loadStats();
        } catch (error) {
            console.error('Error deleting article:', error);
            showToast('Failed to delete article', 'error');
        }
    }
};

document.getElementById('add-article-btn')?.addEventListener('click', () => {
    showToast('Add article form - implement rich text editor', 'success');
});

// ===== CATEGORIES =====
async function loadCategories() {
    try {
        const categories = await getCategories();
        const container = document.getElementById('categories-list');
        
        if (categories.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); padding: 2rem 0;">No categories yet.</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Subcategories</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(category => `
                        <tr>
                            <td>${category.name}</td>
                            <td>${category.subcategories?.join(', ') || 'None'}</td>
                            <td>
                                <button class="btn btn-outline" style="padding: 0.5rem 1rem; margin-right: 0.5rem;" onclick="editCategory('${category.id}')">Edit</button>
                                <button class="btn" style="background: var(--color-error); color: white; padding: 0.5rem 1rem;" onclick="deleteCategoryConfirm('${category.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories', 'error');
    }
}

window.editCategory = function(id) {
    showToast('Edit functionality - implement category modal', 'success');
};

window.deleteCategoryConfirm = async function(id) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await deleteCategory(id);
            showToast('Category deleted successfully', 'success');
            loadCategories();
            loadStats();
        } catch (error) {
            console.error('Error deleting category:', error);
            showToast('Failed to delete category', 'error');
        }
    }
};

document.getElementById('add-category-btn')?.addEventListener('click', () => {
    showToast('Add category form - implement modal', 'success');
});

// ===== RSS MANAGEMENT =====
document.getElementById('refresh-rss-btn')?.addEventListener('click', async () => {
    try {
        showToast('Refreshing RSS feeds...', 'success');
        const { refreshRSSFeeds } = await import('./rss.js');
        await refreshRSSFeeds();
        document.getElementById('last-fetch-time').textContent = new Date().toLocaleString();
        showToast('RSS feeds refreshed successfully', 'success');
    } catch (error) {
        console.error('Error refreshing RSS:', error);
        showToast('Failed to refresh RSS feeds', 'error');
    }
});

// ===== SETTINGS =====
document.getElementById('save-settings-btn')?.addEventListener('click', () => {
    const settings = {
        whatsappNumber: document.getElementById('whatsapp-number')?.value,
        siteName: document.getElementById('site-name')?.value,
        instagram: document.getElementById('instagram-handle')?.value,
        facebook: document.getElementById('facebook-handle')?.value,
        tiktok: document.getElementById('tiktok-handle')?.value
    };
    
    localStorage.setItem('site_settings', JSON.stringify(settings));
    showToast('Settings saved successfully', 'success');
});

// Load saved settings
window.addEventListener('load', () => {
    const saved = localStorage.getItem('site_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            if (document.getElementById('whatsapp-number')) {
                document.getElementById('whatsapp-number').value = settings.whatsappNumber || '254791943551';
                document.getElementById('site-name').value = settings.siteName || 'Byte by Philip';
                document.getElementById('instagram-handle').value = settings.instagram || '@bytebyphilip';
                document.getElementById('facebook-handle').value = settings.facebook || '@bytebyphilip';
                document.getElementById('tiktok-handle').value = settings.tiktok || '@bytebyphilip';
            }
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
});

// ===== FILE UPLOAD =====
export async function uploadFile(file, path) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== HELPER FUNCTIONS =====
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export { generateSlug };
