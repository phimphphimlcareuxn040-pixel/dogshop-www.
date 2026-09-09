/* ==========================================================================
   Paw Paradise - Main Application & Interactive Overlays Manager
   ========================================================================== */

class AppManager {
  constructor() {
    this.dogs = (typeof DOGS_DATA !== 'undefined' ? DOGS_DATA : window.DOGS_DATA) || [];
    this.audioCtx = null;
    this.isBgMusicPlaying = false;
    this.bgMusicTimer = null;
    this.bgNoteIndex = 0;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.filterDogs();
    this.createFloatingBgMusicButton();
    this.autoStartBgMusic();
  }

  setupEventListeners() {
    // Mobile navigation toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.overlay-modal');
        if (modal) this.closeModal(modal.id);
      });
    });

    // Close modal when clicking outside content
    document.querySelectorAll('.overlay-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Filter controls
    const searchInput = document.getElementById('search-input');
    const breedSelect = document.getElementById('breed-filter');
    const priceSelect = document.getElementById('price-filter');

    if (searchInput) searchInput.addEventListener('input', () => this.filterDogs());
    if (breedSelect) breedSelect.addEventListener('change', () => this.filterDogs());
    if (priceSelect) priceSelect.addEventListener('change', () => this.filterDogs());
  }

  /* ------------------------------------------------------------------------
     BACKGROUND MUSIC SYNTHESIZER (FLOATING OVERLAY BUTTON)
     ------------------------------------------------------------------------ */
  createFloatingBgMusicButton() {
    if (document.getElementById('bg-music-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'bg-music-btn';
    btn.className = 'bg-music-btn';
    btn.title = 'เปิด/ปิด เสียงดนตรีบรรเลงประกอบเว็บ';
    btn.onclick = () => this.toggleBgMusic();

    btn.innerHTML = `
      <span id="bg-music-icon">🔇</span>
      <span class="bg-music-tooltip" id="bg-music-tooltip">เปิดดนตรีบรรเลง 🎵</span>
    `;

    document.body.appendChild(btn);
  }

  autoStartBgMusic() {
    // Automatically turn on background music when entering the site unless explicitly muted by user
    const isMuted = localStorage.getItem('paw_bg_music_muted') === 'true';
    if (!isMuted) {
      this.toggleBgMusic(true);
    }

    // Browsers block AudioContext autoplay without user interaction.
    // Attach one-time event listeners on user gestures (click/touch/scroll/keypress) to unlock audio playback automatically.
    const unlockAndPlay = () => {
      if (this.isBgMusicPlaying) {
        if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().then(() => {
            if (this.isBgMusicPlaying && !this.bgMusicTimer) {
              this.startBgMusicLoop();
            }
          }).catch(e => console.log('Audio resume notice:', e));
        } else if (!this.bgMusicTimer) {
          this.startBgMusicLoop();
        }
      }
    };

    ['click', 'touchstart', 'keydown', 'scroll', 'pointerdown', 'mousemove'].forEach(evt => {
      window.addEventListener(evt, unlockAndPlay, { once: true, passive: true });
    });
  }

  toggleBgMusic(forceState) {
    if (typeof forceState === 'boolean') {
      this.isBgMusicPlaying = forceState;
    } else {
      this.isBgMusicPlaying = !this.isBgMusicPlaying;
    }

    // Persist preference so explicit user mute is remembered
    localStorage.setItem('paw_bg_music_muted', (!this.isBgMusicPlaying).toString());

    const btn = document.getElementById('bg-music-btn');
    const icon = document.getElementById('bg-music-icon');
    const tooltip = document.getElementById('bg-music-tooltip');

    if (this.isBgMusicPlaying) {
      if (btn) btn.classList.add('playing');
      if (icon) icon.textContent = '🎶';
      if (tooltip) tooltip.textContent = 'ปิดดนตรีบรรเลง 🔇';
      this.startBgMusicLoop();
    } else {
      if (btn) btn.classList.remove('playing');
      if (icon) icon.textContent = '🔇';
      if (tooltip) tooltip.textContent = 'เปิดดนตรีบรรเลง 🎵';
      this.stopBgMusicLoop();
    }
  }

  startBgMusicLoop() {
    this.stopBgMusicLoop();

    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    // Soothing Pentatonic Ambient Melody Scale (Hz)
    const melodyScale = [
      261.63, 329.63, 392.00, 523.25,  // C4, E4, G4, C5
      293.66, 349.23, 440.00, 587.33,  // D4, F4, A4, D5
      329.63, 392.00, 493.88, 659.25,  // E4, G4, B4, E5
      261.63, 349.23, 392.00, 523.25   // C4, F4, G4, C5
    ];

    const playNextNote = () => {
      if (!this.isBgMusicPlaying) return;

      try {
        const freq = melodyScale[this.bgNoteIndex % melodyScale.length];
        this.bgNoteIndex++;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        // Soft sine wave for gentle background music
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle envelope attack & decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.08); // soft low volume
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } catch (e) {
        console.log('Synth music notice:', e);
      }

      this.bgMusicTimer = setTimeout(playNextNote, 320); // 320ms per note tempo
    };

    playNextNote();
  }

  stopBgMusicLoop() {
    if (this.bgMusicTimer) {
      clearTimeout(this.bgMusicTimer);
      this.bgMusicTimer = null;
    }
  }

  // Modal Control Methods
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';

      // Stop HTML5 videos if closing video modal
      const video = modal.querySelector('video');
      if (video) video.pause();

      // Stop YouTube iframe if closing video modal
      const youtubeIframe = modal.querySelector('#modal-youtube-player');
      if (youtubeIframe) youtubeIframe.src = '';

      // Stop audio playback if closing audio modal
      this.stopAllAudio();
    }
  }

  stopAllAudio() {
    if (this.customAudioPlayer) {
      this.customAudioPlayer.pause();
      this.customAudioPlayer = null;
    }

    const modalAudio = document.getElementById('modal-custom-audio');
    if (modalAudio) {
      modalAudio.pause();
    }

    const visualizer = document.querySelector('.audio-visualizer');
    if (visualizer) visualizer.classList.remove('playing');

    this.isSynthPlaying = false;
    this.updateAudioBtnUI(false);
  }

  /* ------------------------------------------------------------------------
     OVERLAY 1: Image Lightbox
     ------------------------------------------------------------------------ */
  openImageOverlay(imgSrc, caption = '') {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'รูปถ่ายน้องหมา Fon Paradise';

    this.openModal('image-overlay-modal');
  }

  /* ------------------------------------------------------------------------
     OVERLAY 2: Video Player Modal (Supports HTML5 MP4 & YouTube Links)
     ------------------------------------------------------------------------ */
  openVideoOverlay(videoUrl, title = '') {
    const videoTitle = document.getElementById('video-modal-title');
    const videoPlayer = document.getElementById('modal-video-player');
    const youtubePlayer = document.getElementById('modal-youtube-player');

    if (videoTitle) videoTitle.textContent = title || 'วิดีโอความน่ารักของน้องหมา 🎥';

    const ytEmbedUrl = this.getYouTubeEmbedUrl(videoUrl);

    if (ytEmbedUrl) {
      // YouTube Embed Player
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.style.display = 'none';
      }
      if (youtubePlayer) {
        youtubePlayer.src = ytEmbedUrl;
        youtubePlayer.style.display = 'block';
      }
    } else {
      // Native HTML5 Video Player
      if (youtubePlayer) {
        youtubePlayer.src = '';
        youtubePlayer.style.display = 'none';
      }
      if (videoPlayer) {
        videoPlayer.style.display = 'block';
        videoPlayer.src = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
        videoPlayer.play().catch(e => console.log('Autoplay prevented:', e));
      }
    }

    this.openModal('video-overlay-modal');
  }

  getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     OVERLAY 3: Audio Sound Overlay & Web Audio Bark Synth
     ------------------------------------------------------------------------ */
  openAudioOverlay(dogName = 'น้องหมา', barkType = 'playful_yap', customAudioUrl = '') {
    const audioTitle = document.getElementById('audio-modal-title');
    if (audioTitle) audioTitle.textContent = `เสียงโฮ่งๆ ของ ${dogName} 🐕🔊`;

    this.currentBarkType = barkType;
    this.currentCustomAudioUrl = customAudioUrl;
    this.openModal('audio-overlay-modal');

    const modalAudio = document.getElementById('modal-custom-audio');
    if (customAudioUrl && modalAudio) {
      modalAudio.src = customAudioUrl;
      modalAudio.style.display = 'block';
      modalAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
      
      const visualizer = document.querySelector('.audio-visualizer');
      if (visualizer) visualizer.classList.add('playing');
      this.updateAudioBtnUI(true);

      modalAudio.onended = () => {
        if (visualizer) visualizer.classList.remove('playing');
        this.updateAudioBtnUI(false);
      };
    } else {
      if (modalAudio) modalAudio.style.display = 'none';
      this.playDogBarkSound(barkType);
    }
  }

  toggleAudioModalSound() {
    const modalAudio = document.getElementById('modal-custom-audio');
    const visualizer = document.querySelector('.audio-visualizer');

    // Custom audio file playback toggle
    if (this.currentCustomAudioUrl && modalAudio) {
      if (!modalAudio.paused) {
        modalAudio.pause();
        if (visualizer) visualizer.classList.remove('playing');
        this.updateAudioBtnUI(false);
      } else {
        modalAudio.play();
        if (visualizer) visualizer.classList.add('playing');
        this.updateAudioBtnUI(true);
      }
      return;
    }

    // Web Audio Bark Synth toggle
    if (this.isSynthPlaying) {
      this.isSynthPlaying = false;
      if (visualizer) visualizer.classList.remove('playing');
      this.updateAudioBtnUI(false);
    } else {
      this.isSynthPlaying = true;
      this.playDogBarkSound(this.currentBarkType);
    }
  }

  updateAudioBtnUI(isPlaying) {
    const btn = document.getElementById('btn-audio-play-toggle');
    if (btn) {
      btn.innerHTML = isPlaying ? '⏸️ หยุดเล่นเสียง' : '🔊 กดเล่นเสียงอีกครั้ง';
      btn.style.background = isPlaying 
        ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
        : 'linear-gradient(135deg, var(--primary-pink), var(--cyan-blue))';
    }
  }

  playCustomAudioFile(url) {
    const visualizer = document.querySelector('.audio-visualizer');
    if (visualizer) {
      visualizer.classList.add('playing');
      setTimeout(() => visualizer.classList.remove('playing'), 2500);
    }

    try {
      if (this.customAudioPlayer) {
        this.customAudioPlayer.pause();
      }
      this.customAudioPlayer = new Audio(url);
      this.customAudioPlayer.play().catch(e => console.log("Audio play error:", e));
      this.updateAudioBtnUI(true);
    } catch(e) {
      console.log("Audio player error:", e);
    }
  }

  playDogBarkSound(barkType = 'playful_yap') {
    if (this.currentCustomAudioUrl) {
      this.playCustomAudioFile(this.currentCustomAudioUrl);
      return;
    }

    this.isSynthPlaying = true;
    this.updateAudioBtnUI(true);

    // Visualizer effect
    const visualizer = document.querySelector('.audio-visualizer');
    if (visualizer) {
      visualizer.classList.add('playing');
      setTimeout(() => {
        visualizer.classList.remove('playing');
        this.isSynthPlaying = false;
        this.updateAudioBtnUI(false);
      }, 1500);
    }

    // Synthesize Bark using Web Audio API (ensures sound always works offline!)
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      if (barkType === 'playful_yap') {
        // High pitched yap yap
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      } else if (barkType === 'boof_bark') {
        // Deeper bark
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      } else {
        // Cute snort bark
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      }

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.log('Audio API error:', e);
    }
  }

  /* ------------------------------------------------------------------------
     OVERLAY 4: Dynamic API Overlay (Dog.ceo / Dog API)
     ------------------------------------------------------------------------ */
  async openApiOverlay() {
    const apiContainer = document.getElementById('api-modal-content');
    if (!apiContainer) return;

    this.openModal('api-overlay-modal');

    apiContainer.innerHTML = `
      <div class="api-result-box">
        <div class="spinner" style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
        <p>กำลังเชื่อมต่อ API สุนัขสากลแบบเรียลไทม์...</p>
      </div>
    `;

    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();
      
      // Extract breed name from API URL string
      const parts = data.message.split('/');
      const breedRaw = parts[parts.indexOf('breeds') + 1] || 'Happy Dog';
      const breedFormatted = breedRaw.replace('-', ' ').toUpperCase();

      apiContainer.innerHTML = `
        <div class="api-result-box">
          <img src="${data.message}" alt="${breedFormatted}" class="api-dog-img">
          <h4 style="color: var(--primary-pink); font-size: 1.4rem; margin-bottom: 6px;">🐾 พันธุ์สุนัขสากล: ${breedFormatted}</h4>
          <p style="color: var(--text-muted); font-size: 0.95rem;">ข้อมูลสุ่มสดๆ ส่งตรงจาก Dog.ceo Public REST API</p>
          <button class="btn-primary" style="margin-top: 15px;" onclick="window.appManager.openApiOverlay()">
            🔄 สุ่มสุนัขพันธุ์อื่นจาก API
          </button>
        </div>
      `;
    } catch (err) {
      apiContainer.innerHTML = `
        <div class="api-result-box">
          <p style="color: #ef4444; font-weight: bold;">⚠️ ไม่สามารถดึงข้อมูลจาก API สากลได้ในขณะนี้</p>
          <button class="btn-primary" style="margin-top: 15px;" onclick="window.appManager.openApiOverlay()">
            🔄 ลองใหม่อีกครั้ง
          </button>
        </div>
      `;
    }
  }

  /* ------------------------------------------------------------------------
     Catalog Rendering & Filters
     ------------------------------------------------------------------------ */
  renderCatalog(dogsToRender = this.dogs) {
    const gridContainer = document.getElementById('dogs-grid');
    if (!gridContainer) return;

    if (dogsToRender.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <h3>🐾 ไม่พบน้องหมาที่ตรงกับเงื่อนไขการค้นหา</h3>
          <p>ลองปรับคำค้นหา หรือเลือกสายพันธุ์อื่นดูนะคะ</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = dogsToRender.map(dog => `
      <div class="dog-card">
        <div class="dog-card-img-wrap">
          <img src="${dog.images[0]}" alt="${dog.name}" onerror="this.onerror=null; this.src='${dog.images[1] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}';">
          <span class="card-badge-gender ${dog.gender === 'female' ? 'badge-female' : 'badge-male'}">
            ${dog.gender === 'female' ? '♀ เพศเมีย' : '♂ เพศผู้'}
          </span>
          <div class="card-quick-overlay-btns">
            <button class="btn-icon-overlay" title="ขยายรูป" onclick="window.appManager.openImageOverlay('${dog.images[0]}', '${dog.name}')">🖼️</button>
            <button class="btn-icon-overlay" title="เล่นวิดีโอ" onclick="window.appManager.openVideoOverlay('${dog.videoUrl}', '${dog.name}')">🎥</button>
            <button class="btn-icon-overlay" title="ฟังเสียง" onclick="window.appManager.openAudioOverlay('${dog.name}', '${dog.audioBark}', '${dog.customAudioUrl || ''}')">🔊</button>
          </div>
        </div>
        <div class="dog-card-body">
          <div class="dog-card-breed">${dog.breedTh} (${dog.breed})</div>
          <h3 class="dog-card-name">${dog.name}</h3>
          <div class="dog-card-info">
            <span>🎂 ${dog.age}</span>
            <span>🎨 ${dog.color}</span>
          </div>
          <div class="dog-card-price">฿${dog.price.toLocaleString()}</div>
          <div class="card-actions">
            <a href="dog-detail.html?id=${dog.id}" class="btn-card-detail">📋 รายละเอียด</a>
            <button class="btn-card-buy" onclick="window.appManager.openAdoptionModal('${dog.name}', ${dog.price})">🛒 สนใจรับเลี้ยง</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  filterDogs() {
    if (!this.dogs || this.dogs.length === 0) {
      this.dogs = (typeof DOGS_DATA !== 'undefined' ? DOGS_DATA : window.DOGS_DATA) || [];
    }

    const searchVal = (document.getElementById('search-input')?.value || '').trim().toLowerCase();
    const breedVal = document.getElementById('breed-filter')?.value || 'all';
    const priceVal = document.getElementById('price-filter')?.value || 'all';

    let filtered = this.dogs.filter(dog => {
      const matchSearch = !searchVal || 
                          dog.name.toLowerCase().includes(searchVal) || 
                          dog.breedTh.toLowerCase().includes(searchVal) ||
                          dog.breed.toLowerCase().includes(searchVal);
      const matchBreed = breedVal === 'all' || dog.breed === breedVal || dog.breedTh === breedVal;
      
      let matchPrice = true;
      if (priceVal === 'under20k') matchPrice = dog.price < 20000;
      else if (priceVal === '20k-25k') matchPrice = dog.price >= 20000 && dog.price <= 25000;
      else if (priceVal === 'above25k') matchPrice = dog.price > 25000;

      return matchSearch && matchBreed && matchPrice;
    });

    this.renderCatalog(filtered);
  }

  openAdoptionModal(dogName, price) {
    const nameEl = document.getElementById('adopt-dog-name');
    const priceEl = document.getElementById('adopt-dog-price');
    if (nameEl) nameEl.textContent = dogName;
    if (priceEl) priceEl.textContent = `฿${price.toLocaleString()}`;

    this.openModal('adoption-modal');
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.appManager = new AppManager();
});
