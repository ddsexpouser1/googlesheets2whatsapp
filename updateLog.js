
async function updateLog(gsapi,spreadsheetId,range,log,advertiserId) {
    
    await gsapi.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [
                    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), log.id, log.message, log.sent, advertiserId
                ]
            ]
        }
    });
}
exports.updateLog = updateLog;
