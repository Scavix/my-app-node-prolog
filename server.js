const path = require('path');
const cors = require('cors');
const express = require('express');
const pl = require("tau-prolog");
var sessionsIds = 1000;
const program = `
                morse(a, ".-").
                morse(b, "-...").
                morse(c, "-.-.").
                morse(d, "-..").
                morse(e, ".").
                morse(f, "..-.").
                morse(g, "--.").
                morse(h, "....").
                morse(i, "..").
                morse(j, ".---").
                morse(k, "-.-").
                morse(l, ".-..").
                morse(m, "--").
                morse(n, "-.").
                morse(o, "---").
                morse(p, ".--.").
                morse(q, "--.-").
                morse(r, ".-.").
                morse(s, "...").
                morse(t, "-").
                morse(u, "..-").
                morse(v, "...-").
                morse(w, ".--").
                morse(x, "-..-").
                morse(y, "-.--").
                morse(z, "--..").

                morse('0', "-----").
                morse('1', ".----").
                morse('2', "..---").
                morse('3', "...--").
                morse('4', "....-").
                morse('5', ".....").
                morse('6', "-....").
                morse('7', "--...").
                morse('8', "---..").
                morse('9', "----.").

                morser([], []).
                morser([MorseLetter|RestMorse], [Letter|RestText]) :-
                    morse(Letter, MorseLetter),
                    morser(RestMorse, RestText).
                `;

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post('/apiFromMorse', (req, res) => {
    console.log(req.body.sentence);
    const session = pl.create(sessionsIds);
    sessionsIds++;
    const sentence = req.body.sentence;
    var sentenceFinal = "[";
    for (var i = 0; i < sentence.length; i++) {
        sentenceFinal += '"' + sentence[i] + '",';
    }
    sentenceFinal = sentenceFinal.slice(0, -1);
    sentenceFinal += "]";
    const goal = "morser(" + sentenceFinal + ",Text).";
    session.consult(program, {
        success: function () {
            session.query(goal, {
                success: function () {
                    session.answer({
                        success: function (answer) {
                            res.json({ result: session.format_answer(answer) });
                        },
                        error: function (err) {
                            console.log("Uncaught error", err);
                        }
                    });
                }
            })
        }
    });
});

app.post('/apiToMorse', (req, res) => {
    const session = pl.create(sessionsIds);
    sessionsIds++;
    const sentence = req.body.sentence;
    const goal = `morser(Morse,"${sentence}").`;
    session.consult(program, {
        success: function () {
            session.query(goal, {
                success: function () {
                    session.answer({
                        success: function (answer) {
                            res.json({ result: session.format_answer(answer) });
                        },
                        error: function (err) {
                            console.log("Uncaught error", err);
                        }
                    });
                }
            })
        }
    });
});

app.get("*", (req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
