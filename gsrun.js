const { google } = require('googleapis');
var cron = require('node-cron');
const { filterCheck } = require("./filterCheck");
const { filterSplit } = require("./filterSplit");
const { readDatabase } = require("./readDatabase");
const {scheduleTask}=require('./scheduleTask');
const {jobToDo}=require('./jobToDo');

async function gsrun(cl) {

    const gsapi = google.sheets({ version: 'v4', auth: cl }); 
    const spreadsheetId= '1UdcuYluJlAj-iXW4cTCC3r0uTYSIf7r5IOkikNj1758';

    let groupsData = await readDatabase(gsapi,spreadsheetId,'groups!A2:G5');
    let scheduleData = await readDatabase(gsapi,spreadsheetId,'schedule!A2:H3');
    let jobsData = await readDatabase(gsapi,spreadsheetId,'jobs!A2:C7');

    cron.schedule('* * * * *', () => {

        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        let scheduleDate = '';
        let scheduleTime = ''; 

        scheduleData.map(async (record) => {

            scheduleDate = new Date(record[1]);
            scheduleTime = scheduleDate.getTime();

            let diff = currentTime - scheduleTime;
            diff /= (1000 * 60);

            if ((diff >= 0) && (diff <= 1) && (record[2] == 'inactive')) {

                let advertiserId=await jobToDo(record[4],jobsData);
                            
                let { filtersList, filters } = filterSplit(record);
                            
                let filteredRecords=await filterCheck(gsapi, spreadsheetId, groupsData, filtersList, filters);

                await scheduleTask(gsapi,spreadsheetId,filteredRecords,record[1],advertiserId,scheduleData,record);
                                        
                }
               
            });
           
    });

}
exports.gsrun = gsrun;
