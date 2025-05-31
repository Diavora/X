// Упрощенная версия скрипта, сфокусированная на работе кнопки генерации предикта
let isGenerating = false; // Флаг для отслеживания процесса генерации
let generateBtn; // Глобальная переменная для кнопки генерации предикта

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем инициализацию');
    
    // Находим кнопку генерации предикта
    generateBtn = document.getElementById('generate-btn');
    console.log('Кнопка генерации:', generateBtn);
    
    if (generateBtn) {
        // Сначала удаляем все существующие обработчики событий
        generateBtn.replaceWith(generateBtn.cloneNode(true));
        
        // Получаем свежую ссылку на клонированную кнопку
        generateBtn = document.getElementById('generate-btn');
        
        // Добавляем прямой обработчик клика
        generateBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Кнопка нажата!');
            generatePrediction();
        });
        
        // Также добавляем обработчик mousedown для дополнительной надежности
        generateBtn.addEventListener('mousedown', function(event) {
            console.log('Mousedown на кнопке!');
        });
        
        console.log('Обработчик клика добавлен');
    } else {
        console.error('Кнопка генерации не найдена!');
    }
    
    // 3D-визуализация полета удалена
});

// Функция генерации предикта с прогрессивной загрузкой
function generatePrediction() {
    console.log('Функция generatePrediction вызвана');
    
    if (isGenerating) {
        console.log('Генерация уже идет, выходим');
        return;
    }

    console.log('Начинаем генерацию предикта');
    isGenerating = true;
    
    // Получаем ссылки на элементы
    const loadingContainer = document.getElementById('loading-prediction');
    const predictionResult = document.getElementById('prediction-result');
    
    if (loadingContainer && predictionResult) {
        // Показываем анимацию загрузки
        predictionResult.style.display = 'none';
        loadingContainer.style.display = 'flex';
        
        // Генерируем случайный коэффициент через 3 секунды
        setTimeout(function() {
            // Генерируем коэффициент от 1.1 до 10.0
            const coefficient = (Math.random() * 8.9 + 1.1).toFixed(2);
            
            // Отображаем результат
            const coefficientElement = document.getElementById('coefficient-value');
            if (coefficientElement) {
                coefficientElement.textContent = coefficient + 'x';
            }
            
            // Скрываем анимацию загрузки и показываем результат
            loadingContainer.style.display = 'none';
            predictionResult.style.display = 'flex';
            
            // 3D-визуализация полета удалена
            
            // Сбрасываем флаг генерации
            isGenerating = false;
            
            console.log('Генерация завершена, коэффициент:', coefficient);
        }, 3000);
    } else {
        console.error('Не найдены необходимые элементы интерфейса');
        isGenerating = false;
    }
}
