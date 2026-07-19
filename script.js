/**
 * XAERISOFT CHAT STUDIO ENGINE v2.1
 * UI/UX: Futuristik & Premium
 * Canvas Render: Original TikTok Template Restored
 */

// =============================================
// ORIGINAL CONFIG & ASSETS 
// =============================================
const TEMPLATE_URL = 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/qyzwa.png';

const FONT_ASSETS = [
  { name: 'PlusJakartaSans-Regular', url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Regular.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Medium',  url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Medium.ttf',  family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Bold',    url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Bold.ttf',    family: 'Plus Jakarta Sans' },
  { name: 'FontAwesome-Solid',       url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/fa-solid-900.ttf',            family: 'Font Awesome 6 Free' },
];

const MENU_ICONS = [
  { unicode: '\uf3e5', text: 'Balas',           color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan',         color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin',            color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan',      color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan',         color: '#ea4335' },
];

const config = {
  topPPX: 183, topPPY: 83, topPPRadius: 42,
  topNameX: 250, topNameY: 82, topNameSize: 34,
  chatPPX: 75, chatPPRadius: 38,
  textX: 175, textY: 962,
  bubbleWidth: 520, textSize: 30,
  bubbleBgColor: '#ffffff', textColor: '#161823',
};

// =============================================
// CACHE & DOM ELEMENTS
// =============================================
let templateImageCache = null;
let fontsLoaded = false;
let currentDataUrl = '';
let avatarDataUrl = null;

const DOM = {
    dropZone: document.getElementById('dropZone'),
    avatarFile: document.getElementById('avatarFile'),
    avatarThumb: document.getElementById('avatarThumb'),
    username: document.getElementById('username'),
    chatText: document.getElementById('chatText'),
    generateBtn: document.getElementById('generateBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    newBtn: document.getElementById('newBtn'),
    resultSection: document.getElementById('resultSection'),
    canvas: document.getElementById('canvasPreview'),
    errorMsg: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    loading: document.getElementById('loadingOverlay'),
    loadingSub: document.getElementById('loadingSub'),
    toast: document.getElementById('notification')
};

// =============================================
// DROP ZONE LOGIC (MODERNIZED)
// =============================================
DOM.dropZone.addEventListener('click', () => DOM.avatarFile.click());
DOM.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.add('active');
});
DOM.dropZone.addEventListener('dragleave', () => DOM.dropZone.classList.remove('active'));
DOM.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.remove('active');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadAvatarFile(file);
});
DOM.avatarFile.addEventListener('change', (e) => {
    if (e.target.files[0]) loadAvatarFile(e.target.files[0]);
});

function loadAvatarFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        avatarDataUrl = ev.target.result;
        DOM.avatarThumb.src = avatarDataUrl;
        DOM.avatarThumb.classList.add('show');
    };
    reader.readAsDataURL(file);
}

// =============================================
// ORIGINAL HELPERS RESTORED
// =============================================
function wrapText(ctx, text, maxWidth) {
    const words = text.split(/(\s+)/);
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if (!word) continue;
        if (word.trim() === '' && currentLine === '') continue;
        const testLine = currentLine + word;
        if (ctx.measureText(testLine).width > maxWidth) {
            if (currentLine !== '') {
                lines.push(currentLine.trimEnd());
                currentLine = word.trimStart();
            } else {
                lines.push(testLine);
                currentLine = '';
            }
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine.trim()) lines.push(currentLine.trimEnd());
    return lines;
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke = null, shadow = false) {
    ctx.save();
    if (shadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 12;
    }
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
    ctx.restore();
}

function drawCircleImage(ctx, img, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, cx-r, cy-r, r*2, r*2);
    ctx.restore();
}

function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadFonts() {
    if (fontsLoaded) return;
    for (const f of FONT_ASSETS) {
        if(DOM.loadingSub) DOM.loadingSub.textContent = `Memuat font ${f.name}...`;
        const font = new FontFace(f.family, `url(${f.url})`);
        const loaded = await font.load();
        document.fonts.add(loaded);
    }
    fontsLoaded = true;
}

