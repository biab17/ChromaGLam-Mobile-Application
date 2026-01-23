const axios = require('axios');

exports.getCurrentWeather = async (city = 'Bucharest') => {
    try {
         const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=API_KEY`);
        return { temp: res.data.main.temp, condition: res.data.weather[0].main };


    } catch (error) {
        return { temp: 20, condition: 'Clear' };
    }
};