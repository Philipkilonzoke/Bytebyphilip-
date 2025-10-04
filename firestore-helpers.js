// Firestore CRUD helper functions
import { db } from './firebase.js';
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ===== PRODUCTS =====
export async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        // Fallback to sample data
        return loadSampleProducts();
    }
}

export async function getProductBySlug(slug) {
    try {
        const q = query(collection(db, 'products'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting product by slug:', error);
        const products = await loadSampleProducts();
        return products.find(p => p.slug === slug) || null;
    }
}

export async function addProduct(productData) {
    try {
        const docRef = await addDoc(collection(db, 'products'), {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...productData };
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

export async function updateProduct(id, productData) {
    try {
        const productRef = doc(db, 'products', id);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: serverTimestamp()
        });
        return { id, ...productData };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, 'products', id));
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// ===== ARTICLES =====
export async function getArticles() {
    try {
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articles = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            articles.push({ 
                id: doc.id, 
                ...data,
                isExternal: false
            });
        });
        return articles;
    } catch (error) {
        console.error('Error getting articles:', error);
        return loadSampleArticles();
    }
}

export async function getArticleBySlug(slug) {
    try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting article by slug:', error);
        const articles = await loadSampleArticles();
        return articles.find(a => a.slug === slug) || null;
    }
}

export async function addArticle(articleData) {
    try {
        const docRef = await addDoc(collection(db, 'articles'), {
            ...articleData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...articleData };
    } catch (error) {
        console.error('Error adding article:', error);
        throw error;
    }
}

export async function updateArticle(id, articleData) {
    try {
        const articleRef = doc(db, 'articles', id);
        await updateDoc(articleRef, {
            ...articleData,
            updatedAt: serverTimestamp()
        });
        return { id, ...articleData };
    } catch (error) {
        console.error('Error updating article:', error);
        throw error;
    }
}

export async function deleteArticle(id) {
    try {
        await deleteDoc(doc(db, 'articles', id));
        return true;
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}

// ===== CATEGORIES =====
export async function getCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        return categories;
    } catch (error) {
        console.error('Error getting categories:', error);
        return loadSampleCategories();
    }
}

export async function addCategory(categoryData) {
    try {
        const docRef = await addDoc(collection(db, 'categories'), {
            ...categoryData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, ...categoryData };
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

export async function updateCategory(id, categoryData) {
    try {
        const categoryRef = doc(db, 'categories', id);
        await updateDoc(categoryRef, categoryData);
        return { id, ...categoryData };
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

export async function deleteCategory(id) {
    try {
        await deleteDoc(doc(db, 'categories', id));
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

// ===== SAMPLE DATA LOADERS =====
async function loadSampleProducts() {
    try {
        const response = await fetch('data/sample-products.json');
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error loading sample products:', error);
    }
    
    // Hardcoded fallback
    return [
        {
            id: '1',
            title: 'AI Fundamentals Guide',
            slug: 'ai-fundamentals-guide',
            category: 'PDF',
            subcategory: 'Machine Learning',
            shortDescription: 'Complete guide to artificial intelligence fundamentals',
            description: 'A comprehensive guide covering AI basics, neural networks, and practical applications.',
            price: 1500,
            currency: 'KES',
            image: 'assets/products/placeholder.jpg',
            published: true,
            tags: ['AI', 'Machine Learning', 'Education']
        }
    ];
}

async function loadSampleArticles() {
    try {
        const response = await fetch('data/sample-articles.json');
        if (response.ok) {
            const articles = await response.json();
            return articles.map(a => ({ ...a, isExternal: false }));
        }
    } catch (error) {
        console.error('Error loading sample articles:', error);
    }
    
    // Hardcoded fallback
    return [
        {
            id: '1',
            title: 'The Future of AI in Kenya',
            slug: 'future-of-ai-kenya',
            excerpt: 'Exploring how artificial intelligence is transforming industries across Kenya.',
            body: '<p>Artificial intelligence is rapidly transforming industries across Kenya...</p>',
            author: 'Philip',
            category: 'AI',
            image: 'assets/default-news.jpg',
            publishedAt: new Date().toISOString(),
            isExternal: false
        }
    ];
}

function loadSampleCategories() {
    return [
        { id: '1', name: 'PDF', subcategories: ['eBooks', 'Guides', 'Research Papers'] },
        { id: '2', name: 'App', subcategories: ['Mobile Apps', 'Web Apps', 'Desktop Apps'] },
        { id: '3', name: 'Tools', subcategories: ['Scripts', 'CLI Tools', 'Utilities'] },
        { id: '4', name: 'Course', subcategories: ['Video Courses', 'Interactive', 'Text-based'] },
        { id: '5', name: 'Template', subcategories: ['UI Kits', 'Code Templates', 'Design Systems'] },
        { id: '6', name: 'Plugin', subcategories: ['WordPress', 'VS Code', 'Browser Extensions'] },
        { id: '7', name: 'AI', subcategories: ['Models', 'Demos', 'Datasets'] },
        { id: '8', name: 'Service', subcategories: ['Consulting', 'Development', 'Design'] }
    ];
}

export { loadSampleProducts, loadSampleArticles, loadSampleCategories };
