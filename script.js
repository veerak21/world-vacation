var apiKey = "b18645d8b7e81b3823fffbad4fabb137"
var today = moment().format('DD/MM/YYYY');
var searchHistoryList = [];

// add on click event listener 
$("#search-btn").on("click", function(event) {
    event.preventDefault();

    var city = $("#search-city").val().trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

// function current condition
function currentCondition(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);
        
        $("#weather-content").css("display", "block");
        $("#city-detail").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        //This code presents a city's current weather.
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} 
                </h2>
                ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            
            <p>Temperature: ${cityWeatherResponse.main.temp} °C</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);

        $("#city-detail").append(currentCity);

        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        
        futureCondition(lat, lon);
            
        });
    };


// future conditions function
function futureCondition(lat, lon) {

    // presents five day forecast
    var futureURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(futureResponse) {
        console.log(futureResponse);
        $("#seven-day").empty();
        
        for (let i = 1; i < 7; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                humidity: futureResponse.daily[i].humidity,
                wind: futureResponse.daily[i].wind_speed,
               
            };

            var currDate = moment.unix(cityInfo.date).format("DD/MM/YYYY");
            var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

          // This code presents the city's weather for the next 6 days.
            var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-4 pt-2 mb-2 w-20px">
                        <div class="card-body">
                            <h5>${currDate}</h5>
                            <p>${iconURL}</p>
                            <p>Temp: ${cityInfo.temp} °C</p>
                            <p>Humidity: ${cityInfo.humidity}\%</p>
                            <p>Wind: ${cityInfo.wind} MPH</p>
                           
                        </div>
                    </div>
                <div>
            `);

            $("#seven-day").append(futureCard);
        }
    }); 
}


