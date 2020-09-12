
document.addEventListener('DOMContentLoaded', function () {

    let currentPosition = {}

    var weatherData;
    const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';
    let pageLink = location.href.toString()


    if (localStorage.getItem('CurrentLocationData') != null) {
        let currentLocationData = localStorage.getItem('CurrentLocationData');
        currentLocationData = JSON.parse(currentLocationData);
        getQueryCurrentPlace(currentLocationData.location_name)
    } else {
        navigator.geolocation.getCurrentPosition(
            position => {
                currentPosition = { lat: position.coords.latitude, lon: position.coords.longitude }
                getQueryCurrentPlace(currentPosition);
            },
            error => {
                switch (error.code) {

                    case 0: // unknown error
                        console.log('The application has encountered an unknown error while trying to determine location.');
                        break;

                    case 1: // permission denied
                        console.log('You chose not to allow this application access to your location.');
                        break;

                    case 2: // position unavailable
                        console.log('The application was unable to determine your location.');
                        break;

                    case 3: // timeout
                        console.log('The request to determine your location has timed out.');
                        break;
                }
                getQueryCurrentPlace('new york');
            }
        );
    }

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



    if (!pageLink.includes('index')) {


        const localStorageData = JSON.parse(localStorage.getItem('CurrentLocationData'))

        let lat = localStorageData.lat;
        let lon = localStorageData.lon;
        let units = 'metric'

        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`

        let data = getAPIdata(encodeURI(query));

        var weatherDOMContainer = document.querySelector('.weatherData');

        data.then(function (data) {
            weatherData = data;

            if (data.cod == '404') {
                console.log(data);
                throw new Error('Data unavaialble');
            }

            if (pageLink.includes('weekly')) {
                document.querySelector('#weatherLocation').innerHTML = (localStorage.getItem('CurrentLocationData') != null) ? `Showing weekly weather for ${JSON.parse(localStorage.getItem('CurrentLocationData')).location_name}` : ''
                displayCurrentWeatherData(weatherData);
                displayWeeklyWeatherData(weatherData);
            } else if (pageLink.includes('hourly')) {
                document.querySelector('#weatherLocation').innerHTML = (localStorage.getItem('CurrentLocationData') != null) ? `Showing hourly weather for ${JSON.parse(localStorage.getItem('CurrentLocationData')).location_name}` : ''
                displayCurrentWeatherData(weatherData);
                displayHourlyWeatherData(weatherData);
            } else {

                //   do nothing

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
            cardEventStatus.classList.remove('warning')
            cardEventStatus.classList.remove('unsafe')
            cardEventStatus.classList.add('error')
            cardEventStatus.innerHTML = `<span>${'Error'}<span>`;
            cardDescription.innerHTML = `No Data`;
            cardDetails.innerHTML = error

        })
    }




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
        cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" alt="${weatherData.current.weather[0].description}" />`;
        cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
        cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
        cardDescription.innerHTML = weatherData.current.weather[0].description;
        cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} km/hour.</span>`

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
            cardEventStatus.classList.remove('warning');
            cardEventStatus.classList.remove('unsafe');

            dayNumber++;
            if (dayNumber > 6) {
                dayNumber = 0
            }

            const WEATHER_INFROMATION = getWeatherInformation(weatherData, 'weekly', i)
            // console.log(WEATHER_INFROMATION);


            // render data
            cardTitle.innerHTML = DaysOfWeek[dayNumber];
            cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" alt="${weatherData.daily[i].weather[0].description}" />`;
            cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
            cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
            cardDescription.innerHTML = weatherData.daily[i].weather[0].description;
            cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} km/hour.</span>`



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
            cardEventStatus.classList.remove('warning');
            cardEventStatus.classList.remove('unsafe');


            const WEATHER_INFROMATION = getWeatherInformation(weatherData, 'hourly', i)


            // render data

            if (epochToJsDate(weatherData.hourly[i].dt).getHours() < 12) {
                cardTitle.innerHTML = (epochToJsDate(weatherData.hourly[i].dt).getHours() == 0) ? "12 am" : epochToJsDate(weatherData.hourly[i].dt).getHours() + " am"
            } else {
                cardTitle.innerHTML = (epochToJsDate(weatherData.hourly[i].dt).getHours() - 12 == 0) ? "12 pm" : (epochToJsDate(weatherData.hourly[i].dt).getHours() - 12) + " pm"
            }

            if ((epochToJsDate(weatherData.hourly[i].dt).getHours() - 12) > 6 && cardTitle.innerHTML.includes('pm') && weatherData.hourly[i].weather[0].description === 'clear sky') {
                cardImage.innerHTML = `<img class="iconImg" src="${WEATHERICON.clear_night}" alt="${weatherData.hourly[i].weather[0].description}" />`;
            } else {
                cardImage.innerHTML = `<img class="iconImg" src="${WEATHER_INFROMATION.cardImage}" alt="${weatherData.hourly[i].weather[0].description}" />`;
            }
            cardEventStatus.classList.add(WEATHER_INFROMATION.eventPossibilityClass)
            cardEventStatus.innerHTML = `<span>${WEATHER_INFROMATION.eventPossibilityClass}<span>`;
            cardDescription.innerHTML = weatherData.hourly[i].weather[0].description;
            cardDetails.innerHTML = `<span>Humidity: ${WEATHER_INFROMATION.details.humidity}%</span> <span>Temperature: ${WEATHER_INFROMATION.details.temperature}°C</span> <span>Wind Speed: ${WEATHER_INFROMATION.details.speed} km/hour.</span>`

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
                    eventPossibilityClass: 'warning',
                    details: WeatherDetails
                }
                break;
            case 'moderate rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warning',
                    details: WeatherDetails
                }
                break;
            case 'very heavy rain':

                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'warning',
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

    function getWeatherCurrentStatus(switchClause) {
        switch (switchClause) {
            case 'clear sky':
                return {
                    cardImage: WEATHERICON.clear,
                    eventPossibilityClass: 'safe',
                }
                break;
            case 'few clouds':
                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                }
                break;
            case 'scattered clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                }
                break;
            case 'broken clouds':

                return {
                    cardImage: WEATHERICON.cloudy,
                    eventPossibilityClass: 'safe',
                }

                break;
            case 'overcast clouds':
                return {
                    cardImage: WEATHERICON.part_clouds,
                    eventPossibilityClass: 'safe',
                }
            case 'shower rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warning',
                }
                break;
            case 'moderate rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warning',
                }
                break;
            case 'rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                }
                break;
            case 'light rain':
                return {
                    cardImage: WEATHERICON.heavy_rains,
                    eventPossibilityClass: 'unsafe',
                }
                break;
            case 'thunderstorm':

                return {
                    cardImage: WEATHERICON.thunderstorm,
                    eventPossibilityClass: 'unsafe',
                }
                break
            case 'snow':
                return {
                    cardImage: WEATHERICON.snowy,
                    eventPossibilityClass: 'safe',
                }
                break;
            default:
                return {
                    cardImage: WEATHERICON.error,
                    eventPossibilityClass: 'Unknown',
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
                    temperature: data.hourly[i].temp,
                    speed: data.hourly[i].wind_speed,
                }
                switchClause = data.hourly[i].weather[0].description.toLowerCase()
            }

            if (type == 'weekly') {
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
                    eventPossibilityClass: 'warning',
                    details: WeatherDetails
                }
                break;
            case 'moderate rain':

                return {
                    cardImage: WEATHERICON.cloudy_rains_light,
                    eventPossibilityClass: 'warning',
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

    function updateSummary(weatherData) {
        const currentDate = epochToJsDate(weatherData.current.dt)
        const weatherDetails = getWeatherDetails(weatherData.current.weather[0].description.toLowerCase(), weatherData)
        const countryLocation = weatherData.timezone

        let summaryTitle = countryLocation
        let summaryDate = currentDate
        let summaryImage = weatherDetails.cardImage
        let summaryDetails = `<span>Humidity: ${weatherDetails.details.humidity}%</span> <span>Temperature: ${weatherDetails.details.temperature}°C</span> <span>Wind Speed: ${weatherDetails.details.speed} km/hour.</span>`


        let summaryItem = document.querySelector('.summaryItem')
        summaryItem.querySelector('#title').innerHTML = summaryTitle
        summaryItem.querySelector('#date').innerHTML = summaryDate

        summaryItem.querySelector('#weatherImage').innerHTML = `<img src="${summaryImage}" width="300" height="315" />`
        summaryItem.querySelector('#weatherDetails').innerHTML = summaryDetails
    }


    function epochToJsDate(ts) {
        // ts = epoch timestamp
        // returns date obj
        return new Date(ts * 1000);
    }

    async function getAPIdata(url) {
        const response = await fetch(url)
        let data = response.json();
        return data;
    }

    function getQueryCurrentPlace(queryReq) {
        
        if (pageLink.includes('index')) {
          
            let query;

            if (typeof (queryReq) === 'string') {
                queryReq = queryReq.toLowerCase();
                query = `https://api.openweathermap.org/data/2.5/weather?q=${queryReq}&appid=${API_KEY}&units=metric`
            } else if (typeof (queryReq) === 'object') {
                query = `https://api.openweathermap.org/data/2.5/weather?lat=${queryReq.lat}&lon=${queryReq.lon}&appid=${API_KEY}&units=metric`
            } else {
                query = `https://api.openweathermap.org/data/2.5/weather?q=${'new york'}&appid=${API_KEY}&units=metric`
            }

            let data = getAPIdata(encodeURI(query));
            data.then(function (data) {

                const location = data.name
                const time = epochToJsDate(data.dt)
                const details = {
                    humidity: data.main.humidity,
                    temperature: data.main.temp,
                    wind_speed: data.wind.speed,
                }
                const country = data.sys.country;
                const icon = getWeatherCurrentStatus(data.weather[0].description).cardImage;
                const description = data.weather[0].description;
                const QueryLocationData = {
                    location_name: data.name,
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                }

                localStorage.setItem('CurrentLocationData', JSON.stringify(QueryLocationData))
                // worker.postMessage({ lat: QueryLocationData.lat, lon: QueryLocationData.lon })

                const weatherData = {
                    location: location,
                    time: time,
                    description: description,
                    weatherDetails: details,
                    icon: icon,
                    country:country
                }

                let summaryTitle = `${weatherData.location}, ${weatherData.country} `
                let summaryDate = weatherData.time
                let summaryDescription = weatherData.description
                let summaryImage = weatherData.icon
                let summaryDetails = `<span>Humidity: ${weatherData.weatherDetails.humidity}%</span> <span>Temperature: ${weatherData.weatherDetails.temperature}°C</span> <span>Wind Speed: ${weatherData.weatherDetails.wind_speed} km/hour.</span>`


                let summaryItem = document.querySelector('.summaryItem')
                summaryItem.querySelector('#title').innerHTML = summaryTitle
                summaryItem.querySelector('#date').innerHTML = summaryDate
                summaryItem.querySelector('#description').innerHTML = summaryDescription
                summaryItem.querySelector('#weatherImage').innerHTML = `<img src="${summaryImage}" width="300" height="315" alt="${weatherData.location}_icon" />`
                summaryItem.querySelector('#weatherDetails').innerHTML = summaryDetails

            }).catch(function (error) {
                //handle errors here
                let summaryItem = document.querySelector('.summaryItem')
                summaryItem.querySelector('#title').innerHTML = 'Unknown location'
                summaryItem.querySelector('#date').innerHTML = 'No time'
                summaryItem.querySelector('#description').innerHTML = ''
                summaryItem.querySelector('#weatherImage').innerHTML = `<img src="${WEATHERICON.error}" width="300" height="315" alt="error" />`
                summaryItem.querySelector('#weatherDetails').innerHTML = 'Seems like there is a problem with the name of the location you are searching'
            })



        }
    }

    document.querySelector('#searchButton').addEventListener('click', function (event) {
        event.preventDefault();
        getQueryCurrentPlace(document.querySelector('#searchbox').value);
    })

    document.querySelector('#searchForm').addEventListener('submit', function (event) {
        event.preventDefault()
        getQueryCurrentPlace(document.querySelector('#searchbox').value);
    })

});


















