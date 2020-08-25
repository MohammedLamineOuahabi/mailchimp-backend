//jshint esversion 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//share local resources
app.use(express.static("public"));

app.get("/", function (req, res) {
  //console.log(__dirname +"/signup.html");
  res.sendFile(__dirname + "/subscribe.html");
});

app.post("/subscribe", function (req, res) {
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed"
      }
    ]
  };
  var jsonData = JSON.stringify(data);
  let url = `https://us20.api.mailchimp.com/3.0/lists/${process.env.LISTID}`;
  let Authorization = `anyString ${process.env.APIKEY}`;
  console.log("url", url);
  console.log("Authorization", Authorization);
  var options = {
    url,
    method: "POST",
    headers: {
      Authorization
    },
    body: jsonData
  };

  request(options, function (error, response, body) {
    if (error) {
      res.status(404).send({ result: false, msg: "internal error" });
    } else if (response.statusCode === 200) {
      console.log(response.statusCode);
      res.status(200).send({ result: true });
    } else {
      console.log(response.statusCode);
      res.status(404).send({ result: false, msg: response.statusCode });
    }
  });
});

// app.post("/success", function (req, res) {
//   res.redirect("/");
// });

//process.env.PORT  dynamic port Heroku

app.listen(process.env.PORT || 8000, function () {
  console.log("Server is running under port : 8000 ...");
});
