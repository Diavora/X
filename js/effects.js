// u0424u0443u043du043au0446u0438u0438 u0434u043bu044f u0430u043du0438u043cu0438u0440u043eu0432u0430u043du043du043eu0433u043e u0444u043eu043du0430 u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u043eu0432 u0438 u044du0444u0444u0435u043au0442u0430 u043au043eu043du0444u0435u0442u0442u0438

// u0424u0443u043du043au0446u0438u044f u043fu0440u0438u043cu0435u043du0435u043du0438u044f u0430u043du0438u043cu0438u0440u043eu0432u0430u043du043du043eu0433u043e u0444u043eu043du0430 u043a u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u0443
function applyAnimatedBackground(element, coefficient) {
    // u0423u0434u0430u043bu044fu0435u043c u0432u0441u0435 u043au043bu0430u0441u0441u044b u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u043eu0432
    element.classList.remove('coefficient-low', 'coefficient-medium', 'coefficient-high');
    element.classList.add('animated-coefficient');
    
    // u041fu0440u0438u043cu0435u043du044fu0435u043c u0441u043eu043eu0442u0432u0435u0442u0441u0442u0432u0443u044eu0449u0438u0439 u043au043bu0430u0441u0441 u0432 u0437u0430u0432u0438u0441u0438u043cu043eu0441u0442u0438 u043eu0442 u0437u043du0430u0447u0435u043du0438u044f u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u0430
    coefficient = parseFloat(coefficient);
    
    if (coefficient < 2.0) {
        element.classList.add('coefficient-low');
    } else if (coefficient < 5.0) {
        element.classList.add('coefficient-medium');
    } else {
        element.classList.add('coefficient-high');
        // u0414u043bu044f u0432u044bu0441u043eu043au0438u0445 u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u043eu0432 u0442u0430u043au0436u0435 u0434u043eu0431u0430u0432u043bu044fu0435u043c u044du0444u0444u0435u043au0442 u0441u0432u0435u0447u0435u043du0438u044f u043a u043au0430u0440u0442u043eu0447u043au0435
        const predictionResult = document.getElementById('prediction-result');
        if (predictionResult) {
            predictionResult.classList.add('glow-effect');
            
            // u0423u0434u0430u043bu044fu0435u043c u044du0444u0444u0435u043au0442 u0441u0432u0435u0447u0435u043du0438u044f u0447u0435u0440u0435u0437 5 u0441u0435u043au0443u043du0434
            setTimeout(() => {
                predictionResult.classList.remove('glow-effect');
            }, 5000);
        }
        
        // u0417u0430u043fu0443u0441u043au0430u0435u043c u044du0444u0444u0435u043au0442 u043au043eu043du0444u0435u0442u0442u0438 u0438 u0432u0437u0440u044bu0432u0430 u0434u043bu044f u0432u044bu0441u043eu043au0438u0445 u043au043eu044du0444u0444u0438u0446u0438u0435u043du0442u043eu0432
        createConfetti();
        createExplosionEffect();
    }
}

