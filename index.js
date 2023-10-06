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
    "Abandon": "3b10a09f-cab5-4c6a-8607-46ba5b0ebc98",
    "Aged Out": "c4a4bdf6-ddc0-4765-acf8-c366aae58e64",
    "Agent Error": "31a12cf5-691c-4f9c-8655-3c6edd25e546",
    "Already Graduated": "ed81eb16-51e7-41a2-8267-2eb0a7302f10",
    "Answering Machine": "cb8b5ecd-2856-4d99-aa69-8c8bec6c6a52",
    "Application Completed": "abea2064-b0cd-4f1e-9ad5-8388d85bf010",
    "Application Completed_AIP": "19cfb9ee-d55c-4396-8f60-630a3795465a",
    "Application Started": "7d208f70-1c7b-4cf8-9d50-2cae468fa3f6",
    "Application Worked On_AIP": "245d537c-fc0b-452f-a412-afebaa7c730e",
    "Bad Phone Number": "7f309b5f-69d4-4341-8ad6-83bd9c02effe",
    "Bad Phone Number_AIP": "e1cfe48d-8d49-48c4-b5b0-a145578e1f17",
    "Busy": "9d9162e7-6cf3-4944-bf63-4dff82258764",
    "Call Back": "8a793b62-5602-448c-9422-5a70c34c173a",
    "Call Back_AIP": "71ee55c6-7add-4d24-bbc5-6a8adc814ee2",
    "Caller Disconnected": "4041fa30-d781-4e2f-a1a1-396d503b03c5",
    "Currently Enrolled": "70dd9f56-afb5-4f19-a01d-d47b08ec9828",
    "Deceased": "e01ea084-a556-4da1-98f7-c21848d946bb",
    "Declined": "1b6f5441-2508-4c31-a9c1-d9f378e798ff",
    "Declined Program": "85a26be5-9c4c-4cc2-9bc8-88c1e5682a78",
    "Dial Error": "baa5f24f-639f-4608-97b9-db8557b1171f",
    "Do Not Call": "741343db-c5cb-4f39-b3be-a6e4fc009768",
    "Do Not Contact": "588b9099-d991-45d1-b894-ee7878325817",
    "Do Not Contact- AIP": "ad7b103f-b911-41f9-8a06-3575d193571d",
    "Duplicated Callback Request": "46fab7a3-17f2-4b2f-a3a2-0f0458dfc9ef",
    "Fax": "31f52075-14d0-4670-8d92-f835c43e6986",
    "Force Stop": "b2e02bab-a44b-4e7b-85ee-df366b39e864",
    "Forced Logout": "305fa664-640b-4362-9dfe-8e99b6ccbbf0",
    "Forward Participant": "025fe29b-1662-4369-8b12-94d26cc80c27",
    "Forwarded": "35caf704-0cbb-4768-b9bf-52489ec3802a",
    "Hangup": "cabd9cc0-de6d-4555-a847-7c76f6d51c59",
    "Hardware Timeout": "3724a51b-8810-4af7-a7d1-2d5947ec0877",
    "Interested": "e9ad6702-6d25-453e-9830-afff12ecdd92",
    "Internal Call": "4e1315ba-28c1-4a9c-9004-5eb371315c94",
    "Local Follow Up Needed": "3fa8f998-16f1-436e-93d5-04c6d766d3b3",
    "Local Follow Up Needed_AIP": "b0d46d9c-0988-4c3b-b8c3-b7706719cd72",
    "Mainline Call Inquiry": "101ec894-c597-426d-b64d-fd6ff147514f",
    "Moved Out Of Area": "b71f2ad8-2181-4c9f-ab31-0ba156cee5af",
    "No Answer": "887abc28-1024-4b1c-af9d-20cfb41432ef",
    "No Disposition": "0c407d74-5af0-447a-8729-d902a004ca8c",
    "No Response From Caller": "0e8191bd-6bb0-4e0e-bebc-750f5c42b303",
    "Operator Intercept": "0937dea0-1f91-4910-9705-bd0cb9930338",
    "Queue Callback Assigned": "d021ce4f-8c9b-46fc-a641-3e37b41ab617",
    "Queue Callback Timeout": "cec5f97e-babe-4b10-a33f-f4af88342231",
    "Recycle": "a954924e-d325-4d6d-b8d5-a6abf31214db",
    "Registration Link Sent": "1a99ed31-5d4c-43eb-a944-c748eeda4424",
    "Resource Unavailable": "6619ae34-063c-4c30-8dc9-1662a8abefe9",
    "Ringback": "6c442e4c-3e35-4f8f-ad33-04f6a35e6e12",
    "Sent To Voicemail": "7cd4b445-3592-4a48-85d8-4d098d29610a",
    "Spam": "ec67c635-b7b7-4f36-82ab-14eff197b5ff",
    "Spanish Callback Needed": "bbc0eafa-1584-48b9-8233-8bb663972c91",
    "Spanish Callback Needed_AIP": "1970a711-bbbe-4054-8c19-2809c6a913b0",
    "System Error": "03af7d15-2df1-480a-b60e-83c21893e059",
    "System Shutdown": "45fb2e8b-b925-4760-8c21-85be3ecb0cc4",
    "Timeout": "4ce89503-3d2a-4336-9d03-b2796e886391",
    "Transferred To 3rd Party": "339c4829-0358-4d5b-95bb-fb80d2966dec",
    "Underage": "9e19ec15-3c4d-4bb5-bcc8-3d889d191791",
    "Unknown Connection": "01a8d3d6-09f5-4187-b9c4-513395c9e46e",
    "Voicemail Dump": "dac5664d-91fc-4973-8060-7a353f5d7db2",
    "Voicemail Processed": "715e00d2-b1b8-479d-af38-98c004536e8c",
    "Voicemail Returned": "01cc59d8-dd8a-49e4-afb7-b550ca9be804",
    "Voicemail_App in Progress": "576eaf6e-46f1-4a6c-bda4-b090efbc2809",
    "Voicemail_BAA_App in Progress": "96257f22-28de-4ef9-b840-20b6dee35eab",
    "Voicemail_BAA_Recruitment": "8c2cad99-1086-4acd-b393-22420c50fb9b",
    "Voicemail_CCAA_Apps in Progress": "06af10b0-35f8-446b-8528-ab6d6fce79e1",
    "Voicemail_CCAA_Recruitment": "524a424f-7cef-4516-bbc4-36d86e57de56",
    "Voicemail_CSAA_Apps in Progress": "1364b2ef-671b-4bdf-b933-b966d8c099a0",
    "Voicemail_CSAA_Recruitment": "67a4cf69-fa2c-40fd-8b91-3a1189085712",
    "Voicemail_EAA_Apps in Progress": "8cd37495-8d8a-40c3-8c7d-cfe954cc4472",
    "Voicemail_EAA_Recruitment": "718998c3-b55e-4633-aa0c-ab3c6f18e651",
    "Voicemail_ECAA_Apps in Progress": "e30f7e08-879a-4471-90f9-10cb3acf8a09",
    "Voicemail_ECAA_Recruitment": "6ff8aacf-7b01-41fd-b728-33a15a4fb05e",
    "Voicemail_GCAA_Apps in Progress": "c367f26c-ac70-4afc-9cc9-ebbc6db2e4cf",
    "Voicemail_GCAA_Recruitment": "5d75a364-65f6-4610-9916-28001278acad",
    "Voicemail_LAA_Apps in Progress": "ae1e0381-841e-40a0-a7e2-57707bb1d502",
    "Voicemail_LAA_Recruitment": "dba41b7f-0e7b-4820-bdae-3cb6184b2f3d",
    "Voicemail_LCAA_Apps in Progress": "d735c4a0-52b7-435c-8ea1-86cd985ad98d",
    "Voicemail_LCAA_Recruitment": "0b71f906-d585-41f1-9524-1489b9c332b3",
    "Voicemail_Mainline_Call": "278f8a5c-11cd-44a2-a84f-e593e3b8e815",
    "Voicemail_MCAA_Apps in Progress": "99cb3095-781a-4383-b7d5-55cbe067cc23",
    "Voicemail_MCAA_Recruitment": "65f5fc53-3039-4f25-9d23-522e147f2cff",
    "Voicemail_MDAA_Apps in Progress": "6403a93e-9bec-4daf-a0bf-c3929661013e",
    "Voicemail_MDAA_Recruitment": "18ceae19-c78b-41a9-a234-331ecc94d196",
    "Voicemail_SAA_Apps in Progress": "40612ba8-a6b2-452b-96ca-f51f4f0692bc",
    "Voicemail_SAA_Recruitment": "3c3eb57d-c8a0-4803-a1a6-df37c399add3",
    "Voicemail_SLAA_Apps in Progress": "08e9e06d-2efc-409b-9a15-4e66e774dc47",
    "Voicemail_SLAA_Recruitment": "bbe3f4c3-5a5a-46e1-a0ba-90d027ead316",
    "Voicemail_Spanish_Callback": "84a8d60e-9503-4f78-8acc-ba434c8a656e",
    "Voicemail_WAA_Apps in Progress": "38a51317-0898-435d-a72f-f5b2b7fa34fd",
    "Voicemail_WAA_Recruitment": "f05de67e-cc17-45ea-bb88-7b90d2876555"
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
        'last_agent': data.full_name ? data.full_name : data.last_agent_name,
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