// ===== PERBAIKAN HANYA DI BAGIAN INI =====
        // DOM Elements
        const generateBtn = document.getElementById('generateBtn');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const resultSection = document.getElementById('resultSection');
        const generatedImage = document.getElementById('generatedImage');
        const downloadBtn = document.getElementById('downloadBtn');
        const newBtn = document.getElementById('newBtn');
        const textInput = document.getElementById('text');
        const timeInput = document.getElementById('time');
        const styleSelect = document.getElementById('styleSelect');
        const bgSelect = document.getElementById('bgSelect');
        const bgGroup = document.getElementById('bgGroup');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const notification = document.getElementById('notification');

        let currentImageUrl = '';

        // Tampilkan/sembunyikan background select
        styleSelect.addEventListener('change', function() {
            bgGroup.style.display = this.value === 'style2' ? 'block' : 'none';
        });

        // Show notification
        function showNotification() {
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 5000);
        }

        // Show error
        function showError(message) {
            errorText.textContent = message;
            errorMessage.classList.add('active');
            setTimeout(() => errorMessage.classList.remove('active'), 5000);
        }

        // Generate
        generateBtn.addEventListener('click', async function() {
            const text = textInput.value.trim();
            const time = timeInput.value.trim() || '22.54';
            const style = styleSelect.value;

            if (!text) {
                showError('Harap isi pesan chat terlebih dahulu.');
                return;
            }

            loadingOverlay.classList.add('active');
            errorMessage.classList.remove('active');

            try {
                let imageBlob = null;

                if (style === 'style1') {
                    // ===== STYLE 1: API =====
                    const apiUrl = `https://api.theresav.biz.id/canvas/iqc?teks=${encodeURIComponent(text)}`;
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000);
                    const response = await fetch(apiUrl, {
                        signal: controller.signal,
                        mode: 'cors'
                    });
                    clearTimeout(timeoutId);
                    if (!response.ok) throw new Error(`API error: ${response.status}`);
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('image')) {
                        throw new Error('API tidak mengembalikan gambar');
                    }
                    imageBlob = await response.blob();
                    if (imageBlob.size === 0) throw new Error('Gambar kosong');

                } else {
                    // ===== STYLE 2: LOCAL =====
                    const bg = bgSelect.value;
                    // pink = bubble pink, light/dark = bubble hijau WA
                    const bubbleColor = bg === 'pink' ? '#ffc5d5' : bg === 'dark' ? '#144D37' : '#dcf8c6';
                    const response = await fetch('/generate-style2', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text,
                            time,
                            bubbleColor,
                            background: bg
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || `Server error: ${response.status}`);
                    }
                    imageBlob = await response.blob();
                    if (imageBlob.size === 0) throw new Error('Gambar kosong');
                }

                if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
                currentImageUrl = URL.createObjectURL(imageBlob);
                generatedImage.src = currentImageUrl;
                await new Promise((resolve, reject) => {
                    generatedImage.onload = resolve;
                    generatedImage.onerror = () => reject(new Error('Gagal memuat gambar'));
                });

                loadingOverlay.classList.remove('active');
                resultSection.classList.add('active');
                showNotification();
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } catch (error) {
                console.error('Error:', error);
                loadingOverlay.classList.remove('active');
                if (error.name === 'AbortError') {
                    showError('Waktu permintaan habis. Coba lagi.');
                } else if (error.message.includes('ECONNREFUSED') || error.message.includes('localhost')) {
                    showError('Server lokal tidak berjalan. Jalankan "node server.js" terlebih dahulu.');
                } else {
                    showError(`Gagal: ${error.message}`);
                }
            }
        });

        // Download
        downloadBtn.addEventListener('click', function() {
            if (!currentImageUrl) {
                showError('Tidak ada gambar');
                return;
            }
            const link = document.createElement('a');
            link.href = currentImageUrl;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `iqc-chat-${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // Buat baru
        newBtn.addEventListener('click', function() {
            resultSection.classList.remove('active');
            window.scrollTo(0, 0);
        });

        // Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !loadingOverlay.classList.contains('active')) {
                generateBtn.click();
            }
        });

        // Load
        window.addEventListener('load', function() {
            window.scrollTo(0, 0);
        });