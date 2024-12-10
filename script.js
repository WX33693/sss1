document.addEventListener('DOMContentLoaded', () => {
    // تهيئة السلايدر
    initSlider();
    
    // تهيئة قائمة المنتجات
    initProductInteractions();
    
    // تهيئة النشرة البريدية
    initNewsletterForm();
    
    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();
    
    // تحديث عربة التسوق عند تحميل الصفحة
    updateCartDisplay();
    
    // تحديث عداد المفضلة عند تحميل الصفحة
    updateFavoritesCount();
    checkEmptyFavorites();
    loadFavoritesFromLocalStorage();
});

// دالة تهيئة السلايدر
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // تغيير السلايد تلقائياً كل 5 ثواني
    setInterval(nextSlide, 5000);
}

// دالة تهيئة تفاعلات المنتجات
function initProductInteractions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إضافة منتج للسلة
            const product = {
                id: 1,
                name: 'Product 1',
                price: 10.99,
                image: 'product-image.jpg'
            };
            addToCart(product);
            
            // تأثير متحرك عند إضافة منتج للسلة
            button.innerHTML = '✓ تمت الإضافة';
            button.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = 'أضف للعربة';
                button.style.backgroundColor = '';
            }, 1500);
        });
    });

    // تأثيرات حركية للمنتجات
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// دالة إضافة منتج للسلة
function addToCart(product) {
    // الحصول على السلة الحالية من التخزين المحلي
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // التحقق مما إذا كان المنتج موجود بالفعل في السلة
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // زيادة الكمية إذا كان المنتج موجودًا بالفعل
        cart[existingProductIndex].quantity += 1;
    } else {
        // إضافة المنتج الجديد للسلة
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // حفظ السلة المحدثة في التخزين المحلي
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تحديث عداد السلة في واجهة المستخدم
    updateCartCount();
    
    // تحديث عربة التسوق
    updateCartDisplay();
}

// دالة تحديث عداد السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// دالة تحديث عرض عربة التسوق
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalElement = document.getElementById('subtotal');
    const totalPriceElement = document.getElementById('total-price');
    
    // مسح المحتوى الحالي
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        subtotalElement.textContent = '0.00 ج.م';
        totalPriceElement.textContent = '0.00 ج.م';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    // حساب المجموع الفرعي
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = 50;
    const totalPrice = subtotal + shippingCost;
    
    // عرض المنتجات
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price">${item.price.toFixed(2)} جنيه</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decrementQuantity(${index})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="updateQuantity(${index}, this)">
                <button class="quantity-btn" onclick="incrementQuantity(${index})">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        cartContainer.appendChild(cartItemElement);
    });
    
    // تحديث الأسعار
    subtotalElement.textContent = `${subtotal.toFixed(2)} ج.م`;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} ج.م`;
}

// دالة زيادة الكمية
function incrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity < 10) {
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// دالة تقليل الكمية
function decrementQuantity(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// دالة تحديث الكمية
function updateQuantity(index, input) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = parseInt(input.value);
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    } else {
        input.value = cart[index].quantity;
    }
}

// دالة إزالة منتج
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

// دالة تطبيق كود الخصم
function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // قائمة أكواد الخصم
    const promoCodes = {
        'WELCOME10': 0.1,  // خصم 10%
        'SUMMER20': 0.2,   // خصم 20%
        'SWEET50': 0.5     // خصم 50%
    };
    
    if (promoCodes[promoCode]) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discountAmount = subtotal * promoCodes[promoCode];
        const totalPrice = subtotal + 50 - discountAmount;
        
        document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} ج.م`;
        document.getElementById('total-price').textContent = `${totalPrice.toFixed(2)} ج.م`;
        
        alert(`تم تطبيق كود الخصم ${promoCode} بنجاح!`);
    } else {
        alert('كود الخصم غير صالح');
    }
    
    promoInput.value = '';
}

// دالة المتابعة للدفع
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('عربة التسوق فارغة');
        return;
    }
    
    // توجيه المستخدم لصفحة الدفع
    window.location.href = 'checkout.html';
}

// دالة تهيئة النشرة البريدية
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input.value) {
                alert('تم الاشتراك بنجاح! 🎉');
                input.value = '';
            }
        });
    }
}

// دالة البحث
function searchProducts(query) {
    // هنا سيتم إضافة منطق البحث عن المنتجات
    console.log('جاري البحث عن:', query);
}

// تهيئة القائمة المنسدلة
const dropdowns = document.querySelectorAll('.has-dropdown');
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'flex';
        }
    });
    
    dropdown.addEventListener('mouseleave', () => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    });
});

// وظائف المفضلة المحسنة
function addToFavorites(product) {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');

    // التحقق من وجود المنتج بالفعل في المفضلة
    const existingFavorites = favoritesGrid.querySelectorAll('.favorite-item');
    const isDuplicate = Array.from(existingFavorites).some(favorite => 
        favorite.querySelector('h3').textContent === product.name
    );

    if (isDuplicate) {
        alert('هذا المنتج موجود بالفعل في المفضلة');
        return;
    }

    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('favorite-item');
    favoriteItem.innerHTML = `
        <button class="remove-favorite" onclick="removeFavorite(this)">
            <i class="fas fa-times"></i>
        </button>
        <img src="${product.image}" alt="${product.name}">
        <div class="favorite-item-details">
            <h3>${product.name}</h3>
            <p>${product.price} جنيه</p>
            <div class="favorite-actions">
                <button class="remove-favorite" onclick="removeFavorite(this)">إزالة</button>
                <button onclick="addToCart('${product.name}')">أضف للسلة</button>
            </div>
        </div>
    `;

    favoritesGrid.appendChild(favoriteItem);
    updateFavoritesCount();
    checkEmptyFavorites();
    saveFavoritesToLocalStorage();
}

function removeFavorite(button) {
    const favoriteItem = button.closest('.favorite-item');
    favoriteItem.remove();
    updateFavoritesCount();
    checkEmptyFavorites();
    saveFavoritesToLocalStorage();
}

function updateFavoritesCount() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesCount = favoritesGrid.children.length;
    document.querySelector('.favorites-count').textContent = favoritesCount;
}

function checkEmptyFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyFavorites = document.getElementById('emptyFavorites');

    if (favoritesGrid.children.length === 0) {
        favoritesGrid.style.display = 'none';
        emptyFavorites.style.display = 'block';
    } else {
        favoritesGrid.style.display = 'grid';
        emptyFavorites.style.display = 'none';
    }
}

function saveFavoritesToLocalStorage() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favorites = Array.from(favoritesGrid.children).map(item => ({
        name: item.querySelector('h3').textContent,
        price: item.querySelector('p').textContent,
        image: item.querySelector('img').src
    }));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    favorites.forEach(product => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');
        favoriteItem.innerHTML = `
            <button class="remove-favorite" onclick="removeFavorite(this)">
                <i class="fas fa-times"></i>
            </button>
            <img src="${product.image}" alt="${product.name}">
            <div class="favorite-item-details">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <div class="favorite-actions">
                    <button class="remove-favorite" onclick="removeFavorite(this)">إزالة</button>
                    <button onclick="addToCart('${product.name}')">أضف للسلة</button>
                </div>
            </div>
        `;
        favoritesGrid.appendChild(favoriteItem);
    });

    updateFavoritesCount();
    checkEmptyFavorites();
}