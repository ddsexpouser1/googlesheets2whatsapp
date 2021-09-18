function filterSplit(record) {
    let filtersList = record[5].split(";");
    let filters = [];
    for (let i = 0; i < filtersList.length; i++) {
        filters[i] = filtersList[i].split("=");
    }
    return { filtersList, filters };
}
exports.filterSplit = filterSplit;
