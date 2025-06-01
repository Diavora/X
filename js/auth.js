/**
 * Система авторизации для доступа к сайту
 */

(function() {
    'use strict';
    
    // Пароль для доступа к сайту
    const ACCESS_PASSWORD = 'INSHYNE25';
    
    // Проверяем, авторизован ли пользователь
    function checkAuth() {
        // Проверяем, есть ли в localStorage запись об успешной авторизации
        const isAuthorized = localStorage.getItem('auth_access') === 'granted';
        
        if (!isAuthorized) {
            // Если пользователь не авторизован, показываем окно авторизации
            showAuthModal();
        }
    }
    
    // Показываем модальное окно авторизации
    function showAuthModal() {
        // Создаем элементы модального окна
        const authOverlay = document.createElement('div');
        authOverlay.className = 'auth-overlay';
        authOverlay.id = 'auth-overlay';
        
        const authContainer = document.createElement('div');
        authContainer.className = 'auth-container';
        
        // Содержимое модального окна
        authContainer.innerHTML = `
            <div class="auth-header">
                <h2 class="auth-title">Доступ к Lucky Jet Predictor</h2>
            </div>
            <div class="auth-content">
                <p>Введите пароль для доступа к сайту:</p>
                <div class="password-input-container">
                    <input type="password" id="auth-password" class="auth-password" placeholder="Введите пароль..." />
                    <button id="toggle-password" class="toggle-password">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <div class="auth-error" id="auth-error"></div>
                <button id="auth-submit" class="auth-submit">Войти</button>
            </div>
        `;
        
        // Добавляем модальное окно на страницу
        authOverlay.appendChild(authContainer);
        document.body.appendChild(authOverlay);
        
        // Блокируем прокрутку страницы
        document.body.style.overflow = 'hidden';
        
        // Добавляем обработчики событий
        const passwordInput = document.getElementById('auth-password');
        const submitButton = document.getElementById('auth-submit');
        const togglePassword = document.getElementById('toggle-password');
        const errorElement = document.getElementById('auth-error');
        
        // Фокус на поле ввода пароля
        passwordInput.focus();
        
        // Обработчик нажатия на кнопку "Войти"
        submitButton.addEventListener('click', validatePassword);
        
        // Обработчик нажатия Enter в поле ввода пароля
        passwordInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                validatePassword();
            }
        });
        
        // Переключение видимости пароля
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Изменение иконки
            const icon = togglePassword.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
        
        // Функция проверки пароля
        function validatePassword() {
            const password = passwordInput.value.trim();
            
            if (password === ACCESS_PASSWORD) {
                // Если пароль верный, сохраняем в localStorage и закрываем модальное окно
                localStorage.setItem('auth_access', 'granted');
                closeAuthModal();
            } else {
                // Если пароль неверный, показываем сообщение об ошибке
                errorElement.textContent = 'Неверный пароль. Попробуйте снова.';
                passwordInput.value = '';
                passwordInput.focus();
                
                // Добавляем анимацию встряски для поля ввода
                passwordInput.classList.add('shake');
                setTimeout(() => {
                    passwordInput.classList.remove('shake');
                }, 500);
            }
        }
    }
    
    // Закрываем модальное окно авторизации
    function closeAuthModal() {
        const authOverlay = document.getElementById('auth-overlay');
        if (authOverlay) {
            // Плавно скрываем модальное окно
            authOverlay.classList.add('fade-out');
            
            // Удаляем модальное окно после завершения анимации
            setTimeout(() => {
                document.body.removeChild(authOverlay);
                document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
            }, 300);
        }
    }
    
    // Инициализация при загрузке страницы
    function init() {
        checkAuth();
    }
    
    // Запускаем проверку авторизации при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
