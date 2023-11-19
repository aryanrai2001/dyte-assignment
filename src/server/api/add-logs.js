const faunadb = require("faunadb");

const query = faunadb.query;

const client = new faunadb.Client({
    // This is the secret key for my fauna database
    secret: "fnAFS-R60qAAQkavstCU0Ap6ETjqITSCGxU87nHh",
    domain: "db.us.fauna.com",
});

// Schema of a valid log object
const LOG_SCHEMA = {
    level: String,
    message: String,
    resourceId: String,
    timestamp: String,
    traceId: String,
    spanId: String,
    commit: String,
    metadata: {
        parentResourceId: String,
    },
};

// Function that only returns true if the log object matches the schema structure
function validateLogStructure(schema, log) {
    if (log === undefined) return false;
    for (const prop in schema) {
        if (schema[prop].constructor === Object) {
            if (!validateLogStructure(schema[prop], log[prop])) return false;
        } else {
            if (
                !log.hasOwnProperty(prop) ||
                log[prop].constructor !== schema[prop]
            )
                return false;
        }
    }
    for (const prop of Object.keys(log)) {
        if (schema[prop] === undefined) return false;
    }
    return true;
}

module.exports = async (req, res) => {
    const reqbody = req.body;
    const reqdata = [];

    // Handle multiple logs in one request
    if (Array.isArray(reqbody)) {
        reqbody.forEach((logbody) => {
            reqdata.push({
                data: logbody,
            });
        });
    } else {
        reqdata.push({
            data: reqbody,
        });
    }

    try {
        const resdata = [];

        // Validate log object structure
        for (const logdata of reqdata) {
            if (!validateLogStructure(LOG_SCHEMA, logdata.data))
                throw TypeError("incorrect log format", {
                    cause: "bad request",
                });
        }

        // Separate query for each log
        for (const logdata of reqdata) {
            // Converting timestamp from given format to seconds
            let dateval = new Date(logdata.data.timestamp);
            if (isNaN(dateval)) dateval = new Date();
            logdata.data.timestamp = dateval.getTime();
            const dbs = await client.query(
                query.Create(query.Collection("logs"), logdata)
            );
            resdata.push(dbs);
        }
        res.status(200).json(resdata);
    } catch (e) {
        console.log(e);
        res.status(e.cause === "bad request" ? 400 : 500).json({
            error: e.message,
        });
    }
};
