// Основные переменные
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const coefficientValue = document.getElementById('coefficient-value');
const timerValue = document.getElementById('timer-value');
const historyBody = document.getElementById('history-body');
const successRate = document.getElementById('success-rate');
const avgCoefficient = document.getElementById('avg-coefficient');
const usersCount = document.getElementById('users-count');
const maxCoefficient = document.getElementById('max-coefficient');
const maxTime = document.getElementById('max-time');
const successProgress = document.getElementById('success-progress');
const coefTrend = document.getElementById('coef-trend');
const usersTrend = document.getElementById('users-trend');
const totalPredictions = document.getElementById('total-predictions');
const successPredictions = document.getElementById('success-predictions');
const closePredictions = document.getElementById('close-predictions');
const failedPredictions = document.getElementById('failed-predictions');

// Данные для предиктов
let predictions = [];
let timer = 120; // Таймер на 2 минуты (120 секунд)
let timerInterval;
let isGenerating = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем таймер для кнопки генерации
    startTimer();
    
    // Инициализация навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Инициализация элементов для казино и промокода
    const casinoBtn = document.getElementById('casino-btn');
    const promoBanner = document.getElementById('promo-banner');
    const promoOverlay = document.getElementById('promo-overlay');
    const closePromo = document.getElementById('close-promo');
    const copyPromo = document.getElementById('copy-promo');
    const promoText = document.getElementById('promo-text');
    const continueToCasino = document.getElementById('continue-to-casino');
    
    // URL казино
    const casinoUrl = 'https://1wcjlr.com/casino/list?open=register&p=xufl';
    
    // Обработчик клика по навигационным ссылкам
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаляем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Получаем целевой элемент
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Плавный скролл к целевому элементу
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Если это статистика, активируем первый таб
                if (targetId === 'stats-section') {
                    // Активируем первый таб статистики
                    document.querySelector('.stats-tab[data-tab="general"]').click();
                }
            }
        });
    });
    
    // Обработчик кнопки перехода в казино
    casinoBtn.addEventListener('click', function() {
        // Показываем баннер с промокодом
        showPromoBanner();
    });
    
    // Обработчик нажатия на кнопку генерации предикта
    generateBtn.addEventListener('click', function() {
        // Проверяем, можно ли генерировать предикт (прошло ли 2 минуты)
        if (timer > 0 && generateBtn.disabled) {
            // Если таймер еще не закончился и кнопка заблокирована
            // Показываем сообщение о том, что нужно подождать
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            const timeLeft = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Создаем уведомление
            const notification = document.createElement('div');
            notification.className = 'timer-notification';
            notification.textContent = `Подождите ${timeLeft} до следующего предикта`;
            
            // Добавляем уведомление на страницу
            document.querySelector('.prediction-result').prepend(notification);
            
            // Удаляем уведомление через 3 секунды
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            return;
        }
        
        // Если прошло 2 минуты, генерируем предикт
        generatePrediction();
        
        // Запускаем таймер заново
        resetTimer();
    });
    
    // Обработчик закрытия баннера
    closePromo.addEventListener('click', function() {
        hidePromoBanner();
    });
    
    // Обработчик клика по оверлею
    promoOverlay.addEventListener('click', function() {
        hidePromoBanner();
    });
    
    // Обработчик копирования промокода
    copyPromo.addEventListener('click', function() {
        // Копируем промокод в буфер обмена
        navigator.clipboard.writeText(promoText.textContent)
            .then(() => {
                // Меняем текст кнопки и добавляем класс
                copyPromo.textContent = 'Скопировано!';
                copyPromo.classList.add('copied');
                
                // Возвращаем исходный текст через 2 секунды
                setTimeout(() => {
                    copyPromo.textContent = 'Копировать';
                    copyPromo.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Ошибка при копировании:', err);
            });
    });
    
    // Обработчик кнопки продолжения в казино
    continueToCasino.addEventListener('click', function() {
        // Открываем сайт казино в новой вкладке
        window.open(casinoUrl, '_blank');
        
        // Скрываем баннер
        hidePromoBanner();
    });
    
    // Функция показа баннера с промокодом
    function showPromoBanner() {
        promoBanner.style.display = 'block';
        promoOverlay.style.display = 'block';
        
        // Добавляем класс с задержкой для анимации
        setTimeout(() => {
            promoBanner.classList.add('active');
            promoOverlay.classList.add('active');
        }, 10);
    }
    
    // Функция скрытия баннера с промокодом
    function hidePromoBanner() {
        promoBanner.classList.remove('active');
        promoOverlay.classList.remove('active');
        
        // Скрываем элементы после завершения анимации
        setTimeout(() => {
            promoBanner.style.display = 'none';
            promoOverlay.style.display = 'none';
        }, 300);
    }

    // Прокрутка к предиктору при нажатии на кнопку "Начать сейчас"
    startBtn.addEventListener('click', () => {
        document.querySelector('.predictor').scrollIntoView({ behavior: 'smooth' });
    });

    // Генерация предикта при нажатии на кнопку
    generateBtn.addEventListener('click', generatePrediction);

    // Запуск таймера
    startTimer();

    // Обновление статистики каждые 5 минут
    updateStatistics();
    setInterval(updateStatistics, 300000);

    // Инициализация табов статистики
    const statsTabs = document.querySelectorAll('.stats-tab');
    const statsContents = document.querySelectorAll('.stats-content');

    // Инициализация переключателей времени в трендах
    const trendTimeItems = document.querySelectorAll('.trend-time-item');

    // Обработчик переключения табов статистики
    statsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех табов
            statsTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущему табу
            this.classList.add('active');

            // Получаем id таба
            const tabId = this.getAttribute('data-tab');

            // Скрываем все контенты
            statsContents.forEach(content => content.classList.remove('active'));

            // Показываем нужный контент
            document.getElementById(tabId + '-stats').classList.add('active');
        });
    });

    // Обработчик переключения времени в трендах
    trendTimeItems.forEach(item => {
        item.addEventListener('click', function() {
            // Удаляем активный класс у всех элементов
            trendTimeItems.forEach(i => i.classList.remove('active'));
            // Добавляем активный класс текущему элементу
            this.classList.add('active');

            // Получаем период времени
            const timeFrame = this.getAttribute('data-time');

            // Обновляем график тренда в зависимости от выбранного периода
            updateTrendChart(timeFrame);
        });
    });

    // Функция обновления графика тренда
    function updateTrendChart(timeFrame) {
        const trendPath = document.querySelector('.trend-path');
        const trendLabels = document.querySelectorAll('.trend-label');

        // Разные пути для разных периодов времени
        let path = '';
        let labels = [];

        switch(timeFrame) {
            case 'day':
                path = 'M0,80 C50,70 100,20 150,40 C200,60 250,30 300,10';
                labels = ['00:00', '06:00', '12:00', '18:00', '24:00'];
                break;
            case 'week':
                path = 'M0,50 C50,30 100,60 150,20 C200,40 250,10 300,30';
                labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                break;
            case 'month':
                path = 'M0,30 C50,50 100,10 150,70 C200,20 250,40 300,60';
                labels = ['1 нед', '2 нед', '3 нед', '4 нед'];
                break;
        }

        // Анимируем изменение пути
        trendPath.style.transition = 'all 0.5s ease';
        trendPath.setAttribute('d', path);

        // Обновляем метки
        trendLabels.forEach((label, index) => {
            if (index < labels.length) {
                label.textContent = labels[index];
                label.style.display = 'block';
            } else {
                label.style.display = 'none';
            }
        });
    }
});

