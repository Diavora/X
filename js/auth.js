/**
 * Система авторизации для доступа к сайту
 * Модуль авторизации с паролем для доступа к сайту
 * Обновлен для лучшей работы с Telegram WebApp и обработки сворачивания/разворачивания
 */

(function() {
    'use strict';
    
    // Константы
    const CORRECT_PASSWORD = 'INSHYNE25';
    const AUTH_STORAGE_KEY = 'auth_access';
    const AUTH_COOKIE_NAME = 'auth_access';
    const AUTH_EXPIRY_DAYS = 30;
    
    // Флаг для отслеживания состояния авторизации
    let isAuthInitialized = false;
    
    // Проверяем, запущено ли приложение в Telegram WebApp
    function isTelegramWebApp() {
        // Используем глобальную функцию из telegram-lifecycle.js если она доступна
        if (window.TelegramLifecycle && typeof window.TelegramLifecycle.isTelegramWebApp === 'function') {
            return window.TelegramLifecycle.isTelegramWebApp();
        }
        
        // Резервный метод определения Telegram WebApp
        try {
            // Проверка на наличие Telegram WebApp API
            if (window.Telegram && window.Telegram.WebApp) {
                return true;
            }
            
            // Проверка на наличие специфичных параметров в URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppStartParam')) {
                return true;
            }
            
            // Проверка User-Agent на наличие упоминания Telegram
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes('telegram') || userAgent.includes('tgweb')) {
                return true;
            }
            
            // Дополнительная проверка на наличие куки или localStorage с признаком Telegram
            if (safeGetItem('is_telegram_webapp') === 'true' || getCookie('is_telegram_webapp') === 'true') {
                return true;
            }
            
            return false;
        } catch (e) {
            // В случае ошибки возвращаем false
            console.warn('Ошибка при проверке Telegram WebApp:', e);
            return false;
        }
    }
    
    // Безопасная работа с localStorage
    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('Ошибка при доступе к localStorage:', e);
            return null;
        }
    }
    
    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.warn('Ошибка при записи в localStorage:', e);
            return false;
        }
    }
    
    // Используем cookie как резервный вариант
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
    
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Проверяем, авторизован ли пользователь
    function checkAuth() {
        // Предотвращаем повторную инициализацию
        if (isAuthInitialized) {
            return;
        }
        
        isAuthInitialized = true;
        
        // Проверяем, запущено ли приложение в Telegram WebApp
        const isTelegram = isTelegramWebApp();
        
        // Если это Telegram WebApp, сохраняем эту информацию в localStorage и cookie
        if (isTelegram) {
            // Устанавливаем флаг авторизации для Telegram WebApp
            safeSetItem(AUTH_STORAGE_KEY, 'granted');
            setCookie(AUTH_COOKIE_NAME, 'granted', AUTH_EXPIRY_DAYS);
            
            // Сохраняем флаг, что это Telegram WebApp
            safeSetItem('is_telegram_webapp', 'true');
            setCookie('is_telegram_webapp', 'true', AUTH_EXPIRY_DAYS);
            
            // Добавляем класс к телу документа для стилизации
            document.body.classList.add('telegram-webapp');
            
            // Не показываем авторизацию в Telegram
            console.log('Телеграм веб-приложение обнаружено, авторизация пропущена');
            return;
        }
        
        // Проверяем авторизацию в localStorage или cookie
        const isAuthorized = safeGetItem(AUTH_STORAGE_KEY) === 'granted' || getCookie(AUTH_COOKIE_NAME) === 'granted';
        
        if (!isAuthorized) {
            console.log('Пользователь не авторизован, показываем окно авторизации');
            // Добавляем небольшую задержку для предотвращения проблем с отображением
            setTimeout(function() {
                showAuthModal();
            }, 100);
        } else {
            console.log('Пользователь уже авторизован');
        }
    }
    
    // Показываем модальное окно авторизации
    function showAuthModal() {
        // Проверяем, не отображается ли уже модальное окно
        if (document.getElementById('auth-overlay')) {
            return;
        }
        
        // Создаем элементы модального окна
        const authOverlay = document.createElement('div');
        authOverlay.id = 'auth-overlay';
        authOverlay.className = 'auth-overlay';
        
        const authContainer = document.createElement('div');
        authContainer.className = 'auth-container';
        
        // Содержимое модального окна
        authContainer.innerHTML = `
            <div class="auth-header">
                <h2>Авторизация</h2>
            </div>
            <div class="auth-content">
                <p>Для доступа к сайту введите пароль:</p>
                <div class="auth-input-group">
                    <input type="password" id="auth-password" class="auth-input" placeholder="Введите пароль" autocomplete="off">
                    <button id="toggle-password" class="toggle-password">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                <p id="auth-error" class="auth-error"></p>
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
        
        // Безопасно устанавливаем фокус на поле ввода пароля
        try {
            setTimeout(() => {
                if (passwordInput) passwordInput.focus();
            }, 300);
        } catch (e) {
            console.warn('Не удалось установить фокус на поле пароля:', e);
        }
        
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
        
        // Добавляем обработчик события видимости страницы
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Функция обработки изменения видимости страницы
        function handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                // Страница снова видима, проверяем авторизацию
                const isAuthorized = safeGetItem(AUTH_STORAGE_KEY) === 'granted' || getCookie(AUTH_COOKIE_NAME) === 'granted';
                if (isAuthorized) {
                    closeAuthModal();
                }
            }
        }
        
        // Функция проверки пароля
        function validatePassword() {
            const password = passwordInput.value.trim();
            
            if (password === CORRECT_PASSWORD) {
                // Если пароль верный, сохраняем в localStorage и cookie, затем закрываем модальное окно
                safeSetItem(AUTH_STORAGE_KEY, 'granted');
                setCookie(AUTH_COOKIE_NAME, 'granted', AUTH_EXPIRY_DAYS);
                closeAuthModal();
            } else {
                // Если пароль неверный, показываем сообщение об ошибке
                errorElement.textContent = 'Неверный пароль. Попробуйте снова.';
                passwordInput.value = '';
                
                // Безопасно устанавливаем фокус
                try {
                    passwordInput.focus();
                } catch (e) {}
                
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
            // Удаляем обработчик события видимости страницы
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            
            // Плавно скрываем модальное окно
            authOverlay.classList.add('fade-out');
            
            // Удаляем модальное окно после завершения анимации
            setTimeout(() => {
                try {
                    if (authOverlay.parentNode) {
                        authOverlay.parentNode.removeChild(authOverlay);
                    }
                    document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
                } catch (e) {
                    console.warn('Ошибка при удалении модального окна:', e);
                }
            }, 300);
        }
    }
    
    // Глобальная функция для обработки изменения видимости страницы
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Страница снова видима, проверяем авторизацию
            const isAuthorized = safeGetItem(AUTH_STORAGE_KEY) === 'granted' || getCookie(AUTH_COOKIE_NAME) === 'granted';
            if (isAuthorized) {
                closeAuthModal();
            }
        }
    }
    
    // Инициализация при загрузке страницы
    function init() {
        // Добавляем обработчики событий жизненного цикла страницы
        window.addEventListener('pageshow', function(event) {
            // Если страница была восстановлена из кэша (bfcache)
            if (event.persisted) {
                isAuthInitialized = false; // Сбрасываем флаг, чтобы повторно проверить авторизацию
                setTimeout(checkAuth, 300); // Проверяем авторизацию с небольшой задержкой
            }
        });
        
        // Добавляем глобальный обработчик события видимости
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                // Проверяем, есть ли авторизация после возврата на страницу
                const isAuthorized = safeGetItem(AUTH_STORAGE_KEY) === 'granted' || getCookie(AUTH_COOKIE_NAME) === 'granted';
                
                // Если нет авторизации и не Telegram WebApp, показываем модальное окно
                if (!isAuthorized && !isTelegramWebApp()) {
                    // Сбрасываем флаг инициализации
                    isAuthInitialized = false;
                    setTimeout(checkAuth, 300);
                }
            }
        });
        
        // Проверяем авторизацию
        checkAuth();
    }
    
    // Запускаем проверку авторизации при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Добавляем небольшую задержку для предотвращения проблем с инициализацией
        setTimeout(init, 100);
    }
})();
