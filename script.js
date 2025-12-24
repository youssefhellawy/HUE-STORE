let cart = [];
const cartCount = document.getElementById('cartCount'); // عنصر لعرض عدد العناصر في السلة
const cartModal = document.getElementById('cartModal'); // نافذة السلة
const closeCartButton = document.getElementById('closeCart'); // زر إغلاق نافذة السلة
const CheckOutCartButton = document.getElementById('checkoutButton'); 
const clearCartButton = document.getElementById('clearCart'); 
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// --- Product details modal (created dynamically) ---
let productModal = null;
function ensureProductModal() {
  if (productModal) return productModal;
  productModal = document.createElement('div');
  productModal.id = 'productModal';
  productModal.className = 'product-modal';
  productModal.innerHTML = `
    <div class="product-modal-content">
      <button class="product-modal-close" aria-label="Close">×</button>
      <div class="product-modal-body">
        <img class="product-modal-image" src="" alt="product image">
        <div class="product-modal-info">
          <h3 class="product-modal-name"></h3>
          <p class="product-modal-price"></p>
          <div class="product-modal-actions">
            <button class="product-add-button">Add to cart</button>
            <button class="product-cancel-button">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(productModal);

  // wire buttons
  productModal.querySelector('.product-modal-close').addEventListener('click', closeProductModal);
  productModal.querySelector('.product-cancel-button').addEventListener('click', closeProductModal);
  productModal.querySelector('.product-add-button').addEventListener('click', () => {
    const data = productModal._currentProduct;
    if (data) addToCart(data);
    closeProductModal();
  });

  return productModal;
}

function showProductModal(product, anchor) {
  const modal = ensureProductModal();
  const imgEl = modal.querySelector('.product-modal-image');
  const nameEl = modal.querySelector('.product-modal-name');
  const priceEl = modal.querySelector('.product-modal-price');
  // allow product to have image property; otherwise try to get from anchor
  if (product.image) imgEl.src = product.image;
  else if (anchor && anchor.querySelector) {
    const img = anchor.querySelector('img');
    imgEl.src = img ? img.src : '';
  } else imgEl.src = '';

  // store current product for add button
  modal._currentProduct = { name: product.name, price: product.price };

  nameEl.textContent = product.name;
  priceEl.textContent = `Price: ${product.price} L.E`;
  modal.style.display = 'flex';
}

function closeProductModal() {
  if (!productModal) return;
  productModal.style.display = 'none';
  productModal._currentProduct = null;
}


// دالة لإضافة منتج إلى السلة
function addToCart(product) {
  if (!product.name || !product.price) {
    alert('المنتج غير صالح');
    return;
  }
  
  // التحقق من وجود المنتج بالفعل في السلة
  if (cart.some(item => item.name === product.name)) {
    showToast('هذا المنتج موجود بالفعل في السلة');
    return;
  }
  
  cart.push(product);
  saveCartToLocalStorage();
  updateCart();
  showToast('تم إضافة المنتج إلى السلة');
}

// دالة لتحديث السلة
function updateCart() {
  cartCount.textContent = cart.length;  // تحديث عدد العناصر في السلة
  cartItemsContainer.innerHTML = '';  // تنظيف المحتويات الحالية

  if (cart.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'سلتك فارغة!';
    cartItemsContainer.appendChild(emptyMessage);
    cartTotal.textContent = '0.00';  // إذا كانت السلة فارغة، إظهار 0.00
  } else {
    let total = 0;
    cart.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.classList.add('cartItem');
      listItem.innerHTML = `
        <span>${product.name}</span>
        <span>${product.price}</span> L.E
        <button class="removeBtn" aria-label="Remove item from cart" onclick="removeFromCart(${cart.indexOf(product)})">حذف</button>
      `;
      cartItemsContainer.appendChild(listItem);
      total += product.price;  // جمع الأسعار
    });
    total = total.toFixed(2);  // التأكد من تنسيق المجموع
    cartTotal.textContent = total;  // تحديث المجموع
  }
}

// دالة لفتح السلة
document.getElementById('cart').addEventListener('click', () => {
  cartModal.style.display = 'flex';
});

// دالة لإغلاق السلة
closeCartButton.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

// دالة لحذف منتج من السلة
function removeFromCart(index) {
  if (confirm('هل أنت متأكد أنك تريد حذف هذا العنصر من السلة؟')) {
    cart.splice(index, 1); // حذف العنصر من السلة
    saveCartToLocalStorage(); // حفظ السلة في LocalStorage
    updateCart(); // تحديث السلة بعد الحذف
    showToast('تم حذف المنتج من السلة');
  }
}

// دالة لحفظ السلة في LocalStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// دالة لتحميل السلة من LocalStorage عند تحميل الصفحة
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCart();
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      cart = []; // Reset cart if loading fails
    }
  }
}

// دالة لإتمام الشراء
CheckOutCartButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('سلتك فارغة! لا يمكنك إتمام الشراء');
  } else {
    // إخفاء نافذة السلة
    cartModal.style.display = 'none';
    
    // إظهار نافذة الدفع
    document.getElementById('paymentModal').style.display = 'flex';
  }
});

// دالة لإغلاق نافذة الدفع
document.getElementById('closePaymentModal').addEventListener('click', () => {
  document.getElementById('paymentModal').style.display = 'none';
});

// دوال لخيارات الدفع
function payWithVisaCard() {
  alert('تم اختيار الدفع بواسطة البطاقة الائتمانية');
  closePaymentModal();
}

function payWithTelda() {
  alert('تم اختيار الدفع بواسطة تيلدا');
  closePaymentModal();
}

function payWithWallet() {
  alert('تم اختيار الدفع بمحفظة الكترونية');
  closePaymentModal();
}

// دالة لإغلاق نافذة الدفع
function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

// دالة لعرض التنبيه
function showToast(message) { 
  const toast = document.createElement('div'); 
  toast.classList.add('toast');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// تحميل السلة عند فتح الصفحة
loadCartFromLocalStorage();

