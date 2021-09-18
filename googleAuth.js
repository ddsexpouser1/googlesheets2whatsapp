const { google } = require('googleapis');
const { client_email, private_key } = require('./keys.json');
const { gsrun } = require("./gsrun");

const googleAuth = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);
googleAuth.authorize(function (err) {
    if (err) {
        console.log(err);
        return;
    }
    else {
        gsrun(googleAuth);
    }

});
