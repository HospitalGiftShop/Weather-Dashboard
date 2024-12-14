import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city,
            this.date = date,
            this.icon = icon,
            this.iconDescription = iconDescription,
            this.tempF = tempF,
            this.windSpeed = windSpeed,
            this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor(cityName) {
        this.baseURL = `${process.env.API_BASE_URL}`;
        this.apiKey = `${process.env.API_KEY}`;
        this.cityName = cityName;
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/geo/1.0/direct?${query}`);
        if (!response.ok) {
            console.log('could not fetch location data');
            return [];
        }
        else {
            const coordinates = await response.json();
            return coordinates;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        try {
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;
            return { lat: lat, lon: lon };
        }
        catch (error) {
            console.error(`location not found`);
            this.cityName = `location not found`;
            return { lat: 90, lon: 0 };
        }
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        return this.destructureLocationData(await this.fetchLocationData(this.buildGeocodeQuery()));
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const currentWeather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?${this.buildWeatherQuery(coordinates)}`)).json();
        const forecast = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?${this.buildWeatherQuery(coordinates)}`)).json();
        return { currentWeather: currentWeather, forecast: forecast };
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const current = response;
        return new Weather(this.cityName, `${(new Date()).toDateString()}`, current.weather[0].icon, current.weather[0].description, current.main.temp, current.wind.speed, current.main.humidity);
    }
    parseForecast(response) {
        const daysUnfiltered = response.list;
        const days = daysUnfiltered.filter((entry) => entry.dt_txt.includes(`12:00:00`));
        const forecast = [];
        for (const day of days) {
            const weather = new Weather(this.cityName, day.dt_txt.slice(0, -9), day.weather[0].icon, day.weather[0].description, day.main.temp, day.wind.speed, day.main.humidity);
            forecast.push(weather);
        }
        return forecast;
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const weatherArray = [currentWeather];
        weatherArray.push(...weatherData);
        return weatherArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity() {
        try {
            const locationData = await this.fetchAndDestructureLocationData();
            const combinedWeatherData = await this.fetchWeatherData(locationData);
            const current = this.parseCurrentWeather(combinedWeatherData.currentWeather);
            const forecast = this.parseForecast(combinedWeatherData.forecast);
            const weather = this.buildForecastArray(current, forecast);
            return weather;
        }
        catch (error) {
            console.error(`there was an error getting weather data`);
            return;
        }
    }
}
export default WeatherService;
