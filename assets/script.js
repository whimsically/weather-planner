var apiKey = "59603c63fa51fa7eaa74959c5bdaf3f9";

function checkAPI () {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=" + apiKey)
    .then(function (response) {
        if (response.ok) {
            console.log(response.json());
        }
    })
}

checkAPI();