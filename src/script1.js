// script
const apiKey1 = '88f429b96c83addb0a18c8c2c5045e87'; // my API key
const apiUrl1 = 'https://api.openweathermap.org/data/2.5/weather'; // API URL for current weather
const forecastUrl1 = 'https://api.openweathermap.org/data/2.5/forecast'; // API URL for forecast weather
const geocodingApiUrl1 = 'https://api.openweathermap.org/geo/1.0/direct'; // API URL for geocoding
const reverseGeocodingApiUrl1 = 'https://api.openweathermap.org/geo/1.0/reverse'; // API URL for reverse geocoding

// Event listener to execute when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // include addEventListener search button
  document.getElementById('searchbutton').addEventListener('click', () => {
    const city = document.getElementById('city-input').value; // Get the city input value
    if (city) {
      getWeather(city); // Fetch current weather for the entered city
      getExtendedForecast(city); // Fetch forecast weather for the entered city
      updateRecentlySearchedCities(city); // Update the list of recently searched cities
    }
  });

  // Fetch current location weather using geolocation API
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getCityNameFromCoordinates(latitude, longitude).then((cityName) => {
      getWeather(cityName); // Fetch weather based on current location
    });
  });
});

// Function to get city name from coordinates using reverse geocoding API
async function getCityNameFromCoordinates(lat, lon) {
  const url = `${reverseGeocodingApiUrl1}?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey1}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0].name;
}

// Function to get current weather for a city
async function getWeather(city) {
  try {
    if (!city) throw new Error('Please enter a city name'); // Check if city name is entered
    const response = await fetch(`${apiUrl1}?q=${city}&appid=${apiKey1}&units=metric`); // Fetch weather data
    if (!response.ok) throw new Error('City not found'); // Handle city not found error
    const data = await response.json();
    displayWeather(data); // Display weather data
  } catch (error) {
    clearWeatherDisplay(); // Clear previous weather data
    displayError(error.message); // Display error message
  }
}

// Function to get current weather based on location
async function getWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(`${apiUrl1}?lat=${lat}&lon=${lon}&appid=${apiKey1}&units=metric`); // Fetch weather data
    if (!response.ok) throw new Error('Location not found'); // Handle location not found error
    const data = await response.json();
    displayWeather(data); // Display weather data
  } catch (error) {
    clearWeatherDisplay(); // Clear previous weather data
    displayError(error.message); // Display error message
  }
}

// Function to get extended forecast for a city
async function getExtendedForecast(city) {
  try {
    const response = await fetch(`${forecastUrl1}?q=${city}&appid=${apiKey1}&units=metric`); // Fetch forecast data
    if (!response.ok) throw new Error('City not found'); // Handle city not found error
    const data = await response.json();
    displayForecast(data); // Display forecast data
  } catch (error) {
    clearForecastDisplay(); // Clear previous forecast data
    displayError(error.message); // Display error message
  }
}

// Function to display current weather data
function displayWeather(data) {
    clearWeatherDisplay(); // Clear previous weather data
    const weatherDisplay = document.getElementById('weather-display');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDisplay.innerHTML = `
             <div class="justify-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 p-8 rounded-lg shadow-md transform transition duration-500 hover:scale-105">
            <h2 class="text-4xl font-extrabold mb-6" style="margin-bottom: 0.5rem;">${data.name}</h2>
            <img src="${iconUrl}" alt="Weather Icon" class=" r w-12 h-12 mb-4 items-center mx-auto ">
     
            <p class=" text-2xl">🌡️ Temperature: ${data.main.temp}°C</p>
            <p class="text-2xl">💧 Humidity: ${data.main.humidity}%</p>
            <p class="text-2xl">💨 Wind Speed: ${data.wind.speed} m/s</p>
        </div>
    `;
}

// Function to display forecast weather data

function displayForecast(data) {
    clearForecastDisplay(); // Clear previous forecast data
    const forecastDisplay = document.getElementById('forecast-display');
    forecastDisplay.innerHTML = `
        <h2 class="text-4xl font-extrabold text-center mb-8">5-Day Forecast</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${data.list.slice(0, 5).map(day => {
                const date1 = new Date(day.dt * 1000);
                const formattedDate1 = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(date1);
                return `
                     <div class=" justify-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 p-8 rounded-lg shadow-md transform transition duration-500 hover:scale-105 ">
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon" class="w-12 h-12 mb-4  items-center mx-auto">  
                        <p class=" text-center text-2xl datebold">${formattedDate1}</p>
                        <p class= "text-center">Temp: ${day.main.temp}°C</p>
                        <p class= "text-center">Wind: ${day.wind.speed} m/s</p>
                        <p class= "text-center">Humidity: ${day.main.humidity}%</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Function to display error messages
function displayError(message) {
    const errorDisplay = document.getElementById('weather-display');
    errorDisplay.innerHTML = `
        <div class=" bg-red-500 error text-white p-4 rounded-lg shadow-lg">
            <p class="font-bold">${message}</p>
        </div>
    `;
}

// Function to clear current weather display
function clearWeatherDisplay() {
    document.getElementById('weather-display').innerHTML = '';
}

// Function to clear forecast display
function clearForecastDisplay() {
    document.getElementById('forecast-display').innerHTML = '';
}

// Function to update the list of recently searched cities
function updateRecentlySearchedCities(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || []; // Get recent cities from local storage
    if (!cities.includes(city)) {
        cities.push(city); // Add new city to the list
        localStorage.setItem('recentCities', JSON.stringify(cities)); // Save updated list to local storage
        updateCityDropdown(cities); // Update the city dropdown with the new list
    }
}

// Function to update the city dropdown with recent searches
function updateCityDropdown(cities) {
    const dropdown = document.getElementById('city-dropdown');
    if (!dropdown) {
        // Create a new dropdown if it doesn't exist
        // <!-- Create a new dropdown if it doesn't exist -->
        const newheading = document.createElement('p');
        newheading.innerHTML = `<h2 class="text-xl font-extrabold text-start mt-4">Recent Search</h2>`;
        const newDropdown = document.createElement('div');
        newDropdown.className = 'flex flex-col justify-center w-full bg-white rounded-lg shadow-md p-4';
        newDropdown.innerHTML = `
          <select id="city-dropdown" class="p-3 pl-10 text-sm text-gray-700">
            ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
          </select>
          <ul id="city-list" class="list-none mb-0">
            ${cities.map(city => `<li class="py-2 border-b border-gray-200"><a href="#" class="text-gray-700 hover:text-gray-900">${city}</a></li>`).join('')}
          </ul>
        `;
        document.getElementById('app').appendChild(newheading); // Add the heading to the app
        document.getElementById('app').appendChild(newDropdown); // Add the new dropdown to the app
        // document.getElementById('app').appendChild(newDropdown); // Add the new dropdown to the app
    }
    const dropdownElement = document.getElementById('city-dropdown');
    dropdownElement.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join(''); // Populate the dropdown with cities
}

// Load recently searched cities on page load
document.addEventListener('DOMContentLoaded', () => {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        updateCityDropdown(cities); // Update the city dropdown if there are recent searches
    }
});

