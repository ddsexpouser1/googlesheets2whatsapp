const { updateLog } = require("./updateLog");
const { updateField } = require("./updateField");
var request = require('request');
const { messageURL } = require("./scheduleTask");

function sendDescription(filteredRecords, imageDescription, gsapi, spreadsheetId, advertiserId, scheduleData, record) {
    filteredRecords.map(async function (r) {

        var data = {
            body: `Dear ${r[6]}, ${imageDescription}`,
            phone: r[1]
        };
        request(
            {
                url: messageURL,
                method: "POST",
                json: data
            },
            async function (err,res,body) {
                if (err) {
                    console.log("error:", err);
                }
                await updateLog(gsapi, spreadsheetId, 'log!A2:E2', body, advertiserId);
               
                if (body.sent) {
                    await updateField(gsapi, scheduleData.indexOf(record));
                    return true;
                }
                else {
                    return false;
                }
            }
        );

    }),
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    };
}
exports.sendDescription = sendDescription;
