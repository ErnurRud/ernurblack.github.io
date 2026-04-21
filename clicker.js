// ========== КЛИКЕР ИГРА ==========
class DarkClicker {
    constructor() {
        // Состояние игры
        this.energy = 0;
        this.totalClicks = 0;
        this.energyPerSecond = 0;
        
        // Апгрейды
        this.upgrades = [
            {
                id: 'shadow',
                name: 'Теневой слуга',
                desc: 'Даёт +1 энергию в секунду',
                icon: 'fas fa-ghost',
                basePrice: 10,
                price: 10,
                count: 0,
                eps: 1,
                multiplier: 1.5
            },
            {
                id: 'vampire',
                name: 'Вампир',
                desc: 'Даёт +5 энергии в секунду',
                icon: 'fas fa-fang',
                basePrice: 50,
                price: 50,
                count: 0,
                eps: 5,
                multiplier: 1.6
            },
            {
                id: 'lich',
                name: 'Лич',
                desc: 'Даёт +25 энергии в секунду',
                icon: 'fas fa-skull',
                basePrice: 250,
                price: 250,
                count: 0,
                eps: 25,
                multiplier: 1.7
            },
            {
                id: 'dragon',
                name: 'Тёмный дракон',
                desc: 'Даёт +100 энергии в секунду',
                icon: 'fas fa-dragon',
                basePrice: 1000,
                price: 1000,
                count: 0,
                eps: 100,
                multiplier: 1.8
            },
            {
                id: 'god',
                name: 'Повелитель тьмы',
                desc: 'Даёт +500 энергии в секунду',
                icon: 'fas fa-crown',
                basePrice: 5000,
                price: 5000,
                count: 0,
                eps: 500,
                multiplier: 2.0
            }
        ];
        
        // DOM элементы
        this.energyEl = document.getElementById('darkEnergy');
        this.energyPerSecEl = document.getElementById('energyPerSec');
        this.totalClicksEl = document.getElementById('totalClicks');
        this.clickBtn = document.getElementById('clickBtn');
        this.upgradesGrid = document.getElementById('upgradesGrid');
        
        // Интервал для пассивного дохода
        this.interval = null;
        
        this.init();
    }
    
    init() {
        this.loadGame();
        this.renderUpgrades();
        this.startPassiveIncome();
        this.attachEvents();
        
        // Сохраняем при обновлении страницы (перед выгрузкой)
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
        
        // Сохраняем каждые 5 секунд (на случай аварийного закрытия)
        setInterval(() => {
            this.saveGame();
        }, 5000);
    }
    
    attachEvents() {
        if (this.clickBtn) {
            this.clickBtn.addEventListener('click', () => this.handleClick());
        }
    }
    
    handleClick() {
        this.addEnergy(1);
        this.totalClicks++;
        this.updateTotalClicks();
        this.saveGame();
        this.addClickAnimation();
    }
    
    addEnergy(amount) {
        this.energy += amount;
        this.updateEnergyDisplay();
        this.checkUpgradeAvailability();
    }
    
    updateEnergyDisplay() {
        if (this.energyEl) {
            this.energyEl.textContent = Math.floor(this.energy);
            this.energyEl.classList.add('count-animation');
            setTimeout(() => {
                this.energyEl.classList.remove('count-animation');
            }, 300);
        }
    }
    
    updateTotalClicks() {
        if (this.totalClicksEl) {
            this.totalClicksEl.textContent = this.totalClicks;
        }
    }
    
    updateEnergyPerSec() {
        this.energyPerSecond = this.upgrades.reduce((sum, u) => sum + (u.eps * u.count), 0);
        if (this.energyPerSecEl) {
            this.energyPerSecEl.textContent = this.energyPerSecond;
        }
    }
    
    addClickAnimation() {
        if (this.clickBtn) {
            const glow = this.clickBtn.querySelector('.btn-glow');
            if (glow) {
                glow.style.animation = 'none';
                setTimeout(() => {
                    glow.style.animation = 'pulse 0.3s ease-out';
                }, 10);
            }
        }
    }
    
