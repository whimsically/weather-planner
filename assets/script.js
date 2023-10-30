var apiKey = "59603c63fa51fa7eaa74959c5bdaf3f9";

function getWeather() {
    //getting the search box's value
    var citySearched = document.getElementById("citysearch").value;

    //checking to be sure the box has a value
    if (citySearched) {
        //using openweather's geocoding API to get the latitude and longitude
        fetch("https://api.openweathermap.org/geo/1.0/direct?q=" +citySearched + "&limit=1&appid=" + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then (function (data){
                    //storing lat and lon values
                    var cityLat = data[0].lat;
                    var cityLon = data[0].lon;

                    //getting 5 day forecast for the selected city
                    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" +cityLon + "&appid=" + apiKey)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then (function (data) {
                                console.log(data);
                            })
                        }
                    })
                })
            }
        })
    }
}

document.getElementById("search-btn").addEventListener("click", getWeather);