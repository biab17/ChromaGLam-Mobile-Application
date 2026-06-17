export function generateWeatherTip(weather) {
  if (!weather) return "Enjoy your day!";

  const id = weather.weather?.[0]?.id;
  const temp = Math.round(weather.main?.temp);
  const wind = weather.wind?.speed;

  if (!id) return "Enjoy your day!";

  if (id >= 200 && id <= 232) return "Storm outside! Stay safe and avoid open spaces.";

  if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
    if (temp <= 10) return "Cold rain. You'll need a warm waterproof coat and an umbrella.";
    if (temp > 10 && temp <= 20) return "Chilly rain. Don't forget your umbrella and a light jacket.";
    return "Warm rain. A light umbrella or raincoat is enough.";
  }

  if (id >= 600 && id <= 622) {
    if (temp <= -10) return "Extreme cold and snow! Layer up with thermals and a heavy parka.";
    return "Snowing. Watch out for ice and enjoy the winter vibes!";
  }

  if (id >= 701 && id <= 781) return "Reduced visibility. Be extra careful while moving outside.";

  if (id === 800) {
    if (temp >= 30) return "Extreme heat! Stay hydrated and avoid the sun.";
    if (temp >= 20) return "Beautiful sunny day. Don't forget your sunglasses!";
    if (temp <= 5) return "Clear but freezing. Dress warmly in layers.";
    return "Clear sky! Perfect weather for a walk.";
  }

  if (id >= 801 && id <= 804) {
    if (temp <= 5) return "Cloudy and cold. A thick winter coat is a must.";
    if (temp > 5 && temp <= 15) return "Grey and chilly. A sweater and a jacket should do.";
    if (temp > 15 && temp <= 25) return "Mild and cloudy. Perfect temperature for a light hoodie.";
    return "Warm and overcast. Stay comfortable!";
  }

  if (wind > 12) return "Strong wind alert. Watch out for flying objects!";

  return "Enjoy your day, no matter the weather!";
}