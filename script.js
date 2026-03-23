/* ============================================
   PORTFOLIO - JavaScript Interactions
   ============================================ */

// === Matrix Rain Effect (Cursor-Interactive) ===
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let mouseX = -9999;
let mouseY = -9999;
const CURSOR_RADIUS = 140;      // radius around cursor that lights up
const BASE_ALPHA = 0.04;      // how visible chars are away from cursor
const HOVER_ALPHA = 0.85;      // max alpha near cursor

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track mouse globally (canvas has pointer-events:none so use window)
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
});

// Touch support for mobile
window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
}, { passive: true });
window.addEventListener('touchend', () => {
    mouseX = -9999;
    mouseY = -9999;
}, { passive: true });

const matrixChars = '0123456789';
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

// Each column stores the y position of its brightest (head) character
function drawMatrix() {
    // Semi-transparent overlay to fade old characters
    ctx.fillStyle = 'rgba(10, 14, 23, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "Fira Code", monospace`;

    for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Distance from cursor to this character
        const dx = x - mouseX;
        const dy = y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha;
        if (dist < CURSOR_RADIUS) {
            // Smoothstep from HOVER_ALPHA at centre → BASE_ALPHA at edge
            const t = dist / CURSOR_RADIUS;
            const smoothstep = t * t * (3 - 2 * t);
            alpha = HOVER_ALPHA * (1 - smoothstep) + BASE_ALPHA * smoothstep;
        } else {
            // Randomise slightly so it feels alive even far away
            alpha = BASE_ALPHA + Math.random() * 0.02;
        }

        ctx.globalAlpha = alpha;

        // Head of column is bright white; tail is green
        if (drops[i] === Math.floor(drops[i])) {
            // Leading char – white highlight
            ctx.fillStyle = dist < CURSOR_RADIUS ? '#ffffff' : '#00ff41';
        } else {
            ctx.fillStyle = '#00ff41';
        }

        ctx.fillText(char, x, y);
        ctx.globalAlpha = 1;

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 80);

window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
});

// === Cursor Glow Spotlight (DOM overlay) ===
const spotlight = document.createElement('div');
spotlight.id = 'cursorSpotlight';
document.body.appendChild(spotlight);

document.addEventListener('mousemove', (e) => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
    spotlight.style.opacity = '1';
});
document.addEventListener('mouseleave', () => {
    spotlight.style.opacity = '0';
});

// === Typing Effect ===
const typingElement = document.getElementById('typingText');
const roles = [
    'Information Security Analyst',
    'VAPT Specialist',
    'Penetration Tester',
    'CTF Player',
    'Cryptography Enthusiast',
    'Linux Power User',
    'RHCSA Certified Professional'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    typingElement.style.borderRight = '2px solid #00ff41';

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}
typeEffect();

// === Navbar Scroll Effect ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// === Mobile Menu Toggle ===
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// === Smooth Scroll for Navigation ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// === Scroll Reveal Animation ===
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// === Active Nav Link Highlighting ===
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href') === `#${id}`) {
                    link.style.color = '#00ff41';
                }
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// === Parallax effect on hero ===
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
    }
});

// === Glitch effect on hover ===
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    glitchText.addEventListener('mouseenter', () => {
        glitchText.style.animation = 'none';
        void glitchText.offsetHeight;
        glitchText.style.animation = 'glitch-skew 0.3s linear 3';
    });
}

// === Console Easter Egg ===
console.log('%c ╔══════════════════════════════════════╗', 'color: #00ff41; font-family: monospace;');
console.log('%c ║  Aditya Bhatt\'s Portfolio            ║', 'color: #00ff41; font-family: monospace;');
console.log('%c ║  VAPT Specialist | Sec Analyst       ║', 'color: #00ff41; font-family: monospace;');
console.log('%c ║  RHCSA Trained | TryHackMe Top 5%   ║', 'color: #00ff41; font-family: monospace;');
console.log('%c ║  "Hack the Planet!" 🌍               ║', 'color: #00ff41; font-family: monospace;');
console.log('%c ╚══════════════════════════════════════╝', 'color: #00ff41; font-family: monospace;');

// === Certificate Lightbox ===
function openLightbox(src, caption) {
    const lightbox = document.getElementById('certLightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('certLightbox').classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// === Resume Download Button ===
const downloadBtn = document.getElementById('downloadResume');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Point to your CV file once uploaded to assets/cv/
        const cvPath = 'assets/cv/resume.pdf';
        const link = document.createElement('a');
        link.href = cvPath;
        link.download = 'Aditya_Bhatt_Resume.pdf';
        link.click();
    });
}
