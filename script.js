
// ========================
// LANGUAGE TOGGLE
// ========================
function setLang(lang) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    localStorage.setItem('lang', lang);
}

const savedLang = localStorage.getItem('lang') || 'pt';
setLang(savedLang);

// ========================
// THEME TOGGLE
// ========================
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ========================
// INTERACTIVE GARDEN
// ========================
const gardenCanvas = document.getElementById('gardenCanvas');
const gardenSvg = document.getElementById('gardenSvg');

// Load saved flowers
let gardenFlowers = JSON.parse(localStorage.getItem('gardenFlowers') || '[]');

function drawFlower(x, y, size, type) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x}, ${y})`);

    const colors = ['var(--accent)', 'var(--accent2)', 'var(--border)', 'var(--accent3)'];
    const petalColor = colors[type % colors.length];
    const centerColor = colors[(type + 2) % colors.length];

    const petalCount = [4, 5, 6][type % 3];
    for (let i = 0; i < petalCount; i++) {
    const angle = (360 / petalCount) * i;
    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const dist = size * 1.4;
    const rad = (angle * Math.PI) / 180;
    petal.setAttribute('cx', Math.round(Math.cos(rad) * dist));
    petal.setAttribute('cy', Math.round(Math.sin(rad) * dist));
    petal.setAttribute('rx', Math.round(size * 0.55));
    petal.setAttribute('ry', Math.round(size * 0.9));
    petal.setAttribute('fill', petalColor);
    petal.setAttribute('opacity', '0.8');
    petal.setAttribute('transform', `rotate(${angle} ${Math.round(Math.cos(rad) * dist)} ${Math.round(Math.sin(rad) * dist)})`);
    g.appendChild(petal);
    }

    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('cx', 0);
    center.setAttribute('cy', 0);
    center.setAttribute('r', Math.round(size * 0.7));
    center.setAttribute('fill', centerColor);
    g.appendChild(center);

    // Stem
    const stem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const svgRect = gardenSvg.getBoundingClientRect();
    const groundY = svgRect.height;
    stem.setAttribute('x1', 0);
    stem.setAttribute('y1', size);
    stem.setAttribute('x2', Math.round((Math.random() - 0.5) * 10));
    stem.setAttribute('y2', 260);
    stem.setAttribute('stroke', 'var(--border)');
    stem.setAttribute('stroke-width', '1');
    g.insertBefore(stem, g.firstChild);

    g.style.opacity = '0';
    g.style.transition = 'opacity 0.4s ease';
    gardenSvg.appendChild(g);
    requestAnimationFrame(() => { g.style.opacity = '1'; });
}

function renderAllFlowers() {
    gardenSvg.innerHTML = '';
    gardenFlowers.forEach(f => drawFlower(f.x, f.y, f.size, f.type));
}

renderAllFlowers();

gardenCanvas.addEventListener('click', (e) => {
    const rect = gardenCanvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top - 20);
    const size = 6 + Math.floor(Math.random() * 8);
    const type = Math.floor(Math.random() * 3);

    const flower = { x, y, size, type };
    gardenFlowers.push(flower);
    if (gardenFlowers.length > 60) gardenFlowers.shift();
    localStorage.setItem('gardenFlowers', JSON.stringify(gardenFlowers));
    drawFlower(x, y, size, type);
});

// ========================
// SCROLL REVEAL
// ========================
const observer = new IntersectionObserver(
    (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        }
    });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.card, .skill-chip, .contact-link').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
});

// ========================
// ACTIVE NAV
// ========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-center a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) link.style.color = 'var(--accent)';
    });
});