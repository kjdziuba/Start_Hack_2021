const sql = require('mssql')

var config = {
    server: "hhack-sqlserver.database.windows.net",
    database: "hhack_database",
    user: "hhackreader",
    password: "GetMeData!",
    port: 1433
};


function getUserById(id) {
    return new Promise((resolve, reject) => {
        sql.connect(config, err => {
            if (err) {
                throw err;
            }
            console.log("Connection Successful !");

            new sql.Request().query(`select * from Activity where UserId='${id}';`, (err, result) => {
                //handle err
                console.log("heywww")
                if (err) console.log(err)
                console.log("hey")
                console.log(result)
                // This example uses callbacks strategy for getting results.
            })

        });
    }
    );
}

function getRandomId() {
    return new Promise((resolve, reject) => {
        sql.connect(config, err => {
            if (err) {
                throw err;
            }
            console.log("Connection Successful !");

            new sql.Request().query("SELECT TOP 1 * FROM Activity ORDER BY NEWID()", (err, result) => {
                //handle err
                console.log("heywww")
                if (err) console.log(err)
                console.log(result.recordset[0].UserId)
                return resolve(result.recordset[0].UserId)
            })

        });
    }
    );
}

function getActivitiesById(id) {
    return new Promise((resolve, reject) => {
        sql.connect(config, err => { 
            if(err){
                throw err ;
            }
            console.log("Connection Successful !");
        
            new sql.Request().query(`select RecognizedActivity from Activity where UserId='${id}' AND RecognizedActivity!='Unknown'`, (err, result) => {
                //handle err
                if(err) console.log(err)
                console.log(result)
                var data = result.recordset
                // This example uses callbacks strategy for getting results.
        
                var activities = []
        
                for(let i = 0; i < data.length; i++){
                    if (!activities.includes(data[i].RecognizedActivity)){
                        activities.push(data[i].RecognizedActivity)
                    }
            }
        
            return resolve(activities)
                
            })
                
        });
    }
    );
}


module.exports = {
    getUserById,
    getRandomId,
    getActivitiesById
}

