/* ==========================================================================
   Paw Paradise - Admin Zone Controller (Direct Disk Uploads & JSON DB)
   ========================================================================== */

class AdminManager {
  constructor() {
    this.dogs = window.loadDogsDatabase();
    this.editingId = null;
    this.uploadedImageFile = null;
    this.uploadedAudioFile = null;
    this.uploadedVideoFile = null;
    this.uploadedImageUrl = null;
    this.uploadedAudioUrl = null;
    this.uploadedVideoUrl = null;
    this.init();
  }

  init() {
    this.renderStats();
    this.renderDogsTable();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 1. Image File Upload listener
    const imgFileInput = document.getElementById('dog-img-file');
    if (imgFileInput) {
      imgFileInput.addEventListener('change', (e) => this.handleImageFileSelect(e));
    }

    // 2. Audio File Upload listener
    const audioFileInput = document.getElementById('dog-audio-file');
    if (audioFileInput) {
      audioFileInput.addEventListener('change', (e) => this.handleAudioFileSelect(e));
    }

    // 3. Video File Upload listener
    const videoFileInput = document.getElementById('dog-video-file');
    if (videoFileInput) {
      videoFileInput.addEventListener('change', (e) => this.handleVideoFileSelect(e));
    }

    // Form submit listener
    const dogForm = document.getElementById('dog-editor-form');
    if (dogForm) {
      dogForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // JSON Import listener
    const jsonFileInput = document.getElementById('json-import-file');
    if (jsonFileInput) {
      jsonFileInput.addEventListener('change', (e) => this.handleJSONImport(e));
    }
  }

  renderStats() {
    const countEl = document.getElementById('stat-total-dogs');
    const valueEl = document.getElementById('stat-total-value');
    const breedEl = document.getElementById('stat-total-breeds');

    if (countEl) countEl.textContent = this.dogs.length;
    
    if (valueEl) {
      const totalVal = this.dogs.reduce((sum, d) => sum + (d.price || 0), 0);
      valueEl.textContent = `฿${totalVal.toLocaleString()}`;
    }

    if (breedEl) {
      const uniqueBreeds = new Set(this.dogs.map(d => d.breed));
      breedEl.textContent = uniqueBreeds.size;
    }
  }

  renderDogsTable() {
    const tbody = document.getElementById('admin-dogs-tbody');
    if (!tbody) return;

    if (this.dogs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
            🐾 ไม่มีข้อมูลสุนัขในระบบ กรุณากดปุ่ม "เพิ่มข้อมูลสุนัขใหม่" หรือนำเข้า JSON
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.dogs.map(dog => `
      <tr>
        <td style="text-align: center;">
          <img src="${dog.images[0]}" alt="${dog.name}" onerror="this.onerror=null; this.src='${dog.images[1] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'}';" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 2px solid var(--secondary-pink);">
        </td>
        <td style="font-weight: 700; color: var(--primary-blue);">${dog.name}</td>
        <td><span style="background: var(--light-pink); color: var(--primary-pink); padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 0.85rem;">${dog.breedTh} (${dog.breed})</span></td>
        <td style="font-weight: 800; color: var(--primary-pink);">฿${dog.price.toLocaleString()}</td>
        <td>${dog.gender === 'female' ? '♀ เมีย' : '♂ ผู้'} · ${dog.age}</td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${dog.images?.length ? '<span title="มีรูปภาพ" style="background: #e0e7ff; padding: 2px 6px; border-radius: 8px; font-size: 0.8rem;">🖼️ รูป</span>' : ''}
            ${dog.videoUrl ? '<span title="มีวิดีโอ" style="background: #fce7f3; padding: 2px 6px; border-radius: 8px; font-size: 0.8rem;">🎥 วิดีโอ</span>' : ''}
            ${(dog.customAudioUrl || dog.audioBark) ? '<span title="มีเสียง" style="background: #dcfce7; padding: 2px 6px; border-radius: 8px; font-size: 0.8rem;">🔊 เสียง</span>' : ''}
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn-card-detail" style="padding: 6px 12px; font-size: 0.85rem;" onclick="window.adminManager.openEditModal('${dog.id}')">✏️ แก้ไข</button>
            <button class="btn-card-buy" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444;" onclick="window.adminManager.deleteDog('${dog.id}')">🗑️ ลบ</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ------------------------------------------------------------------------
     File Upload Handlers & Server Disk Sync
     ------------------------------------------------------------------------ */
  handleImageFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadedImageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('img-upload-preview');
      if (previewImg) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  handleAudioFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadedAudioFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewAudio = document.getElementById('audio-upload-preview');
      if (previewAudio) {
        previewAudio.src = e.target.result;
        previewAudio.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  handleVideoFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadedVideoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewVideo = document.getElementById('video-upload-preview');
      if (previewVideo) {
        previewVideo.src = e.target.result;
        previewVideo.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  async uploadFileToServer(file, fileType = 'images') {
    const isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    if (isLocalServer) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('filetype', fileType);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            console.log(`[Disk Upload Success] Saved to ${data.url}`);
            return data.url;
          }
        }
      } catch (err) {
        console.warn(`[Upload Server API offline] Fallback to base64 Data URL:`, err);
      }
    }

    // Client-side fallback for GitHub Pages / Static Hosting (Base64 Data URL)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  /* ------------------------------------------------------------------------
     CRUD Operations (Create, Update, Delete)
     ------------------------------------------------------------------------ */
  openAddModal() {
    this.editingId = null;
    this.uploadedImageFile = null;
    this.uploadedAudioFile = null;
    this.uploadedVideoFile = null;

    document.getElementById('modal-editor-title').textContent = '➕ เพิ่มข้อมูลสุนัขตัวใหม่';
    document.getElementById('dog-editor-form').reset();
    
    const previewImg = document.getElementById('img-upload-preview');
    if (previewImg) previewImg.style.display = 'none';

    const previewAudio = document.getElementById('audio-upload-preview');
    if (previewAudio) previewAudio.style.display = 'none';

    const previewVideo = document.getElementById('video-upload-preview');
    if (previewVideo) previewVideo.style.display = 'none';

    if (window.appManager) window.appManager.openModal('dog-editor-modal');
  }

  openEditModal(id) {
    const dog = this.dogs.find(d => d.id === id);
    if (!dog) return;

    this.editingId = id;
    this.uploadedImageFile = null;
    this.uploadedAudioFile = null;
    this.uploadedVideoFile = null;

    document.getElementById('modal-editor-title').textContent = `✏️ แก้ไขข้อมูล: ${dog.name}`;
    
    document.getElementById('dog-name').value = dog.name || '';
    document.getElementById('dog-breed').value = dog.breed || 'Pomeranian';
    document.getElementById('dog-breed-th').value = dog.breedTh || '';
    document.getElementById('dog-price').value = dog.price || '';
    document.getElementById('dog-gender').value = dog.gender || 'female';
    document.getElementById('dog-age').value = dog.age || '';
    document.getElementById('dog-color').value = dog.color || '';
    document.getElementById('dog-img-url').value = dog.images?.[0] || '';
    document.getElementById('dog-video-url').value = dog.videoUrl || '';
    document.getElementById('dog-audio-bark').value = dog.audioBark || 'playful_yap';
    document.getElementById('dog-description').value = dog.description || '';

    // Image preview
    const previewImg = document.getElementById('img-upload-preview');
    if (previewImg && dog.images?.[0]) {
      previewImg.src = dog.images[0];
      previewImg.style.display = 'block';
    }

    // Audio preview
    const previewAudio = document.getElementById('audio-upload-preview');
    if (previewAudio && dog.customAudioUrl) {
      previewAudio.src = dog.customAudioUrl;
      previewAudio.style.display = 'block';
    } else if (previewAudio) {
      previewAudio.style.display = 'none';
    }

    // Video preview
    const previewVideo = document.getElementById('video-upload-preview');
    if (previewVideo && dog.videoUrl) {
      previewVideo.src = dog.videoUrl;
      previewVideo.style.display = 'block';
    } else if (previewVideo) {
      previewVideo.style.display = 'none';
    }

    if (window.appManager) window.appManager.openModal('dog-editor-modal');
  }

  async handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('dog-name').value;
    const breed = document.getElementById('dog-breed').value;
    const breedTh = document.getElementById('dog-breed-th').value || breed;
    const price = parseFloat(document.getElementById('dog-price').value) || 0;
    const gender = document.getElementById('dog-gender').value;
    const age = document.getElementById('dog-age').value;
    const color = document.getElementById('dog-color').value;
    
    const inputImgUrl = document.getElementById('dog-img-url').value;
    const inputVideoUrl = document.getElementById('dog-video-url').value;
    const audioBark = document.getElementById('dog-audio-bark').value;
    const description = document.getElementById('dog-description').value;

    // Upload selected files directly onto hard drive or Data URL on GitHub Pages
    let finalImage = inputImgUrl || 'uploads/images/pompom.svg';
    if (this.uploadedImageFile) {
      finalImage = await this.uploadFileToServer(this.uploadedImageFile, 'images');
    }

    let finalAudio = '';
    if (this.uploadedAudioFile) {
      finalAudio = await this.uploadFileToServer(this.uploadedAudioFile, 'audio');
    }

    let finalVideo = inputVideoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
    if (this.uploadedVideoFile) {
      finalVideo = await this.uploadFileToServer(this.uploadedVideoFile, 'video');
    }

    if (this.editingId) {
      // Update existing record
      const index = this.dogs.findIndex(d => d.id === this.editingId);
      if (index !== -1) {
        this.dogs[index] = {
          ...this.dogs[index],
          name, breed, breedTh, price, gender, age, color,
          images: [finalImage],
          videoUrl: finalVideo,
          audioBark,
          customAudioUrl: finalAudio || this.dogs[index].customAudioUrl || '',
          description
        };
      }
    } else {
      // Create new record
      const newDog = {
        id: `dog-${Date.now()}`,
        name, breed, breedTh, price, gender, age, color,
        vaccinated: "ฉีดวัคซีนแล้ว 1 เข็ม",
        microchip: "มีไมโครชิปแท้",
        pedigree: "ใบเพ็ดสมาคมฯ",
        images: [finalImage],
        videoUrl: finalVideo,
        audioBark,
        customAudioUrl: finalAudio,
        description,
        fatherBreed: `${breed} Champion Line`,
        motherBreed: `${breed} High Bloodline`
      };
      this.dogs.unshift(newDog);
    }

    // Save to localStorage & save to data/dogs.json on disk if local server!
    window.saveDogsDatabase(this.dogs);
    this.saveJSONFileToDisk(this.dogs);

    // Refresh UI
    this.renderStats();
    this.renderDogsTable();

    if (window.appManager) {
      window.appManager.closeModal('dog-editor-modal');
      window.appManager.renderCatalog();
    }

    const isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocalServer) {
      alert('บันทึกและอัปโหลดไฟล์เรียบร้อยแล้ว!');
    } else {
      alert('บันทึกข้อมูลเรียบร้อยแล้ว! (ข้อมูลจะถูกจำลองใน LocalStorage บน GitHub Pages หากต้องการบันทึกเป็นไฟล์ data/dogs.json ให้กดปุ่ม "ส่งออก JSON")');
    }
  }

  async saveJSONFileToDisk(dogsData) {
    const isLocalServer = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (!isLocalServer) return; // Skip fetch on static hosts like GitHub Pages

    try {
      await fetch('/api/save-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dogsData, null, 2)
      });
      console.log('[Disk Sync] data/dogs.json updated on disk');
    } catch (e) {
      console.log('[Disk Sync Note] Server API offline for JSON file save');
    }
  }

  deleteDog(id) {
    const dog = this.dogs.find(d => d.id === id);
    if (!dog) return;

    if (confirm(`คุณต้องการลบข้อมูล "${dog.name}" ออกจากระบบใช่หรือไม่?`)) {
      this.dogs = this.dogs.filter(d => d.id !== id);
      window.saveDogsDatabase(this.dogs);
      this.saveJSONFileToDisk(this.dogs);
      this.renderStats();
      this.renderDogsTable();
      if (window.appManager) window.appManager.renderCatalog();
    }
  }

  /* ------------------------------------------------------------------------
     JSON Export / Import / Reset Database Methods
     ------------------------------------------------------------------------ */
  exportJSONDatabase() {
    const jsonStr = JSON.stringify(this.dogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fonparadise_dogs_db_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  openImportJSONModal() {
    if (window.appManager) window.appManager.openModal('json-import-modal');
  }

  handleJSONImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          this.dogs = importedData;
          window.saveDogsDatabase(this.dogs);
          this.saveJSONFileToDisk(this.dogs);
          this.renderStats();
          this.renderDogsTable();
          if (window.appManager) {
            window.appManager.closeModal('json-import-modal');
            window.appManager.renderCatalog();
          }
          alert(`นำเข้าข้อมูลสำเร็จแล้ว! ทั้งหมด ${importedData.length} รายการ`);
        } else {
          alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง! ต้องเป็นอาร์เรย์ของข้อมูลสุนัข');
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  async resetFactoryDatabase() {
    if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลกลับเป็นค่าเริ่มต้นจากโรงงานใช่หรือไม่? (ข้อมูลที่เพิ่มใหม่จะถูกลบ)')) {
      this.dogs = await window.resetDogsDatabase();
      this.saveJSONFileToDisk(this.dogs);
      this.renderStats();
      this.renderDogsTable();
      if (window.appManager) window.appManager.renderCatalog();
      alert('รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว!');
    }
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.adminManager = new AdminManager();
});
