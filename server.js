const express = require("express");
const cors = require("cors");
const mineflayer = require("mineflayer");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Svetainės failai

let bot = null; // Botas bus saugomas čia

// API maršrutas prisijungti prie serverio
app.post("/connect", (req, res) => {
    const { ip, port } = req.body;

    if (!ip || !port) {
        return res.json({ error: "Įveskite serverio IP ir portą!" });
    }

    if (bot) {
        bot.end(); // Atjungiame ankstesnį botą, jei yra
    }

    bot = mineflayer.createBot({
        host: ip,
        port: parseInt(port),
        username: "ManoBotas",
        version: "1.21.4" // Pakeista į teisingą versiją
    });

    bot.on("login", () => {
        console.log("✅ Botas prisijungė prie serverio!");
        res.json({ message: `Botas prisijungė prie serverio ${ip}:${port}` });
    });

    bot.on("spawn", () => {
        console.log("🎮 Botas atsirado pasaulyje!");
    });

    bot.on("error", (err) => {
        console.error("❌ Klaida jungiantis prie serverio:", err.message);
        res.json({ error: `Nepavyko prisijungti: ${err.message}` });
    });

    bot.on("end", () => {
        console.log("❌ Botas atsijungė!");
    });
});

app.listen(port, () => {
    console.log(`🌍 Serveris veikia: http://localhost:${port}`);
});