
const { google } = require('googleapis');
const {client_email,private_key}=require('./keys.json');

var request = require('request'); //bash: npm install request
// URL for request POST /message
var token = 'vk82a71m15h9xvtv';
var instanceId = '307507';
var url = `https://api.chat-api.com/instance${instanceId}/message?token=${token}`;
// Send a request

const googleclient=new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

googleclient.authorize(function(err){
    if(err){
        console.log(err);
        return;
    }
    else{
        console.log('google connected');
        gsrun(googleclient);
    }

});

async function gsrun(cl){
    const gsapi=google.sheets({version:'v4',auth:cl});

    const opt = {
        spreadsheetId:'1UdcuYluJlAj-iXW4cTCC3r0uTYSIf7r5IOkikNj1758',
          range:'Sheet1!A2:B2' 
    }

    let data=await gsapi.spreadsheets.values.get(opt);

    let dataArray=data.data.values;

    dataArray.map(function(r){
        console.log('database retrieved');
        var data = {
            phone: r[1], 
            body: 'Hello, How r u?',
            
             // Сообщение
        };
        request({
            url: url,
            method: "POST",
            json: data
        });
        
        
    })
}

