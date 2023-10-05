// js/script.js

const apiKey = 'e79197fc47e8e78d290f541ed74c6e8f';

// Function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

// Function to convert temperature from Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);
}

// Function to get user's geolocation
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position.coords),
                (error) => reject(error)
            );
        } else {
            reject(new Error("Geolocation is not available."));
        }
    });
}

// Function to fetch current weather data
async function fetchCurrentWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        throw error;
    }
}

// Function to fetch 5-day forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

// Function to fetch city name suggestions
async function fetchCitySuggestions(query) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`);
        const data = await response.json();
        return data.list.map((item) => item.name);
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        throw error;
    }
}

// Function to display city name suggestions in a dropdown
function displayCitySuggestions(suggestions) {
    const suggestionList = document.getElementById('suggestion-list');

    // Clear the existing suggestions
    while (suggestionList.firstChild) {
        suggestionList.removeChild(suggestionList.firstChild);
    }

    // Create and append new suggestion items
    suggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            // When a suggestion is clicked, populate the input field with the suggestion
            cityInput.value = suggestion;
            // Fetch weather data for the selected city
            fetchAndDisplayWeatherData(suggestion);
            // Clear the suggestion list
            suggestionList.innerHTML = '';
        });
        suggestionList.appendChild(suggestionItem);
    });

    // Show the suggestion list
    suggestionList.style.display = 'block';
}

// Function to display current weather data
// Function to display current weather data
function displayCurrentWeather(data) {
    const cityNameElement = document.getElementById('city-name');
    const weatherIconElement = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    const dateElement = document.getElementById('date');

    // Update elements with weather data
    cityNameElement.textContent = data.name;
    weatherIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
    temperatureElement.textContent = `Temperature: ${kelvinToCelsius(data.main.temp)}°C / ${kelvinToFahrenheit(data.main.temp)}°F`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    
    // Format the date using JavaScript's Date object
    const date = new Date(data.dt * 1000); // Convert timestamp to milliseconds
    dateElement.textContent = `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


// Function to display 5-day forecast data
// Function to display 5-day forecast data
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear any existing forecast data

    // Loop through the forecast data for the next 5 days
    for (let i = 0; i < data.list.length; i++) {
        const forecastItem = data.list[i];
        
        // Create a container for each day's forecast
        const dayContainer = document.createElement('div');
        dayContainer.classList.add('forecast-day');

        // Create and populate elements for each day's forecast
        const dateElement = document.createElement('div');
        dateElement.textContent = new Date(forecastItem.dt * 1000).toLocaleDateString();
        const iconElement = document.createElement('div');
        iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png" alt="Weather Icon">`;
        const tempElement = document.createElement('div');
        tempElement.textContent = `Temperature: ${kelvinToCelsius(forecastItem.main.temp)}°C / ${kelvinToFahrenheit(forecastItem.main.temp)}°F`;
        const windElement = document.createElement('div');
        windElement.textContent = `Wind Speed: ${forecastItem.wind.speed} m/s`;
        const humidityElement = document.createElement('div');
        humidityElement.textContent = `Humidity: ${forecastItem.main.humidity}%`;

        // Append elements to the day's container
        dayContainer.appendChild(dateElement);
        dayContainer.appendChild(iconElement);
        dayContainer.appendChild(tempElement);
        dayContainer.appendChild(windElement);
        dayContainer.appendChild(humidityElement);

        // Append the day's container to the forecast container
        forecastContainer.appendChild(dayContainer);
    }
}


// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();

    if (city !== '') {
        try {
            // Fetch current weather data and forecast
            const currentWeather = await fetchCurrentWeather(city);
            const forecast = await fetchForecast(city);

            // Display current weather and forecast
            displayCurrentWeather(currentWeather);
            displayForecast(forecast);

            // Store the searched city in localStorage for search history
            // Add code to update the search history section
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Handle errors, e.g., display an error message to the user
        }
    }
});

// Event listener for unit conversion toggle
const unitToggle = document.getElementById('unit-toggle');
unitToggle.addEventListener('change', () => {
    // Toggle between Celsius and Fahrenheit and update the displayed temperatures
});

// Event listener for geolocation button
const geolocationButton = document.getElementById('geolocation-button');
geolocationButton.addEventListener('click', async () => {
    try {
        // Get user's location
        const coords = await getUserLocation();

        // Fetch weather data for user's location
        const currentWeather = await fetchCurrentWeatherByCoords(coords.latitude, coords.longitude);
        const forecast = await fetchForecastByCoords(coords.latitude, coords.longitude);

        // Display weather data for user's location
        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle errors, e.g., display an error message to the user
    }
});

// Event listener for search input suggestions
const cityInput = document.getElementById('city-input');
cityInput.addEventListener('input', async () => {
    const query = cityInput.value.trim();
    if (query !== '') {
        try {
            // Fetch city name suggestions
            const suggestions = await fetchCitySuggestions(query);
            // Display the suggestions as a dropdown
            displayCitySuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
        }
    } else {
        // Clear the suggestion list when the input is empty
        document.getElementById('suggestion-list').innerHTML = '';
    }
});

// Initialize the application and set up initial state...
