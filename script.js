document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const inputName = document.getElementById('inputName');
    const inputAvatar = document.getElementById('inputAvatar');
    const inputMessage = document.getElementById('inputMessage');
    const inputTime = document.getElementById('inputTime');
    const inputPosition = document.getElementById('inputPosition');
    const inputTheme = document.getElementById('inputTheme');
    const inputStatus = document.getElementById('inputStatus');
    const inputEmoji = document.getElementById('inputEmoji');
    const inputTyping = document.getElementById('inputTyping');

    // Previews
    const previewHeaderName = document.getElementById('previewHeaderName');
    const previewMessage = document.getElementById('previewMessage');
    const previewTime = document.getElementById('previewTime');
    const previewHeaderAvatar = document.getElementById('previewHeaderAvatar');
    const previewAvatar = document.getElementById('previewAvatar');
    
    // Containers & Elements
    const chatScreen = document.getElementById('chatScreen');
    const messageWrapper = document.getElementById('messageWrapper');
    const previewStatus = document.getElementById('previewStatus');
    const previewReaction = document.getElementById('previewReaction');
    const typingIndicator = document.getElementById('typingIndicator');

    // Buttons
    const btnExportPNG = document.getElementById('btnExportPNG');
    const btnExportJPG = document.getElementById('btnExportJPG');

    // Helper: Default Avatar API
    const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b14bf4&color=fff`;

    // --- REALTIME UPDATES ---
    
    inputName.addEventListener('input', (e) => {
        const val = e.target.value || 'Nama';
        previewHeaderName.textContent = val;
        // Update avatar only if no custom image is uploaded
        if(!inputAvatar.files[0]) {
            const url = getAvatarUrl(val);
            previewHeaderAvatar.src = url;
            previewAvatar.src = url;
        }
    });

    inputAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewHeaderAvatar.src = event.target.result;
                previewAvatar.src = event.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    inputMessage.addEventListener('input', (e) => {
        previewMessage.textContent = e.target.value;
    });

    inputTime.addEventListener('input', (e) => {
        previewTime.textContent = e.target.value;
    });

    inputTheme.addEventListener('change', (e) => {
        chatScreen.className = `chat-screen ${e.target.value}`;
    });

    inputPosition.addEventListener('change', (e) => {
        const pos = e.target.value;
        messageWrapper.className = `message-wrapper ${pos}`;
        updateStatusVisibility();
    });

    inputStatus.addEventListener('change', () => {
        updateStatusVisibility();
    });

    inputEmoji.addEventListener('input', (e) => {
        const val = e.target.value;
        if(val.trim() !== '') {
            previewReaction.textContent = val;
            previewReaction.style.display = 'block';
        } else {
            previewReaction.style.display = 'none';
        }
    });

    inputTyping.addEventListener('change', (e) => {
        const isTyping = e.target.checked;
        if(isTyping) {
            typingIndicator.style.display = 'flex';
            previewMessage.style.display = 'none';
        } else {
            typingIndicator.style.display = 'none';
            previewMessage.style.display = 'inline';
        }
    });

    // --- LOGIC HELPERS ---

    function updateStatusVisibility() {
        const pos = inputPosition.value;
        const status = inputStatus.value;
        
        // WhatsApp logic: only show ticks if message is sent (Right position)
        if(pos === 'right' && status !== 'none') {
            previewStatus.style.display = 'inline-block';
            if(status === 'read') {
                previewStatus.classList.add('read');
                previewStatus.classList.remove('delivered');
            } else {
                previewStatus.classList.add('delivered');
                previewStatus.classList.remove('read');
            }
        } else {
            previewStatus.style.display = 'none';
        }
    }

    // --- EXPORT TO IMAGE (HTML2CANVAS) ---
    
    async function downloadMockup(format) {
        const mockupNode = document.getElementById('phoneMockup');
        
        // Small delay to ensure styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));

        html2canvas(mockupNode, {
            scale: 2, // High resolution
            backgroundColor: null, // Keep border-radius transparency outside the phone
            useCORS: true // Allow loading cross-origin images (like the default avatars)
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Xaerisoft_Mockup_${new Date().getTime()}.${format}`;
            link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 0.9);
            link.click();
        }).catch(err => {
            console.error("Gagal mengekspor gambar:", err);
            alert("Terjadi kesalahan saat mengunduh gambar.");
        });
    }

    btnExportPNG.addEventListener('click', () => downloadMockup('png'));
    btnExportJPG.addEventListener('click', () => downloadMockup('jpg'));

    // Initialize Default State
    updateStatusVisibility();
});
