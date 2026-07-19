// ── UPLOADED URL STORE ──
const uploadedUrls = { ttqc: null, iqcimg: null, musiccard: null, botak: null, chibi: null, figure: null, nft: null, mafia: null, hitam: null, mountain: null, mirror: null, playlist: null, figure2: null };

// ── TABS ──
function switchTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── RESULT RENDER ──
function showResult(id, url) {
  const box = document.getElementById('result-' + id);
  box.innerHTML = `
    <p class="result-label">— Hasil Generate</p>
    <div class="result-img-wrap">
      <img src="${url}" alt="Generated Image" onerror="imgError('${id}')"/>
    </div>
    <div class="result-actions">
      <button class="btn-dl" onclick="downloadImg('${url}', '${id}')">⬇ DOWNLOAD</button>
      <button class="btn-copy" onclick="copyUrl('${url}')">⎘ COPY URL</button>
    </div>
  `;
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function imgError(id) {
  showError(id, 'Gambar gagal dimuat. Cek koneksi atau parameter input.');
}

function showError(id, msg) {
  const e = document.getElementById('err-' + id);
  e.textContent = '⚠ ' + msg;
  e.classList.add('show');
  const box = document.getElementById('result-' + id);
  box.classList.remove('show');
}

function clearError(id) {
  const e = document.getElementById('err-' + id);
  if(e) e.classList.remove('show');
}

// ── DOWNLOAD ──
async function downloadImg(url, id) {
  try {
    showToast('Mengunduh gambar...');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tools-' + id + '-' + Date.now() + '.png';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch(e) {
    showToast('Download gagal: buka URL langsung.');
    window.open(url, '_blank');
  }
}

// ── COPY URL ──
function copyUrl(url) {
  navigator.clipboard.writeText(url).then(() => showToast('URL disalin!')).catch(() => showToast('Gagal menyalin.'));
}

// ── BUILD URLS & GENERATE ──
function encode(s) { return encodeURIComponent(s); }

function generate(id) {
  clearError(id);
  let url = '';

  if (id === 'wmp1') {
    const text = document.getElementById('wmp1-text').value.trim();
    if (!text) return showToast('Isi teks terlebih dahulu!');
    url = `https://apii.nexadev.my.id/wmp1?text=${encode(text)}`;

  } else if (id === 'wmp2') {
    const text = document.getElementById('wmp2-text').value.trim();
    if (!text) return showToast('Isi teks terlebih dahulu!');
    url = `https://apii.nexadev.my.id/wmp2?text=${encode(text)}`;

  } else if (id === 'fakeff') {
    const usn = document.getElementById('fakeff-usn').value.trim();
    if (!usn) return showToast('Isi username terlebih dahulu!');
    url = `https://apii.nexadev.my.id/fakeff?usn=${encode(usn)}`;

  } else if (id === 'fakeffduo') {
    const n1 = document.getElementById('ffduo-name1').value.trim();
    const n2 = document.getElementById('ffduo-name2').value.trim();
    if (!n1 || !n2) return showToast('Isi kedua nama!');
    url = `http://api.nexadev.my.id/api/canvas/fakeffduo/?name1=${encode(n1)}&name2=${encode(n2)}`;

  } else if (id === 'nokia') {
    const text  = document.getElementById('nokia-text').value.trim();
    const from  = document.getElementById('nokia-from').value.trim();
    const date  = document.getElementById('nokia-date').value.trim();
    const time  = document.getElementById('nokia-time').value.trim();
    const title = document.getElementById('nokia-title').value.trim();
    if (!text) return showToast('Isi pesan Nokia!');
    url = `https://apii.nexadev.my.id/nokia?text=${encode(text)}&from=${encode(from)}&date=${encode(date)}&time=${encode(time)}&title=${encode(title)}`;

  // BAGIAN IQC SUDAH DIHAPUS DARI SINI

  } else if (id === 'ttqc') {
    const imgUrl = uploadedUrls['ttqc'];
    const name   = document.getElementById('ttqc-name').value.trim();
    const text   = document.getElementById('ttqc-text').value.trim();
    if (!name || !text) return showToast('Isi nama dan teks!');
    url = `https://apii.nexadev.my.id/ttqc?url=${encode(imgUrl || '')}&name=${encode(name)}&text=${encode(text)}`;

  } else if (id === 'iqcimg') {
    const imgUrl = uploadedUrls['iqcimg'];
    const text   = document.getElementById('iqcimg-text').value.trim();
    const time   = document.getElementById('iqcimg-time').value.trim();
    if (!text) return showToast('Isi teks!');
    url = `https://apii.nexadev.my.id/iqc-dark?text=${encode(text)}&time=${encode(time)}&url=${encode(imgUrl || '')}`;

  } else if (id === 'musiccard') {
    const judul = document.getElementById('musiccard-judul').value.trim();
    const nama  = document.getElementById('musiccard-nama').value.trim();
    const imgUrl = uploadedUrls['musiccard'];
    if (!judul || !nama) return showToast('Isi judul dan nama artis!');
    url = `https://api.nexray.eu.cc/canvas/musiccard?judul=${encode(judul)}&nama=${encode(nama)}&image_url=${encode(imgUrl || '')}`;

  } else if (id === 'botak') {
    const imgUrl = uploadedUrls['botak'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/botak?url=${encode(imgUrl)}`;

  } else if (id === 'chibi') {
    const imgUrl = uploadedUrls['chibi'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/chibi?url=${encode(imgUrl)}`;

  } else if (id === 'figure') {
    const imgUrl = uploadedUrls['figure'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/v1/figure?url=${encode(imgUrl)}`;

  } else if (id === 'nft') {
    const imgUrl = uploadedUrls['nft'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/nft?url=${encode(imgUrl)}`;

  } else if (id === 'mafia') {
    const imgUrl = uploadedUrls['mafia'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/mafia?url=${encode(imgUrl)}`;

  } else if (id === 'hitam') {
    const imgUrl = uploadedUrls['hitam'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/hitam?url=${encode(imgUrl)}`;

  } else if (id === 'mountain') {
    const imgUrl = uploadedUrls['mountain'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/mountain?url=${encode(imgUrl)}`;

  } else if (id === 'mirror') {
    const imgUrl = uploadedUrls['mirror'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/mirror?url=${encode(imgUrl)}`;

  } else if (id === 'playlist') {
    const imgUrl = uploadedUrls['playlist'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/playlist?url=${encode(imgUrl)}`;

  } else if (id === 'figure2') {
    const imgUrl = uploadedUrls['figure2'];
    if (!imgUrl) return showToast('Upload foto terlebih dahulu!');
    url = `https://api.nexray.eu.cc/ephoto/v2/figure?url=${encode(imgUrl)}`;
  } else if (id === 'iqcdark') {
    const text = document.getElementById('iqcdark-text').value.trim();
    const time = document.getElementById('iqcdark-time').value.trim();
    if (!text) return showToast('Isi teks!');
    url = `https://apii.nexadev.my.id/iqc-dark?text=${encode(text)}&time=${encode(time)}`;
  }

  if (!url) return;

  // Loading state
  const btn = event.currentTarget;
  btn.classList.add('loading');
  btn.innerHTML = '<span class="spinner"></span> GENERATING...';

  // Simulate load then show image
  const img = new Image();
  img.onload = () => {
    btn.classList.remove('loading');
    btn.textContent = '⚡ GENERATE';
    showResult(id, url);
    showToast('Gambar berhasil dibuat!');
  };
  img.onerror = () => {
    btn.classList.remove('loading');
    btn.textContent = '⚡ GENERATE';
    // Still show — some APIs return binary directly
    showResult(id, url);
    showToast('Cek hasil di bawah.');
  };
  img.src = url + '&_t=' + Date.now();
}

// ── DRAG & DROP UPLOAD ──
function onDragOver(e, id) {
  e.preventDefault();
  document.getElementById('drop-' + id).classList.add('dragover');
}

function onDragLeave(e, id) {
  document.getElementById('drop-' + id).classList.remove('dragover');
}

function onDrop(e, id) {
  e.preventDefault();
  document.getElementById('drop-' + id).classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) uploadFile(id, file);
}

function handleFile(id) {
  const input = document.getElementById('file-' + id);
  if (input.files[0]) uploadFile(id, input.files[0]);
}

function removeUpload(id) {
  uploadedUrls[id] = null;
  document.getElementById('preview-' + id).classList.remove('show');
  document.getElementById('file-' + id).value = '';
  document.getElementById('drop-' + id).style.display = '';
}

async function uploadFile(id, file) {
  const drop = document.getElementById('drop-' + id);
  const preview = document.getElementById('preview-' + id);
  const previewImg = document.getElementById('preview-img-' + id);
  const previewFname = document.getElementById('preview-fname-' + id);
  const previewUrl = document.getElementById('preview-url-' + id);

  // Local preview
  const reader = new FileReader();
  reader.onload = e => { previewImg.src = e.target.result; };
  reader.readAsDataURL(file);
  previewFname.textContent = file.name;
  previewUrl.textContent = 'Mengupload...';
  preview.classList.add('show');
  drop.style.display = 'none';

  // Upload to Nexa uploader
  try {
    const formData = new FormData();
    formData.append('files[]', file);
    const res = await fetch('https://api.nexadev.my.id/uploder/', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.files && data.files[0] && data.files[0].url) {
      uploadedUrls[id] = data.files[0].url;
      previewUrl.textContent = data.files[0].url;
      showToast('Upload berhasil!');
    } else {
      throw new Error('Upload gagal');
    }
  } catch(err) {
    previewUrl.textContent = '⚠ Upload gagal — coba lagi.';
    uploadedUrls[id] = null;
    showToast('Upload gagal!');
  }
}
