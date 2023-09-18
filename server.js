const path = require('path');
const cors = require('cors');

const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: 'https://morse-prolog-u4tg.onrender.com/'
}));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("*", (req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});