// ========== ЛОАДЕР ==========
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('hide');
    }, 1500);
});

// ========== КАСТОМНЫЙ КУРСОР ==========
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const modal = document.getElementById('secretModal');

function hideCustomCursor() {
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
}

function showCustomCursor() {
    if (cursor) cursor.style.display = 'block';
    if (cursorFollower) cursorFollower.style.display = 'block';
}

// Проверяем, открыто ли модальное окно
function checkModalState() {
    if (modal && modal.classList.contains('show')) {
        hideCustomCursor();
    } else {
        showCustomCursor();
    }
}

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        // Двигаем курсор только если он видим
        if (cursor.style.display !== 'none') {
            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        }
    });
    
    document.querySelectorAll('a, button, .btn-primary, .btn-outline, .filter-btn, .project-link, .social-links a, .submit-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor.style.display !== 'none') {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.borderColor = '#c9a03d';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursor.style.display !== 'none') {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = 'rgba(201, 160, 61, 0.5)';
            }
        });
    });
}

// ========== ТИПИЗАЦИЯ ТЕКСТА ==========
const typedWords = ['Одинокий воин', 'Так одинок', 'Любитель игр', 'Тёмная душа'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.querySelector('.typed-text');

function typeEffect() {
    const currentWord = typedWords[wordIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typedWords.length;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

if (typedTextElement) {
    typeEffect();
}

// ========== АКТИВНАЯ НАВИГАЦИЯ ПРИ СКРОЛЛЕ ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== ПЛАВНАЯ ПРОКРУТКА ==========
document.querySelectorAll('.nav-link, .btn-primary, .btn-outline, .scroll-indicator').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ========== АНИМАЦИЯ НАВЫКОВ ПРИ СКРОЛЛЕ ==========
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated) return;
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = `${width}%`;
    });
    skillsAnimated = true;
}

const skillsSection = document.querySelector('#skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ==========
const fadeElements = document.querySelectorAll('.skill-card, .fact-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});

// ========== ФОРМА ОТПРАВКИ НА ПОЧТУ ==========
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            showFormNotification('Заполни все поля!', 'error');
            return;
        }
        
        // Отправляем данные через fetch
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showFormNotification('✅ Сообщение отправлено! Я отвечу тебе в ближайшее время.', 'success');
                contactForm.reset();
            } else {
                showFormNotification('❌ Ошибка отправки. Попробуй позже или напиши напрямую на почту.', 'error');
            }
        } catch (error) {
            showFormNotification('❌ Ошибка соединения. Проверь интернет.', 'error');
        }
    });
}

function showFormNotification(message, type) {
    // Создаём уведомление
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(46, 125, 50, 0.95)' : 'rgba(211, 47, 47, 0.95)'};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 0.9rem;
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Добавляем стили для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ========== МОБИЛЬНОЕ МЕНЮ ==========
const menuBtn = document.querySelector('.menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener('click', () => {
        if (navLinksContainer.style.display === 'flex') {
            navLinksContainer.style.display = 'none';
        } else {
            navLinksContainer.style.display = 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '70px';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.width = '100%';
            navLinksContainer.style.background = '#0a0a0a';
            navLinksContainer.style.padding = '2rem';
            navLinksContainer.style.gap = '1rem';
            navLinksContainer.style.textAlign = 'center';
        }
    });
}

// ========== ПАРАЛЛАКС ЭФФЕКТ ДЛЯ ОРБ ==========
window.addEventListener('scroll', () => {
    const orb1 = document.querySelector('.gradient-orb');
    const orb2 = document.querySelector('.gradient-orb2');
    if (orb1 && orb2) {
        const scrolled = window.scrollY;
        orb1.style.transform = `translate(${scrolled * 0.05}px, ${scrolled * 0.03}px)`;
        orb2.style.transform = `translate(${-scrolled * 0.04}px, ${-scrolled * 0.02}px)`;
    }
});

// ========== ИЗМЕНЕНИЕ ЦВЕТА НАВИГАЦИИ ПРИ СКРОЛЛЕ ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.padding = '0.5rem 2rem';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.padding = '1rem 2rem';
    }
});

// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР ==========
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicText = document.querySelector('.music-text');
const musicIcon = musicToggle ? musicToggle.querySelector('i') : null;

// Проверяем, была ли музыка включена ранее
let isMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
let musicTime = localStorage.getItem('musicTime') || 0;

