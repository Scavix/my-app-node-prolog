const path = require('path');
const cors = require('cors');

const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: '*'
}));

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post('/apiFromMorse', (req, res) => {
    const sentence = req.body.sentence;
    const doubledsentence = sentence + sentence;
    res.json({ result: doubledsentence });
});

app.post('/apiToMorse', (req, res) => {
    const sentence = req.body.sentence;
    const tripledsentence = sentence + sentence + sentence;
    res.json({ result: tripledsentence });
});

app.get("*", (req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});