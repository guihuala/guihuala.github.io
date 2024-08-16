<template>
  <div class="weather-container">
    <button @click="fetchWeatherByLocation">获取当地天气</button>
    <div v-if="weather && weather.main && weather.weather">
      <h3>你在{{ weather.name }}</h3>
      <p>气温: {{ weather.main.temp }}°C</p>
      <p>天气: {{ weather.weather[0].description }}</p>
    </div>
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weather: null,
      error: ''
    };
  },
  methods: {
    fetchWeatherByLocation() {
      // 确保只在客户端执行
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=992dbd2e354f0655a532d7822bc5458c&units=metric`)
              .then(response => response.json())
              .then(data => {
                console.log(data); // 调试输出 API 返回的数据
                if (data && data.main && data.weather) {
                  this.weather = data;
                } else {
                  this.error = 'Unexpected data format from API';
                }
              })
              .catch(err => {
                this.error = 'Error fetching weather data';
                console.error(err);
              });
          },
          error => {
            this.error = 'Unable to retrieve your location';
            console.error(error);
          }
        );
      } else {
        this.error = 'Geolocation is not supported by this browser';
      }
    }
  }
};
</script>

<style scoped>
.weather-container{
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: space-around;
  justify-content: center;
}
button {
  border: 0px;
  background: #ffd166;
  height: 3rem;
  margin: 1rem 0.5rem;
  padding: 0rem 1rem 0 1rem;
  border-radius: 1.5rem;
  font-size: 1rem;
  line-height: 3;
  text-align: center;
}

button:hover {
  background: #ffdf95;
}
</style>

  