if (bgMusic) {
    // Восстанавливаем позицию музыки
    bgMusic.currentTime = parseFloat(musicTime);
    
    if (isMusicPlaying) {
        bgMusic.play().catch(e => console.log('Автовоспроизведение заблокировано'));
        if (musicToggle) musicToggle.classList.add('playing');
        if (musicText) musicText.textContent = 'Выключить музыку';
        if (musicIcon) musicIcon.className = 'fas fa-stop';
    }
    
    // Сохраняем время музыки при уходе со страницы
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('musicTime', bgMusic.currentTime);
        localStorage.setItem('musicPlaying', isMusicPlaying);
    });
    
    // Периодически сохраняем время
    setInterval(() => {
        if (isMusicPlaying) {
            localStorage.setItem('musicTime', bgMusic.currentTime);
        }
    }, 5000);
}

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => {
                console.log('Не удалось воспроизвести музыку');
                alert('Нажмите ещё раз, чтобы включить музыку');
            });
            musicToggle.classList.add('playing');
            if (musicText) musicText.textContent = 'Выключить музыку';
            if (musicIcon) musicIcon.className = 'fas fa-stop';
            isMusicPlaying = true;
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            if (musicText) musicText.textContent = 'Включить музыку';
            if (musicIcon) musicIcon.className = 'fas fa-music';
            isMusicPlaying = false;
        }
        localStorage.setItem('musicPlaying', isMusicPlaying);
    });
}

// Автовоспроизведение при взаимодействии с сайтом (для браузеров)
document.body.addEventListener('click', function initMusic() {
    if (isMusicPlaying && bgMusic && bgMusic.paused) {
        bgMusic.play().catch(e => console.log('still blocked'));
    }
    document.body.removeEventListener('click', initMusic);
}, { once: true });

// ========== АНИМИРОВАННЫЙ ФОН (ЗВЁЗДЫ, СНЕГ, ЧАСТИЦЫ) ==========
const canvas = document.getElementById('bgCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let stars = [];
    let snowflakes = [];

    // Настройки эффектов
    const PARTICLE_COUNT = 80;
    const STAR_COUNT = 150;
    const SNOW_COUNT = 60;

    // Класс для частиц
    class Particle {
        constructor(x, y, vx, vy, size, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
            this.color = color;
            this.alpha = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Класс для звезды
    class Star {
        constructor(x, y, size, brightness) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.brightness = brightness;
            this.twinkleSpeed = Math.random() * 0.03 + 0.01;
            this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        update() {
            this.brightness += this.twinkleSpeed * this.twinkleDirection;
            if (this.brightness > 1) {
                this.brightness = 1;
                this.twinkleDirection = -1;
            }
            if (this.brightness < 0.3) {
                this.brightness = 0.3;
                this.twinkleDirection = 1;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.brightness;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            if (Math.random() < 0.002) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - 10, this.y + 5);
                ctx.lineTo(this.x - 5, this.y + 10);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Класс для снежинки
    class Snowflake {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height;
            this.size = Math.random() * 4 + 2;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.wobble) * 0.2;
            this.wobble += 0.05;
            
            if (this.y > height) {
                this.reset();
            }
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60) * Math.PI / 180;
                const x2 = this.x + Math.cos(angle) * this.size * 1.5;
                const y2 = this.y + Math.sin(angle) * this.size * 1.5;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(x2, y2);
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }

    function initParticles() {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.3;
            const size = Math.random() * 3 + 1;
            const colors = ['#c9a03d', '#ffd700', '#8b0000', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, vx, vy, size, color));
        }
    }

    function initStars() {
        for (let i = 0; i < STAR_COUNT; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2 + 0.5;
            const brightness = Math.random() * 0.7 + 0.3;
            stars.push(new Star(x, y, size, brightness));
        }
    }

    function initSnow() {
        for (let i = 0; i < SNOW_COUNT; i++) {
            snowflakes.push(new Snowflake());
        }
    }

    function animate() {
        if (!ctx) return;
        
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        
        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        particles = [];
        stars = [];
        snowflakes = [];
        initParticles();
        initStars();
        initSnow();
    }

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);
}

// ========== СЕКРЕТНАЯ СТРАНИЦА (ПАСХАЛКА) ==========
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let userInput = [];
const secretModal = document.getElementById('secretModal');
const closeSecretModal = document.getElementById('closeModal');

// Функция для создания конфетти
function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Функция показа секретного окна
function showSecret() {
    if (secretModal) {
        secretModal.classList.add('show');
        createConfetti();
        hideCustomCursor(); // Скрываем кастомный курсор
    }
}

