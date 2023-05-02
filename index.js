"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");
const request = require('request');
const port = process.env.PORT || 3000;
const nocache = require('nocache');

/* All access from all origins */
app.use(cors());

app.set('trust proxy', 1);

/* No cache */
app.use(nocache());

/* Allows app to handle JSON POST data */
app.use(express.json());


app.post('/', (req, res) => {

console.log(req.body);

});




/* ========== Run the app ========== */
app.listen(port, () => {
console.log('App listening at http://localhost:' + port)
})