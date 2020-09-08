let values;


const worker = {

    message: (e) => {
        try {
            let clientQuery = e.data
            values = clientQuery;
            getUpdates();
        } catch (ex) {
            postMessage({ type: 'error', message: ex });
        }
    }
};


function epochToJsDate(ts) {
    // ts = epoch timestamp
    // returns date obj
    return new Date(ts * 1000);
}

function getUpdates() {
    setTimeout(() => {
        // console.log(values);
        
        const API_KEY = '5b240d5ca7b85efd188e3bcf200f8772';
        let lat = values.lat;
        let lon = values.lon;
        let units = 'metric'

        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`

        let data = getAPIdata(encodeURI(query));

        data.then(function (data) {
            postMessage({ weatherData: data });
            // getUpdates(values);
        }).catch(function (error) {
            throw new Error("Error")
        })

    }, 5000);

}


async function getAPIdata(url) {
    const response = await fetch(url)
    let data = response.json();
    return data;
}

addEventListener('message', worker.message);
