document.addEventListener('DOMContentLoaded', function() {
    // أزرار إضافة للسلة
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.offer-card');
            const productName = card.querySelector('.offer-title').textContent;
            const productPrice = card.querySelector('.offer-price').textContent.match(/[\d,]+/)[0];
            const productImage = card.querySelector('img').src;
            
            // إضافة المنتج للسلة
            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            // عرض رسالة نجاح
            showNotification('تم إضافة المنتج للسلة بنجاح', 'success');
        });
    });

    // أزرار إضافة للمفضلة
    const addToFavButtons = document.querySelectorAll('.add-to-favorites');
    addToFavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.offer-card');
            const productName = card.querySelector('.offer-title').textContent;
            const productPrice = card.querySelector('.offer-price').textContent.match(/[\d,]+/)[0];
            const productImage = card.querySelector('img').src;
            
            // إضافة المنتج للمفضلة
            addToFavorites({
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            // تغيير لون الأيقونة
            const icon = this.querySelector('i');
            icon.style.color = '#e60000';
            
            // عرض رسالة نجاح
            showNotification('تم إضافة المنتج للمفضلة بنجاح', 'success');
        });
    });

    // دالة إضافة للسلة
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // دالة إضافة للمفضلة
    function addToFavorites(product) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();
    }

    // دالة تحديث عدد عناصر السلة
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cart.length;
        }
    }

    // دالة تحديث عدد المفضلة
    function updateFavoritesCount() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favBadge = document.querySelector('.favorites-badge');
        if (favBadge) {
            favBadge.textContent = favorites.length;
        }
    }

    // دالة عرض الإشعارات
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // تحديث العدادات عند تحميل الصفحة
    updateCartCount();
    updateFavoritesCount();
});