// u0424u0443u043du043au0446u0438u044f u0441u043eu0437u0434u0430u043du0438u044f u044du0444u0444u0435u043au0442u0430 u043au043eu043du0444u0435u0442u0442u0438
function createConfetti() {
    // u0421u043eu0437u0434u0430u0435u043c u043au043eu043du0442u0435u0439u043du0435u0440 u0434u043bu044f u043au043eu043du0444u0435u0442u0442u0438, u0435u0441u043bu0438 u0435u0433u043e u0435u0449u0435 u043du0435u0442
    let confettiContainer = document.querySelector('.confetti-container');
    
    if (!confettiContainer) {
        confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.getElementById('prediction-container').appendChild(confettiContainer);
    } else {
        // u041eu0447u0438u0449u0430u0435u043c u043au043eu043du0442u0435u0439u043du0435u0440 u043eu0442 u0441u0442u0430u0440u044bu0445 u043au043eu043du0444u0435u0442u0442u0438
        confettiContainer.innerHTML = '';
    }
    
    // u0426u0432u0435u0442u0430 u0434u043bu044f u043au043eu043du0444u0435u0442u0442u0438
    const colors = [
        '#a3be8c', '#b48ead', '#ebcb8b', '#d08770', '#bf616a', 
        '#5e81ac', '#81a1c1', '#88c0d0', '#8fbcbb', '#ffeaa7'
    ];
    
    // u0421u043eu0437u0434u0430u0435u043c 50 u043au043eu043du0444u0435u0442u0442u0438
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // u0421u043bu0443u0447u0430u0439u043du044bu0435 u0441u0432u043eu0439u0441u0442u0432u0430 u0434u043bu044f u043au0430u0436u0434u043eu0433u043e u043au043eu043du0444u0435u0442u0442u0438
            const size = Math.random() * 10 + 5; // u0420u0430u0437u043cu0435u0440 u043eu0442 5 u0434u043e 15px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100; // u041fu043eu0437u0438u0446u0438u044f u0441u043bu0435u0432u0430 (0-100%)
            const duration = Math.random() * 2 + 1; // u0414u043bu0438u0442u0435u043bu044cu043du043eu0441u0442u044c u0430u043du0438u043cu0430u0446u0438u0438 (1-3u0441)
            
            // u0421u043bu0443u0447u0430u0439u043du0430u044f u0444u043eu0440u043cu0430: u043au0440u0443u0433, u043au0432u0430u0434u0440u0430u0442 u0438u043bu0438 u0442u0440u0435u0443u0433u043eu043bu044cu043du0438u043a
            const shapes = ['50%', '0%', '0% 50% 50% 0%'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            // u041fu0440u0438u043cu0435u043du044fu0435u043c u0441u0442u0438u043bu0438
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.top = '0';
            confetti.style.borderRadius = shape;
            confetti.style.animation = `confettiFall ${duration}s ease forwards`;
            
            // u0414u043eu0431u0430u0432u043bu044fu0435u043c u0432 u043au043eu043du0442u0435u0439u043du0435u0440
            confettiContainer.appendChild(confetti);
            
            // u0423u0434u0430u043bu044fu0435u043c u043fu043eu0441u043bu0435 u0437u0430u0432u0435u0440u0448u0435u043du0438u044f u0430u043du0438u043cu0430u0446u0438u0438
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 20); // u0417u0430u043fu0443u0441u043au0430u0435u043c u0441 u043du0435u0431u043eu043bu044cu0448u043eu0439 u0437u0430u0434u0435u0440u0436u043au043eu0439 u043cu0435u0436u0434u0443 u043au0430u0436u0434u044bu043c u043au043eu043du0444u0435u0442u0442u0438
    }
}

// u0424u0443u043du043au0446u0438u044f u0441u043eu0437u0434u0430u043du0438u044f u044du0444u0444u0435u043au0442u0430 u0432u0437u0440u044bu0432u0430
function createExplosionEffect() {
    // u0421u043eu0437u0434u0430u0435u043c u044du043bu0435u043cu0435u043du0442 u0432u0437u0440u044bu0432u0430
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    
    // u0414u043eu0431u0430u0432u043bu044fu0435u043c u0432 u043au043eu043du0442u0435u0439u043du0435u0440 u043fu0440u0435u0434u0441u043au0430u0437u0430u043du0438u044f
    document.getElementById('prediction-result').appendChild(explosion);
    
    // u0417u0430u043fu0443u0441u043au0430u0435u043c u0430u043du0438u043cu0430u0446u0438u044e
    explosion.style.animation = 'explode 0.6s ease-out forwards';
    
    // u0423u0434u0430u043bu044fu0435u043c u043fu043eu0441u043bu0435 u0437u0430u0432u0435u0440u0448u0435u043du0438u044f u0430u043du0438u043cu0430u0446u0438u0438
    setTimeout(() => {
        explosion.remove();
    }, 600);
}
