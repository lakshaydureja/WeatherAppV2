const express = require("express");
const bodyParser = require("body-parser");
//for connecting api we need to use https module of node
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

  res.sendFile(__dirname+"/weather.html");





});
app.post("/", function (req,res) { 

  const query=req.body.cityName;
  const apiKey="ba6e4ce767c6824f37d019e603c9ff30";
  var unit;
  var unitName;

  
  if(req.body.unit=="c"){
    unit="metric";
    unitName="celcius"
  }
  else if(req.body.unit=="f"){
    unit="imperial";
    unitName="Fahrenheit";
  }

  const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
      
  // res.send("server is runnivng");  //i commented this bcoz we can have only 1 res.send in a single app method

  
  https.get(url, function (response) {
    console.log(response); //well this response give us a raw json data and we have to parse it to get data we want from it
    //when we recieve a data then what response occur is defined by
    response.on("data", function (data) {
      //   console.log(data);
      //   //*but we get a hexadecimal code of data, now to turn it back into java sript object we do
      //   const weatherData=JSON.parse(data);
      //   console.log(weatherData);

      //   //*we can also do opposite of this(coverting object into a single line string data) by
      //   //*for example we have this object
      //   const object1={
      //     name:"lakshay",
      //     favFood:"chicken",
      //     favCar:"mercedes-benz c class cabriolet"
      //   }
      //   //*to convert this object (JSON.stringify(objectName);)
      //   console.log(JSON.stringify(object1));

      //?now for our app we have to code this
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      console.log(temp);
      const desc = weatherData.weather[0].description;
      console.log(desc);
      const icon=weatherData.weather[0].icon;
      const imgURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";

      //now sending this data back to user
            //!note- we can only have only 1 res.send in our app methods so we use multiple res.write
      res.write("<h1>The Temprature in "+query +" is "+temp +" "+ unitName+".</h1>");
      res.write("<p>The weather is currently "+ desc+" </p>");
      res.write("<img src="+imgURL+">");
      res.send();
    });
  });





});

app.listen(3000, function () {
  console.log("server is started at port 3000");
});
