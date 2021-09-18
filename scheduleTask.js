const {instanceId,token}=require("./keys.json");
const { updateLog } = require("./updateLog");
const { updateField } = require("./updateField");

var url = `https://api.chat-api.com/instance${instanceId}/sendFile?token=${token}`;
var cron=require('node-cron');
var request = require('request');
const { getAdvertiserImage } = require("./getAdvertiserImage");

async function scheduleTask(gsapi,spreadsheetId,filteredRecords,scheduledDate,advertiserId,scheduleData,record){
    let imageLink = await getAdvertiserImage(gsapi, spreadsheetId, advertiserId);

    let tempDate=new Date(scheduledDate);
    tempDate.setTime(tempDate.getTime()+(1*60*1000));

    let task=cron.schedule(`${tempDate.getMinutes()} ${tempDate.getHours()} * * *`,()=>{
    
        filteredRecords.map(function(r){
            var data = {
                body:`${imageLink}`,
                filename:"cover.jpg",
                caption:"Tomorrow Ad",
                phone: r[1]
            }; 
            request(
                {
                    url: url,
                    method: "POST",
                    json: data
                },
                async function(err,res,body){
                    if(err){
                        console.log("error:",err);
                    }
                    await updateLog(gsapi,spreadsheetId,'log!A2:D2',body);
                    if(body.sent){
                        await updateField(gsapi,scheduleData.indexOf(record));
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            );       
                
        }),
            {
                scheduled: true,
                timezone: "Asia/Kolkata"
            } 
        }
        );
   task.start();   
}
exports.scheduleTask=scheduleTask;


