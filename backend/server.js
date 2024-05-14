
import path from "path";

import 'dotenv/config';
import express from "express";

const app = express();


app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>")
});
console.log(`123`)

const port = process.env.PORT || 4000;

const start = async () => {
    try {
        app.listen(port, console.log(`Working on ${port} port`))
    } catch (error) {
        console.log(error + 'error');
    }
}
start()
