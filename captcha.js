document.addEventListener('DOMContentLoaded', function() {
    let captchaCanvas = document.getElementById('captchaCanvas');
    let captchaInput = document.getElementById('captchaInput');
    let errorMessage = document.getElementById('errorMessage');
    let captchaContainer = document.getElementById('captchaContainer');
    let refreshCaptcha = document.getElementById('refreshCaptcha');
    let submitCaptcha = document.getElementById('submitCaptcha');
    let ctx = captchaCanvas.getContext('2d');

    let currentCaptcha = '';
    let timer;
    let countdownTimer;
    let countdownDisplay = document.createElement('p');
    countdownDisplay.id = "countdownDisplay";
    captchaContainer.appendChild(countdownDisplay);

    function generateCaptcha() {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        return captcha;
    }

    function drawCaptcha(text) {
        ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
        ctx.fillStyle = '#003366';
        ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

        ctx.save();
        ctx.rotate((Math.random() - 0.5) * 0.2);
        ctx.fillStyle = '#001F3F';
        ctx.fillRect(-20, -20, captchaCanvas.width + 40, captchaCanvas.height + 40);
        ctx.restore();

        for (let i = 0; i < text.length; i++) {
            ctx.font = `${35 + Math.random() * 15}px Arial`;
            ctx.fillStyle = getRandomColor();

            ctx.save();
            let x = 40 * i + 20; 
            let y = 60 + Math.sin(i * Math.PI / 3) * 15 + Math.random() * 15;
            let angle = Math.random() * 1 - 0.5;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(1 + Math.random() * 0.3, 1 + Math.random() * 0.4);

            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }

        for (let i = 0; i < 20; i++) {
            ctx.strokeStyle = getRandomColor();
            ctx.beginPath();
            ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
            ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
            ctx.stroke();
        }

        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = getRandomColor();
            ctx.beginPath();
            ctx.arc(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height, Math.random() * 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function loadCaptcha() {
        currentCaptcha = generateCaptcha();
        drawCaptcha(currentCaptcha);

        clearTimeout(timer);
        clearInterval(countdownTimer);

        let timeRemaining = 60;
        countdownTimer = setInterval(() => {
            countdownDisplay.textContent = `Tiempo restante: ${timeRemaining} segundos`;
            timeRemaining--;

            if (timeRemaining < 0) {
                clearInterval(countdownTimer);
                loadCaptcha();
                captchaInput.value = '';
                errorMessage.textContent = 'El CAPTCHA ha caducado. Inténtalo de nuevo.';
            }
        }, 1000);

        timer = setTimeout(() => {
            loadCaptcha();
            captchaInput.value = '';
            errorMessage.textContent = 'El CAPTCHA ha caducado. Inténtalo de nuevo.';
        }, 60000);
    }

    loadCaptcha();

    refreshCaptcha.addEventListener('click', function() {
        loadCaptcha();
        captchaInput.value = '';
        errorMessage.textContent = '';
    });

    submitCaptcha.addEventListener('click', function() {
        if (captchaInput.value === currentCaptcha) {
            clearTimeout(timer);
            clearInterval(countdownTimer);
            sessionStorage.setItem('captchaResolved', 'true');
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'El CAPTCHA no es correcto, intenta de nuevo.';
        }
    });
});
