const {instanceId,token}=require("./keys.json");
const { updateLog } = require("./updateLog");
const { updateField } = require("./updateField");

var imageURL = `https://api.chat-api.com/instance${instanceId}/sendFile?token=${token}`;
var messageURL = `https://api.chat-api.com/instance${instanceId}/message?token=${token}`;
var cron=require('node-cron');
var request = require('request');
const { getAdvertiserImage } = require("./getAdvertiserImage");

async function scheduleTask(gsapi,spreadsheetId,filteredRecords,scheduledDate,advertiserId,scheduleData,record){
    let {imageLink,imageDescription} = await getAdvertiserImage(gsapi, spreadsheetId, advertiserId);
    let success=0;
    let failure=0;
    
    let tempDate=new Date(scheduledDate);
    tempDate.setTime(tempDate.getTime()+(1*60*1000));

    cron.schedule(`${tempDate.getMinutes()} ${tempDate.getHours()} * * *`,()=>{
        console.log("scheduling.....");
    
        filteredRecords.map(function(r){
            
            var data = {
                body:`${imageLink}`,
                filename:"cover.jpg",
                phone: r[1]
            }; 
            request(
                {
                    url: imageURL,
                    method: "POST",
                    json: data
                },
                async function(err,body){
                    if(err){
                        console.log("error:",err);
                    }
                    await updateLog(gsapi,spreadsheetId,'log!A2:E2',body,advertiserId);
                    if(body.sent){
                        success+=1;
                        await updateField(gsapi,scheduleData.indexOf(record));
                        return true;

                    }
                    else{
                        return false;
                    }
                }
            );       
                
        }),
   
        filteredRecords.map(function(r){
            
            var data = {
                body:`Dear ${r[6]}, ${imageDescription}`,
                phone: r[1]
            }; 
            request(
                {
                    url: messageURL,
                    method: "POST",
                    json: data
                },
                async function(err,body){
                    if(err){
                        console.log("error:",err);
                    }
                    await updateLog(gsapi,spreadsheetId,'log!A2:E2',body,advertiserId);
                    if(body.sent){
                        await updateField(gsapi,scheduleData.indexOf(record)); 
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
    return {success,failure};
    
    
}
exports.scheduleTask=scheduleTask;


