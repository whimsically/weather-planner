var apiKey = "59603c63fa51fa7eaa74959c5bdaf3f9";
var currentWeatherContainer = document.getElementById("current-weather");
var fiveDayContainer = document.getElementById("5day");
var searchHistory = document.getElementById("search-history");
var currentHeader = document.getElementById("current-header");
var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentHumid = document.getElementById("humid");
var currentIcon = document.getElementById("icon");


function clearElements() {
    while (fiveDayContainer.lastChild) {
        fiveDayContainer.removeChild(fiveDayContainer.lastChild);
    }
}

function getSearchValue() {
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
                     //ensures that the string of the city name has a capital letter to begin with then lowercase    
                    var city = citySearched.charAt(0).toUpperCase() + citySearched.toLowerCase().slice(1);

                    //checks localstorage to see if city is already present
                    //if it is not present, adds it and creates an element for it
                    if (!localStorage.getItem(city)) {
                        localStorage.setItem(city, cityLat + "," + cityLon);
                        var searchItem = document.createElement("button");
                        searchItem.textContent = city;
                        searchItem.classList.add("btn");
                        searchItem.classList.add("btn-outline-primary");
                        searchHistory.append(searchItem);
                        var linebreak = document.createElement("br");
                        searchHistory.append(linebreak);

                        //adds event listener to created element
                        searchItem.addEventListener("click", getLatLon);
                    }
                    weatherFromLatLon(city, cityLat, cityLon);
                })
            }
        })
    }
}

function getStorage () {
    for (var i = 0; i < localStorage.length; i++) {
        //creates element for each storage item
        var searchItem = document.createElement("button");
        var cityName = localStorage.key(i);
        var split = localStorage.getItem(cityName).split(",");
        var cityLat = split[0];
        var cityLon = split[1];

        searchItem.textContent = cityName;
        searchItem.classList.add("btn");
        searchItem.classList.add("btn-outline-primary");
        searchHistory.append(searchItem);
        var linebreak = document.createElement("br");
        searchHistory.append(linebreak);

        //adds an event listener to each one
        searchItem.addEventListener("click", getLatLon);
    }
}

function weatherFromLatLon (city, cityLat, cityLon) {
    //clears previous city's forecast if present
    clearElements();

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
                                    } else if ((i + 1) % 8 === 0) {
                                        forecast5Days.push(data.list[i]);
                                    }
                                }
                            //changes text content for the current weather container elements
                            var currentWeatherIcon = currentWeather.weather[0].icon;
                            var currentWeatherIconURL = "http://openweathermap.org/img/w/"+ currentWeatherIcon + ".png";
                            currentIcon.src = currentWeatherIconURL;
                            currentIcon.setAttribute = ("alt", "Weather Icon");
                            currentHeader.textContent = city + " " + currentWeather.dt_txt.slice(0, 10);
                            currentTemp.textContent = "Temperature: " + currentWeather.main.temp + "°F";
                            currentWind.textContent = "Wind: " + currentWeather.wind.gust + " mph";
                            currentHumid.textContent = "Humidity: " + currentWeather.main.humidity;
                            
                            //creates header for five day forecast
                            var forecastHeader = document.createElement("h2");
                            forecastHeader.textContent = "Five Day Forecast for " + city;
                            fiveDayContainer.append(forecastHeader);

                            //loops through each day and creates an element listing forecast for each
                            for (i = 0; i < forecast5Days.length; i++) {
                                //creates a div for each day's forecast
                                var div = document.createElement("div");
                                fiveDayContainer.append(div);
                                //weather icon url from API
                                var weatherIcon = forecast5Days[i].weather[0].icon;
                                //adding my css
                                div.classList.add("forecast");
                                //adding bootstrap classes
                                div.classList.add("col-2");
                                div.classList.add("m-1");
                                div.classList.add("rounded");
                                var icon = document.createElement("img");
                                //adding img url
                                icon.src = ("http://openweathermap.org/img/w/" + weatherIcon + ".png");
                                icon.setAttribute = ("alt", "weather icon");
                                //created variables to hold each value for readbility
                                var date = forecast5Days[i].dt_txt.slice(0, 10);
                                var temp = forecast5Days[i].main.temp + "°F";
                                var wind = forecast5Days[i].wind.gust + "mph";
                                var humidity = forecast5Days[i].main.humidity;
                                div.innerHTML = date + "<br>" + "Temp: " + temp + "<br>" + "Wind: " + wind + "<br>" + "Humidity: " + humidity + "<br>";
                                div.append(icon);
                                }
                            })
                        }
                    })
}

function getLatLon () {
    //getting the lat and lon values from localStorage then passing them to weatherFromLatLon
    var city = this.textContent;
    var split = localStorage.getItem(city).split(",");
    var cityLat = split[0];
    var cityLon = split[1];
    weatherFromLatLon(city, cityLat, cityLon);
}

getStorage();

document.getElementById("search-btn").addEventListener("click", getSearchValue);