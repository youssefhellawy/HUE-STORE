document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton'); // زر تسجيل الدخول

    // تعطيل زر تسجيل الدخول أثناء التحقق
    loginButton.disabled = true;
    loginButton.textContent = "جاري التحقق...";

    // مسح التنبيهات القديمة
    clearErrors();

    // التحقق من تنسيق البريد الإلكتروني
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        resetLoginButton();
        return;
    }

    // التحقق من وجود كلمة المرور
    if (!password) {
        resetLoginButton();
        return;
    }

    // التحقق من قوة كلمة المرور (يجب أن تحتوي على 6 أحرف على الأقل مع حرف وأرقام)
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(password)) {
        resetLoginButton();
        return;
    }

    // إذا كانت المدخلات صالحة
    alert('تم تسجيل الدخول بنجاح!');
    window.location.href = 'index.html'; // إعادة توجيه المستخدم بعد تسجيل الدخول
});

// معالج حدث لزر "رجوع إلى الصفحة الرئيسية"
document.getElementById('backToHome').addEventListener('click', function() {
    window.location.href = 'index.html';  // استبدل 'index.html' بعنوان الصفحة الرئيسية الخاصة بك
});

// دالة لعرض التنبيه باستخدام Toast
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

// دالة لمسح التنبيهات القديمة
function clearErrors() {
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
}

// دالة لإعادة تفعيل الزر بعد التحقق
function resetLoginButton() {
    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = false;
    loginButton.textContent = "تسجيل الدخول";
}
