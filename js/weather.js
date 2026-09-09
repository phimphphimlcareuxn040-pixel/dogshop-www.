/* ==========================================================================
   Paw Paradise - Real-Time Weather & Clock Manager (Chiang Mai Location)
   ========================================================================== */

class WeatherClockManager {
  constructor() {
    this.city = "Chiang Mai (เชียงใหม่)";
    // Coordinates for Chiang Mai, Thailand
    this.lat = 18.7883;
    this.lng = 98.9853;
    this.init();
  }

  init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.fetchLiveWeather();
    // Refresh weather every 10 minutes
    setInterval(() => this.fetchLiveWeather(), 600000);
  }

  updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour12: false });
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('th-TH', dateOptions);

    // Update top bar clock
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      clockEl.textContent = timeStr;
    }

    const dateEl = document.getElementById('live-date');
    if (dateEl) {
      dateEl.textContent = dateStr;
    }
  }

  async fetchLiveWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lng}&current_weather=true&hourly=relativehumidity_2m`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather API request failed");
      const data = await res.json();
      
      const temp = Math.round(data.current_weather.temperature);
      // Get current hour humidity from hourly array
      const currentHour = new Date().getHours();
      const humidity = data.hourly?.relativehumidity_2m ? data.hourly.relativehumidity_2m[currentHour] || 65 : 68;
      const weatherCode = data.current_weather.weathercode;
      
      const weatherStatus = this.interpretWeatherCode(weatherCode);

      this.renderWeatherData(temp, humidity, weatherStatus);
    } catch (err) {
      console.warn("Using fallback Chiang Mai weather data due to network:", err);
      // Fallback realistic Chiang Mai mountain weather values
      const fallbackTemp = 28;
      const fallbackHumidity = 70;
      const fallbackStatus = { text: "อากาศสบาย อบอุ่น ⛅", icon: "⛅" };
      this.renderWeatherData(fallbackTemp, fallbackHumidity, fallbackStatus);
    }
  }

  interpretWeatherCode(code) {
    if (code === 0) return { text: "ท้องฟ้าแจ่มใส ☀️", icon: "☀️" };
    if (code <= 3) return { text: "มีเมฆบางส่วน ⛅", icon: "⛅" };
    if (code <= 67) return { text: "ฝนตกเล็กน้อย 🌧️", icon: "🌧️" };
    if (code <= 82) return { text: "ฝนฟ้าคะนอง ⛈️", icon: "⛈️" };
    return { text: "อากาศอบอุ่น 🌤️", icon: "🌤️" };
  }

  renderWeatherData(temp, humidity, status) {
    // Top bar weather badge
    const topBarWeather = document.getElementById('top-bar-weather');
    if (topBarWeather) {
      topBarWeather.innerHTML = `${status.icon} ${this.city} ${temp}°C | ความชื้น ${humidity}%`;
    }

    // Main weather card on hero
    const tempEl = document.getElementById('weather-temp');
    if (tempEl) tempEl.textContent = `${temp}°C`;

    const humidityEl = document.getElementById('weather-humidity');
    if (humidityEl) humidityEl.textContent = `${humidity}%`;

    const statusEl = document.getElementById('weather-status');
    if (statusEl) statusEl.textContent = status.text;

    const tipEl = document.getElementById('weather-dog-tip');
    if (tipEl) {
      if (temp > 33) {
        tipEl.innerHTML = "💡 <b>คำแนะนำสำหรับสุนัขวันนี้ (เชียงใหม่):</b> อากาศร้อนจัด! ควรพาน้องหมาเดินเล่นช่วงเช้า/เย็น และเตรียมน้ำดื่มสะอาดตลอดเวลา 💧";
      } else if (humidity > 80) {
        tipEl.innerHTML = "💡 <b>คำแนะนำสำหรับสุนัขวันนี้ (เชียงใหม่):</b> ความชื้นสูง เป่าขนให้น้องแห้งสนิทหลังอาบน้ำ เพื่อป้องกันเชื้อรา 🧼";
      } else {
        tipEl.innerHTML = "💡 <b>คำแนะนำสำหรับสุนัขวันนี้ (เชียงใหม่):</b> อากาศดี เหมาะสำหรับพาน้องหมาออกไปวิ่งเล่นตามสวนสาธารณะในเชียงใหม่ 🐕🏃";
      }
    }
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.weatherClockManager = new WeatherClockManager();
});
