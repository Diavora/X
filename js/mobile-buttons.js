/**
 * u0414u043eu043fu043eu043bu043du0438u0442u0435u043bu044cu043du044bu0439 u0441u043au0440u0438u043fu0442 u0434u043bu044f u0440u0430u0431u043eu0442u044b u043au043du043eu043fu043eu043a u043du0430 u043cu043eu0431u0438u043bu044cu043du044bu0445 u0443u0441u0442u0440u043eu0439u0441u0442u0432u0430u0445
 */

// u0418u0441u043fu043eu043bu044cu0437u0443u0435u043c u0441u0430u043cu043eu0432u044bu0437u044bu0432u0430u044eu0449u0443u044eu0441u044f u0444u0443u043du043au0446u0438u044e u0434u043bu044f u0438u0437u043eu043bu044fu0446u0438u0438 u043fu0435u0440u0435u043cu0435u043du043du044bu0445
(function() {
    'use strict';
    
    // u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043fu0440u043eu0432u0435u0440u043au0438 u043cu043eu0431u0438u043bu044cu043du043eu0433u043e u0443u0441u0442u0440u043eu0439u0441u0442u0432u0430
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    }
    
    // u0424u0443u043du043au0446u0438u044f u0434u043bu044f u043du0430u0441u0442u0440u043eu0439u043au0438 u043au043du043eu043fu043eu043a
    function setupButtons() {
        const startBtn = document.getElementById('start-btn');
        const casinoBtn = document.getElementById('casino-btn');
        const generateBtn = document.getElementById('generate-btn');
        
        if (startBtn) {
            // u0414u043eu0431u0430u0432u043bu044fu0435u043c u043eu0431u0440u0430u0431u043eu0442u0447u0438u043au0438 u0434u043bu044f u0441u0435u043du0441u043eu0440u043du044bu0445 u0441u043eu0431u044bu0442u0438u0439
            startBtn.addEventListener('touchstart', function() {
                startBtn.classList.add('button-active');
            }, { passive: true });
            
            startBtn.addEventListener('touchend', function(e) {
                startBtn.classList.remove('button-active');
                // u041eu0441u043du043eu0432u043du0430u044f u0444u0443u043du043au0446u0438u043eu043du0430u043bu044cu043du043eu0441u0442u044c u0443u0436u0435 u0434u043eu0431u0430u0432u043bu0435u043du0430 u0447u0435u0440u0435u0437 onclick
            }, { passive: false });
        }
        
        if (casinoBtn) {
            // u0414u043eu0431u0430u0432u043bu044fu0435u043c u043eu0431u0440u0430u0431u043eu0442u0447u0438u043au0438 u0434u043bu044f u0441u0435u043du0441u043eu0440u043du044bu0445 u0441u043eu0431u044bu0442u0438u0439
            casinoBtn.addEventListener('touchstart', function() {
                casinoBtn.classList.add('button-active');
            }, { passive: true });
            
            casinoBtn.addEventListener('touchend', function(e) {
                casinoBtn.classList.remove('button-active');
                // u041eu0441u043du043eu0432u043du0430u044f u0444u0443u043du043au0446u0438u043eu043du0430u043bu044cu043du043eu0441u0442u044c u0443u0436u0435 u0434u043eu0431u0430u0432u043bu0435u043du0430 u0447u0435u0440u0435u0437 onclick
            }, { passive: false });
        }
        
        // u0423u043bu0443u0447u0448u0430u0435u043c u0440u0430u0431u043eu0442u0443 u043au043du043eu043fu043au0438 u0433u0435u043du0435u0440u0430u0446u0438u0438
        if (generateBtn) {
            generateBtn.addEventListener('touchstart', function() {
                generateBtn.classList.add('button-active');
            }, { passive: true });
            
            generateBtn.addEventListener('touchend', function() {
                generateBtn.classList.remove('button-active');
            }, { passive: true });
        }
    }
    
    // u0414u043eu0431u0430u0432u043bu044fu0435u043c CSS u043au043bu0430u0441u0441 u0434u043bu044f u0430u043au0442u0438u0432u043du044bu0445 u043au043du043eu043fu043eu043a
    function addButtonActiveStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .button-active {
                transform: scale(0.98) !important;
                opacity: 0.9 !important;
                transition: transform 0.1s ease, opacity 0.1s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // u0414u043eu0431u0430u0432u043bu044fu0435u043c u043cu0435u0442u0430-u0442u0435u0433 u0434u043bu044f u043eu0442u043au043bu044eu0447u0435u043du0438u044f u043cu0430u0441u0448u0442u0430u0431u0438u0440u043eu0432u0430u043du0438u044f u043fu0440u0438 u0434u0432u043eu0439u043du043eu043c u043du0430u0436u0430u0442u0438u0438
    function disableDoubleTapZoom() {
        // u041fu0440u043eu0432u0435u0440u044fu0435u043c, u0435u0441u0442u044c u043bu0438 u0443u0436u0435 u043cu0435u0442u0430-u0442u0435u0433 viewport
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        
        if (viewportMeta) {
            // u041fu0440u043eu0432u0435u0440u044fu0435u043c, u0435u0441u0442u044c u043bu0438 u0432 u043du0435u043c user-scalable=no
            if (viewportMeta.content.indexOf('user-scalable=no') === -1) {
                viewportMeta.content = viewportMeta.content + ', user-scalable=no';
            }
        }
    }
    
    // u0418u043du0438u0446u0438u0430u043bu0438u0437u0430u0446u0438u044f u043fu0440u0438 u0437u0430u0433u0440u0443u0437u043au0435 u0441u0442u0440u0430u043du0438u0446u044b
    function init() {
        if (isMobileDevice()) {
            console.log('u041cu043eu0431u0438u043bu044cu043du043eu0435 u0443u0441u0442u0440u043eu0439u0441u0442u0432u043e u043eu0431u043du0430u0440u0443u0436u0435u043du043e, u043du0430u0441u0442u0440u0430u0438u0432u0430u0435u043c u043au043du043eu043fu043au0438...');
            addButtonActiveStyle();
            setupButtons();
            disableDoubleTapZoom();
        }
    }
    
    // u0417u0430u043fu0443u0441u043au0430u0435u043c u0438u043du0438u0446u0438u0430u043bu0438u0437u0430u0446u0438u044e u043fu0440u0438 u0437u0430u0433u0440u0443u0437u043au0435 DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
