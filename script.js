/**
 * XAERISOFT CHAT STUDIO ENGINE v3.5 (iOS Multi-Theme)
 * UI/UX: Futuristik & Premium
 * Platform: Dual Render Engine (TikTok & WhatsApp iOS)
 */

// =============================================
// CONFIG & ASSETS 
// =============================================
const TEMPLATE_URL = 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/qyzwa.png';

const FONT_ASSETS = [
  { name: 'PlusJakartaSans-Regular', url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Regular.ttf', family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Medium',  url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Medium.ttf',  family: 'Plus Jakarta Sans' },
  { name: 'PlusJakartaSans-Bold',    url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/PlusJakartaSans-Bold.ttf',    family: 'Plus Jakarta Sans' },
  { name: 'FontAwesome-Solid',       url: 'https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@main/ttqc/fa-solid-900.ttf',            family: 'Font Awesome 6 Free' },
];

// Konfigurasi TikTok
const TIKTOK_MENU = [
  { unicode: '\uf3e5', text: 'Balas',           color: '#000000' },
  { unicode: '\uf064', text: 'Teruskan',         color: '#000000' },
  { unicode: '\uf0c5', text: 'Salin',            color: '#000000' },
  { unicode: '\uf1ab', text: 'Terjemahkan',      color: '#000000' },
  { unicode: '\uf2ed', text: 'Hapus untuk saya', color: '#000000' },
  { unicode: '\uf024', text: 'Laporkan',         color: '#ea4335' },
];

const tkConfig = {
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
    platformSelect: document.getElementById('platformSelect'),
    themeSelect: document.getElementById('themeSelect'),
    themeWrapper: document.getElementById('themeWrapper'),
    usernameWrapper: document.getElementById('usernameWrapper'),
    avatarWrapper: document.getElementById('avatarWrapper'),
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
// UI LISTENERS & LOGIC
// =============================================
DOM.platformSelect.addEventListener('change', (e) => {
    if (e.target.value === 'whatsapp') {
        DOM.avatarWrapper.style.display = 'none';
        DOM.usernameWrapper.style.display = 'none';
        DOM.themeWrapper.style.display = 'block'; 
    } else {
        DOM.avatarWrapper.style.display = 'block';
        DOM.usernameWrapper.style.display = 'block';
        DOM.themeWrapper.style.display = 'none'; 
    }
});

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
// HELPERS
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
    const chatText = DOM.chatText.value.trim() || 'oy';
    const platform = DOM.platformSelect.value;
    const theme = DOM.themeSelect.value; 
    
    if (!chatText) { showError('Pesan chat tidak boleh kosong.'); return; }

    DOM.loading.classList.add('active');
    DOM.errorMsg.classList.remove('show');
    await new Promise(r => setTimeout(r, 50)); 

    try {
        await loadFonts();
        
        const canvas = document.createElement('canvas');
        canvas.width  = 1080 * 2;
        canvas.height = 2280 * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // CABANG LOGIKA: TIKTOK vs WHATSAPP
        if (platform === 'tiktok') {
            await renderTikTok(ctx, chatText);
        } else {
            await renderWhatsApp(ctx, chatText, theme);
        }

        // Output ke Layar
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
// ENGINE: RENDER TIKTOK
// =============================================
async function renderTikTok(ctx, chatText) {
    const username = DOM.username.value.trim() || 'Lutzz';
    
    if (!templateImageCache) {
        if(DOM.loadingSub) DOM.loadingSub.textContent = 'Memuat template TikTok...';
        templateImageCache = await loadImg(TEMPLATE_URL);
    }

    if(DOM.loadingSub) DOM.loadingSub.textContent = 'Memuat avatar...';
    let avatarImage;
    if (avatarDataUrl) {
        avatarImage = await loadImg(avatarDataUrl);
    } else {
        avatarImage = await loadImg('https://cdn.jsdelivr.net/gh/Ditzzx-vibecoder/Assets@6b71d84a580f385bd7ee36402df5341ead4770a0/Image/artworks-gWLRE6HyPH3DgVMG-ZFFxtg-t500x500.jpg');
    }

    if(DOM.loadingSub) DOM.loadingSub.textContent = 'Rendering TikTok...';

    ctx.clearRect(0, 0, 1080, 2280);
    ctx.drawImage(templateImageCache, 0, 0, 1080, 2280);

    drawCircleImage(ctx, avatarImage, tkConfig.topPPX, tkConfig.topPPY, tkConfig.topPPRadius);

    ctx.font = `bold ${tkConfig.topNameSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(username, tkConfig.topNameX, tkConfig.topNameY);

    ctx.font = `500 ${tkConfig.textSize}px 'Plus Jakarta Sans', sans-serif`;
    const lines = wrapText(ctx, chatText, tkConfig.bubbleWidth - 52);
    const lineH = tkConfig.textSize * 1.45;

    let maxW = 0;
    for (const l of lines) maxW = Math.max(maxW, ctx.measureText(l).width);

    const padX = 30, padY = 24;
    const bubbleW = Math.max(maxW + padX*2, 180);
    const bubbleH = lines.length * lineH + padY*2;
    const bubbleX = tkConfig.textX - padX;
    const bubbleY = tkConfig.textY - padY;

    drawCircleImage(ctx, avatarImage, tkConfig.chatPPX, bubbleY + bubbleH/2, tkConfig.chatPPRadius);
    drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 35, tkConfig.bubbleBgColor);

    ctx.fillStyle = tkConfig.textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    lines.forEach((line, i) => {
        const lineY = tkConfig.textY + i * lineH + tkConfig.textSize / 2;
        ctx.fillText(line, tkConfig.textX, lineY);
    });

    const menuX = 90, menuY = bubbleY + bubbleH + 28;
    drawRoundedRect(ctx, menuX, menuY, 565, 580, 40, '#ffffff', 'rgba(0,0,0,0.02)', true);

    const itemH = 90, iconX = menuX + 60, labelX = menuX + 130;
    TIKTOK_MENU.forEach((item, i) => {
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
}

// =============================================
// ENGINE: RENDER WHATSAPP DENGAN TEMA (UPDATED)
// =============================================
async function renderWhatsApp(ctx, chatText, theme) {
    if(DOM.loadingSub) DOM.loadingSub.textContent = 'Membangun Lingkungan iOS WA...';
    
    const iosFont = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif`;
    const emojiFont = `"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

    // Palet Warna Default
    let bg, menuBg, bubbleBg, textCol, separatorCol, timeCol, tickCol, plusBg, plusIcon, blurBgIn, blurBgOut, shadowCol;

    // SISTEM TEMA DINAMIS (KALIBRASI PERSIS GAMBAR)
    if (theme === 'dark') {
        bg = '#010101'; // Hitam pekat iOS
        menuBg = '#1F1F1F'; // Abu-abu gelap untuk menu
        bubbleBg = '#005C4B'; // Hijau khas WA Dark Mode
        textCol = '#FFFFFF';
        separatorCol = '#38383A';
        timeCol = '#8696A0';
        tickCol = '#53BDEB';
        plusBg = '#3A3A3C';
        plusIcon = '#A1A1A6';
        blurBgIn = '#1C1C1E'; // Bubble received (blur)
        blurBgOut = '#005C4B'; // Bubble sent (blur)
        shadowCol = 'rgba(0,0,0,0.6)'; // Shadow lebih tebal untuk dark mode
    } else if (theme === 'light') {
        bg = '#F2F2F6'; // Abu-abu terang background iOS
        menuBg = '#FFFFFF';
        bubbleBg = '#E0F6CA'; // Hijau terang WA Light
        textCol = '#000000';
        separatorCol = '#E5E5EA';
        timeCol = '#667781';
        tickCol = '#53BDEB';
        plusBg = '#E5E5EA';
        plusIcon = '#8E8E93';
        blurBgIn = '#FFFFFF';
        blurBgOut = '#E0F6CA';
        shadowCol = 'rgba(0,0,0,0.12)'; // Shadow lembut
    } else if (theme === 'pink') {
        bg = '#F2ECEB'; // Krem ke-pink-an lembut (seperti gambar)
        menuBg = '#FFFFFF';
        bubbleBg = '#FFC4D0'; // Merah muda bubble
        textCol = '#000000';
        separatorCol = '#E5E5EA';
        timeCol = '#8A6A71'; // Warna waktu abu-abu kemerahan
        tickCol = '#E5395E'; // Centang warna merah muda tegas
        plusBg = '#E5E5EA';
        plusIcon = '#8E8E93';
        blurBgIn = '#FFFFFF';
        blurBgOut = '#FFC4D0';
        shadowCol = 'rgba(0,0,0,0.12)'; // Shadow lembut
    }
    
    // Draw Background Layer
    ctx.clearRect(0, 0, 1080, 2280);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 2280);
    
    // Efek Fake Chat Blur (Disesuaikan posisinya agar mirip history chat)
    ctx.filter = 'blur(16px)';
    drawRoundedRect(ctx, 400, 350, 600, 160, 35, blurBgOut); 
    drawRoundedRect(ctx, 100, 550, 500, 140, 35, blurBgIn);  
    drawRoundedRect(ctx, 350, 750, 650, 200, 35, blurBgOut); 
    drawRoundedRect(ctx, 100, 1000, 750, 160, 35, blurBgIn); 
    ctx.filter = 'none';

    // Kalkulasi Text Bubble 
    ctx.font = `400 34px ${iosFont}`;
    const lines = wrapText(ctx, chatText, 600);
    const lineH = 48;
    let maxW = 50;
    for(let l of lines) maxW = Math.max(maxW, ctx.measureText(l).width);
    
    // Padding dan dimensi bubble
    const bubbleW = maxW + 160; 
    const bubbleH = lines.length * lineH + 50;
    const bubbleX = 1000 - bubbleW; 
    const bubbleY = 1250; 
    
    // Draw Bubble Chat (iOS Sudut Bawah Kanan)
    ctx.fillStyle = bubbleBg;
    ctx.beginPath();
    const r = 35;
    ctx.moveTo(bubbleX + r, bubbleY);
    ctx.lineTo(bubbleX + bubbleW - r, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + r);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - 6); 
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - 6, bubbleY + bubbleH);
    ctx.lineTo(bubbleX + r, bubbleY + bubbleH);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - r);
    ctx.lineTo(bubbleX, bubbleY + r);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + r, bubbleY);
    ctx.closePath();
    ctx.fill();
    
    // Draw Text Message
    ctx.fillStyle = textCol;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `400 34px ${iosFont}`;
    lines.forEach((line, i) => {
        ctx.fillText(line, bubbleX + 30, bubbleY + 22 + (i * lineH));
    });
    
    // Draw Timestamp
    ctx.font = `500 22px ${iosFont}`;
    ctx.fillStyle = timeCol;
    ctx.textAlign = 'right';
    const timeY = bubbleY + bubbleH - 32;
    ctx.fillText('22.39', bubbleX + bubbleW - 75, timeY + 2);
    
    // Draw Tick (Centang Biru / Merah)
    ctx.fillStyle = tickCol;
    ctx.font = `900 24px 'Font Awesome 6 Free'`;
    ctx.fillText('\uf560', bubbleX + bubbleW - 25, timeY);

    // =============================================
    // DRAW REACTION PILL (Gaya iOS Kompak)
    // =============================================
    const pillW = 550; 
    const pillH = 96;
    const pillX = bubbleX + bubbleW - pillW; 
    const pillY = bubbleY - pillH - 15;
    
    ctx.shadowColor = shadowCol;
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 15;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 48, menuBg);
    ctx.shadowColor = 'transparent';
    
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    ctx.font = `56px ${emojiFont}`; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const startX = pillX + 52;
    const spacing = 75;
    
    emojis.forEach((em, i) => {
        ctx.fillText(em, startX + (i * spacing), pillY + pillH/2 + 4);
    });
    
    // Tombol Plus (+) Apple Style
    const plusBtnX = startX + (6 * spacing) - 10;
    ctx.fillStyle = plusBg; 
    ctx.beginPath();
    ctx.arc(plusBtnX, pillY + pillH/2, 30, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = plusIcon; 
    ctx.font = `500 34px ${iosFont}`;
    ctx.fillText('+', plusBtnX, pillY + pillH/2 + 2);

    // =============================================
    // DRAW CONTEXT MENU
    // =============================================
    const waMenu = [
        { unicode: '\uf3e5', text: 'Balas',           color: textCol },
        { unicode: '\uf064', text: 'Teruskan',        color: textCol },
        { unicode: '\uf0c5', text: 'Salin',           color: textCol },
        { unicode: '\uf304', text: 'Edit',            color: textCol },
        { unicode: '\uf05a', text: 'Info',            color: textCol },
        { unicode: '\uf006', text: 'Beri bintang',    color: textCol },
        { unicode: '\uf2ed', text: 'Hapus',           color: '#FF3B30' }, 
    ];

    const menuW = 500;
    const itemH = 88;
    const menuH = waMenu.length * itemH;
    const menuX = bubbleX + bubbleW - menuW; 
    const menuY = bubbleY + bubbleH + 25;
    
    ctx.shadowColor = shadowCol;
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    drawRoundedRect(ctx, menuX, menuY, menuW, menuH, 32, menuBg);
    ctx.shadowColor = 'transparent';
    
    waMenu.forEach((item, i) => {
        const itemY = menuY + (i * itemH);
        
        ctx.fillStyle = item.color;
        ctx.font = `400 34px ${iosFont}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, menuX + 35, itemY + itemH/2);
        
        ctx.font = `900 30px 'Font Awesome 6 Free'`;
        ctx.textAlign = 'right';
        ctx.fillText(item.unicode, menuX + menuW - 35, itemY + itemH/2);
        
        // Garis Separator (Persis batas teks sampai ujung kanan)
        if (i < waMenu.length - 1) {
            ctx.fillStyle = separatorCol;
            ctx.fillRect(menuX + 35, itemY + itemH, menuW - 35, 1.5);
        }
    });
}

// =============================================
// GLOBAL LISTENERS
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
    
      // Format nama file dinamis sesuai pilihan
    let fileName = `XAERISOFT-${DOM.platformSelect.value.toUpperCase()}`;
    if (DOM.platformSelect.value === 'whatsapp') {
        fileName += `-${DOM.themeSelect.value.toUpperCase()}`;
    }
    fileName += `-${Date.now()}.png`;

    const a = document.createElement('a');
    a.href = currentDataUrl;
    a.download = fileName;
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