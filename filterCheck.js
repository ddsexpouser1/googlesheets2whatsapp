const { readDatabase } = require("./readDatabase");

async function filterCheck(gsapi, spreadsheetId, groupsData, filtersList, filters) {
    let fieldNames = [].concat.apply([], (await readDatabase(gsapi, spreadsheetId, 'groups!A1:G1')));
    let filteredRecords=[];
    groupsData.map(record => {
        var conditionalString = 0;
        for (let str = 0; str < filtersList.length; str++) {
            if (record[fieldNames.indexOf(filters[str][0])] == filters[str][1]) {
                conditionalString++;
            };

        };
        if (conditionalString == filtersList.length){
            filteredRecords.push(record);           
        }
            
 
    });
    return filteredRecords;
}
exports.filterCheck = filterCheck;