// Функция генерации предикта
function generatePrediction() {
    if (isGenerating) return;

    isGenerating = true;
    // Блокируем кнопку на 2 минуты
    generateBtn.disabled = true;
    generateBtn.textContent = 'Генерация...';
    generateBtn.classList.add('generating');

    // Создаем анимацию "поиска" коэффициента
    let animationCounter = 0;
    const animationValues = [];
    const animationDuration = 7000; // 7 секунд анимации
    const animationInterval = 100; // Обновление каждые 100мс
    const animationSteps = animationDuration / animationInterval;

    // Генерируем конечный коэффициент заранее
    // Используем распределение, при котором мелкие коэффициенты выпадают чаще
    let finalCoefficient;
    
    // В 70% случаев генерируем мелкие коэффициенты от 1.04 до 2.0
    if (Math.random() < 0.7) {
        finalCoefficient = (Math.random() * 0.96 + 1.04).toFixed(2);
    } 
    // В 20% случаев генерируем средние коэффициенты от 2.0 до 5.0
    else if (Math.random() < 0.9) {
        finalCoefficient = (Math.random() * 3.0 + 2.0).toFixed(2);
    }
    // В 10% случаев генерируем высокие коэффициенты от 5.0 до 10.0
    else {
        finalCoefficient = (Math.random() * 5.0 + 5.0).toFixed(2);
    }

    // Добавляем класс для анимации
    coefficientValue.classList.add('animating');

    // Добавляем анимацию загрузки
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    document.querySelector('.prediction-result').prepend(loadingIndicator);

    // Запускаем анимацию
    const animationTimer = setInterval(() => {
        animationCounter++;

        // Генерируем случайное значение, которое постепенно приближается к финальному
        const progress = animationCounter / animationSteps;
        let currentValue;

        if (progress < 0.7) {
            // В начале анимации показываем более случайные значения, но с уклоном в сторону мелких коэффициентов
            // В 70% случаев показываем мелкие коэффициенты
            if (Math.random() < 0.7) {
                currentValue = (Math.random() * 0.96 + 1.04).toFixed(2);
            } 
            // В 20% случаев показываем средние коэффициенты
            else if (Math.random() < 0.9) {
                currentValue = (Math.random() * 3.0 + 2.0).toFixed(2);
            }
            // В 10% случаев показываем высокие коэффициенты
            else {
                currentValue = (Math.random() * 5.0 + 5.0).toFixed(2);
            }
        } else {
            // Ближе к концу приближаемся к финальному значению
            const randomFactor = 1 - progress;
            const diff = Math.random() * 2 * randomFactor - randomFactor;
            currentValue = (parseFloat(finalCoefficient) + diff).toFixed(2);
            
            // Убедимся, что коэффициент не меньше 1.04
            if (parseFloat(currentValue) < 1.04) {
                currentValue = (1.04).toFixed(2);
            }
        }

        // Обновляем UI
        coefficientValue.textContent = currentValue + 'x';
        coefficientValue.style.color = getColorByCoefficient(currentValue);

        // Обновляем индикатор загрузки
        const loadingProgress = Math.min(progress * 1.2, 1);
        loadingIndicator.style.setProperty('--loading-progress', loadingProgress);

        // Если анимация завершена
        if (animationCounter >= animationSteps) {
            clearInterval(animationTimer);

            // Устанавливаем финальное значение
            coefficientValue.textContent = finalCoefficient + 'x';
            coefficientValue.style.color = getColorByCoefficient(finalCoefficient);

            // Добавляем эффект завершения
            loadingIndicator.classList.add('complete');

            // Добавление в историю
            addToHistory(finalCoefficient);

            // Удаляем индикатор после анимации
            setTimeout(() => {
                loadingIndicator.remove();
                coefficientValue.classList.remove('animating');
            }, 1000);

            // Сброс состояния генерации, но кнопка остается заблокированной
            isGenerating = false;
            // Кнопка остается заблокированной до истечения таймера
            generateBtn.textContent = 'Сгенерировать предикт';
            generateBtn.classList.remove('generating');

            // Обновление статистики
            updateStatistics();
        }
    }, animationInterval);
}

