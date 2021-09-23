async function readDatabase(gsapi,spreadsheetId,range) {
    const databaseData = {
        spreadsheetId,
        range
    };
    let record=await gsapi.spreadsheets.values.get(databaseData);
    return record.data.values;
}
exports.readDatabase = readDatabase;
