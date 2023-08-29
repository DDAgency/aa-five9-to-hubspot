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
        "3rd Party Transfer": "0cc2ead9-a595-4cbe-9cb0-fcd9247d7fe9",
        "Abandon": "d5d2a784-4f85-4927-85da-20b8a5612145",
        "Aged Out": "c4a4bdf6-ddc0-4765-acf8-c366aae58e64",
        "Agent Error": "31a12cf5-691c-4f9c-8655-3c6edd25e546",
        "Already Graduated": "ed81eb16-51e7-41a2-8267-2eb0a7302f10",
        "Answering Machine": "cb8b5ecd-2856-4d99-aa69-8c8bec6c6a52",
        'Application Completed': "ec7d1488-bcec-4a93-9c21-2f61af6e4843",
        "Application Completed_AIP": "4d232a70-a89a-4b66-b0c2-4b708235ea01",
        "Application Started": "b923096a-8b54-464e-a887-69c3d6c524e8",
        "Application Worked On_AIP": "360ec10f-7468-4c1a-8e69-0f94adf0065c",
        "Application Started/Completed": "35ef124a-5786-41d9-ba0a-cc2211c9bfc4",
        "Bad Phone Numbers": "c3bcb01e-0035-4889-808e-a6d77b7f183e",
        "Bad Phone Number": "e78bbe19-078a-41b1-a876-df145253acea",
        "Bad Phone Number_AIP": "e1cfe48d-8d49-48c4-b5b0-a145578e1f17",
        "Busy": "9d9162e7-6cf3-4944-bf63-4dff82258764",
        "Call Back": "8a793b62-5602-448c-9422-5a70c34c173a",
        "Call Back_AIP": "71ee55c6-7add-4d24-bbc5-6a8adc814ee2",
        "Caller busy, couldn't talk.": "904f61fe-0815-4b2a-8a60-07f4059b5cac",
        "Deceased": "e01ea084-a556-4da1-98f7-c21848d946bb",
        "Declined Program": "85a26be5-9c4c-4cc2-9bc8-88c1e5682a78",
        "Declined": "1b6f5441-2508-4c31-a9c1-d9f378e798ff",
        "Do Not Contact": "99a71316-7415-47a9-ac7e-f710b0780bd5",
        "Dial Error": "baa5f24f-639f-4608-97b9-db8557b1171f",
        "Do Not Call": "741343db-c5cb-4f39-b3be-a6e4fc009768",
        "Do Not Contact": "588b9099-d991-45d1-b894-ee7878325817",
        "Do Not Contact- AIP": "ad7b103f-b911-41f9-8a06-3575d193571d",
        "Duplicated Callback Request": "46fab7a3-17f2-4b2f-a3a2-0f0458dfc9ef",
        "Fax": "31f52075-14d0-4670-8d92-f835c43e6986",
        "Force Stop": "b2e02bab-a44b-4e7b-85ee-df366b39e864",
        "Forward Participant": "025fe29b-1662-4369-8b12-94d26cc80c27",
        "Forwarded": "35caf704-0cbb-4768-b9bf-52489ec3802a",
        "Hangup": "cabd9cc0-de6d-4555-a847-7c76f6d51c59",
        "Hardward Timeout": "3724a51b-8810-4af7-a7d1-2d5947ec0877",
        "Internal Call": "4e1315ba-28c1-4a9c-9004-5eb371315c94",
        "Interested": "e9ad6702-6d25-453e-9830-afff12ecdd92",
        "Interested, Not Ready To Commit.": "425172fb-0d29-4e42-aedd-bc837844b338",
        "Left voicemail + text.": "4355cc52-d3e4-46d2-a09c-96f910c78319",
        "Local Follow Up Needed": "910a0bc8-e589-49b3-84dd-bcd9bb989a1b",
        "Local Follow Up Needed_AIP": "b0d46d9c-0988-4c3b-b8c3-b7706719cd72",
        "Mainline Call Inquiry": "101ec894-c597-426d-b64d-fd6ff147514f",
        "Moved out of area": "b71f2ad8-2181-4c9f-ab31-0ba156cee5af",
        "No Answer": "7b4e2b34-d865-4d4b-8622-9a1182a9fa17",
        "No/Full VM + text. ": "1c5daf0b-0edf-4ec2-b9e4-ba05bcad11f7",
        "No Disposition": "0c407d74-5af0-447a-8729-d902a004ca8c",
        "No Response From Caller": "0e8191bd-6bb0-4e0e-bebc-750f5c42b303",
        "Operator Intercept": "0937dea0-1f91-4910-9705-bd0cb9930338",
        "Queue Callback Assigned": "d021ce4f-8c9b-46fc-a641-3e37b41ab617",,
        "Queue Callback Timeout": "cec5f97e-babe-4b10-a33f-f4af88342231",
        "Recycle": "a954924e-d325-4d6d-b8d5-a6abf31214db",
        "Registration Link Sent": "1a99ed31-5d4c-43eb-a944-c748eeda4424",
        "Resource Unavailable": "6619ae34-063c-4c30-8dc9-1662a8abefe9",
        "Registration Link Sent": "68a60c26-e1b3-4b0b-bd90-b1de0598182c",
        "Ringback": "6c442e4c-3e35-4f8f-ad33-04f6a35e6e12",
        "Sent To Voicemail": "7cd4b445-3592-4a48-85d8-4d098d29610a",
        "Spam": "ec67c635-b7b7-4f36-82ab-14eff197b5ff",
        "Spanish Callback Needed_AIP": "1970a711-bbbe-4054-8c19-2809c6a913b0",
        "Spanish Callback Needed": "24a2c8ff-a391-498e-b1aa-b7de502fece1",
        "System Error": "03af7d15-2df1-480a-b60e-83c21893e059",
        "System Shutdown": "45fb2e8b-b925-4760-8c21-85be3ecb0cc4",
        "Timeout": "4ce89503-3d2a-4336-9d03-b2796e886391",
        "Transferred to 3rd Party": "9482264a-86fa-40e0-b539-e11910d43e24",
        "Underage": "d8d3007a-e092-4ae4-af58-84527ac4ba62",
        "Unknown Connection":  "01a8d3d6-09f5-4187-b9c4-513395c9e46e",
        "Voicemail Dump": "dac5664d-91fc-4973-8060-7a353f5d7db2",
        "Voicemail Processed": "715e00d2-b1b8-479d-af38-98c004536e8c",
        "Voicemail Returned": "01cc59d8-dd8a-49e4-afb7-b550ca9be804",
        "Voicemail": "01cc59d8-dd8a-49e4-afb7-b550ca9be804"
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
        'hubspot_owner_id': data.last_agent_name ? agents[data.last_agent_name] : agents[data.full_name],
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