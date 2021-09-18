
async function updateField(gsapi,recordNumber) {

    await gsapi.spreadsheets.values.update({
        spreadsheetId: '1UdcuYluJlAj-iXW4cTCC3r0uTYSIf7r5IOkikNj1758',
        range: `schedule!R[${recordNumber+1}]C[2]`,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values:[
                ["active"]
            ]
        }
    });
}
exports.updateField = updateField;