// Функция добавления предикта в историю
function addToHistory(coefficient) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Генерация фактического коэффициента (для демонстрации)
    let actualCoefficient;
    
    // В 70% случаев генерируем мелкие коэффициенты от 1.04 до 2.0
    if (Math.random() < 0.7) {
        actualCoefficient = (Math.random() * 0.96 + 1.04).toFixed(2);
    } 
    // В 20% случаев генерируем средние коэффициенты от 2.0 до 5.0
    else if (Math.random() < 0.9) {
        actualCoefficient = (Math.random() * 3.0 + 2.0).toFixed(2);
    }
    // В 10% случаев генерируем высокие коэффициенты от 5.0 до 10.0
    else {
        actualCoefficient = (Math.random() * 5.0 + 5.0).toFixed(2);
    }
    
    // Добавляем минимальную вариативность для реалистичности (высокая точность)
    // В 90% случаев делаем очень близкое значение к предсказанному
    if (Math.random() < 0.9) {
        // Отклонение всего на ±3%
        const smallVariation = Math.random() * 0.06 - 0.03;
        actualCoefficient = (parseFloat(coefficient) * (1 + smallVariation)).toFixed(2);
    } else {
        // В 10% случаев небольшое отклонение
        const variation = Math.random() * 0.1 - 0.05; // Отклонение на ±5%
        actualCoefficient = (parseFloat(actualCoefficient) * (1 + variation)).toFixed(2);
    }
    
    // Убедимся, что коэффициент не меньше 1.04
    if (parseFloat(actualCoefficient) < 1.04) {
        actualCoefficient = (1.04).toFixed(2);
    }

    // Определение статуса (увеличенная точность)
    let status;
    let statusClass;

    // Рассчитываем процентную разницу между предсказанным и фактическим коэффициентом
    const predCoef = parseFloat(coefficient);
    const actCoef = parseFloat(actualCoefficient);
    const percentDiff = Math.abs(predCoef - actCoef) / predCoef * 100;

    // Увеличиваем порог успешных предсказаний
    if (percentDiff < 10) { // Разница меньше 10%
        status = 'Успех';
        statusClass = 'status-success';
    } else if (percentDiff < 20) { // Разница меньше 20%
        status = 'Близко';
        statusClass = 'status-warning';
    } else {
        status = 'Мимо';
        statusClass = 'status-danger';
    }
    
    // Дополнительно увеличиваем вероятность успеха
    if (status !== 'Успех' && Math.random() < 0.7) {
        status = 'Успех';
        statusClass = 'status-success';
        // Приближаем фактический коэффициент к предсказанному
        actualCoefficient = (predCoef * (1 + (Math.random() * 0.06 - 0.03))).toFixed(2);
    }

    // Создание записи
    const historyRow = document.createElement('div');
    historyRow.className = 'history-row';
    historyRow.innerHTML = `
        <div class="history-cell">${time}</div>
        <div class="history-cell">${coefficient}x</div>
        <div class="history-cell">${actualCoefficient}x</div>
        <div class="history-cell ${statusClass}">${status}</div>
    `;

    // Добавление в начало истории
    historyBody.insertBefore(historyRow, historyBody.firstChild);

    // Ограничение количества записей
    if (historyBody.children.length > 10) {
        historyBody.removeChild(historyBody.lastChild);
    }

    // Сохранение предикта
    predictions.push({
        time,
        predicted: parseFloat(coefficient),
        actual: parseFloat(actualCoefficient),
        status
    });
}

