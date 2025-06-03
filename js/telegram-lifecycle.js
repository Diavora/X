/**
 * Обработка событий жизненного цикла Telegram WebApp
 * Предотвращает ошибки при сворачивании и разворачивании приложения
 * Версия 1.1 - Улучшенная обработка сворачивания/разворачивания
 */

(function() {
    'use strict';
    
    // Флаги для отслеживания состояния приложения
    let appActive = true;
    let appInitialized = false;
    let lastVisibilityChange = Date.now();
    let errorCount = 0;
    let recoveryAttempts = 0;
    
    // Сохраняем оригинальные методы console
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn
    };
    
    // Функция для проверки наличия Telegram WebApp API
    function isTelegramWebApp() {
        // Проверка на наличие Telegram WebApp API
        const isTelegramApp = window.Telegram && window.Telegram.WebApp;
        
        // Проверка на наличие специфичных параметров в URL
        let hasTgWebAppParam = false;
        try {
            const urlParams = new URLSearchParams(window.location.search);
            hasTgWebAppParam = urlParams.has('tgWebAppData') || urlParams.has('tgWebAppStartParam');
        } catch (e) {}
        
        // Проверка User-Agent на наличие упоминания Telegram
        let hasTelegramInUA = false;
        try {
            const userAgent = navigator.userAgent.toLowerCase();
            hasTelegramInUA = userAgent.includes('telegram') || userAgent.includes('tgweb');
        } catch (e) {}
        
        // Если хотя бы один из признаков положительный, считаем что это Telegram
        return isTelegramApp || hasTgWebAppParam || hasTelegramInUA;
    }
    
    // Функция для безопасного вызова методов Telegram WebApp API
    function safeCallTelegramApi(method, ...args) {
        try {
            if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp[method] === 'function') {
                return window.Telegram.WebApp[method](...args);
            }
        } catch (e) {
            // Подавляем ошибки при вызове API
            console.warn('Ошибка при вызове Telegram API:', e);
        }
        return null;
    }
    
    // Переопределяем методы console для предотвращения ошибок
    function setupSafeConsole() {
        // Создаем безопасные версии методов console
        console.log = function(...args) {
            if (appActive) {
                try {
                    originalConsole.log(...args);
                } catch (e) {
                    // Подавляем ошибки
                }
            }
        };
        
        console.error = function(...args) {
            if (appActive) {
                try {
                    originalConsole.error(...args);
                } catch (e) {
                    // Подавляем ошибки
                }
            }
        };
        
        console.warn = function(...args) {
            if (appActive) {
                try {
                    originalConsole.warn(...args);
                } catch (e) {
                    // Подавляем ошибки
                }
            }
        };
    }
    
    // Устанавливаем обработчики событий видимости страницы
    function setupVisibilityHandlers() {
        // Обработчик изменения видимости страницы
        document.addEventListener('visibilitychange', function() {
            // Запоминаем время последнего изменения видимости
            const now = Date.now();
            const timeSinceLastChange = now - lastVisibilityChange;
            lastVisibilityChange = now;
            
            // Предотвращаем слишком частые изменения видимости (менее 100мс)
            if (timeSinceLastChange < 100) {
                console.warn('Слишком частое изменение видимости, игнорируем');
                return;
            }
            
            if (document.visibilityState === 'hidden') {
                // Приложение свернуто
                appActive = false;
                
                try {
                    // Приостанавливаем все анимации и освобождаем ресурсы
                    pauseAllAnimations();
                    cleanupResources();
                    
                    // Сохраняем состояние приложения в sessionStorage
                    try {
                        sessionStorage.setItem('tg_app_state', 'suspended');
                        sessionStorage.setItem('tg_app_suspend_time', String(Date.now()));
                    } catch (e) {}
                } catch (e) {
                    console.warn('Ошибка при приостановке приложения:', e);
                }
            } else {
                // Приложение развернуто
                appActive = true;
                
                try {
                    // Проверяем, сколько времени прошло с момента сворачивания
                    let suspendTime = 0;
                    try {
                        suspendTime = parseInt(sessionStorage.getItem('tg_app_suspend_time') || '0', 10);
                    } catch (e) {}
                    
                    const timeInBackground = suspendTime ? (Date.now() - suspendTime) : 0;
                    
                    // Если приложение было свернуто более 30 секунд, перезагружаем страницу
                    if (timeInBackground > 30000) {
                        console.warn('Долгое время в фоне, перезагружаем страницу...');
                        setTimeout(function() {
                            window.location.reload();
                        }, 300);
                        return;
                    }
                    
                    // Восстанавливаем состояние приложения
                    setTimeout(function() {
                        try {
                            restoreAppState();
                            // Очищаем состояние приостановки
                            sessionStorage.removeItem('tg_app_state');
                            sessionStorage.removeItem('tg_app_suspend_time');
                        } catch (e) {
                            console.warn('Ошибка при восстановлении приложения:', e);
                        }
                    }, 300);
                } catch (e) {
                    console.warn('Ошибка при восстановлении приложения:', e);
                }
            }
        });
        
        // Обработчик события beforeunload
        window.addEventListener('beforeunload', function() {
            appActive = false;
            try {
                cleanupResources();
            } catch (e) {}
        });
        
        // Обработчик события pagehide
        window.addEventListener('pagehide', function() {
            appActive = false;
            try {
                cleanupResources();
                // Сохраняем состояние приложения в sessionStorage
                try {
                    sessionStorage.setItem('tg_app_state', 'hidden');
                    sessionStorage.setItem('tg_app_suspend_time', String(Date.now()));
                } catch (e) {}
            } catch (e) {}
        });
        
        // Обработчик события pageshow
        window.addEventListener('pageshow', function(event) {
            appActive = true;
            
            // Если страница восстановлена из кэша (bfcache)
            if (event.persisted) {
                try {
                    // Проверяем, было ли приложение скрыто долгое время
                    let suspendTime = 0;
                    try {
                        suspendTime = parseInt(sessionStorage.getItem('tg_app_suspend_time') || '0', 10);
                    } catch (e) {}
                    
                    const timeInBackground = suspendTime ? (Date.now() - suspendTime) : 0;
                    
                    // Если приложение было скрыто более 30 секунд, перезагружаем страницу
                    if (timeInBackground > 30000) {
                        console.warn('Долгое время в фоне, перезагружаем страницу...');
                        setTimeout(function() {
                            window.location.reload();
                        }, 300);
                        return;
                    }
                    
                    setTimeout(function() {
                        restoreAppState();
                        // Очищаем состояние приостановки
                        try {
                            sessionStorage.removeItem('tg_app_state');
                            sessionStorage.removeItem('tg_app_suspend_time');
                        } catch (e) {}
                    }, 300);
                } catch (e) {
                    console.warn('Ошибка при обработке pageshow:', e);
                    // В случае ошибки просто перезагружаем страницу
                    setTimeout(function() {
                        window.location.reload();
                    }, 500);
                }
            }
        });
        
        // Добавляем обработчик для события резкого закрытия приложения
        window.addEventListener('freeze', function() {
            appActive = false;
            try {
                pauseAllAnimations();
                cleanupResources();
            } catch (e) {}
        });
        
        // Добавляем обработчик для события возобновления приложения
        window.addEventListener('resume', function() {
            appActive = true;
            setTimeout(restoreAppState, 300);
        });
    }
    
    // Устанавливаем обработчики событий Telegram WebApp
    function setupTelegramEventHandlers() {
        if (!isTelegramWebApp()) return;
        
        try {
            // Событие при изменении темы
            if (window.Telegram.WebApp.onEvent) {
                window.Telegram.WebApp.onEvent('themeChanged', function() {
                    updateTheme();
                });
                
                // Событие при изменении размера окна
                window.Telegram.WebApp.onEvent('viewportChanged', function() {
                    updateViewport();
                });
                
                // Событие при сворачивании приложения
                window.Telegram.WebApp.onEvent('popupClosed', function() {
                    appActive = false;
                    cleanupResources();
                });
            }
            
            // Обработка событий для новой версии API
            if (window.Telegram.WebApp.onEvent) {
                window.Telegram.WebApp.onEvent('mainButtonClicked', function() {
                    // Обработка нажатия на основную кнопку
                });
            }
        } catch (e) {
            console.warn('Ошибка при установке обработчиков событий Telegram:', e);
        }
    }
    
    // Приостанавливаем все анимации при сворачивании
    function pauseAllAnimations() {
        try {
            // Находим все анимированные элементы
            const animatedElements = document.querySelectorAll('.animated, [class*="animation"], canvas');
            
            // Приостанавливаем анимации
            animatedElements.forEach(function(element) {
                if (element.tagName.toLowerCase() === 'canvas') {
                    // Для canvas сохраняем контекст
                    element.dataset.paused = 'true';
                } else {
                    // Для CSS анимаций
                    element.style.animationPlayState = 'paused';
                    element.style.transitionDuration = '0s';
                }
            });
            
            // Приостанавливаем все таймеры и интервалы
            window.PAUSED_TIMERS = window.PAUSED_TIMERS || [];
            
            // Сохраняем и очищаем все активные таймеры
            for (let i = 1; i < 10000; i++) {
                window.PAUSED_TIMERS.push(i);
                window.clearTimeout(i);
                window.clearInterval(i);
            }
        } catch (e) {
            console.warn('Ошибка при приостановке анимаций:', e);
        }
    }
    
    // Очищаем ресурсы при сворачивании приложения
    function cleanupResources() {
        try {
            // Удаляем обработчики событий, которые могут вызывать ошибки
            const eventTypes = ['mousemove', 'touchmove', 'scroll', 'resize'];
            
            eventTypes.forEach(function(type) {
                window.removeEventListener(type, null, true);
            });
            
            // Останавливаем все аудио и видео
            document.querySelectorAll('audio, video').forEach(function(media) {
                try {
                    media.pause();
                } catch (e) {}
            });
            
            // Очищаем WebGL контексты
            document.querySelectorAll('canvas').forEach(function(canvas) {
                try {
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (gl) {
                        gl.getExtension('WEBGL_lose_context').loseContext();
                    }
                } catch (e) {}
            });
            
            // Принудительно освобождаем память
            if (window.gc) {
                try {
                    window.gc();
                } catch (e) {}
            }
        } catch (e) {
            console.warn('Ошибка при очистке ресурсов:', e);
        }
    }
    
    // Восстанавливаем анимации после разворачивания
    function resumeAllAnimations() {
        try {
            // Восстанавливаем анимации CSS
            document.querySelectorAll('[style*="animation-play-state: paused"]').forEach(function(element) {
                element.style.animationPlayState = 'running';
            });
            
            // Восстанавливаем переходы CSS
            document.querySelectorAll('[style*="transition-duration: 0s"]').forEach(function(element) {
                element.style.transitionDuration = '';
            });
            
            // Восстанавливаем видео
            document.querySelectorAll('video[data-paused="true"]').forEach(function(video) {
                try {
                    video.play();
                    video.removeAttribute('data-paused');
                } catch (e) {}
            });
            
            // Восстанавливаем аудио
            document.querySelectorAll('audio[data-paused="true"]').forEach(function(audio) {
                try {
                    audio.play();
                    audio.removeAttribute('data-paused');
                } catch (e) {}
            });
            
            // Восстанавливаем canvas элементы
            document.querySelectorAll('canvas[data-paused="true"]').forEach(function(canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx && typeof ctx.resume === 'function') {
                    try {
                        ctx.resume();
                    } catch (e) {}
                }
                canvas.removeAttribute('data-paused');
            });
        } catch (e) {
            console.warn('Ошибка при восстановлении анимаций:', e);
        }
    }
    
    // Восстанавливаем состояние приложения после разворачивания
    function restoreAppState() {
        // Проверяем, инициализировано ли приложение
        if (!appInitialized) {
            appInitialized = true;
            recoveryAttempts = 0; // Сбрасываем счетчик попыток восстановления
        }
        
        try {
            // Восстанавливаем анимации
            resumeAllAnimations();
            
            // Обновляем параметры темы и вьюпорта
            updateTheme();
            updateViewport();
            
            // Проверяем состояние Telegram WebApp
            if (window.Telegram && window.Telegram.WebApp) {
                try {
                    // Проверяем, что Telegram WebApp доступен и работает
                    const isReady = window.Telegram.WebApp.isExpanded || 
                                    window.Telegram.WebApp.MainButton || 
                                    window.Telegram.WebApp.BackButton;
                    
                    if (!isReady) {
                        // Если WebApp не готов, перезагружаем страницу
                        recoveryAttempts++;
                        
                        if (recoveryAttempts > 2) {
                            console.warn('Не удалось восстановить WebApp, перезагружаем страницу');
                            setTimeout(function() {
                                window.location.reload();
                            }, 300);
                            return;
                        }
                    } else {
                        // Если WebApp готов, сбрасываем счетчик попыток
                        recoveryAttempts = 0;
                    }
                } catch (e) {
                    console.warn('Ошибка при проверке состояния WebApp:', e);
                }
            }
            
            // Сбрасываем счетчик ошибок
            errorCount = 0;
        } catch (e) {
            console.warn('Ошибка при восстановлении состояния приложения:', e);
            
            // Увеличиваем счетчик ошибок
            errorCount++;
            
            // Если слишком много ошибок, перезагружаем страницу
            if (errorCount > 3) {
                console.warn('Слишком много ошибок, перезагружаем страницу');
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            }
        }
    }
    
    // Обновляем тему в соответствии с Telegram
    function updateTheme() {
        if (!isTelegramWebApp()) return;
        
        try {
            const colorScheme = safeCallTelegramApi('colorScheme');
            if (colorScheme) {
                document.body.setAttribute('data-theme', colorScheme);
                document.body.classList.remove('light-theme', 'dark-theme');
                document.body.classList.add(colorScheme + '-theme');
            }
        } catch (e) {
            console.warn('Ошибка при обновлении темы:', e);
        }
    }
    
    // Обновляем viewport в соответствии с Telegram
    function updateViewport() {
        if (!isTelegramWebApp()) return;
        
        try {
            const viewportHeight = safeCallTelegramApi('viewportHeight');
            if (viewportHeight) {
                document.documentElement.style.setProperty('--tg-viewport-height', viewportHeight + 'px');
                
                // Исправляем высоту для мобильных браузеров
                document.documentElement.style.setProperty('--vh', (viewportHeight * 0.01) + 'px');
            }
        } catch (e) {
            console.warn('Ошибка при обновлении viewport:', e);
        }
    }
    
    // Добавляем глобальный обработчик ошибок
    function setupGlobalErrorHandler() {
        window.addEventListener('error', function(event) {
            // Предотвращаем стандартную обработку ошибок
            event.preventDefault();
            
            // Логируем ошибку, но не показываем пользователю
            console.warn('Перехвачена ошибка:', event.error);
            
            return true;
        }, true);
        
        // Перехватываем необработанные отклонения промисов
        window.addEventListener('unhandledrejection', function(event) {
            event.preventDefault();
            console.warn('Необработанное отклонение промиса:', event.reason);
            return true;
        });
    }
    
    // Инициализация
    function init() {
        // Устанавливаем безопасный console
        setupSafeConsole();
        
        // Устанавливаем обработчики событий видимости
        setupVisibilityHandlers();
        
        // Устанавливаем глобальный обработчик ошибок
        setupGlobalErrorHandler();
        
        // Если это Telegram WebApp, устанавливаем специфичные обработчики
        if (isTelegramWebApp()) {
            document.body.classList.add('telegram-webapp');
            setupTelegramEventHandlers();
            updateTheme();
            updateViewport();
        }
    }
    
    // Запускаем инициализацию как можно раньше
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Экспортируем функции для использования в других скриптах
    window.TelegramLifecycle = {
        isTelegramWebApp: isTelegramWebApp,
        updateTheme: updateTheme,
        updateViewport: updateViewport,
        pauseAllAnimations: pauseAllAnimations,
        restoreAppState: restoreAppState
    };
})();
