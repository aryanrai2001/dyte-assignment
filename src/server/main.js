const express = require("express");
const ViteExpress = require("vite-express");
const addlogs = require("./api/add-logs.js");
const querylogs = require("./api/query-logs.js");

const app = express();
const PORT = 3000;

app.use(express.json());
app.post("/", addlogs);
app.post("/logs", querylogs);

ViteExpress.listen(app, PORT, () =>
    console.log(`API live on http://localhost:${PORT}`)
);