    buyUpgrade(upgrade) {
        if (this.energy >= upgrade.price) {
            this.energy -= upgrade.price;
            upgrade.count++;
            upgrade.price = Math.floor(upgrade.basePrice * Math.pow(upgrade.multiplier, upgrade.count));
            
            this.updateEnergyDisplay();
            this.updateEnergyPerSec();
            this.renderUpgrades();
            this.saveGame();
            
            // Анимация покупки
            this.showNotification(`Куплен ${upgrade.name}! +${upgrade.eps} EPS`, 'success');
        } else {
            this.showNotification(`Не хватает ${Math.floor(upgrade.price - this.energy)} тёмной энергии!`, 'error');
        }
    }
    
    checkUpgradeAvailability() {
        const upgradeCards = document.querySelectorAll('.upgrade-card');
        this.upgrades.forEach((upgrade, index) => {
            if (upgradeCards[index]) {
                if (this.energy >= upgrade.price) {
                    upgradeCards[index].classList.remove('disabled');
                } else {
                    upgradeCards[index].classList.add('disabled');
                }
            }
        });
    }
    
    renderUpgrades() {
        if (!this.upgradesGrid) return;
        
        this.upgradesGrid.innerHTML = '';
        this.upgrades.forEach((upgrade, index) => {
            const card = document.createElement('div');
            card.className = `upgrade-card ${this.energy >= upgrade.price ? '' : 'disabled'}`;
            card.innerHTML = `
                <div class="upgrade-icon">
                    <i class="${upgrade.icon}"></i>
                </div>
                <div class="upgrade-info">
                    <div class="upgrade-name">${upgrade.name}</div>
                    <div class="upgrade-desc">${upgrade.desc}</div>
                    <div class="upgrade-stats">
                        <span>📦 ${upgrade.count}</span>
                        <span>⚡ ${upgrade.eps * upgrade.count} EPS</span>
                    </div>
                </div>
                <div class="upgrade-price">
                    <div class="price-value">${Math.floor(upgrade.price)}</div>
                    <div class="price-label">тёмной энергии</div>
                </div>
            `;
            
            card.addEventListener('click', () => this.buyUpgrade(upgrade));
            this.upgradesGrid.appendChild(card);
        });
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)'};
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    startPassiveIncome() {
        if (this.interval) clearInterval(this.interval);
        
        this.interval = setInterval(() => {
            if (this.energyPerSecond > 0) {
                this.addEnergy(this.energyPerSecond);
                this.saveGame(); // Сохраняем после пассивного дохода
            }
        }, 1000);
    }
    
    saveGame() {
        // Используем sessionStorage (сохраняется только при обновлении, но не при закрытии)
        const saveData = {
            energy: this.energy,
            totalClicks: this.totalClicks,
            upgrades: this.upgrades.map(u => ({
                count: u.count,
                price: u.price
            }))
        };
        sessionStorage.setItem('darkClickerSave', JSON.stringify(saveData));
    }
    
    loadGame() {
        const saveData = sessionStorage.getItem('darkClickerSave');
        
        if (saveData) {
            // Загружаем сохранение
            const data = JSON.parse(saveData);
            this.energy = data.energy || 0;
            this.totalClicks = data.totalClicks || 0;
            
            if (data.upgrades) {
                this.upgrades.forEach((upgrade, index) => {
                    if (data.upgrades[index]) {
                        upgrade.count = data.upgrades[index].count;
                        upgrade.price = data.upgrades[index].price;
                    }
                });
            }
            
            this.updateTotalClicks();
            this.updateEnergyDisplay();
            this.updateEnergyPerSec();
            
            console.log('💾 Прогресс загружен (из sessionStorage)');
        } else {
            // Нет сохранения — начинаем новую игру
            this.resetGame();
            console.log('🆕 Новая игра (нет сохранения в sessionStorage)');
        }
    }
    
    resetGame() {
        this.energy = 0;
        this.totalClicks = 0;
        
        this.upgrades.forEach(upgrade => {
            upgrade.count = 0;
            upgrade.price = upgrade.basePrice;
        });
        
        this.updateEnergyPerSec();
        this.updateTotalClicks();
        this.updateEnergyDisplay();
        this.renderUpgrades();
        
        // Удаляем сохранение
        sessionStorage.removeItem('darkClickerSave');
        
        ;
    }
}

// Добавляем стили для анимаций уведомлений
const clickerStyle = document.createElement('style');
clickerStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes countUp {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.1);
            color: #ffd700;
        }
    }
    
    .count-animation {
        animation: countUp 0.3s ease-out;
    }
`;
document.head.appendChild(clickerStyle);

// Запускаем игру после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.darkClicker = new DarkClicker();
});