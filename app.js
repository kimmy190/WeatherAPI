const express = require('express'); 
const https = require('https'); 

const bodyParser = require('body-parser');
const { response } = require('express');

const app = express(); 

app.use(bodyParser.urlencoded({extended: true}));
// using static folders 
app.use(express.static('public'));

// 1. create a get request for our root route method 
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res){ //path specified is going to be showing the response of this callback function 
    
    const city = req.body.cityInput;
    const apiKey = "a229449832e52a20a2ffb445eb54f729";
    const geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city +"&appid=" + apiKey;

    // units = "imperial";
    const units = "metric";

    let latitude;
    let longitude;

    // when user types the keyword, need to convert them into latitude & longitude 
    https.get(geoUrl, function(response1){
        console.log(response1.statusCode);
        
        response1.on('data', function(data){
            
            const geoData = JSON.parse(data); 
            // console.log(geoData);
            // console.log(geoData[0].lat);
            latitude = geoData[0].lat;
            longitude = geoData[0].lon;

            const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + 
                                                                "&lon=" + longitude + 
                                                                "&appid="+ apiKey + 
                                                                "&units=" + units;

            https.get(url, function(response){
                console.log(response.statusCode);
                
                response.on('data', function(data){
                    const weatherData = JSON.parse(data);
                    // console.log(JSON.stringify(weatherData)); -> turns into String object 
                    const city = weatherData.name; 
                    const country = weatherData.sys.country;
                    const temperature = weatherData.main.temp;
                    const descript = weatherData.weather[0].description;

                    const feelsLike = weatherData.main.feels_like;
                    const minT = weatherData.main.temp_min; 
                    const maxT = weatherData.main.temp_max; 
                    
                    // inserting an image 
                    const icon = weatherData.weather[0].icon; 
                    const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                    console.log(temperature + "\n" + descript + "\n" + icon );

                    res.write("<h1>Currently the temp in " + city + " is " + temperature + "</h1>"); 
                    res.write("<p> The weather today in " + city + " is "+ descript +"</p>");
                    res.write("<img src=" + imgUrl + ">");

                    res.send();
                }) 
            });

        });
    });
}); 

//2. listen to a port 
app.listen(3000, function(){
    console.log("Server is running on port 3000"); 
})