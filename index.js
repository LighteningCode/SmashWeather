
document.addEventListener('DOMContentLoaded', function () {
    var weatherData;

    const WEATHERICON = {
        clear: "./weatherStates/weather-clear.png",
        cloudy: "./weatherStates/weather-cloudy.png",
        cloudy_rains_light: "./weatherStates/weather-light-rains.png",
        part_clouds: "./weatherStates/weather-part-clouds.png",
        heavy_rains: "./weatherStates/weather-rain-heavy.png",
        scattered_rains: "./weatherStates/weather-scattered-showers.png",
        snowy: "./weatherStates/weather-windy.png",
        windy: "./weatherStates/weather-windy.png",
    }

    const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';
    const cityname = 'new york';
    let lat = '40.730610';
    let lon = '-73.935242';

    const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    let data = getAPIdata(encodeURI(query));

    var weatherDOMContainer = document.querySelector('.weatherData');

    data.then(function (data) {
        weatherData = data;

        let card = document.querySelector('#c-1')
        let cardTitle = card.querySelector('.weather-title');
        let cardImage = card.querySelector('.weather-image');
        let cardDetails = card.querySelector('.weather-details');
        let cardDescription = card.querySelector('.weather-description');
        let cardEventStatus = card.querySelector('.event-status');


        const CurrentWeatherDetails = {
            humidity: weatherData.current.humidity,
            temperature: weatherData.current.temp,
            speed: weatherData.current.wind_speed,
        }

        const detailsOutput = `<span>Humidity: ${CurrentWeatherDetails.humidity}</span> <span>Temperature: ${CurrentWeatherDetails.temperature}</span> <span>Wind Speed: ${CurrentWeatherDetails.speed} miles/hour.</span>`
        const eventStatus = `<span>Safe</span>`;
        cardTitle.innerHTML = 'Today'
        cardDescription.innerHTML = weatherData.current.weather[0].description;
        cardDetails.innerHTML = detailsOutput;
        cardEventStatus.innerHTML = eventStatus;

        switch (weatherData.current.weather[0].main.toLowerCase()) {
            case 'clouds':
                cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.cloudy}" />`;
                break;
            case 'scattered clouds':
                cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.cloudy}" />`;
                break;
            default:
                cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.clear}" />`;
                break;
        }

        var cardTemplate = document.querySelector(`#weatherTemplate`);
        
        var newCard
        for (let i = 0; i < weatherData.daily.length-1; i++) {
            newCard = cardTemplate;
            
            let cardTitle = newCard.querySelector('.weather-title');
            let cardImage = newCard.querySelector('.weather-image');
            let cardDetails = newCard.querySelector('.weather-details');
            let cardDescription = newCard.querySelector('.weather-description');
            let cardEventStatus = newCard.querySelector('.event-status');
            newCard.classList.remove('d-none')

            const DailyWeatherDetails = {
                humidity: weatherData.daily[i].humidity,
                temperature: weatherData.daily[i].temp.max,
                speed: weatherData.daily[i].wind_speed,
            }

            const detailsOutput = `<span>Humidity: ${DailyWeatherDetails.humidity}</span> <span>Temperature: ${DailyWeatherDetails.temperature}</span> <span>Wind Speed: ${DailyWeatherDetails.speed} miles/hour.</span>`
            const eventStatus = `<span>Safe</span>`;

            cardTitle.innerHTML = i
            cardDescription.innerHTML = weatherData.daily[i].weather[0].description;
            cardDetails.innerHTML = detailsOutput;
            cardEventStatus.innerHTML = eventStatus;


            switch (weatherData.daily[i].weather[0].main.toLowerCase()) {
                case 'clouds':
                    cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.cloudy}" />`;
                    break;
                case 'scattered clouds':
                    cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.cloudy}" />`;
                    break;
                default:
                    cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.clear}" />`;
                    break;
            }

            weatherDOMContainer.innerHTML += newCard.innerHTML;

        }

        return;
    })





    // let hourlyquery = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${cityname}&appid=${'0fa93f92f4b80637cbf3664a3882c2b0'}`;
    // const hourlyForcast = getAPIdata(encodeURI(hourlyquery));
    // hourlyForcast.then(function(data){
    //     console.log(data);
    // })





    async function getAPIdata(url) {
        const response = await fetch(url)
        let data = response.json();
        return data;
    }
});


















