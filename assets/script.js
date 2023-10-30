var apiKey = "59603c63fa51fa7eaa74959c5bdaf3f9";
var currentWeatherContainer = document.getElementById("current-weather");
var fiveDayContainer = document.getElementById("5day");
var currentHeader = document.getElementById("current-header");
var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHumid = document.getElementById("humid");

function getWeather() {
    //getting the search box's value
    var citySearched = document.getElementById("citysearch").value;

    //checking to be sure the box has a value
    if (citySearched) {
        //using openweather's geocoding API to get the latitude and longitude
        //the built in geocoding is deprecated, so I am using this as suggested by the documentation
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + citySearched + "&limit=1&appid=" + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then (function (data){
                    //storing lat and lon values
                    var cityLat = data[0].lat;
                    var cityLon = data[0].lon;

                    //getting 5 day forecast for the selected city
                    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" +cityLon + "&units=imperial&appid=" + apiKey)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then (function (data) {
                                var forecast5Days = [];
                                var currentWeather;
                                for (let i = 0; i < data.list.length; i++) {
                                    if (i === 0) {
                                        currentWeather = data.list[i];
                                        console.log(currentWeather);
                                    } else if ((i + 1) % 8 === 0) {
                                        forecast5Days.push(data.list[i]);
                                    }
                                }
                            //ensures that the string of the city name has a capital letter to begin with then lowercase    
                            var city = citySearched.charAt(0).toUpperCase() + citySearched.toLowerCase().slice(1); 

                            //changes text content for the current weather container elements
                            currentHeader.textContent = city + " " + currentWeather.dt_txt.slice(0, 10);
                            currentTemp.textContent = "Temperature: " + currentWeather.main.temp + "°F";
                            currentWind.textContent = "Wind: " + currentWeather.wind.gust + " mph";
                            currentHumid.textContent = "Humidity: " + currentWeather.main.humidity;
                            })

                        
                        }
                    })
                })
            }
        })
    }
}

document.getElementById("search-btn").addEventListener("click", getWeather);