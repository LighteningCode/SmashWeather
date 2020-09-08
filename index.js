
document.addEventListener('DOMContentLoaded', function () {
    var weatherData;

    const WEATHERICON = {
        clear: "./weatherStates/weather-clear.png",
        clear_night: "./weatherStates/weather-clear-night.png",
        part_clouds: "./weatherStates/weather-part-clouds.png",
        cloudy: "./weatherStates/weather-cloudy.png",
        cloudy_rains_light: "./weatherStates/weather-light-rains.png",
        heavy_rains: "./weatherStates/weather-rain-heavy.png",
        thunderstorm: "./weatherStates/weather-thunderstorm.png",
        scattered_rains: "./weatherStates/weather-scattered-showers.png",
        snowy: "./weatherStates/weather-windy.png",
        windy: "./weatherStates/weather-windy.png",
        error: "./weatherStates/weather-error.png",
    }

    const DaysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';
    const cityname = 'new york';
    let lat = '40.730610';
    let lon = '-73.935242';
    let units = 'metric'

    const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`

    let data = getAPIdata(encodeURI(query));

    var weatherDOMContainer = document.querySelector('.weatherData');

    data.then(function (data) {
        weatherData = data;

        let pageLink = location.href.toString()


        if (data == undefined || null) {
            console.log(data);

            throw new Error('Data unavaialble');
        }


        if (pageLink.includes('weekly')) {
            displayCurrentWeatherData(weatherData);
            displayWeeklyWeatherData(weatherData);
        } else if (pageLink.includes('hourly')) {
            displayCurrentWeatherData(weatherData);
            displayHourlyWeatherData(weatherData);
        } else {

            const currentDate = epochToJsDate(weatherData.current.dt)
            const weatherDetails = getWeatherDetails(data.current.weather[0].description.toLowerCase(), weatherData)
            const countryLocation = weatherData.timezone

            let summaryTitle = countryLocation
            let summaryDate = currentDate
            let summaryImage = weatherDetails.cardImage
            let summaryDetails = `<span>Humidity: ${weatherDetails.details.humidity}%</span> <span>Temperature: ${weatherDetails.details.temperature}°C</span> <span>Wind Speed: ${weatherDetails.details.speed} miles/hour.</span>`


            let summaryItem = document.querySelector('.summaryItem')
            summaryItem.querySelector('#title').innerHTML = summaryTitle
            summaryItem.querySelector('#date').innerHTML = summaryDate
            summaryItem.querySelector('#weatherImage').innerHTML = `<img src="${summaryImage}" width="300" />`
            summaryItem.querySelector('#weatherDetails').innerHTML = summaryDetails

        }




        // save the necessary data to localstorage
        localStorage.setItem('weatherData', JSON.stringify(weatherData))


        return;
    }).catch(function (error) {

        console.error(error);


        let card = document.querySelector('#c-1')
        let cardTitle = card.querySelector('.weather-title');
        let cardImage = card.querySelector('.weather-image');
        let cardDetails = card.querySelector('.weather-details');
        let cardDescription = card.querySelector('.weather-description');
        let cardEventStatus = card.querySelector('.event-status');


        cardTitle.innerHTML = `Error No Data`
        cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.error}" />`;
        cardEventStatus.classList.remove('safe')
        cardEventStatus.classList.remove('warn')
        cardEventStatus.classList.remove('unsafe')
        cardEventStatus.classList.add('error')
        cardEventStatus.innerHTML = `<span>${'Error'}<span>`;
        cardDescription.innerHTML = `No Data`;
        cardDetails.innerHTML = error

    })





    // let hourlyquery = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${cityname}&appid=${'0fa93f92f4b80637cbf3664a3882c2b0'}`;
    // const hourlyForcast = getAPIdata(encodeURI(hourlyquery));
    // hourlyForcast.then(function(data){
    //     console.log(data);
    // })

    function displayCurrentWeatherData(weatherData) {

        if (weatherData == undefined || null) {
            throw new Error('Data unavaialble');
        }

        // get all DOM elements to connect to
        let card = document.querySelector('#c-1')
        let cardTitle = card.querySelector('.weather-title');
        let cardImage = card.querySelector('.weather-image');
        let cardDetails = card.querySelector('.weather-details');
        let cardDescription = card.querySelector('.weather-description');
        let cardEventStatus = card.querySelector('.event-status');

        // get processedData
        const WEATHER_INFROMATION = getWeatherInformation(weatherData)

        // render data
        cardTitle.innerHTML = 'Today'
        cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" />`;
        cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
        cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
        cardDescription.innerHTML = weatherData.current.weather[0].description;
        cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} miles/hour.</span>`

    }

    function displayWeeklyWeatherData(weatherData) {
        var cardTemplate = document.querySelector(`#weatherTemplate`);
        let dayNumber = new Date().getDay();
        // get processedData


        for (let i = 0; i < weatherData.daily.length - 1; i++) {
            let newCard = cardTemplate;

            let cardTitle = newCard.querySelector('.weather-title');
            let cardImage = newCard.querySelector('.weather-image');
            let cardDetails = newCard.querySelector('.weather-details');
            let cardDescription = newCard.querySelector('.weather-description');
            let cardEventStatus = newCard.querySelector('.event-status');
            newCard.classList.remove('d-none');
            cardEventStatus.classList.remove('safe');
            cardEventStatus.classList.remove('warn');
            cardEventStatus.classList.remove('unsafe');

            dayNumber++;
            if (dayNumber > 6) {
                dayNumber = 0
            }

            const WEATHER_INFROMATION = getWeatherInformation(weatherData, 'weekly', i)
            console.log(WEATHER_INFROMATION);


            // render data
            cardTitle.innerHTML = DaysOfWeek[dayNumber];
            cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" />`;
            cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
            cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
            cardDescription.innerHTML = weatherData.daily[i].weather[0].description;
            cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} miles/hour.</span>`



            weatherDOMContainer.innerHTML += newCard.innerHTML;
        }
    }

    function displayHourlyWeatherData(weatherData) {
        var cardTemplate = document.querySelector(`#weatherTemplate`);
        let dayNumber = new Date().getDay();


        for (let i = 0; i < weatherData.hourly.length - 1; i++) {
            let newCard = cardTemplate;

            let cardTitle = newCard.querySelector('.weather-title');
            let cardImage = newCard.querySelector('.weather-image');
            let cardDetails = newCard.querySelector('.weather-details');
            let cardDescription = newCard.querySelector('.weather-description');
            let cardEventStatus = newCard.querySelector('.event-status');
            newCard.classList.remove('d-none');
            cardEventStatus.classList.remove('safe');
            cardEventStatus.classList.remove('warn');
            cardEventStatus.classList.remove('unsafe');


            const WEATHER_INFROMATION = getWeatherInformation(weatherData, 'hourly', i)


            // render data

            if (epochToJsDate(weatherData.hourly[i].dt).getHours() < 12) {
                cardTitle.innerHTML = (epochToJsDate(weatherData.hourly[i].dt).getHours() == 0) ? "12 am" : epochToJsDate(weatherData.hourly[i].dt).getHours() + " am"
            } else {
                cardTitle.innerHTML = (epochToJsDate(weatherData.hourly[i].dt).getHours() - 12 == 0) ? "12 pm" : (epochToJsDate(weatherData.hourly[i].dt).getHours() - 12) + " pm"
            }
            cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" />`;
            cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
            cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
            cardDescription.innerHTML = weatherData.hourly[i].weather[0].description;
            cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} miles/hour.</span>`

            weatherDOMContainer.innerHTML += newCard.innerHTML;
        }
    }

    function getWeatherDetails(switchClause, data) {
        WeatherDetails = {
            humidity: data.current.humidity,
            temperature: data.current.temp,
            speed: data.current.wind_speed,
        }
        switch (switchClause) {
            case 'clear sky':
                return {
                    cardImage: WEATHERICON.clear,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'few clouds':
                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'scattered clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'broken clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }

                break;
            case 'overcast clouds':
                return {
                    cardImage: WEATHERICON.part_clouds,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
            case 'shower rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warn',
                    details: WeatherDetails
                }
                break;
            case 'moderate rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warn',
                    details: WeatherDetails
                }
                break;
            case 'rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break;
            case 'light rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break;
            case 'thunderstorm':

                return {
                    cardImage: WEATHERICON.thunderstorm,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break
            case 'snow':
                return {
                    cardImage: WEATHERICON.snowy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            default:
                return {
                    cardImage: WEATHERICON.error,
                    eventPossibilityClass: 'Unknown',
                    details: null
                }
                break;
        }
    }

    function getWeatherInformation(data, type = 'current', i) {
        let switchClause;
        let WeatherDetails;


        if (data.cod == '404') {
            throw new Error('No data from API')
        }

        if (i == undefined) {
            if (type == 'current') {
                WeatherDetails = {
                    humidity: data.current.humidity,
                    temperature: data.current.temp,
                    speed: data.current.wind_speed,
                }
            }

            switchClause = data.current.weather[0].description.toLowerCase()
        } else {
            if (type == 'hourly') {
                WeatherDetails = {
                    humidity: data.hourly[i].humidity,
                    temperature: data.hourly[i].temp.max,
                    speed: data.hourly[i].wind_speed,
                }
                switchClause = data.hourly[i].weather[0].description.toLowerCase()
            }

            if (type == 'weekly') {
                console.log("here");

                WeatherDetails = {
                    humidity: data.daily[i].humidity,
                    temperature: data.daily[i].temp.max,
                    speed: data.daily[i].wind_speed,
                }
                switchClause = data.daily[i].weather[0].description.toLowerCase()
            }

        }


        switch (switchClause) {
            case 'clear sky':
                return {
                    cardImage: WEATHERICON.clear,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'few clouds':
                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'overcast clouds':
                return {
                    cardImage: WEATHERICON.part_clouds,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'scattered clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            case 'broken clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }

                break;
            case 'shower rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warn',
                    details: WeatherDetails
                }
                break;
            case 'moderate rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warn',
                    details: WeatherDetails
                }
                break;
            case 'rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break;
            case 'heavy intensity rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break;
            case 'light rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break;
            case 'thunderstorm':

                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                    details: WeatherDetails
                }
                break
            case 'snow':
                return {
                    cardImage: WEATHERICON.snowy,
                    eventPossibilityClass: 'safe',
                    details: WeatherDetails
                }
                break;
            default:
                return {
                    cardImage: WEATHERICON.error,
                    eventPossibilityClass: 'error',
                    details: WeatherDetails
                }
                break;
        }

    }


    function epochToJsDate(ts) {
        // ts = epoch timestamp
        // returns date obj
        return new Date(ts * 1000);
    }

    function jsDateToEpoch(d) {
        // d = javascript date obj
        // returns epoch timestamp
        return (d.getTime() - d.getMilliseconds()) / 1000;
    }

    async function getAPIdata(url) {
        const response = await fetch(url)
        let data = response.json();
        return data;
    }


    const worker = new Worker('weatherWorker.js')

    worker.onerror = (error) => console.log(error);

    worker.onmessage = (messageEvt) => {
        console.log(messageEvt)
    }

    // worker.postMessage({message:"from client"})
});


















