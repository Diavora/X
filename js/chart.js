// Анимированный график истории предиктов
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, существует ли контейнер для графика
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) return;
    
    // Данные для графика (будут заполняться динамически)
    let chartData = {
        labels: [],
        datasets: [
            {
                label: 'Предикты',
                data: [],
                borderColor: '#b8b8b8',
                backgroundColor: 'rgba(184, 184, 184, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#e0e0e0',
                pointBorderColor: '#404040',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4
            },
            {
                label: 'Фактические',
                data: [],
                borderColor: '#808080',
                backgroundColor: 'rgba(128, 128, 128, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#c0c0c0',
                pointBorderColor: '#303030',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4
            }
        ]
    };
    
    // Опции графика
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(184, 184, 184, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                }
            },
            x: {
                grid: {
                    color: 'rgba(184, 184, 184, 0.1)'
                },
                ticks: {
                    color: '#b0b0b0'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#e8e8e8'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                titleColor: '#f8f8f8',
                bodyColor: '#e8e8e8',
                borderColor: 'rgba(184, 184, 184, 0.2)',
                borderWidth: 1
            }
        }
    };
    
    // Создаем график
    const ctx = chartContainer.getContext('2d');
    const coefficientChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    // Функция для добавления данных в график
    window.updateChart = function(predictedValue, actualValue, time) {
        // Ограничиваем количество точек на графике
        if (chartData.labels.length > 10) {
            chartData.labels.shift();
            chartData.datasets[0].data.shift();
            chartData.datasets[1].data.shift();
        }
        
        // Добавляем новые данные
        chartData.labels.push(time);
        chartData.datasets[0].data.push(predictedValue);
        chartData.datasets[1].data.push(actualValue || null);
        
        // Обновляем график с анимацией
        coefficientChart.update();
    };
    
    // Функция для отображения тренда
    window.showTrend = function() {
        const data = chartData.datasets[0].data;
        if (data.length < 2) return 'neutral';
        
        const lastValue = data[data.length - 1];
        const prevValue = data[data.length - 2];
        
        if (lastValue > prevValue) {
            return 'up';
        } else if (lastValue < prevValue) {
            return 'down';
        } else {
            return 'neutral';
        }
    };
    
    // Демонстрационные данные для примера
    const demoTimes = ['10:00', '10:05', '10:10', '10:15', '10:20'];
    const demoPredicts = [1.5, 2.1, 1.8, 2.5, 3.2];
    const demoActuals = [1.6, 2.0, 1.9, 2.3, 3.0];
    
    // Заполняем график демо-данными
    for (let i = 0; i < demoTimes.length; i++) {
        setTimeout(() => {
            updateChart(demoPredicts[i], demoActuals[i], demoTimes[i]);
        }, i * 500);
    }
    
    // Обновляем индикатор тренда
    setInterval(() => {
        const trend = showTrend();
        const trendIndicator = document.getElementById('trend-indicator');
        if (trendIndicator) {
            trendIndicator.className = 'trend-indicator';
            trendIndicator.classList.add(`trend-${trend}`);
            
            let trendText = '';
            let trendIcon = '';
            
            switch(trend) {
                case 'up':
                    trendText = 'Восходящий тренд';
                    trendIcon = '↑';
                    break;
                case 'down':
                    trendText = 'Нисходящий тренд';
                    trendIcon = '↓';
                    break;
                default:
                    trendText = 'Нейтральный тренд';
                    trendIcon = '→';
            }
            
            trendIndicator.innerHTML = `<span class="trend-icon">${trendIcon}</span> <span class="trend-text">${trendText}</span>`;
        }
    }, 2000);
});