// Функция закрытия секретного окна
function hideSecret() {
    if (secretModal) {
        secretModal.classList.remove('show');
        showCustomCursor(); // Показываем курсор обратно
    }
}

// Закрытие по кнопке
if (closeSecretModal) {
    closeSecretModal.addEventListener('click', hideSecret);
}

// Закрытие по клику вне окна
window.addEventListener('click', (e) => {
    if (e.target === secretModal) {
        hideSecret();
    }
});

// Наблюдатель за модальным окном (для курсора)
if (secretModal) {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                checkModalState();
            }
        });
    });
    observer.observe(secretModal, { attributes: true });
    checkModalState();
}

// Отслеживание комбинации клавиш
document.addEventListener('keydown', (e) => {
    userInput.push(e.code);
    
    if (userInput.length > secretCode.length) {
        userInput.shift();
    }
    
    let isMatch = true;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== secretCode[i]) {
            isMatch = false;
            break;
        }
    }
    
    if (isMatch && userInput.length === secretCode.length) {
        showSecret();
        userInput = [];
    }
    
    if (e.code === 'F12') {
        console.log('%c💀 Ты нашёл консоль... Попробуй ввести секретную комбинацию клавиш...', 'color: #c9a03d; font-size: 14px');
        console.log('%cПодсказка: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #ff6699; font-size: 12px');
    }
});

// Двойной клик по заголовку
const secretHeroTitle = document.querySelector('.glitch-title');
if (secretHeroTitle) {
    secretHeroTitle.addEventListener('dblclick', () => {
        showSecret();
    });
}

// Выводим подсказку в консоль при загрузке
console.log('%c🔐 На сайте есть секрет! Попробуй найти его...', 'color: #c9a03d; font-size: 16px');
console.log('%cПодсказка в консоли не поможет... Попробуй нажать определённую комбинацию клавиш 😉', 'color: #888; font-size: 12px');

