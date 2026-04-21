// ========== ИГРА: УГАДАЙ ЧИСЛО ==========
class GuessGame {
    constructor() {
        this.secretNumber = null;
        this.attempts = 0;
        this.bestScore = localStorage.getItem('guessGameBestScore') || null;
        
        // DOM элементы
        this.guessInput = document.getElementById('guessInput');
        this.guessBtn = document.getElementById('guessBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.attemptsSpan = document.getElementById('attempts');
        this.bestScoreSpan = document.getElementById('bestScore');
        this.gameMessage = document.getElementById('gameMessage');
        
        this.init();
    }
    
    init() {
        this.updateBestScoreDisplay();
        this.newGame();
        this.attachEvents();
    }
    
    attachEvents() {
        if (this.guessBtn) {
            this.guessBtn.addEventListener('click', () => this.checkGuess());
        }
        
        if (this.newGameBtn) {
            this.newGameBtn.addEventListener('click', () => this.newGame());
        }
        
        if (this.guessInput) {
            this.guessInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkGuess();
                }
            });
        }
    }
    
    updateBestScoreDisplay() {
        if (this.bestScoreSpan) {
            if (this.bestScore) {
                this.bestScoreSpan.textContent = this.bestScore;
            } else {
                this.bestScoreSpan.textContent = '—';
            }
        }
    }
    
    showMessage(text, type) {
        if (this.gameMessage) {
            this.gameMessage.textContent = text;
            this.gameMessage.className = `game-message ${type}`;
            
            setTimeout(() => {
                if (this.gameMessage.className === `game-message ${type}`) {
                    this.gameMessage.classList.remove(type);
                    this.gameMessage.textContent = '';
                }
            }, 3000);
        }
    }
    
    newGame() {
        this.secretNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        
        if (this.attemptsSpan) {
            this.attemptsSpan.textContent = this.attempts;
        }
        
        if (this.guessInput) {
            this.guessInput.value = '';
            this.guessInput.disabled = false;
            this.guessInput.focus();
        }
        
        if (this.guessBtn) {
            this.guessBtn.disabled = false;
        }
        
        this.showMessage('Новая игра! Я загадал число от 1 до 100. Попробуй угадать!', 'info');
        
        // Для отладки (можно убрать)
        console.log(`[DEBUG] Загаданное число: ${this.secretNumber}`);
    }
    
    checkGuess() {
        if (!this.secretNumber) {
            this.newGame();
            return;
        }
        
        const input = this.guessInput.value.trim();
        
        if (!input) {
            this.showMessage('Введи число!', 'error');
            return;
        }
        
        const guess = parseInt(input);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showMessage('Введи число от 1 до 100!', 'error');
            return;
        }
        
        this.attempts++;
        
        if (this.attemptsSpan) {
            this.attemptsSpan.textContent = this.attempts;
        }
        
        if (guess === this.secretNumber) {
            // Победа!
            this.showMessage(`🎉 Поздравляю! Ты угадал число ${this.secretNumber} за ${this.attempts} попыток! 🎉`, 'success');
            
            if (this.guessInput) this.guessInput.disabled = true;
            if (this.guessBtn) this.guessBtn.disabled = true;
            
            // Обновляем лучший результат
            if (!this.bestScore || this.attempts < this.bestScore) {
                this.bestScore = this.attempts;
                localStorage.setItem('guessGameBestScore', this.bestScore);
                this.updateBestScoreDisplay();
                this.showMessage(`🏆 Новый рекорд! ${this.attempts} попыток! 🏆`, 'success');
            }
            
            // Эффект конфетти
            this.createConfetti();
            
        } else if (guess < this.secretNumber) {
            this.showMessage(`📈 Число ${guess} — МАЛЕНЬКОЕ! Попробуй ещё.`, 'info');
            if (this.guessInput) {
                this.guessInput.value = '';
                this.guessInput.focus();
            }
        } else {
            this.showMessage(`📉 Число ${guess} — БОЛЬШОЕ! Попробуй ещё.`, 'info');
            if (this.guessInput) {
                this.guessInput.value = '';
                this.guessInput.focus();
            }
        }
    }
    
    createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'guess-confetti';
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: hsl(${Math.random() * 360}, 100%, 60%);
                position: absolute;
                animation: guessConfettiFall ${Math.random() * 2 + 2}s linear forwards;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
}

// Добавляем стили для конфетти
const guessGameStyle = document.createElement('style');
guessGameStyle.textContent = `
    @keyframes guessConfettiFall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(guessGameStyle);

// Запускаем игру после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.guessGame = new GuessGame();
});