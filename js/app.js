const $ = document;
const apiKey = process.env.API_KEY || "Your Openweather API Key";
const homeBtn = $.querySelector("#home");
const weatherEl = $.querySelector(".weather");
const temp = $.querySelector("#temp span");
const cityEl = $.querySelector("#city");
const wind = $.querySelector("#wind");
const humidity = $.querySelector("#humidity");
const precipitation = $.querySelector("#precipitation");
const tempIcon = $.querySelector("#temp img");
const searchBtn = $.querySelector("#search-btn");
const searchInp = $.querySelector("#search");

class Weather {
  constructor() {
    // super();
    this.weather = null;
    this.precipitation = "Loading...";
  }
  fetchWeather(city) {
    this.precipitation = "loading...";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((res) => {
        this.weather = res;
        this.showWeather();
      });

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((res) => {
        this.precipitation = res.list[res.list.length - 1].pop;
        this.showWeather();
      });
  }
  showWeather() {
    const res = this.weather;
    $.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${
      res.name
    } ${res.weather[0].icon.includes('d') ? 'Day' : 'Night'}`;
    weatherEl.classList.remove("loading");
    temp.innerHTML = res.main.temp;
    cityEl.innerHTML = res.name;
    tempIcon.src = `http://openweathermap.org/img/w/${res.weather[0].icon}.png`;
    wind.innerHTML = `${res.wind.speed}/KMH`;
    humidity.innerHTML = `${res.main.humidity}%`;
    precipitation.innerHTML = this.precipitation;
  }
}

let weather = new Weather();

window.addEventListener("load", homeWeather);
homeBtn.addEventListener("click", homeWeather);
searchBtn.addEventListener("click", searchBtnClckHandler);
searchInp.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    searchBtnClckHandler();
  }
});

function homeWeather() {
  weatherEl.classList.add("loading");
  fetch("https://ipinfo.io?token=bf002711d48d64")
    .then((res) => res.json())
    .then((res) => {
      weather.fetchWeather(res.city);
    });
}

function searchBtnClckHandler() {
  weather.fetchWeather(searchInp.value);
}
