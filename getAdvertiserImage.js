const { readDatabase } = require("./readDatabase");

async function getAdvertiserImage(gsapi, spreadsheetId, advertiserId) {
    
    let imageArray = await readDatabase(gsapi, spreadsheetId, 'images!A2:C');
    let imageLink;
    let imageDescription;
    imageArray.map(function (r) {
        if (r[0] == advertiserId) {
            imageLink = r[1];
            imageDescription=r[2];
        }
    });
    return {imageLink,imageDescription};
}
exports.getAdvertiserImage = getAdvertiserImage;
