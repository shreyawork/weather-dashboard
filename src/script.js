// script
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const API_KEY = "88f429b96c83addb0a18c8c2c5045e87";
const weatherCarddiv = document.getElementById("weather-cards");
const currentweatherdiv = document.getElementById("currentWeather");
const currentLocationButton = document.getElementById("currentLocationButton");

// Add event listener to search button
searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName!== "") {
    getWeatherDetails(cityName);
  } else {
    alert("Please enter a city name");
  }
});

const createWeatherCard = (cityName, weatherItem, index) => {
  try {
    const date = new Date(weatherItem.dt * 1000);
    const day = date.toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`;
    const temp = Math.round(weatherItem.main.temp - 273.15);
    const wind = weatherItem.wind.speed;
    const humidity = weatherItem.main.humidity;

    if (index === 0) {
      return `
        <div id="currentWeather" class="bg-blue-200 rounded p-4 transition duration-300 ease-in-out hover:scale-110">
          <h2 id="currentCity" class="text-xl font-bold text-blue-900 mb-2">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
          <p id="currentTemp" class="text-gray-700">🌡️ Temperature: ${temp}°C</p>
          <p id="currentWind" class="text-gray-700"> 💨Wind: ${wind} M/S</p>
          <p id="currentHumidity" class="text-gray-700"> 💧Humidity: ${humidity}%</p>
          <img id="currentWeatherIcon" src="${iconUrl}" alt="Weather Icon" class="w-16 h-16 mx-auto mt-2">
          <p id="currentWeatherDescription" class="text-gray-700 mt-2">Light Rain</p>
        </div>
      `;
    } else {
      return `
        <div id="day1" class="bg-blue-100 rounded p-4 transition duration-300 ease-in-out hover:scale-110">
          <h3 class="text-xl font-bold text-blue-900 mb-2">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
          <img id="day1Icon" src="${iconUrl}" alt="Weather Icon" class="w-16 h-16 mx-auto mt-2">
          <p id="day1Temp" class="text-gray-700"> 🌡️Temp: ${temp}°C</p>
          <p id="day1Wind" class="text-gray-700">💨 Wind: ${wind} m/s</p>
          <p id="day1Humidity" class="text-gray-700">💧 Humidity: ${humidity}%</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error creating weather card:", error);
    return "";
  }
};

const getWeatherDetails = (cityName) => {
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
   .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch geocoding data");
      }
      return res.json();
    })
   .then((data) => {
      if (data.length === 0) {
        alert("City not found");
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      getWeatherForecast(lat, lon, cityName);
    })
   .catch((error) => {
      console.error("Error fetching geocoding data:", error);
      alert("An error occurred while fetching the geocoding data!");
    });
};

const getWeatherForecast = (lat, lon, cityName) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
   .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return res.json();
    })
   .then((data) => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {

        const forecastDate = new Date(forecast.dt * 1000).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      // clearing previous weather data
      cityInput.value = "";
      currentweatherdiv.innerHTML = "";
      weatherCarddiv.innerHTML = "";

      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentweatherdiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        } else {
          weatherCarddiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
        }
      });
    })
    .catch((error) => {
      alert("An error occurred while fetching the coordinatet!");
    });
    };
    const getuserCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          // get city name from coordinates using reverse geocoding api
          fetch(REVERSE_GEOCODING_URL)
            .then(response => response.json())
            .then(data => {
              const { name } = data[0];
              getWeatherForecast(latitude, longitude, name); // Corrected the order of parameters
            }).catch(error => {
              console.error("Error fetching city name:", error);
              alert("An error occurred while fetching the city!");
            });
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Geolocation request denied. Please reset location permission to grant access again");
          }
        }
      );
    }
    
    currentLocationButton.addEventListener("click", getuserCoordinates);
    // searchButton.addEventListener("click", getCityCoordinates); // This line is not needed, as you already have an event listener for searchButton
    cityInput.addEventListener("keyup", e => e.key === "Enter" && searchButton.click()); // Corrected the event listener
//     const getuserCoordinates = () => {
//   navigator.geolocation.getCurrentPosition(
//     position => {
//       const { latitude, longitude } = position.coords;
//       const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
// //  get city name from coordinates using reverse geocodng api
//       fetch(REVERSE_GEOCODING_URL)
//         .then(response => response.json())
//         .then(data => {
//           const{name } =data[0];
//           getWeatherForecast(name,latitude, longitude );
//         }).catch(() => {
//           alert("an error occurd while fetching the city!")
//         });
        
//     },
//     error => {
//       if (error.code === error.PERMISSION_DENIED) {
//         alert("Geolocation request denied. Please reset location permission to grant access again");
//       }
//     }
//   );
// }
    
//     currentLocationButton.addEventListener("click", getuserCoordinates);
//     searchButton.addEventListener("click", getCityCoordinates);
    // cityInput.addEventListener("keyup", e => e.key == "Enter" && getCityCoordinates());