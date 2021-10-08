const {instanceId,token}=require("./keys.json");

var imageURL = `https://api.chat-api.com/instance${instanceId}/sendFile?token=${token}`;
exports.imageURL = imageURL;
var messageURL = `https://api.chat-api.com/instance${instanceId}/message?token=${token}`;
exports.messageURL = messageURL;
var cron=require('node-cron');
const { getAdvertiserImage } = require("./getAdvertiserImage");
const { sendImage } = require("./sendImage");
const { sendDescription } = require("./sendDescription");


async function scheduleTask(gsapi,spreadsheetId,filteredRecords,scheduledDate,advertiserId,scheduleData,record){
    let {imageLink,imageDescription} = await getAdvertiserImage(gsapi, spreadsheetId, advertiserId);
    
    let tempDate=new Date(scheduledDate);
    tempDate.setTime(tempDate.getTime()+(1*60*1000));

    cron.schedule(`${tempDate.getMinutes()} ${tempDate.getHours()} * * *`,async ()=>{
        console.log("scheduling.....");
        await sendImage(filteredRecords, imageLink, gsapi, spreadsheetId, advertiserId, scheduleData, record);
       // sendDescription(filteredRecords, imageDescription, gsapi, spreadsheetId, advertiserId, scheduleData, record);
       
        }
       
    ); 

}
exports.scheduleTask=scheduleTask;



