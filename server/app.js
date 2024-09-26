const express = require('express');
const morgan = require('morgan');
var bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config()

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

let movies = [];
const apikey = process.env.API_KEY;

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter
app.get("/", async (req, res) => {
    const queries = req.query;
    const key = Object.keys(queries)[0];
    const value = Object.values(queries)[0];

    const keyPairs = {i: "imdbID", t: "Title"};
    const objectValue = keyPairs[key];
  
    if(movies.find((movie) => movie[objectValue].toLowerCase() == value)){
        res.send(movies.find((movie) => movie[objectValue].toLowerCase() == value));
    } else {
        try {
                const response = await axios.get(`http://www.omdbapi.com/?${key}=${value}&apikey=${apikey}`);
                const result = response.data;
                movies.push(result);
                res.send(result);
            } catch (error) {
                console.error("Failed to make request:", error.message);
                res.sendStatus(404);
            }
    }
});

module.exports = app;