// =============================================
// MAIN RENDER ENGINE
// =============================================
async function generate() {
    const username = DOM.username.value.trim() || 'Lutzz';
    const chatText = DOM.chatText.value.trim() || 'Just friend kok cemburu 😂😂';

    if (!chatText) { showError('Pesan chat tidak boleh kosong.'); return; }

    DOM.loading.classList.add('active');
    DOM.errorMsg.classList.remove('show');
    await new Promise(r => setTimeout(r, 50)); // Render tick

    try {
        await loadFonts();

        if (!templateImageCache) {
            if(DOM.loadingSub) DOM.loadingSub.textContent = 'Memuat template...';
            templateImageCache = await loadImg(TEMPLATE_URL);
        }

        if(DOM.loadingSub) DOM.loadingSub.textContent = 'Memuat avatar...';
        let avatarImage;
        if (avatarDataUrl) {
            avatarImage = await loadImg(avatarDataUrl);
        } else {
            avatarImage = await loadImg('https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@6b71d84a580f385bd7ee36402df5341ead4770a0/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg');
        }

        if(DOM.loadingSub) DOM.loadingSub.textContent = 'Rendering...';

        // Original Canvas dimensions & scaling
        const canvas = document.createElement('canvas');
        canvas.width  = 1080 * 2;
        canvas.height = 2280 * 2;
        const ctx = canvas.getContext('2d');

        ctx.scale(2, 2);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Draw Original Template
        ctx.clearRect(0, 0, 1080, 2280);
        ctx.drawImage(templateImageCache, 0, 0, 1080, 2280);

        // 2. Top profile picture
        drawCircleImage(ctx, avatarImage, config.topPPX, config.topPPY, config.topPPRadius);

        // 3. Username di header
        ctx.font = `bold ${config.topNameSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(username, config.topNameX, config.topNameY);

        // 4. Chat text wrap & calculations
        ctx.font = `500 ${config.textSize}px 'Plus Jakarta Sans', sans-serif`;
        const lines = wrapText(ctx, chatText, config.bubbleWidth - 52);
        const lineH = config.textSize * 1.45;

        let maxW = 0;
        for (const l of lines) {
            const w = ctx.measureText(l).width;
            if (w > maxW) maxW = w;
        }

        const padX = 30, padY = 24;
        const bubbleW = Math.max(maxW + padX*2, 180);
        const bubbleH = lines.length * lineH + padY*2;
        const bubbleX = config.textX - padX;
        const bubbleY = config.textY - padY;

        // 5. Chat avatar
        drawCircleImage(ctx, avatarImage, config.chatPPX, bubbleY + bubbleH/2, config.chatPPRadius);

        // 6. Bubble
        drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, config.bubbleBgColor);

        // 7. Chat text
        ctx.fillStyle = config.textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        lines.forEach((line, i) => {
            const lineY = config.textY + i * lineH + config.textSize / 2;
            ctx.fillText(line, config.textX, lineY);
        });

        // 8. Menu popup (Original Restored)
        const menuX = 90, menuY = bubbleY + bubbleH + 28;
        drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true);

        const itemH = 90, iconX = menuX + 60, labelX = menuX + 130;
        MENU_ICONS.forEach((item, i) => {
            const cy = menuY + 25 + i * itemH + itemH/2;
            ctx.fillStyle = item.color;
            ctx.font = `900 34px 'Font Awesome 6 Free'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.unicode, iconX, cy);
            ctx.font = `500 34px 'Plus Jakarta Sans', sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText(item.text, labelX, cy);
        });

        // Copy to display canvas (Responsive fix applied)
        currentDataUrl = canvas.toDataURL('image/png');
        DOM.canvas.src = currentDataUrl;
        
        const finalImg = new Image();
        finalImg.src = currentDataUrl;
        finalImg.style.width = '100%';
        finalImg.style.display = 'block';
        finalImg.style.borderRadius = '12px';
        
        const wrapper = DOM.canvas.parentNode;
        wrapper.innerHTML = ''; 
        wrapper.appendChild(finalImg);

        DOM.loading.classList.remove('active');
        DOM.resultSection.classList.add('show');
        showToast();
        
        setTimeout(() => {
            DOM.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch(err) {
        DOM.loading.classList.remove('active');
        showError('Gagal generate: ' + err.message);
        console.error(err);
    }
}

// =============================================
// UI ALERTS & LISTENERS
// =============================================
function showToast() {
    DOM.toast.classList.add('show');
    setTimeout(() => DOM.toast.classList.remove('show'), 4000);
}

function showError(msg) {
    DOM.errorText.textContent = msg;
    DOM.errorMsg.classList.add('show');
    setTimeout(() => DOM.errorMsg.classList.remove('show'), 5000);
}

DOM.generateBtn.addEventListener('click', generate);

DOM.downloadBtn.addEventListener('click', () => {
    if (!currentDataUrl) { showError('Tidak ada gambar'); return; }
    const a = document.createElement('a');
    a.href = currentDataUrl;
    a.download = `XAERISOFT-${Date.now()}.png`;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
});

DOM.newBtn.addEventListener('click', () => {
    DOM.resultSection.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement !== DOM.chatText
        && !DOM.loading.classList.contains('active')) DOM.generateBtn.click();
});
