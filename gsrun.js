const { google } = require('googleapis');
var cron = require('node-cron');
const { filterCheck } = require("./filterCheck");
const { filterSplit } = require("./filterSplit");
const { readDatabase } = require("./readDatabase");
const {scheduleTask}=require('./scheduleTask');
const {jobToDo}=require('./jobToDo');
const {updateJobLog}=require("./updateJobLog");

async function gsrun(cl) {

    const gsapi = google.sheets({ version: 'v4', auth: cl }); 
    const spreadsheetId= '1UdcuYluJlAj-iXW4cTCC3r0uTYSIf7r5IOkikNj1758';

    
    cron.schedule('*/2 * * * *',async () => {
        
        let groupsData = await readDatabase(gsapi,spreadsheetId,'groups!A2:G');
        let scheduleData = await readDatabase(gsapi,spreadsheetId,'schedule!A2:H');
        let jobsData = await readDatabase(gsapi,spreadsheetId,'jobs!A2:C');           
        
        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        let scheduleDate = '';
        let scheduleTime = ''; 

        scheduleData.map(async (record) => {

            scheduleDate = new Date(record[1]);
            scheduleTime = scheduleDate.getTime();

            let diff = currentTime - scheduleTime;
            diff /= (1000 * 60);

            if ((diff >= 0) && (diff <= 1) && (record[2] == 'new')) {

                console.log("New task entered......");

                let advertiserId=await jobToDo(record[4],jobsData);
                            
                let { filtersList, filters } = filterSplit(record);

                console.log("filters list:",filtersList);
                            
                let filteredRecords=await filterCheck(gsapi, spreadsheetId, groupsData, filtersList, filters);

                console.log("filtered mobile numbers",filteredRecords);

                let {success,failure}=await scheduleTask(gsapi,spreadsheetId,filteredRecords,record[1],advertiserId,scheduleData,record);

                await updateJobLog(gsapi,spreadsheetId,'joblog!A2:E2',advertiserId,filteredRecords.length,success,failure);
                                        
                }
               
            });
           
    });

}
exports.gsrun = gsrun;