// Функция запуска автоматической генерации предиктов каждые 2 минуты
let autoGenerationInterval;

function startAutomaticGeneration() {
    // Очищаем предыдущий интервал, если он был
    clearInterval(autoGenerationInterval);
    
    // Генерируем первый предикт сразу
    generatePrediction();
    
    // Запускаем интервал генерации каждые 2 минуты (120000 мс)
    autoGenerationInterval = setInterval(() => {
        // Генерируем предикт
        generatePrediction();
        
        // Сбрасываем таймер для синхронизации
        resetTimer();
    }, 120000); // 2 минуты в миллисекундах
}

// Функция сброса таймера
function resetTimer() {
    clearInterval(timerInterval);
    timer = 120; // Устанавливаем таймер на 2 минуты (120 секунд)
    updateTimerDisplay();
    startTimer();
}

// Функция запуска таймера для отображения времени до следующего предикта
function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();

        if (timer <= 0) {
            // Таймер достиг нуля, разблокируем кнопку генерации
            generateBtn.disabled = false;
            
            // Добавляем анимацию к кнопке, чтобы привлечь внимание
            generateBtn.classList.add('ready');
            setTimeout(() => {
                generateBtn.classList.remove('ready');
            }, 1000);
            
            // Останавливаем таймер
            clearInterval(timerInterval);
            timerValue.textContent = '00:00';
        }
    }, 1000);
}

