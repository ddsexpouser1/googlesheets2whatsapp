const { updateLog } = require("./updateLog");
const { updateField } = require("./updateField");
const request = require('request-promise');
const { imageURL } = require("./scheduleTask");
const {updateJobLog}=require("./updateJobLog");
var a={value:0};
global.succ=0;
global.failure=0;
async function sendImage(filteredRecords, imageLink, gsapi, spreadsheetId, advertiserId, scheduleData, record) {
     filteredRecords.map( async function (r) {
        var data = {
            body: `${imageLink}`,
            filename: "cover.jpg",
            phone: r[1]
        };
        request(
            {
                url: imageURL,
                method: "POST",
                json: data
            }
        )
            .then(a.value=async (success)=>{
                global.succ+=1;
                await updateLog(gsapi, spreadsheetId, 'log!A2:E2', success, advertiserId);
                await updateField(gsapi, scheduleData.indexOf(record)); 
                console.log(a.value);
               // await updateJobLog(gsapi,spreadsheetId,'joblog!A2:E2',advertiserId,filteredRecords.length,global.succ,global.failure);
                return global.succ;
            })
            .catch((err)=>{
                console.log("error:", err);
            })    
        }
    ),
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    };
    await updateJobLog(gsapi,spreadsheetId,'joblog!A2:E2',advertiserId,filteredRecords.length,a.value,global.failure);
    
}
exports.sendImage = sendImage;
