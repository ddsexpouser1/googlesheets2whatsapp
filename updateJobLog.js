async function updateJobLog(gsapi,spreadsheetId,range,advertiserId,filteredRecords,success,failure) {
    
    await gsapi.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [
                    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),advertiserId,filteredRecords,success,failure 
                ]
            ]
        }
    });
}
exports.updateJobLog = updateJobLog;
