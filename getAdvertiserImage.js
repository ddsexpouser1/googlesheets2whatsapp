const { readDatabase } = require("./readDatabase");

async function getAdvertiserImage(gsapi, spreadsheetId, advertiserId) {
    let imageArray = await readDatabase(gsapi, spreadsheetId, 'images!A2:B11');
    let imageLink;
    imageArray.map(function (r) {
        if (r[0] == advertiserId) {
            imageLink = r[1];
        }
    });
    return imageLink;
}
exports.getAdvertiserImage = getAdvertiserImage;
