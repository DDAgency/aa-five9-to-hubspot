"use strict";

const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");
const request = require('request');
const bodyParser = require("body-parser");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.post('/', (req, res) => {


    function updateContact(idPropType, idProp, props) {
        var url;

        if (idPropType == 'email') {
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
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                properties: props
            })
        };

        console.log(options);

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            res.status(200).end();
        });
    }


    function createNote(props, associations) {
        var url;

        url = 'https://api.hubspot.com/crm/v3/objects/notes';

        var options = {
            method: "POST",
            url: url,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                properties: props,
                associations: associations
            })
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
        });
    }

        function createCall(props, associations) {
        var url;

        url = 'https://api.hubspot.com/crm/v3/objects/calls';

        var options = {
            method: "POST",
            url: url,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                properties: props,
                associations: associations
            })
        };

        request(options, function(error, response, body) {
            if (error) throw new Error(error);
        });
    }




    const data = req.body;

    console.log(data);

    const recordId = req.body['Record ID - Contact'] ? req.body['Record ID - Contact'] : false;
    const recordEmail = req.body.email ? req.body.email : false;
    const recordComments = req.body.comments ? req.body.comments : false;
    const now = Date.now();

    const agents = { 
        'Jesse Corona': 140837421,
        'Janette Reyes': 140837422,
        'Joselyn Reyes': 140837423,
        'Ryan Graves': 154085888,
        'Lisa Ferguson': 140844419,
        'Erica Mattey': 154090129,
        'Michelle Smith': 239479718,
        'Cindy Ramos': 446632571,
        'Yvette Rios': 446633007,
        'Griffin Pogue': 446633079,
        'Yaney Hatfield': 202881385 
    };

    // https://api.hubapi.com/calling/v1/dispositions

    const callOutcomes = {
        "Abandon": "d5d2a784-4f85-4927-85da-20b8a5612145",
        "Aged Out": "c4a4bdf6-ddc0-4765-acf8-c366aae58e64",
        "Already Graduated": "ed81eb16-51e7-41a2-8267-2eb0a7302f10",
        "Application Started/Completed": "35ef124a-5786-41d9-ba0a-cc2211c9bfc4",
        "Bad Phone Numbers": "c3bcb01e-0035-4889-808e-a6d77b7f183e",
        "Caller busy, couldn't talk.": "904f61fe-0815-4b2a-8a60-07f4059b5cac",
        "Deceased": "1234afd0-c31d-46bd-b18a-21538331202e",
        "Declined Program": "5a5ea465-9666-4220-951b-1f0dde025050",
        "Do Not Contact": "99a71316-7415-47a9-ac7e-f710b0780bd5",
        "Interested, Not Ready To Commit.": "425172fb-0d29-4e42-aedd-bc837844b338",
        "Left voicemail + text.": "4355cc52-d3e4-46d2-a09c-96f910c78319",
        "Local Follow Up Needed": "910a0bc8-e589-49b3-84dd-bcd9bb989a1b",
        "Moved out of area": "6408fc1f-3e5d-4283-9bf6-ecb2a2409300",
        "No Answer": "887abc28-1024-4b1c-af9d-20cfb41432ef",
        "No/Full VM + text. ": "1c5daf0b-0edf-4ec2-b9e4-ba05bcad11f7",
        "Registration Link Sent": "68a60c26-e1b3-4b0b-bd90-b1de0598182c",
        "Spanish Callback Needed": "24a2c8ff-a391-498e-b1aa-b7de502fece1",
        "Underage": "d8d3007a-e092-4ae4-af58-84527ac4ba62"
    };

    const contactProperties = {
        'firstname': data.first_name,
        'lastname': data.last_name,
        'phone': data.phone1,
        'phone_number_2': data.phone2,
        'phone_number_3': data.phone3,
        'email': data.email,
        'district': data['District'],
        'date': data['Date of Birth'] ? new Date(data['Date of Birth']).setUTCHours(0, 0, 0, 0) : '',
        'address': data.street,
        'street_address_2': data['Street Address 2'],
        'zip': data.zip,
        'city': data.city,
        'state': data.state,
        'auto_dialer_create_date': data['Create Date'],
        'direction_of_call': data['Direction of Call'],
        // 'notes_last_updated': data['Last Activity Date'],
        'last_agent': data['Last Agent'],
        'time_or_date_of_call': data['Time or Date of Call'],
        'time_or_length_of_call': data['Time or Length of Call'],
        'last_disposition': data.disposition_name
    };

    const callProperties = {
        'hs_timestamp': now,
        'hubspot_owner_id': agents[data['Last Agent']],
        'hs_call_body': data.comments ? data.comments : '',
        'hs_call_duration': data['Time or Length of Call'],
        'hs_call_to_number': data.phone1 ? data.phone1 : '',
        'hs_call_disposition': callOutcomes[data.disposition_name]
    };

    const callAssociations = [{
        'to': {
            'id': recordId
        },
        'types': [{
            "associationCategory": "HUBSPOT_DEFINED",
            "associationTypeId": 10
        }]
    }]

    const noteProperties = {
        'hs_timestamp': now,
        'hs_note_body': data.comments ? data.comments : ''
    }

    const noteAssociations = [{
        'to': {
            'id': recordId
        },
        'types': [{
            "associationCategory": "HUBSPOT_DEFINED",
            "associationTypeId": 10
        }]
    }]


    if(recordComments && recordId){
        createNote(noteProperties, noteAssociations);
        createCall(callProperties, callAssociations);
        updateContact('recordId', recordId, contactProperties);
    }
    else if (recordId) {
        updateContact('recordId', recordId, contactProperties);
        createCall(callProperties, callAssociations);
    } else if (recordEmail) {
        updateContact('email', recordEmail, contactProperties);
    } else {
        res.json({
            'error': 'No unique identifier found'
        });
    }


});


/* ========== Run the app ========== */
app.listen(port, () => {
    console.log('App listening at http://localhost:' + port)
});