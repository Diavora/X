// Тестовый файл для проверки работы кнопки
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем тестирование кнопки');
    
    // Находим кнопку генерации предикта
    const generateBtn = document.getElementById('generate-btn');
    console.log('Кнопка генерации:', generateBtn);
    
    if (generateBtn) {
        // Добавляем простой обработчик клика
        generateBtn.onclick = function() {
            console.log('Кнопка нажата!');
            alert('Кнопка работает!');
        };
        console.log('Обработчик клика добавлен');
    } else {
        console.error('Кнопка генерации не найдена!');
    }
});
