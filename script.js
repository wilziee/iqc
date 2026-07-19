/**
 * XAERISOFT CHAT STUDIO ENGINE v2.0
 * Completely Original Canvas Renderer
 * No external template images. 100% Programmatic Canvas drawing.
 */

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
    toast: document.getElementById('notification')
};

let avatarDataUrl = null;
let currentOutputUrl = null;

// Modern File Upload Handling
DOM.dropZone.addEventListener('click', () => DOM.avatarFile.click());
DOM.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.add('active');
});
DOM.dropZone.addEventListener('dragleave', () => DOM.dropZone.classList.remove('active'));
DOM.dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.dropZone.classList.remove('active');
    handleFile(e.dataTransfer.files[0]);
});
DOM.avatarFile.addEventListener('change', (e) => handleFile(e.target.files[0]));

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        showError('Format file ditolak. Gunakan format gambar.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarDataUrl = e.target.result;
        DOM.avatarThumb.src = avatarDataUrl;
        DOM.avatarThumb.classList.add('show');
    };
    reader.readAsDataURL(file);
}

function showError(msg) {
    DOM.errorText.textContent = msg;
    DOM.errorMsg.classList.add('show');
    setTimeout(() => DOM.errorMsg.classList.remove('show'), 4000);
}

function showToast() {
    DOM.toast.classList.add('show');
    setTimeout(() => DOM.toast.classList.remove('show'), 4000);
}

// -----------------------------------------------------------------
// ENGINE CANVAS: GLASSMORPHISM RENDERER (100% ORIGINAL)
// -----------------------------------------------------------------
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
}

async function renderCanvas() {
    const username = DOM.username.value.trim() || 'Anonymous';
    const text = DOM.chatText.value.trim();

    if (!text) return showError('Transmisi pesan tidak boleh kosong.');

    DOM.loading.classList.add('active');
    DOM.errorMsg.classList.remove('show');

    // Beri waktu browser untuk memunculkan loading screen
    await new Promise(r => setTimeout(r, 100));

    try {
        const canvas = document.createElement('canvas');
        // Resolusi Tinggi untuk hasil Premium (1080x1080 Square Post)
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        // 1. Draw Universe Background #050816 to #121A45
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#050816');
        bgGradient.addColorStop(1, '#121A45');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Premium Glowing Nebula
        const glow1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
        glow1.addColorStop(0, 'rgba(108, 99, 255, 0.4)');
        glow1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const glow2 = ctx.createRadialGradient(800, 800, 0, 800, 800, 700);
        glow2.addColorStop(0, 'rgba(0, 217, 255, 0.25)');
        glow2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines for Cyber feel
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;
        for(let i=0; i<canvas.width; i+=80) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // 3. Draw Glassmorphism Chat Bubble
        ctx.font = '500 42px "Inter", sans-serif';
        const maxWidth = 750;
        const lineHeight = 65;
        
        // Calculate bubble height dynamically based on text
        const words = text.split(' ');
        let testLine = '';
        let lineCount = 1;
        for(let n = 0; n < words.length; n++) {
            const temp = testLine + words[n] + ' ';
            if(ctx.measureText(temp).width > maxWidth && n > 0) {
                lineCount++; testLine = words[n] + ' ';
            } else { testLine = temp; }
        }

        const padding = 50;
        const bubbleW = 850;
        const bubbleH = (lineCount * lineHeight) + (padding * 2) + 120; // 120 for header space
        const bubbleX = (canvas.width - bubbleW) / 2;
        const bubbleY = (canvas.height - bubbleH) / 2;

        ctx.save();
        // Shadow for floating effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 20;

        // Glass Fill
        ctx.fillStyle = 'rgba(10, 16, 38, 0.6)'; // Translucent dark
        drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 30);
        ctx.fill();
        ctx.restore();

        // Border Glow
        ctx.lineWidth = 3;
        const borderGrad = ctx.createLinearGradient(bubbleX, bubbleY, bubbleX+bubbleW, bubbleY+bubbleH);
        borderGrad.addColorStop(0, 'rgba(0, 217, 255, 0.6)');
        borderGrad.addColorStop(1, 'rgba(108, 99, 255, 0.3)');
        ctx.strokeStyle = borderGrad;
        drawRoundedRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 30);
        ctx.stroke();

        // 4. Load & Draw Avatar
        let avatarImg = new Image();
        if (avatarDataUrl) {
            avatarImg.src = avatarDataUrl;
        } else {
            // Default Abstract Cyber Avatar generated dynamically if none provided
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 200; tempCanvas.height = 200;
            const tCtx = tempCanvas.getContext('2d');
            const g = tCtx.createLinearGradient(0,0,200,200);
            g.addColorStop(0, '#6C63FF'); g.addColorStop(1, '#00D9FF');
            tCtx.fillStyle = g; tCtx.fillRect(0,0,200,200);
            tCtx.fillStyle = '#fff'; tCtx.font = 'bold 80px Inter'; tCtx.textAlign = 'center'; tCtx.textBaseline = 'middle';
            tCtx.fillText(username.charAt(0).toUpperCase(), 100, 100);
            avatarImg.src = tempCanvas.toDataURL();
        }

        await new Promise((resolve) => { avatarImg.onload = resolve; });

        const avatarSize = 100;
        const avatarX = bubbleX + padding;
        const avatarY = bubbleY + padding;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Avatar Outer Glow Ring
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, (avatarSize/2) + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#00D9FF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 5. Draw Username
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 45px "Space Grotesk", sans-serif';
        ctx.fillText(username, avatarX + avatarSize + 30, avatarY + 45);

        // Draw "Premium User" badge
        ctx.fillStyle = '#00D9FF';
        ctx.font = '600 24px "Inter", sans-serif';
        ctx.fillText("VERIFIED • ENCRYPTED", avatarX + avatarSize + 30, avatarY + 85);

        // 6. Draw Text Bubble Content
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '400 42px "Inter", sans-serif';
        wrapText(ctx, text, bubbleX + padding, avatarY + avatarSize + 60, maxWidth, lineHeight);

        // 7. XAERISOFT Watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '700 28px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("XAERISOFT STUDIO", canvas.width / 2, canvas.height - 40);

        // Export to DOM
        currentOutputUrl = canvas.toDataURL('image/png');
        DOM.canvas.src = currentOutputUrl;
        
        // Use Image tag instead of actual canvas for better responsiveness
        const finalImg = new Image();
        finalImg.src = currentOutputUrl;
        finalImg.style.width = '100%';
        finalImg.style.display = 'block';
        
        const wrapper = DOM.canvas.parentNode;
        wrapper.innerHTML = ''; 
        wrapper.appendChild(finalImg);

        DOM.loading.classList.remove('active');
        DOM.resultSection.classList.add('show');
        showToast();
        
        setTimeout(() => {
            DOM.resultSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);

    } catch (err) {
        DOM.loading.classList.remove('active');
        showError('Kesalahan Render: ' + err.message);
        console.error(err);
    }
}

// Events
DOM.generateBtn.addEventListener('click', renderCanvas);

DOM.downloadBtn.addEventListener('click', () => {
    if (!currentOutputUrl) return;
    const a = document.createElement('a');
    a.href = currentOutputUrl;
    a.download = `XAERISOFT_Render_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

DOM.newBtn.addEventListener('click', () => {
    DOM.resultSection.classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
