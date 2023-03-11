const https = require("https");
const bodyParser = require("body-parser");
const express = require("express");

  
const appKey = "ef1b3abbb663e9d15a3b35c580151915";

const app = express();

// add EJS to express app
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");

    
    
});

app.post("/", function(req, res){

    // get city name from the HTML input
    const city = req.body.CityName;

    // Use the Geocoding API to get all the information on the city entered
    const locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+ city +"&appid=" + appKey

    // Use the https module to get the city information 
    https.get(locationUrl, function(response){
        console.log("Geocoding API response status: "+response.statusCode);

        response.on("data", function(data){
            
            // Transform the data in Json formmat using JSON.parse
            const locationData = JSON.parse(data);

            // Store the lat and lon of the given city in a const
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;
            
            // Weather API URL
            const url = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon="+ lon +"&appid="+ appKey +"&units=metric";

            // Using https module get the weather data
            https.get(url, function(response){
                console.log("Weather API response stataus: " + response.statusCode);

                response.on("data", function(data){
                    
                    // Transform the data to a JSON formmat using JSON.parse
                    const weatherData = JSON.parse(data);

                    const temp = weatherData.main.temp; 
                    const description = weatherData.weather[0].description;
                    const icon = weatherData.weather[0].icon;
                    const imageUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
                    
                    // To send multiple things use .write method and just call .send() after writng everything you wanted
                    res.write("<h1>The weather in "+ city +" is " +temp + " degrees celcius</h1>");
                    res.write("<h3>Currently " + description + " in "+ city +"</h3>");
                    res.write("<img src="+ imageUrl +"></br>");

                    res.send();
                    
                })
            })
        })
    })
    console.log("post received");
})



app.listen(3000, function(){
    console.log("Server is running on port 3000");
})