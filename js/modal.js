/**
 * u0421u043au0440u0438u043fu0442 u0434u043bu044f u0443u043fu0440u0430u0432u043bu0435u043du0438u044f u043cu043eu0434u0430u043bu044cu043du044bu043c u043eu043au043du043eu043c u0441 u043fu0440u043eu043cu043eu043au043eu0434u043eu043c
 */

(function() {
    'use strict';
    
    // u041au044du0448u0438u0440u0443u0435u043c DOM u044du043bu0435u043cu0435u043du0442u044b
    const casinoBtn = document.getElementById('casino-btn');
    const promoModal = document.getElementById('promo-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const goToCasino = document.getElementById('go-to-casino');
    
    // URL u043au0430u0437u0438u043du043e u0441 u043fu0440u043eu043cu043eu043au043eu0434u043eu043c
    const casinoUrl = 'https://1wcjlr.com/casino/list?open=register&p=xufl';
    
    // u0424u0443u043du043au0446u0438u044f u043eu0442u043au0440u044bu0442u0438u044f u043cu043eu0434u0430u043bu044cu043du043eu0433u043e u043eu043au043du0430
    function openModal() {
        promoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // u0411u043bu043eu043au0438u0440u0443u0435u043c u043fu0440u043eu043au0440u0443u0442u043au0443 u0441u0442u0440u0430u043du0438u0446u044b
    }
    
    // u0424u0443u043du043au0446u0438u044f u0437u0430u043au0440u044bu0442u0438u044f u043cu043eu0434u0430u043bu044cu043du043eu0433u043e u043eu043au043du0430
    function closeModal() {
        promoModal.classList.remove('active');
        document.body.style.overflow = ''; // u0412u043eu0441u0441u0442u0430u043du0430u0432u043bu0438u0432u0430u0435u043c u043fu0440u043eu043au0440u0443u0442u043au0443 u0441u0442u0440u0430u043du0438u0446u044b
    }
    
    // u0424u0443u043du043au0446u0438u044f u043fu0435u0440u0435u0445u043eu0434u0430 u043du0430 u0441u0430u0439u0442 u043au0430u0437u0438u043du043e
    function goToCasinoSite() {
        window.open(casinoUrl, '_blank');
        closeModal();
    }
    
    // u0414u043eu0431u0430u0432u043bu044fu0435u043c u043eu0431u0440u0430u0431u043eu0442u0447u0438u043au0438 u0441u043eu0431u044bu0442u0438u0439
    if (casinoBtn) {
        casinoBtn.addEventListener('click', function(event) {
            event.preventDefault();
            openModal();
        });
        
        // u0414u043eu0431u0430u0432u043bu044fu0435u043c u043eu0431u0440u0430u0431u043eu0442u0447u0438u043au0438 u0434u043bu044f u0441u0435u043du0441u043eu0440u043du044bu0445 u0443u0441u0442u0440u043eu0439u0441u0442u0432
        casinoBtn.addEventListener('touchstart', function() {
            casinoBtn.classList.add('button-active');
        }, { passive: true });
        
        casinoBtn.addEventListener('touchend', function() {
            casinoBtn.classList.remove('button-active');
        }, { passive: true });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    if (goToCasino) {
        goToCasino.addEventListener('click', goToCasinoSite);
    }
    
    // u0417u0430u043au0440u044bu0442u0438u0435 u043cu043eu0434u0430u043bu044cu043du043eu0433u043e u043eu043au043du0430 u043fu0440u0438 u043au043bu0438u043au0435 u043du0430 u0444u043eu043d
    promoModal.addEventListener('click', function(event) {
        if (event.target === promoModal) {
            closeModal();
        }
    });
    
    // u0417u0430u043au0440u044bu0442u0438u0435 u043cu043eu0434u0430u043bu044cu043du043eu0433u043e u043eu043au043du0430 u043fu0440u0438 u043du0430u0436u0430u0442u0438u0438 Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && promoModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // u0414u043eu0431u0430u0432u043bu044fu0435u043c u0432u043eu0437u043cu043eu0436u043du043eu0441u0442u044c u043au043eu043fu0438u0440u043eu0432u0430u043du0438u044f u043fu0440u043eu043cu043eu043au043eu0434u0430 u043fu0440u0438 u043au043bu0438u043au0435
    const promoCode = document.querySelector('.promo-code');
    if (promoCode) {
        promoCode.addEventListener('click', function() {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(promoCode);
            selection.removeAllRanges();
            selection.addRange(range);
            
            try {
                // u041fu044bu0442u0430u0435u043cu0441u044f u0441u043au043eu043fu0438u0440u043eu0432u0430u0442u044c u0442u0435u043au0441u0442
                const successful = document.execCommand('copy');
                if (successful) {
                    // u0414u043eu0431u0430u0432u043bu044fu0435u043c u0432u0438u0437u0443u0430u043bu044cu043du044bu0439 u044du0444u0444u0435u043au0442 u043fu0440u0438 u0443u0441u043fu0435u0448u043du043eu043c u043au043eu043fu0438u0440u043eu0432u0430u043du0438u0438
                    promoCode.classList.add('copied');
                    const originalText = promoCode.textContent;
                    promoCode.textContent = 'u0421u043au043eu043fu0438u0440u043eu0432u0430u043du043e!';
                    
                    setTimeout(function() {
                        promoCode.textContent = originalText;
                        promoCode.classList.remove('copied');
                    }, 1500);
                }
            } catch (err) {
                console.error('u041du0435 u0443u0434u0430u043bu043eu0441u044c u0441u043au043eu043fu0438u0440u043eu0432u0430u0442u044c u0442u0435u043au0441u0442:', err);
            }
            
            // u0421u043du0438u043cu0430u0435u043c u0432u044bu0434u0435u043bu0435u043du0438u0435
            selection.removeAllRanges();
        });
    }
})();
