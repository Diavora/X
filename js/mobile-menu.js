// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    const overlay = document.createElement('div');
    
    // Создаем оверлей для мобильного меню
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    // Функция для переключения мобильного меню
    function toggleMobileMenu() {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        overlay.classList.toggle('active');
        
        // Блокировка прокрутки страницы при открытом меню
        if (body.classList.contains('menu-open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    // Обработчик клика по кнопке меню
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Обработчик клика по ссылкам меню для закрытия меню при переходе
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (nav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Закрытие меню при клике по оверлею
    overlay.addEventListener('click', function() {
        if (nav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Закрытие меню при клике вне меню
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = mobileMenuToggle.contains(event.target);
        
        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            toggleMobileMenu();
        }
    });
    
    // Добавление стилей для активного состояния меню
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            body.menu-open {
                overflow: hidden;
            }
            
            .mobile-menu-toggle.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            
            .mobile-menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
        </style>
    `);
});
