// Отладочный скрипт для проверки работы кнопки
document.addEventListener('DOMContentLoaded', function() {
    console.log('Отладка: DOM загружен');
    
    // Проверяем, существует ли кнопка
    const generateBtn = document.getElementById('generate-btn');
    console.log('Отладка: Кнопка генерации:', generateBtn);
    
    if (generateBtn) {
        // Добавляем прямой обработчик клика
        generateBtn.onclick = function() {
            console.log('Отладка: Кнопка нажата!');
            alert('Кнопка работает!');
        };
        console.log('Отладка: Обработчик клика добавлен');
        
        // Проверяем стили кнопки
        const computedStyle = window.getComputedStyle(generateBtn);
        console.log('Отладка: Стили кнопки:', {
            display: computedStyle.display,
            position: computedStyle.position,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            pointerEvents: computedStyle.pointerEvents,
            zIndex: computedStyle.zIndex
        });
        
        // Проверяем, нет ли перекрывающих элементов
        const rect = generateBtn.getBoundingClientRect();
        console.log('Отладка: Координаты кнопки:', rect);
    } else {
        console.error('Отладка: Кнопка генерации не найдена!');
    }
    
    // Проверяем все кнопки на странице
    const allButtons = document.querySelectorAll('button');
    console.log('Отладка: Все кнопки на странице:', allButtons);
});
