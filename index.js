
// document.onreadystatechange = () => {
//     if (document.readyState == 'complete') {
//         console.log(document.readyState);

//         console.log(getAPIdata('http://api.openweathermap.org/data/2.5/weather?q=Accra&appid=5b240d5ca7b85efd188e3bcf200f8772'));

//         let data = getAPIdata('http://api.openweathermap.org/data/2.5/weather?q=Accra&appid=5b240d5ca7b85efd188e3bcf200f8772');

//         data
//         .then(weatherData => console.log('⛅',weatherData.clouds.all))


//     }

// }
function output (val) { 
    console.log(val);
    
 }



function addOne(val) {
    return val + 1;
}



function _() {
    return new Promise((resolve) => {
        resolve(addOne(1))
    })
}

const promise = _()
    .then((val) => {
        return addOne(val)
    })
    .then((val) => {
        return addOne(val)
    })
    .then((val) => {
        return addOne(val)
    })
    .then((val) => {
        output(val)
    })


// async function getAPIdata(url) {
//     const response = await fetch(url)
//     let data = response.json();
//     return data;
// }

window.addEventListener('unhandledrejection',event => {
    console.log(event);
    console.log("Unhandled rejection has arrived");
},false)



new Promise((resolve,reject) =>{
    console.log("Initial Promise");
    resolve();
})
.then(()=>{
    throw new Error ('Something broke')
    console.log('This will not execute');
})
.catch((reason)=>{
    console.error(reason)
})
.then(()=>{
    console.log("lets still execute what we want after");
    
})






