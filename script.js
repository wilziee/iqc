// DOM Elements
        const landingPage = document.getElementById('landingPage');
        const downloadPage = document.getElementById('downloadPage');
        const continueBtn = document.getElementById('continueBtn');
        const urlInput = document.getElementById('urlInput');
        const pasteBtn = document.getElementById('pasteBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const videoResult = document.getElementById('videoResult');
        const photoResult = document.getElementById('photoResult');
        const videoThumbnail = document.getElementById('videoThumbnail');
        const videoTitle = document.getElementById('videoTitle');
        const videoAuthor = document.getElementById('videoAuthor');
        const videoDuration = document.getElementById('videoDuration');
        const videoViews = document.getElementById('videoViews');
        const videoLikes = document.getElementById('videoLikes');
        const videoDescription = document.getElementById('videoDescription');
        const downloadVideoBtn = document.getElementById('downloadVideoBtn');
        const downloadMusicBtn = document.getElementById('downloadMusicBtn');
        const photoList = document.getElementById('photoList');
        const downloadPhotoBtn = document.getElementById('downloadPhotoBtn');

        // API Configuration
        const API_KEY = 'free-lutfizx-c3d32df8';
        const API_BASE = 'https://api.myxzlyn.my.id/api/download/tiktok-v2';

        // Current data
        let currentVideoData = null;
        let currentPhotoData = null;

        // Event Listeners
        continueBtn.addEventListener('click', goToDownloadPage);
        pasteBtn.addEventListener('click', pasteFromClipboard);
        downloadBtn.addEventListener('click', processDownload);
        downloadVideoBtn.addEventListener('click', () => downloadFile('video'));
        downloadMusicBtn.addEventListener('click', () => downloadFile('music'));
        downloadPhotoBtn.addEventListener('click', () => downloadFile('photo'));

        // URL input enter key support
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processDownload();
            }
        });

        // === PERBAIKAN 1: TOMBOL TEMPEL (LANGSUNG TEMPEL, TANPA NOTIF "CTRL+V") ===
        async function pasteFromClipboard() {
            // Metode 1: Clipboard API modern (HTTPS / localhost)
            try {
                if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                    const text = await navigator.clipboard.readText();
                    if (text) {
                        urlInput.value = text;
                        showNotification('URL berhasil ditempel');
                        return;
                    }
                }
            } catch (err) {
                console.warn('Clipboard API gagal, fallback ke execCommand:', err);
            }

            // Metode 2: Fallback dengan execCommand('paste')
            try {
                const textarea = document.createElement('textarea');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                textarea.style.pointerEvents = 'none';
                document.body.appendChild(textarea);
                textarea.value = '';
                textarea.focus();

                const successful = document.execCommand('paste');
                if (successful) {
                    // Tunggu sebentar agar nilai textarea terisi
                    setTimeout(() => {
                        const pasted = textarea.value;
                        if (pasted) {
                            urlInput.value = pasted;
                            showNotification('URL berhasil ditempel');
                        } else {
                            showError('Tidak dapat membaca clipboard. Tempel manual dengan Ctrl+V');
                        }
                        document.body.removeChild(textarea);
                    }, 30);
                } else {
                    document.body.removeChild(textarea);
                    showError('Browser tidak mengizinkan akses clipboard. Gunakan Ctrl+V manual.');
                }
            } catch (e) {
                console.error('Fallback paste error:', e);
                showError('Tidak dapat mengakses clipboard. Tempel manual dengan Ctrl+V');
            }
        }

        // === PERBAIKAN 2: DOWNLOAD PAKAI BLOB, TIDAK REDIRECT KE URL ===
        // Fungsi ini WAJIB digunakan untuk SEMUA download, tidak ada fallback ke anchor biasa
        async function forceDownloadBlob(url, filename) {
            showLoading();
            try {
                const response = await fetch(url, {
                    mode: 'cors',        // Minta CORS
                    credentials: 'omit', // Jangan kirim cookie
                    cache: 'no-cache'
                });
                if (!response.ok) throw new Error('Gagal mengambil file');
                
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
                hideLoading();
                showNotification(`Download ${filename} dimulai`);
            } catch (error) {
                hideLoading();
                console.error('Download blob error:', error);
                showError('Download gagal karena CORS atau koneksi. Coba lagi atau gunakan perangkat lain.');
            }
        }

        // Fungsi utama untuk memproses download (video, musik, foto)
        async function downloadFile(type) {
            if (type === 'video' && currentVideoData) {
                const url = currentVideoData.hdplay || currentVideoData.play || currentVideoData.wmplay;
                if (url) await forceDownloadBlob(url, 'lutzzxdownloadervideo.mp4');
                else showError('URL video tidak ditemukan');
            } else if (type === 'music' && currentVideoData) {
                const url = currentVideoData.music;
                if (url) await forceDownloadBlob(url, 'lutzzxdownloadermusic.mp3');
                else showError('URL musik tidak ditemukan');
            } else if (type === 'photo' && currentPhotoData) {
                const images = currentPhotoData.images || [currentPhotoData.cover];
                for (let i = 0; i < images.length; i++) {
                    setTimeout(() => {
                        forceDownloadBlob(images[i], `lutzzxdownloaderfoto${images.length > 1 ? (i+1) : ''}.jpg`);
                    }, i * 500); // jeda biar tidak overload
                }
                showNotification(`Download ${images.length} foto dimulai`);
            }
        }

        // Hapus fungsi forceDownload() yang lama, tidak dipakai lagi

        // ===== FUNGSI LAINNYA (TIDAK BERUBAH) =====
        function goToDownloadPage() {
            landingPage.style.display = 'none';
            downloadPage.style.display = 'flex';
            urlInput.focus();
        }

        async function processDownload() {
            const url = urlInput.value.trim();
            if (!url) {
                showError('Masukkan URL TikTok');
                return;
            }
            if (!isValidTikTokUrl(url)) {
                showError('URL TikTok tidak valid');
                return;
            }
            hideError();
            videoResult.classList.remove('active');
            photoResult.classList.remove('active');
            showLoading();
            
            try {
                const encodedUrl = encodeURIComponent(url);
                const apiUrl = `${API_BASE}?apikey=${API_KEY}&url=${encodedUrl}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                hideLoading();
                
                if (data.status === true && data.result.code === 0) {
                    const videoData = data.result.data;
                    if (videoData.duration > 0) {
                        displayVideoResult(videoData);
                        currentVideoData = videoData;
                        currentPhotoData = null;
                    } else {
                        displayPhotoResult(videoData);
                        currentPhotoData = videoData;
                        currentVideoData = null;
                    }
                } else {
                    showError('Gagal mengambil data. Cek URL dan coba lagi.');
                }
            } catch (error) {
                hideLoading();
                showError('Koneksi error. Cek internet dan coba lagi.');
                console.error('Download error:', error);
            }
        }

        function displayVideoResult(videoData) {
            videoThumbnail.src = videoData.cover || videoData.origin_cover;
            videoTitle.textContent = videoData.title || 'Video TikTok';
            videoAuthor.textContent = videoData.author?.nickname || 'Unknown';
            videoDuration.textContent = formatDuration(videoData.duration);
            videoViews.textContent = formatNumber(videoData.play_count) + ' views';
            videoLikes.textContent = formatNumber(videoData.digg_count) + ' likes';
            videoDescription.textContent = videoData.title || 'Tidak ada deskripsi';
            videoResult.classList.add('active');
        }

        // Tampilan foto: HANYA GAMBAR + TOMBOL DOWNLOAD
        function displayPhotoResult(photoData) {
            photoList.innerHTML = '';
            const images = photoData.images || [photoData.cover];
            
            images.forEach((imgSrc, index) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item-vertical';
                photoItem.style.animationDelay = `${index * 0.1}s`;
                
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Foto ${index + 1}`;
                img.loading = 'lazy';
                
                const infoDiv = document.createElement('div');
                infoDiv.className = 'photo-info-text';
                infoDiv.innerHTML = `
                    <span class="photo-caption">Foto ${index + 1}</span>
                    <button class="photo-download-single" data-url="${imgSrc}" data-index="${index}">
                        <i class="fas fa-download"></i> Download
                    </button>
                `;
                
                photoItem.appendChild(img);
                photoItem.appendChild(infoDiv);
                photoList.appendChild(photoItem);
            });
            
            // Event listener untuk tombol download per foto (pake blob, bukan anchor biasa)
            document.querySelectorAll('.photo-download-single').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const url = btn.dataset.url;
                    const idx = btn.dataset.index;
                    forceDownloadBlob(url, `lutzzxdownloaderfoto${parseInt(idx)+1}.jpg`);
                });
            });
            
            photoResult.classList.add('active');
        }

        function showLoading() {
            loading.classList.add('active');
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Memproses...';
        }

        function hideLoading() {
            loading.classList.remove('active');
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'Download';
        }

        function showError(message) {
            errorText.textContent = message;
            errorMessage.classList.add('active');
        }

        function hideError() {
            errorMessage.classList.remove('active');
        }

        function showNotification(message, duration = 3000) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(to right, var(--primary), var(--accent));
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                animation: fadeInUp 0.3s ease-out;
                font-weight: 500;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => document.body.removeChild(notification), 300);
            }, duration);
        }

        // Helper functions
        function isValidTikTokUrl(url) {
            return url.includes('tiktok.com') || url.includes('vt.tiktok.com');
        }

        function formatDuration(seconds) {
            if (!seconds) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function formatNumber(num) {
            if (!num) return '0';
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        }

        // Additional CSS for fadeOut
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                0% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);