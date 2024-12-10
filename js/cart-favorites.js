// إدارة السلة والمفضلة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة السلة والمفضلة في localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }

    // تحديث عدادات السلة والمفضلة
    updateCounters();

    // إضافة مستمعي الأحداث لأزرار السلة والمفضلة
    initializeButtons();
});

function initializeButtons() {
    // أزرار إضافة للسلة
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.offer-card, .product-card');
            const product = {
                id: card.dataset.productId || generateProductId(),
                name: card.querySelector('.offer-title, .product-title').textContent,
                price: card.querySelector('.current, .price').textContent.replace(/[^\d]/g, ''),
                image: card.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
        });
    });

    // أزرار إضافة للمفضلة
    document.querySelectorAll('.add-to-favorites').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.offer-card, .product-card');
            const product = {
                id: card.dataset.productId || generateProductId(),
                name: card.querySelector('.offer-title, .product-title').textContent,
                price: card.querySelector('.current, .price').textContent.replace(/[^\d]/g, ''),
                image: card.querySelector('img').src
            };
            
            toggleFavorite(product, this);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCounters();
    showNotification('تم إضافة المنتج للسلة بنجاح', 'success');
}

function toggleFavorite(product, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(item => item.id === product.id);
    const icon = button.querySelector('i');

    if (index === -1) {
        // إضافة للمفضلة
        favorites.push(product);
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.style.color = '#e60000';
        showNotification('تم إضافة المنتج للمفضلة', 'success');
    } else {
        // إزالة من المفضلة
        favorites.splice(index, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '#666';
        showNotification('تم إزالة المنتج من المفضلة', 'info');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCounters();
}

function updateCounters() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // تحديث عداد السلة
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // تحديث عداد المفضلة
    const favBadge = document.querySelector('.favorites-badge');
    if (favBadge) {
        favBadge.textContent = favorites.length;
        favBadge.style.display = favorites.length > 0 ? 'flex' : 'none';
    }

    // تحديث حالة أيقونات المفضلة
    updateFavoriteIcons();
}

function updateFavoriteIcons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.offer-card, .product-card').forEach(card => {
        const productId = card.dataset.productId;
        const isFavorite = favorites.some(item => item.id === productId);
        const icon = card.querySelector('.add-to-favorites i');
        
        if (icon) {
            if (isFavorite) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#e60000';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '#666';
            }
        }
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة أيقونة حسب نوع الإشعار
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    notification.prepend(icon);

    document.body.appendChild(notification);

    // تحريك الإشعار للأعلى
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);

    // إخفاء الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function generateProductId() {
    return Math.random().toString(36).substr(2, 9);
}
