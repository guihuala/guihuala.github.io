<template>
  <section class="weather-card">
    <h3>天气助手</h3>

    <div class="actions">
      <button type="button" :disabled="loading" @click="fetchWeatherByLocation">
        {{ loading ? "获取中..." : "定位获取天气" }}
      </button>
      <div class="search">
        <input
          v-model.trim="city"
          type="text"
          placeholder="输入城市名，如 杭州"
          @keydown.enter.prevent="fetchWeatherByCity"
        />
        <button type="button" :disabled="loading || !city" @click="fetchWeatherByCity">查询城市</button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="weather" class="result">
      <h4>{{ weather.name }}</h4>
      <p>{{ weather.desc }}</p>
      <div class="facts">
        <span>温度 {{ weather.temp }}°C</span>
        <span>体感 {{ weather.feelsLike }}°C</span>
        <span>湿度 {{ weather.humidity }}%</span>
        <span>风速 {{ weather.wind }} km/h</span>
      </div>
      <small>数据来源：Open-Meteo</small>
    </div>
  </section>
</template>

<script>
const WEATHER_TEXT = {
  0: "晴朗",
  1: "大体晴",
  2: "局部多云",
  3: "阴天",
  45: "雾",
  48: "霜雾",
  51: "小毛毛雨",
  53: "毛毛雨",
  55: "强毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  80: "阵雨",
  81: "较强阵雨",
  82: "强阵雨",
  95: "雷雨",
};

export default {
  data() {
    return {
      loading: false,
      weather: null,
      city: "",
      error: "",
    };
  },
  methods: {
    async fetchWeatherByLocation() {
      this.error = "";
      this.weather = null;
      if (!(typeof navigator !== "undefined" && navigator.geolocation)) {
        this.error = "当前浏览器不支持定位。";
        return;
      }

      this.loading = true;
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const name = await this.reverseGeocode(coords.latitude, coords.longitude);
            await this.fetchWeather(coords.latitude, coords.longitude, name);
          } catch (error) {
            this.error = "获取定位天气失败。";
            console.error(error);
          } finally {
            this.loading = false;
          }
        },
        () => {
          this.loading = false;
          this.error = "未获取到定位权限。";
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    },
    async fetchWeatherByCity() {
      if (!this.city) return;
      this.error = "";
      this.weather = null;
      this.loading = true;

      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            this.city
          )}&count=1&language=zh&format=json`
        );
        const data = await response.json();
        if (!data?.results?.length) {
          this.error = "未找到该城市，请尝试更完整的名称。";
          this.loading = false;
          return;
        }

        const cityInfo = data.results[0];
        const name = [cityInfo.name, cityInfo.admin1, cityInfo.country]
          .filter(Boolean)
          .join(" · ");
        await this.fetchWeather(cityInfo.latitude, cityInfo.longitude, name);
      } catch (error) {
        this.error = "查询失败，请稍后重试。";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async reverseGeocode(lat, lon) {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=zh&format=json`
      );
      const data = await response.json();
      if (!data?.results?.length) return "当前位置";
      const result = data.results[0];
      return [result.name, result.admin1, result.country].filter(Boolean).join(" · ");
    },
    async fetchWeather(lat, lon, name) {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();
      const current = data?.current;
      if (!current) {
        this.error = "天气数据格式异常。";
        return;
      }

      this.weather = {
        name,
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        wind: Number(current.wind_speed_10m).toFixed(1),
        desc: WEATHER_TEXT[current.weather_code] || "天气状态未知",
      };
    },
  },
};
</script>

<style scoped>
.weather-card {
  width: min(760px, 100%);
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 188, 212, 0.24);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 26px rgba(2, 132, 199, 0.14);
}

h3 {
  margin: 0 0 0.75rem;
  color: #02738a;
}

.actions {
  display: grid;
  gap: 0.65rem;
}

.search {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
}

input {
  min-height: 2.6rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 188, 212, 0.35);
  padding: 0 0.9rem;
  color: #035f78;
}

button {
  min-height: 2.6rem;
  border: none;
  border-radius: 999px;
  padding: 0 1rem;
  background: #ffd54f;
  color: #035f78;
  font-weight: 900;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #ffe082;
}

.result {
  margin-top: 0.9rem;
  border-radius: 12px;
  padding: 0.85rem;
  background: linear-gradient(135deg, #e0f7fa 0%, #fff9c4 100%);
}

.result h4 {
  margin: 0;
  color: #02738a;
}

.result p {
  margin: 0.4rem 0 0;
  color: #03618f;
  font-weight: 700;
}

.facts {
  margin-top: 0.65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.facts span {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  color: #03618f;
  font-size: 0.85rem;
  font-weight: 700;
}

.error {
  margin-top: 0.75rem;
  color: #c57947;
  font-weight: 700;
}
</style>
