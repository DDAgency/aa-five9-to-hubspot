"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");
const request = require('request');
const port = process.env.PORT || 3000;
const nocache = require('nocache');
const authToken = process.env.HS_AUTH_TOKEN;


/* All access from all origins */
app.use(cors());

app.set('trust proxy', 1);

/* No cache */
app.use(nocache());

/* Allows app to handle JSON POST data */
app.use(express.json());


app.post('/', (req, res) => {


    function updateContact(idPropType, idProp, props) {
        var url;

        if (idPropType = 'email') {
            url = `https://api.hubapi.com/crm/v3/objects/contacts/${idProp}?idProperty=email`;
        } else {
            url = `https://api.hubapi.com/crm/v3/objects/contacts/${idProp}`;
        }

        var options = {
            method: "PATCH",
            url: url,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${HS_AUTH_TOKEN}`
            },
            body: JSON.stringify({
                properties: props
            }),
            json: true,
        };


        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            res.json({
                received: true
            });
        });
    }


    console.log(req);
    console.log(req.query);

    const data = req.body;

    const recordId = req.body['Record Id - Contact'] ? req.body['Record Id - Contact'] : false;
    const recordEmail = req.body.email ? req.body.email : false;

    const properties = {
        'firstname': data.first_name,
        'lastname': data.last_name,
        'phone': data.phone1,
        'phone_number_2': data.phone2,
        'phone_number_3': data.phone3,
        'email': data.email,
        'district': data['District'],
        'date': data['Date of Birth'],
        'address': data.street,
        'street_address_2': data['Street Address 2'],
        'zip': data.zip,
        'city': data.city,
        'state': data.state,
        'auto_dialer_create_date': data['Create Date'],
        'direction_of_call': data['Direction of Call'],
        'notes_last_updated': data['Last Activity Date'],
        'last_agent': data['Last Agent'],
        'time_or_date_of_call': data['Time or Date of Call'],
        'time_or_length_of_call': data['Time or Length of Call'],
        'last_disposition': data.disposition_name
    }


    if (recordId) {
        updateContact('recordId', recordId, properties);
    } else if (recordEmail) {
        updateContact('email', recordEmail, properties);
    } else {
        res.json({
           'error': 'No unique identifier found'
        });

    }


});


/* ========== Run the app ========== */
app.listen(port, () => {
    console.log('App listening at http://localhost:' + port)
})