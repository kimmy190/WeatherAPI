const port = 3000; 
const express = require('express'); 
const app = express(); 

const https = require('https'); 

const bodyParser = require('body-parser');
// const { response } = require('express');
app.use(bodyParser.urlencoded({extended: true}));
// using static folders 
app.use(express.static('public'));
const ejs = require('ejs');

require('dotenv').config(); 
let API_KEY = process.env.API_KEY;

// for ejs template 
app.set('views', './views'); 
app.set('view engine', 'ejs');

// 1. create a get request for our root route method 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");

});

// respond to the post request the html form have sent 
app.post("/", function(req, res){ //path specified is going to be showing the response of this callback function 
    
    const city = req.body.cityInput;
    const apiKey = API_KEY; 
    const geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=" + apiKey;

    // units = "imperial";
    const units = "metric";

    // when user types the keyword, need to convert them into latitude & longitude 
    https.get(geoUrl, function(response1){
        console.log(response1.statusCode);
        
        response1.on('data', function(data){
            
            const geoData = JSON.parse(data); 

            // console.log(geoData);
            // console.log(geoData[0].lat);
            let latitude = geoData[0].lat;
            let longitude = geoData[0].lon;

            const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + 
                                                                "&lon=" + longitude + 
                                                                "&appid="+ apiKey + 
                                                                "&units=" + units;

            https.get(url, function(response){
                console.log(response.statusCode);
                
                response.on('data', function(data){
                    const weatherData = JSON.parse(data);
                    // console.log(JSON.stringify(weatherData)); -> turns into String object 

                    const icon = weatherData.weather[0].icon; 

                    var weatherAll = {
                        city: weatherData.name, 
                        country : weatherData.sys.country, 
                        temperature : weatherData.main.temp, 
                        descript : weatherData.weather[0].description, 
                        feelsLike : weatherData.main.feels_like, 
                        minT : weatherData.main.temp_min, 
                        maxT : weatherData.main.temp_max, 
                        humidity : weatherData.main.humidity,
                        imgUrl : "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                        // cityImgSrc : cityUrl 
                        
                    }
                    res.render('weather', weatherAll);
                }) 
            });

        });
    });
}); 

app.post('/back', function(req, res){
    res.redirect('/');
})

// listen to a port 
app.listen(port, function(){
    console.log("Server is running on port" + port); 
})