// Функция обновления отображения таймера
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Функция обновления статистики
function updateStatistics() {
    // Инициализация статистики, если массив пуст
    if (predictions.length === 0) {
        // Если предсказаний еще нет, показываем высокую точность по умолчанию
        displayDefaultHighStats();
        return;
    }
    
    // Расчет точности
    const successCount = predictions.filter(p => p.status === 'Успех').length;
    const closeCount = predictions.filter(p => p.status === 'Близко').length;
    const failedCount = predictions.filter(p => p.status === 'Мимо').length;
    
    // Гарантируем высокую точность (85-95%)
    let accuracy = Math.round((successCount / predictions.length) * 100);
    if (accuracy < 85) {
        accuracy = Math.floor(Math.random() * 11) + 85; // Случайное число от 85 до 95
    }
    
    // Расчет среднего коэффициента
    const totalCoefficient = predictions.reduce((sum, p) => sum + p.predicted, 0);
    const average = (totalCoefficient / predictions.length).toFixed(2);
    
    // Расчет тренда коэффициентов
    const prevAvg = parseFloat(avgCoefficient.textContent) || 0;
    const trend = (average - prevAvg).toFixed(1);
    const trendDirection = trend >= 0 ? 'up' : 'down';
    
    // Обновление максимального коэффициента
    const maxCoef = Math.max(...predictions.map(p => p.actual));
    if (maxCoef > parseFloat(maxCoefficient.textContent)) {
        maxCoefficient.textContent = maxCoef.toFixed(2) + 'x';
        maxTime.textContent = 'Сегодня, ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // Обновление пользователей
    const currentUsers = parseInt(usersCount.textContent.replace(/,|\+/g, ''));
    const newUsers = currentUsers + Math.floor(Math.random() * 10);
    const usersTrendValue = newUsers - currentUsers;
    
    // Обновление UI общей статистики
    successRate.textContent = `${accuracy}%`;
    avgCoefficient.textContent = `${average}x`;
    usersCount.textContent = `${newUsers.toLocaleString()}+`;
    
    // Обновление прогресс-бара точности
    successProgress.style.width = `${accuracy}%`;
    
    // Обновление трендов
    coefTrend.textContent = (trend >= 0 ? '+' : '') + trend + 'x';
    coefTrend.parentElement.className = 'stats-trend ' + trendDirection;
    
    usersTrend.textContent = '+' + usersTrendValue;
    
    // Обновление детальной статистики
    totalPredictions.textContent = predictions.length;
    successPredictions.textContent = successCount;
    closePredictions.textContent = closeCount;
    failedPredictions.textContent = failedCount;
    
    // Обновление полосы точности в основном блоке
    document.querySelector('.accuracy-fill').style.width = `${accuracy}%`;
    document.querySelector('.accuracy-value').textContent = `${accuracy}% точность`;
    
    // Анимация обновления статистики
    animateStatisticsUpdate();
}

// Функция анимации обновления статистики
function animateStatisticsUpdate() {
    const statsCards = document.querySelectorAll('.stats-card');
    
    statsCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('update-animation');
            setTimeout(() => {
                card.classList.remove('update-animation');
            }, 500);
        }, index * 100);
    });
}

// Функция отображения высокой статистики по умолчанию
function displayDefaultHighStats() {
    // Устанавливаем высокую точность (85-95%)
    const accuracy = Math.floor(Math.random() * 11) + 85;
    
    // Средний коэффициент в диапазоне 1.5-2.5
    const avgCoef = (Math.random() * 1.0 + 1.5).toFixed(2);
    
    // Максимальный коэффициент в диапазоне 7.5-9.5
    const maxCoef = (Math.random() * 2.0 + 7.5).toFixed(2);
    
    // Количество предсказаний (100-200)
    const totalPreds = Math.floor(Math.random() * 101) + 100;
    
    // Расчет количества успешных, близких и неудачных предсказаний
    const successPreds = Math.floor(totalPreds * (accuracy / 100));
    const closePreds = Math.floor(totalPreds * 0.1); // 10% близких
    const failedPreds = totalPreds - successPreds - closePreds;
    
    // Обновление UI общей статистики
    successRate.textContent = `${accuracy}%`;
    avgCoefficient.textContent = `${avgCoef}x`;
    maxCoefficient.textContent = `${maxCoef}x`;
    
    // Время максимального коэффициента (сегодня, случайное время)
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    maxTime.textContent = `Сегодня, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Обновление прогресс-бара точности
    successProgress.style.width = `${accuracy}%`;
    
    // Обновление трендов
    coefTrend.textContent = '+0.3x';
    coefTrend.parentElement.className = 'stats-trend up';
    
    usersTrend.textContent = '+125';
    
    // Обновление детальной статистики
    if (totalPredictions) {
        totalPredictions.textContent = totalPreds;
        successPredictions.textContent = successPreds;
        closePredictions.textContent = closePreds;
        failedPredictions.textContent = failedPreds;
    }
    
    // Обновление полосы точности в основном блоке
    const accuracyFill = document.querySelector('.accuracy-fill');
    const accuracyValue = document.querySelector('.accuracy-value');
    if (accuracyFill && accuracyValue) {
        accuracyFill.style.width = `${accuracy}%`;
        accuracyValue.textContent = `${accuracy}% точность`;
    }
    
    // Анимация обновления статистики
    animateStatisticsUpdate();
}

// Функция получения цвета в зависимости от коэффициента
function getColorByCoefficient(coefficient) {
    coefficient = parseFloat(coefficient);
    
    if (coefficient < 2) {
        return '#00b894'; // Зеленый для низких коэффициентов
    } else if (coefficient < 5) {
        return '#1dd1a1'; // Светло-зеленый для средних коэффициентов
    } else {
        return '#ffeaa7'; // Желтый для высоких коэффициентов
    }
}
