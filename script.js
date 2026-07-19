// ── INTEL HIGH-PERFORMANCE 60FPS PARTICLE SYSTEMS ─────
const canvasBg = document.getElementById('cyberParticles');
const ctxBg = canvasBg.getContext('2d');
let particlesArray = [];

function fitCanvasToWindow() {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
}
window.addEventListener('resize', fitCanvasToWindow);
fitCanvasToWindow();

class CyberParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvasBg.width;
        this.y = Math.random() * canvasBg.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.4 ? '#00f0ff' : '#9d00ff';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvasBg.width || this.y < 0 || this.y > canvasBg.height) {
            this.reset();
        }
    }
    draw() {
        ctxBg.fillStyle = this.color;
        ctxBg.beginPath();
        ctxBg.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxBg.fill();
    }
}

function initParticleField() {
    particlesArray = [];
    const density = Math.min((window.innerWidth * window.innerHeight) / 9000, 80);
    for (let i = 0; i < density; i++) {
        particlesArray.push(new CyberParticle());
    }
}

function processParticleFrame() {
    ctxBg.clearRect(0, 0, canvasBg.width, canvasBg.height);
    // Render links between close particles for a premium cluster effect
    ctxBg.strokeStyle = 'rgba(0, 240, 255, 0.03)';
    ctxBg.lineWidth = 0.5;
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(processParticleFrame); // High efficiency 60FPS loop
}
initParticleField();
processParticleFrame();

// ── MODERN RIPPLE ENGINE WITH INTERACTION GLOW ────────
document.querySelectorAll('.action-trigger').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute; background: rgba(255, 255, 255, 0.25);
            width: 120px; height: 120px; border-radius: 50%;
            pointer-events: none; transform: translate(-50%, -50%) scale(0);
            left: ${x}px; top: ${y}px; animation: ripOut 0.55s ease-out;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const ripAnimStyle = document.createElement('style');
ripAnimStyle.innerHTML = `@keyframes ripOut { to { transform: translate(-50%, -50%) scale(3); opacity: 0; } }`;
document.head.appendChild(ripAnimStyle);

// ── FIXED CORE APPLICATION LOGIC (PERSISTENT LOGIC) ──
const CONFIG = {
    canvas:   { width: 1920, height: 3416 },
    username: {
        a: 2650,       
        b: 2790,       
        c: 727,        
        d: 1319,       
        centerX: 1009, 
        fontSize: 85,
        maxChars: 20,
    }
};

const FONT_URL = '/asset/fonts/TeutonNormal.otf';
let fontLoaded = false;

// DOM Linkage[span_4](start_span)[span_4](end_span)
const lobbySelect    = document.getElementById('lobbySelect');
const generateBtn    = document.getElementById('generateBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingSub     = document.getElementById('loadingSub');
const resultSection  = document.getElementById('resultSection');
const downloadBtn    = document.getElementById('downloadBtn');
const newBtn         = document.getElementById('newBtn');
const usernameInput  = document.getElementById('username');
const errorMessage   = document.getElementById('errorMessage');
const errorText      = document.getElementById('errorText');
const notification   = document.getElementById('notification');
const resultCanvas   = document.getElementById('resultCanvas');

// Populating Select matrix[span_5](start_span)[span_5](end_span)
for (let i = 1; i <= 30; i++) {
    const o = document.createElement('option');
    o.value = i; o.textContent = `SECTOR // LOBBY_${String(i).padStart(2, '0')}`;
    lobbySelect.appendChild(o);
}

function checkInput() {
    generateBtn.disabled = usernameInput.value.trim().length === 0;
}
usernameInput.addEventListener('input', checkInput);
checkInput();

async function loadFont() {
    if (fontLoaded) return;
    loadingSub.textContent = 'Decrypting vector typography...';
    try {
        const font = new FontFace('TeutonNormal', `url(${FONT_URL})`);
        const loaded = await font.load();
        document.fonts.add(loaded);
        fontLoaded = true;
    } catch (err) {
        console.warn('System typeface critical error, falling back to System Sans.');
    }
}

function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload  = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to cache segment map: ' + src));
        img.src = src;
    });
}

function drawGradientUsername(ctx, username, cfg) {
    const { a, b, c, d, fontSize, maxChars, centerX } = cfg;
    const name = String(username || 'Player').slice(0, maxChars);
    const boxW = d - c;
    const boxH = b - a;
    const cx   = centerX ?? (c + boxW / 2);

    let size = fontSize;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    while (size > 12) {
        ctx.font = `${size}px TeutonNormal, Orbitron, sans-serif`;
        if (ctx.measureText(name).width <= boxW) break;
        size -= 1;
    }

    ctx.font = `${size}px TeutonNormal, Orbitron, sans-serif`;
    const centerY = a + boxH / 2;
    const textW   = ctx.measureText(name).width;
    const gradX1  = cx - textW / 2;
    const gradX2  = cx + textW / 2;

    const grad = ctx.createLinearGradient(gradX1, centerY, gradX2, centerY);
    grad.addColorStop(0.00, '#FFFDE7');
    grad.addColorStop(0.35, '#FFE57F');
    grad.addColorStop(0.70, '#FFB300');
    grad.addColorStop(1.00, '#FF8F00');

    ctx.save();
    ctx.shadowColor   = 'rgba(0,0,0,0.95)';
    ctx.shadowBlur    = 16;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = grad;
    ctx.fillText(name, cx, centerY);
    ctx.restore();
}

async function generate() {
    const username = usernameInput.value.trim();
    let lobbyNum   = parseInt(lobbySelect.value);
    if (!lobbyNum || lobbyNum < 1) lobbyNum = Math.floor(Math.random() * 30) + 1;

    loadingOverlay.classList.add('active');
    errorMessage.classList.remove('active');
    generateBtn.disabled = true;

    try {
        await loadFont();
        loadingSub.textContent = `Injecting environment module [0${lobbyNum}]...`;
        const lobbyImg = await loadImg(`/asset/lobby/${lobbyNum}.jpg`);

        loadingSub.textContent = 'Mapping data coordinates...';
        const { width, height } = CONFIG.canvas;
        resultCanvas.width  = width;
        resultCanvas.height = height;

        const ctx = resultCanvas.getContext('2d');
        ctx.drawImage(lobbyImg, 0, 0, width, height);
        drawGradientUsername(ctx, username, CONFIG.username);

        loadingOverlay.classList.remove('active');
        resultSection.classList.add('active');
        showNotification();
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch(err) {
        loadingOverlay.classList.remove('active');
        showError(err.message);
        console.error(err);
    } finally {
        checkInput();
    }
}

function showNotification() {
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 4000);
}

function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.add('active');
    setTimeout(() => errorMessage.classList.remove('active'), 6000);
}

generateBtn.addEventListener('click', generate);

downloadBtn.addEventListener('click', () => {
    const url = resultCanvas.toDataURL('image/jpeg', 1.0);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = `cyber-lobby-${usernameInput.value.trim()}-${Date.now()}.jpg`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
});

newBtn.addEventListener('click', () => {
    resultSection.classList.remove('active');
    usernameInput.value = '';
    checkInput();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !loadingOverlay.classList.contains('active') && !generateBtn.disabled) {
        generateBtn.click();
    }
});
