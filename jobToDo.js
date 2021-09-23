async function jobToDo(jobId,jobsData){
    let advertiserId='';
    jobsData.map(function(r){

        if(r[0]===jobId){
          advertiserId=r[2];
        }

    });
    console.log("advertiser id",advertiserId);
    return advertiserId;
}
exports.jobToDo=jobToDo;