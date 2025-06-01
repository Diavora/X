/**
 * Lucky Jet Predictor - Оптимизированная версия
 * Улучшения производительности и стабильности
 */

// Используем IIFE для изоляции переменных и предотвращения загрязнения глобальной области видимости
(function() {
    'use strict'; // Строгий режим для предотвращения распространенных ошибок

    // Кэшированные ссылки на DOM-элементы
    const DOM = {
        generateBtn: null,
        loadingContainer: null,
        predictionResult: null,
        coefficientElement: null,
        historyBody: null,
        startBtn: null,
        casinoBtn: null
    };

    // Состояние приложения
    const state = {
        isGenerating: false,
        history: [],
        lastGeneratedTime: 0,
        errorCount: 0
    };

    // Константы
    const CONFIG = {
        MIN_COEFFICIENT: 1.1,
        MAX_COEFFICIENT: 10.0,
        THRESHOLD_COEFFICIENT: 1.6, // Пороговый коэффициент для увеличения задержки
        BASE_GENERATION_DELAY: 3000, // Базовая задержка для малых коэффициентов
        ADDITIONAL_DELAY_FACTOR: 1500, // Дополнительная задержка для больших коэффициентов
        COEFFICIENT_ANIMATION_DURATION: 1000, // Длительность анимации появления коэффициента
        THROTTLE_DELAY: 500, // Минимальный интервал между генерациями
        MAX_HISTORY_ITEMS: 50,
        MAX_ERROR_RETRY: 3
    };

    /**
     * Инициализация приложения
     */
    function init() {
        // Кэшируем DOM-элементы при загрузке для повышения производительности
        cacheDOMElements();
        
        // Добавляем обработчики событий
        attachEventListeners();
        
        // Загружаем историю из localStorage, если она есть
        loadHistoryFromStorage();
        
        // Добавляем обработчик ошибок
        setupErrorHandling();
        
        console.log('Приложение инициализировано успешно');
    }

    /**
     * Кэширование DOM-элементов для повышения производительности
     */
    function cacheDOMElements() {
        DOM.generateBtn = document.getElementById('generate-btn');
        DOM.loadingContainer = document.getElementById('loading-prediction');
        DOM.predictionResult = document.getElementById('prediction-result');
        DOM.coefficientElement = document.getElementById('coefficient-value');
        DOM.historyBody = document.getElementById('history-body');
        DOM.startBtn = document.getElementById('start-btn');
        DOM.casinoBtn = document.getElementById('casino-btn');
        
        // Проверка наличия всех необходимых элементов
        const missingElements = Object.entries(DOM)
            .filter(([key, element]) => !element && key !== 'startBtn' && key !== 'casinoBtn') // Не показываем предупреждение для необязательных кнопок
            .map(([key]) => key);
            
        if (missingElements.length > 0) {
            console.warn('Не найдены следующие элементы DOM:', missingElements.join(', '));
        }
    }

    /**
     * Добавление обработчиков событий с использованием делегирования где возможно
     */
    function attachEventListeners() {
        if (DOM.generateBtn) {
            // Используем более эффективный способ добавления обработчика
            // без клонирования элемента, что может вызывать утечки памяти
            
            // Удаляем существующие обработчики более безопасным способом
            const newBtn = DOM.generateBtn.cloneNode(true);
            DOM.generateBtn.parentNode.replaceChild(newBtn, DOM.generateBtn);
            DOM.generateBtn = newBtn;
            
            // Добавляем обработчик с защитой от дребезга
            DOM.generateBtn.addEventListener('click', debounce(function(event) {
                event.preventDefault();
                event.stopPropagation();
                generatePrediction();
            }, 300));
        }
        
        // Добавляем обработчики для кнопок "Начать сейчас" и "Играть в казино"
        if (DOM.startBtn) {
            DOM.startBtn.addEventListener('click', function(event) {
                event.preventDefault();
                // Плавно прокручиваем страницу к блоку предиктора
                const predictorSection = document.querySelector('.predictor');
                if (predictorSection) {
                    predictorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Добавляем небольшую задержку и запускаем генерацию предикта
                    setTimeout(() => {
                        if (DOM.generateBtn) {
                            DOM.generateBtn.click();
                        }
                    }, 800);
                }
            });
        }
        
        if (DOM.casinoBtn) {
            DOM.casinoBtn.addEventListener('click', function(event) {
                event.preventDefault();
                // Открываем сайт казино в новой вкладке
                window.open('https://1win-official-site.com', '_blank');
            });
        }
        
        console.log('Обработчики событий добавлены');
        
        // Добавляем обработчик для сохранения данных при закрытии страницы
        window.addEventListener('beforeunload', saveHistoryToStorage);
        
        // Добавляем обработчик изменения размера окна для адаптивности
        window.addEventListener('resize', debounce(handleResize, 200));
    }

    /**
     * Функция генерации предикта с улучшенной обработкой ошибок и производительностью
     */
    function generatePrediction() {
        // Проверяем, не слишком ли часто вызывается функция
        const now = Date.now();
        if (now - state.lastGeneratedTime < CONFIG.THROTTLE_DELAY) {
            console.log('Слишком частые запросы генерации, игнорируем');
            return;
        }
        
        // Обновляем время последней генерации
        state.lastGeneratedTime = now;
        
        // Проверяем, не идет ли уже процесс генерации
        if (state.isGenerating) {
            console.log('Генерация уже идет, выходим');
            return;
        }

        console.log('Начинаем генерацию предикта');
        state.isGenerating = true;
        
        // Блокируем кнопку на время генерации
        if (DOM.generateBtn) {
            DOM.generateBtn.disabled = true;
            DOM.generateBtn.classList.add('disabled');
        }
        
        try {
            // Проверяем наличие необходимых элементов
            if (!DOM.loadingContainer || !DOM.predictionResult) {
                throw new Error('Не найдены необходимые элементы интерфейса');
            }
            
            // Показываем анимацию загрузки
            DOM.predictionResult.style.display = 'none';
            DOM.loadingContainer.style.display = 'flex';
            
            // Используем Promise для лучшей обработки асинхронных операций
            const generationPromise = new Promise((resolve) => {
                // Генерируем коэффициент с вероятностным распределением
                let coefficient;
                
                // Используем смещенное распределение, чтобы малые коэффициенты выпадали чаще
                const rand = Math.random();
                
                if (rand < 0.7) { // 70% шанс на малый коэффициент
                    coefficient = (Math.random() * 
                        (CONFIG.THRESHOLD_COEFFICIENT - CONFIG.MIN_COEFFICIENT) + 
                        CONFIG.MIN_COEFFICIENT).toFixed(2);
                } else { // 30% шанс на большой коэффициент
                    coefficient = (Math.random() * 
                        (CONFIG.MAX_COEFFICIENT - CONFIG.THRESHOLD_COEFFICIENT) + 
                        CONFIG.THRESHOLD_COEFFICIENT).toFixed(2);
                }
                
                // Рассчитываем задержку в зависимости от величины коэффициента
                let delay = CONFIG.BASE_GENERATION_DELAY;
                
                // Если коэффициент больше порогового, увеличиваем задержку
                if (parseFloat(coefficient) > CONFIG.THRESHOLD_COEFFICIENT) {
                    // Дополнительная задержка пропорциональна величине коэффициента
                    const additionalDelay = CONFIG.ADDITIONAL_DELAY_FACTOR * 
                        (parseFloat(coefficient) - CONFIG.THRESHOLD_COEFFICIENT) / 
                        (CONFIG.MAX_COEFFICIENT - CONFIG.THRESHOLD_COEFFICIENT);
                    delay += additionalDelay;
                }
                
                setTimeout(() => {
                    resolve(coefficient);
                }, delay);
            });
            
            generationPromise
                .then(displayResult)
                .then(updateHistory)
                .catch(handleError)
                .finally(resetGenerationState);
                
        } catch (error) {
            handleError(error);
            resetGenerationState();
        }
    }
    
    /**
     * Отображение результата генерации с анимацией
     * @param {string} coefficient - Сгенерированный коэффициент
     * @returns {string} - Тот же коэффициент для цепочки промисов
     */
    function displayResult(coefficient) {
        // Скрываем анимацию загрузки и показываем результат
        if (DOM.loadingContainer && DOM.predictionResult) {
            DOM.loadingContainer.style.display = 'none';
            DOM.predictionResult.style.display = 'flex';
        }
        
        // Анимация появления коэффициента
        if (DOM.coefficientElement) {
            // Создаем анимацию счетчика
            animateCounterValue(DOM.coefficientElement, 0, parseFloat(coefficient), CONFIG.COEFFICIENT_ANIMATION_DURATION);
            
            // Добавляем класс для анимации пульсации
            DOM.coefficientElement.classList.add('pulse-animation');
            
            // Добавляем цвет в зависимости от величины коэффициента
            DOM.coefficientElement.className = 'coefficient'; // Сбрасываем классы
            
            if (parseFloat(coefficient) < CONFIG.THRESHOLD_COEFFICIENT) {
                DOM.coefficientElement.classList.add('low-coefficient');
            } else if (parseFloat(coefficient) < 5.0) {
                DOM.coefficientElement.classList.add('medium-coefficient');
            } else {
                DOM.coefficientElement.classList.add('high-coefficient');
            }
            
            // Удаляем класс пульсации через некоторое время
            setTimeout(() => {
                DOM.coefficientElement.classList.remove('pulse-animation');
            }, CONFIG.COEFFICIENT_ANIMATION_DURATION + 500);
        }
        
        console.log('Генерация завершена, коэффициент:', coefficient);
        return coefficient;
    }
    
    /**
     * Анимация счетчика от начального до конечного значения
     * @param {HTMLElement} element - Элемент для анимации
     * @param {number} start - Начальное значение
     * @param {number} end - Конечное значение
     * @param {number} duration - Длительность анимации в мс
     */
    function animateCounterValue(element, start, end, duration) {
        const startTime = performance.now();
        const updateInterval = 16; // Примерно 60 кадров в секунду
        
        // Функция для плавной анимации (easeOutExpo)
        const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        
        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutExpo(progress);
            
            // Рассчитываем текущее значение
            const value = start + (end - start) * easedProgress;
            
            // Обновляем текст элемента
            element.textContent = value.toFixed(2) + 'x';
            
            // Продолжаем анимацию, если она еще не завершена
            if (progress < 1) {
                setTimeout(() => requestAnimationFrame(updateCounter), updateInterval);
            }
        };
        
        // Запускаем анимацию
        requestAnimationFrame(updateCounter);
    }
    
    /**
     * Обновление истории предиктов
     * @param {string} coefficient - Сгенерированный коэффициент
     */
    function updateHistory(coefficient) {
        // Создаем запись истории
        const historyItem = {
            time: new Date().toLocaleTimeString(),
            prediction: parseFloat(coefficient),
            actual: null, // В реальном приложении здесь будет фактический коэффициент
            status: 'pending', // pending, success, fail
            timestamp: Date.now()
        };
        
        // Добавляем в начало массива
        state.history.unshift(historyItem);
        
        // Ограничиваем размер истории
        if (state.history.length > CONFIG.MAX_HISTORY_ITEMS) {
            state.history.pop();
        }
        
        // Обновляем отображение истории
        renderHistory();
        
        return coefficient;
    }
    
    /**
     * Отображение истории предиктов
     */
    function renderHistory() {
        if (!DOM.historyBody) return;
        
        // Используем DocumentFragment для оптимизации DOM-операций
        const fragment = document.createDocumentFragment();
        
        state.history.forEach(item => {
            const row = document.createElement('div');
            row.className = 'history-row';
            
            // Время
            const timeCell = document.createElement('div');
            timeCell.className = 'history-cell';
            timeCell.textContent = item.time;
            row.appendChild(timeCell);
            
            // Предикт
            const predictionCell = document.createElement('div');
            predictionCell.className = 'history-cell';
            predictionCell.textContent = item.prediction.toFixed(2) + 'x';
            row.appendChild(predictionCell);
            
            // Фактический
            const actualCell = document.createElement('div');
            actualCell.className = 'history-cell';
            actualCell.textContent = item.actual ? item.actual.toFixed(2) + 'x' : '-';
            row.appendChild(actualCell);
            
            // Статус
            const statusCell = document.createElement('div');
            statusCell.className = 'history-cell status-' + item.status;
            statusCell.textContent = getStatusText(item.status);
            row.appendChild(statusCell);
            
            fragment.appendChild(row);
        });
        
        // Очищаем и добавляем все элементы за одну операцию
        DOM.historyBody.innerHTML = '';
        DOM.historyBody.appendChild(fragment);
    }
    
    /**
     * Получение текста статуса
     * @param {string} status - Код статуса
     * @returns {string} - Текст статуса
     */
    function getStatusText(status) {
        switch(status) {
            case 'success': return 'Успех';
            case 'fail': return 'Неудача';
            case 'pending': 
            default: return 'Ожидание';
        }
    }
    
    /**
     * Сброс состояния генерации
     */
    function resetGenerationState() {
        state.isGenerating = false;
        
        // Разблокируем кнопку
        if (DOM.generateBtn) {
            DOM.generateBtn.disabled = false;
            DOM.generateBtn.classList.remove('disabled');
        }
    }
    
    /**
     * Обработка ошибок
     * @param {Error} error - Объект ошибки
     */
    function handleError(error) {
        console.error('Ошибка в процессе генерации:', error);
        
        // Увеличиваем счетчик ошибок
        state.errorCount++;
        
        // Показываем уведомление пользователю
        showNotification('Произошла ошибка: ' + error.message, 'error');
        
        // Если ошибок слишком много, предлагаем перезагрузить страницу
        if (state.errorCount >= CONFIG.MAX_ERROR_RETRY) {
            showNotification('Слишком много ошибок. Рекомендуется перезагрузить страницу.', 'warning', 10000);
        }
    }
    
    /**
     * Показ уведомления пользователю
     * @param {string} message - Текст уведомления
     * @param {string} type - Тип уведомления (info, success, warning, error)
     * @param {number} duration - Длительность показа в мс
     */
    function showNotification(message, type = 'info', duration = 5000) {
        // Проверяем, существует ли контейнер для уведомлений
        let notificationContainer = document.getElementById('notification-container');
        
        // Если контейнера нет, создаем его
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '10px';
            notificationContainer.style.right = '10px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.innerHTML = message;
        
        // Стилизуем уведомление
        notification.style.padding = '10px 15px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        notification.style.fontSize = '14px';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        
        // Цвета в зависимости от типа
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                notification.style.color = 'white';
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                notification.style.color = 'white';
                break;
            case 'error':
                notification.style.backgroundColor = '#F44336';
                notification.style.color = 'white';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
                notification.style.color = 'white';
        }
        
        // Добавляем уведомление в контейнер
        notificationContainer.appendChild(notification);
        
        // Анимируем появление
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Удаляем уведомление через указанное время
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    /**
     * Сохранение истории в localStorage
     */
    function saveHistoryToStorage() {
        try {
            localStorage.setItem('luckyJetHistory', JSON.stringify(state.history));
            localStorage.setItem('luckyJetLastUpdated', Date.now().toString());
            console.log('История сохранена в localStorage');
        } catch (error) {
            console.error('Ошибка при сохранении истории:', error);
        }
    }
    
    /**
     * Загрузка истории из localStorage
     */
    function loadHistoryFromStorage() {
        try {
            const savedHistory = localStorage.getItem('luckyJetHistory');
            if (savedHistory) {
                state.history = JSON.parse(savedHistory);
                renderHistory();
                console.log('История загружена из localStorage');
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
            // В случае ошибки очищаем хранилище
            localStorage.removeItem('luckyJetHistory');
        }
    }
    
    /**
     * Обработка изменения размера окна
     */
    function handleResize() {
        // Здесь можно добавить логику для адаптивности
        console.log('Размер окна изменен');
    }
    
    /**
     * Настройка глобальной обработки ошибок
     */
    function setupErrorHandling() {
        window.addEventListener('error', function(event) {
            console.error('Глобальная ошибка:', event.error);
            showNotification('Произошла ошибка в приложении', 'error');
            return false;
        });
        
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Необработанное отклонение Promise:', event.reason);
            showNotification('Произошла асинхронная ошибка', 'error');
            return false;
        });
    }
    
    /**
     * Функция для предотвращения дребезга
     * @param {Function} func - Функция для вызова
     * @param {number} wait - Время ожидания в мс
     * @returns {Function} - Функция с защитой от дребезга
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    /**
     * Функция для ограничения частоты вызовов
     * @param {Function} func - Функция для вызова
     * @param {number} limit - Минимальный интервал между вызовами в мс
     * @returns {Function} - Функция с ограничением частоты вызовов
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Инициализация приложения при загрузке DOM
    document.addEventListener('DOMContentLoaded', init);
    
})();
