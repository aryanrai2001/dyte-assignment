const faunadb = require("faunadb");

const query = faunadb.query;

const client = new faunadb.Client({
    secret: "fnAFS-R60qAAQkavstCU0Ap6ETjqITSCGxU87nHh",
    domain: "db.us.fauna.com",
});

module.exports = async (req, res) => {
    const reqdata = req.body;
    let message = reqdata.message;
    if (message === undefined) message = "";
    try {
        const dbs = await client.query(
            // Filters by full-text search for message parameter
            query.Map(
                query.Filter(
                    query.Paginate(
                        query.Intersection(
                            // Call Fauna Function "filterBy" for level parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.level !== undefined,
                                "level",
                                reqdata.level,
                            ]),

                            // Call Fauna Function "filterBy" for resourceId parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.resourceId !== undefined,
                                "resid",
                                reqdata.resourceId,
                            ]),

                            // Call Fauna Function "filterBy" for traceId parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.traceId !== undefined,
                                "traceid",
                                reqdata.traceId,
                            ]),

                            // Call Fauna Function "filterBy" for spanId parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.spanId !== undefined,
                                "spanid",
                                reqdata.spanId,
                            ]),

                            // Call Fauna Function "filterBy" for commit parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.commit !== undefined,
                                "commit",
                                reqdata.commit,
                            ]),

                            // Call Fauna Function "filterBy" for metadata.parentResourceId parameter
                            query.Call(query.Function("filterBy"), [
                                reqdata.metadata?.parentResourceId !==
                                    undefined,
                                "parentresid",
                                reqdata.metadata?.parentResourceId,
                            ]),

                            // Filters by timestamp or the duration [timestart, timeend]
                            query.If(
                                reqdata.timestamp !== undefined,
                                query.Match(
                                    query.Index("logs-by-timestamp"),
                                    new Date(reqdata.timestamp).getTime()
                                ),
                                query.If(
                                    reqdata.timestart !== undefined &&
                                        reqdata.timeend !== undefined,
                                    query.Join(
                                        query.Range(
                                            query.Match(
                                                query.Index(
                                                    "logs-by-timeduration"
                                                )
                                            ),
                                            [
                                                new Date(
                                                    reqdata.timestart
                                                ).getTime(),
                                            ],
                                            [
                                                new Date(
                                                    reqdata.timeend
                                                ).getTime(),
                                            ]
                                        ),
                                        query.Lambda(
                                            ["value", "ref"],
                                            query.Singleton(query.Var("ref"))
                                        )
                                    ),
                                    query.Match(query.Index("all-logs"))
                                )
                            )
                        ),
                        {
                            // Number of logs shown in each page
                            size: 3,
                        }
                    ),
                    query.Lambda(
                        "ref",
                        query.ContainsStr(
                            query.LowerCase(
                                query.Select(
                                    ["data", "message"],
                                    query.Get(query.Var("ref"))
                                )
                            ),
                            query.LowerCase(message)
                        )
                    )
                ),
                query.Lambda("ref", query.Get(query.Var("ref")))
            )
        );
        const data = dbs.data;

        // Reformat timestamp from seconds to ISO String
        data.forEach((log) => {
            log.data.timestamp = new Date(log.data.timestamp).toISOString();
        });
        res.status(200).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
};
