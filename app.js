const express = require('express');
const app = express();
const port = 3000;
app.listen(port);

app.get("/", (req, resp) => {
    resp.send("hello world!");
});