// ========== АНИМИРОВАННЫЙ СКЕЛЕТ НА CANVAS ==========
const skeletonCanvas = document.getElementById('skeletonCanvas');
if (skeletonCanvas) {
    const ctx = skeletonCanvas.getContext('2d');
    let angle = 0;
    let glowIntensity = 0;
    let glowDirection = 1;
    
    function drawSkeleton() {
        ctx.clearRect(0, 0, 200, 200);
        
        // Обновляем интенсивность свечения для пульсации
        glowIntensity += 0.02 * glowDirection;
        if (glowIntensity > 1) {
            glowIntensity = 1;
            glowDirection = -1;
        } else if (glowIntensity < 0.3) {
            glowIntensity = 0.3;
            glowDirection = 1;
        }
        
        const glow = 5 + glowIntensity * 15;
        
        ctx.save();
        ctx.shadowBlur = glow;
        ctx.shadowColor = '#c9a03d';
        
        // === ЧЕРЕП ===
        ctx.fillStyle = '#c9a03d';
        ctx.beginPath();
        ctx.ellipse(100, 55, 28, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Глазницы
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.ellipse(82, 50, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(118, 50, 7, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Свечение в глазах (анимированное)
        ctx.fillStyle = `rgba(201, 160, 61, ${0.3 + Math.sin(angle * 3) * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(82, 50, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(118, 50, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Нос
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.moveTo(100, 62);
        ctx.lineTo(96, 70);
        ctx.lineTo(104, 70);
        ctx.fill();
        
        // Улыбка (анимированная)
        const smileAngle = Math.sin(angle) * 0.1;
        ctx.beginPath();
        ctx.arc(100, 78, 12, 0.1 + smileAngle, Math.PI - 0.1 - smileAngle);
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        
        // === ПОЗВОНОЧНИК ===
        ctx.beginPath();
        ctx.moveTo(100, 87);
        ctx.lineTo(100, 130);
        ctx.strokeStyle = '#c9a03d';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Позвонки (кружочки)
        for (let i = 0; i < 5; i++) {
            const y = 92 + i * 9;
            ctx.beginPath();
            ctx.arc(100, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#c9a03d';
            ctx.fill();
        }
        
        // === РЁБРА (анимированные) ===
        const ribAngle = Math.sin(angle) * 0.4;
        for (let i = 0; i < 4; i++) {
            const y = 95 + i * 8;
            
            // Левое ребро
            ctx.beginPath();
            ctx.moveTo(100, y);
            ctx.quadraticCurveTo(78 + Math.sin(angle + i) * 6, y - 2, 65, y + 2);
            ctx.stroke();
            
            // Правое ребро
            ctx.beginPath();
            ctx.moveTo(100, y);
            ctx.quadraticCurveTo(122 - Math.sin(angle + i) * 6, y - 2, 135, y + 2);
            ctx.stroke();
        }
        
        // === РУКИ (анимированные) ===
        const armAngle = Math.sin(angle) * 0.6;
        
        // Левая рука
        ctx.beginPath();
        ctx.moveTo(65, 98);
        ctx.lineTo(48 + armAngle * 12, 118);
        ctx.lineTo(38 + armAngle * 8, 138);
        ctx.lineTo(32 + armAngle * 5, 148);
        ctx.stroke();
        
        // Кисть левой руки
        ctx.beginPath();
        ctx.arc(32 + armAngle * 5, 148, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Правая рука
        ctx.beginPath();
        ctx.moveTo(135, 98);
        ctx.lineTo(152 - armAngle * 12, 118);
        ctx.lineTo(162 - armAngle * 8, 138);
        ctx.lineTo(168 - armAngle * 5, 148);
        ctx.stroke();
        
        // Кисть правой руки
        ctx.beginPath();
        ctx.arc(168 - armAngle * 5, 148, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // === НОГИ (анимированные) ===
        const legAngle = Math.sin(angle + 1) * 0.4;
        
        // Левая нога
        ctx.beginPath();
        ctx.moveTo(100, 130);
        ctx.lineTo(78 + legAngle * 8, 162);
        ctx.lineTo(72 + legAngle * 6, 182);
        ctx.lineTo(70 + legAngle * 4, 192);
        ctx.stroke();
        
        // Ступня левой ноги
        ctx.beginPath();
        ctx.moveTo(70 + legAngle * 4, 192);
        ctx.lineTo(60 + legAngle * 6, 195);
        ctx.lineTo(55 + legAngle * 4, 192);
        ctx.stroke();
        
        // Правая нога
        ctx.beginPath();
        ctx.moveTo(100, 130);
        ctx.lineTo(122 - legAngle * 8, 162);
        ctx.lineTo(128 - legAngle * 6, 182);
        ctx.lineTo(130 - legAngle * 4, 192);
        ctx.stroke();
        
        // Ступня правой ноги
        ctx.beginPath();
        ctx.moveTo(130 - legAngle * 4, 192);
        ctx.lineTo(140 - legAngle * 6, 195);
        ctx.lineTo(145 - legAngle * 4, 192);
        ctx.stroke();
        
        // === ТАЗОБЕДРЕННЫЕ КОСТИ ===
        ctx.beginPath();
        ctx.ellipse(85, 133, 8, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(115, 133, 8, 5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        angle += 0.04;
        requestAnimationFrame(drawSkeleton);
    }
    
    drawSkeleton();
    
    // Добавляем эффект при наведении на секцию
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutSection.addEventListener('mouseenter', () => {
            skeletonCanvas.style.transform = 'scale(1.02)';
        });
        aboutSection.addEventListener('mouseleave', () => {
            skeletonCanvas.style.transform = 'scale(1)';
        });
    }
}

// ========== АНИМАЦИЯ ЛОГОТИПА (УЛЕТАЕМ НАВЕРХ) ==========
const logo = document.querySelector('.logo');
const logoText = document.querySelector('.logo-text');

if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Добавляем класс для анимации
        logo.classList.add('logo-fly');
        
        // Создаём эффект частиц при клике
        createLogoParticles(e.clientX, e.clientY);
        
        // Плавно скроллим наверх
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Убираем класс анимации через 1 секунду
        setTimeout(() => {
            logo.classList.remove('logo-fly');
        }, 1000);
    });
}

function createLogoParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'logo-particle';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${Math.random() * 8 + 2}px;
            height: ${Math.random() * 8 + 2}px;
            background: radial-gradient(circle, #c9a03d, #ffd700);
            border-radius: 50%;
            pointer-events: none;
            z-index: 20000;
            animation: particleFly ${Math.random() * 0.8 + 0.5}s ease-out forwards;
            box-shadow: 0 0 5px rgba(201, 160, 61, 0.8);
        `;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 150; // Улетают вверх
        
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Добавьте в функцию клика по логотипу (опционально)
const clickSound = new Audio();
clickSound.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
clickSound.volume = 0.3;
clickSound.play().catch(e => console.log('Звук не воспроизведён'));