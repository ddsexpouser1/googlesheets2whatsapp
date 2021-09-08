
const { google } = require('googleapis');
const {client_email,private_key}=require('./keys.json');


var request = require('request'); //bash: npm install request
// URL for request POST /message
var token = 'vk82a71m15h9xvtv';
var instanceId = '307507';
var url = `https://api.chat-api.com/instance${instanceId}/sendFile?token=${token}`;
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
    const imageopt ={
        spreadsheetId:'1UdcuYluJlAj-iXW4cTCC3r0uTYSIf7r5IOkikNj1758',
          range:'Sheet1!A8'

    }

    let data=await gsapi.spreadsheets.values.get(opt);
    let imageurl=await gsapi.spreadsheets.values.get(imageopt);
    

    let dataArray=data.data.values;
    let imageArray=imageurl.data.values;

    var cron=require('node-cron');

    let task=cron.schedule('0 22 9 * * *',()=>{
        dataArray.map(function(r){
            var data = {
                body:imageArray[0].toString(),
                filename: "cover.jpg",
                caption: "sample schedule @ 9.22",
                phone: r[1]
            }; 
            console.log("entered in schedule")     
            request({
                        url: url,
                        method: "POST",
                        json: data
                    });       
            
        }),
        {
            scheduled: true,
            timezone: "Asia/Colombo"
        } 
     }
    );   
    task.start();

}
   
//var url = `https://api.chat-api.com/instance${instanceId}/message?token=${token}`;
//dataArray.map(function(r){
//    console.log('database retrieved');
//    var data = {
//        body: "hello how r u",
//        phone: r[1]
//    };
//    request({
//        url: url,
//        method: "POST",
//        json: data
//    });  
//})  
