const express = require("express");
const bodyParser = require("body-parser");
//for connecting api we need to use https module of node
const https = require("https");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');




app.get("/", function (req, res) {

  // res.sendFile(__dirname+"/weather.html");
  res.render("weather");





});
app.post("/", function (req, res) {



  const query = req.body.cityName;
  //Api Key Left Empty due to security concerns
// fill it to use the app.
  //Trash api key is used
  const apiKey = "ba6e4ce767c6824f37d019e603c9ff30";
  var unit;
  var unitName;


  if (req.body.unit == "c") {
    unit = "metric";
    unitName = "celcius"
  }
  else if (req.body.unit == "f") {
    unit = "imperial";
    unitName = "Fahrenheit";
  } else {
    unit = "standard"
    unitName = "Kelvin";
  }

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // res.send("server is runnivng");  //i commented this bcoz we can have only 1 res.send in a single app method


  const reqst = https.get(url, function (response) {

    response.on("data", function (data) {



      const code = response.statusCode;
      if (code == "200") {


        //?now for our app we have to code this
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        console.log(temp);
        const desc = weatherData.weather[0].description;
        console.log(desc);
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        const icon = weatherData.weather[0].icon;
        const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        //now sending this data back to user
        //!note- we can only have only 1 res.send in our app methods so we use multiple res.write
        // res.write("<h1>The Temprature in "+query +" is "+temp +" "+ unitName+".</h1>");
        // res.write("<p>The weather is currently "+ desc+" </p>");
        // res.write("<img src="+imgURL+">");
        // res.send();
        res.render("result", { cityName: query, temp: temp, feels: desc, humidity: humidity, windSpeed: windSpeed, imgURL: imgURL, resCode: code });



      }
      else {
        res.render("result", { resCode: code });

      }
    });







  });


});

app.listen(3000, function () {
  console.log("server is started at port 3000");
});
