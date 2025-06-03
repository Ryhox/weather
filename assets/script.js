const apiKey = "675db84d584f47dc9c9192337252602"; // mh. im just gonna trust that noone is going to abuse it. right? haha

const cityInput = document.getElementById("city");
const burgerMenu = document.querySelector('.burger-menu');
const closeMenuBtn = document.querySelector('.close-menu');
const citiesContainer = document.querySelector('.cities-container');
const citiesList = document.querySelector('.cities-list');

cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

document.querySelectorAll('.popular-cities li').forEach(item => {
    item.addEventListener('click', () => {
        const city = item.textContent;
        getWeather(city);
    });
});

citiesList.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
        const city = item.textContent;
        getWeather(city);
        closeCitiesMenu();
    });
});

burgerMenu.addEventListener('click', toggleCitiesMenu);
closeMenuBtn.addEventListener('click', closeCitiesMenu);

function toggleCitiesMenu() {
    burgerMenu.classList.toggle('active');
    citiesContainer.classList.toggle('active');
    
    if (citiesContainer.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeCitiesMenu() {
    burgerMenu.classList.remove('active');
    citiesContainer.classList.remove('active');
    document.body.style.overflow = '';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function getWeather(cityName) {
    const city = cityName || document.getElementById("city").value;
    if (!city) return;
    
    const formattedCity = capitalizeFirstLetter(city);
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateWeatherUI(data, formattedCity);
        } else {
            alert("City not found");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(data, formattedCity) {
    document.getElementById("temperature").innerText = `${data.current.temp_c}°C`;
    document.getElementById("condition").innerText = data.current.condition.text;
    document.getElementById("icon").src = `https:${data.current.condition.icon}`;
    document.getElementById("city-name").innerText = formattedCity;
    
    updateForecast(data.forecast.forecastday);
    updateMap(data.location.lat, data.location.lon);
    
    document.getElementById("waiting-text").style.display = "none";
    document.getElementById("weather-container").style.display = "block";
    document.getElementById("map").style.display = "block";
    document.getElementById("forecast").style.display = "flex";
}

function updateForecast(forecast) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    forecast.forEach(day => {
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
            <h4>${new Date(day.date).toLocaleDateString()}</h4>
            <p>${day.day.avgtemp_c}°C</p>
            <img src="https:${day.day.condition.icon}" alt="Weather icon">
            <p>${day.day.condition.text}</p>
        `;
        forecastContainer.appendChild(card);
    });
}

let map;
let marker;

function initMap(lat = 0, lon = 0) {
    setTimeout(() => {
        if (!map) {
            map = L.map('map').setView([lat, lon], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            marker = L.marker([lat, lon]).addTo(map);
        } else {
            map.invalidateSize();
            map.setView([lat, lon], 10);
            marker.setLatLng([lat, lon]);
        }
    }, 300);
}

function updateMap(lat, lon) {
    initMap(lat, lon);
}

window.addEventListener('load', () => {
    initMap(0, 0);
});