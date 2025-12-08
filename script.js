let cart = [];
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCartButton = document.getElementById('closeCart');
const CheckOutCartButton = document.getElementById('checkoutButton');
const clearCartButton = document.getElementById('clearCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

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

