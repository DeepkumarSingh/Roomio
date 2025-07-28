// cron.js
const cron = require("node-cron");
const axios = require("axios");

// Runs every 15 minutes
cron.schedule("*/15 * * * *", async () => {
    console.log("Running cron task...");

    try {
        const res = await axios.get("https://roomio-5e5h.onrender.com/keepalive");
        console.log("Ping success:", res.status);
    } catch (err) {
        console.error("Ping failed:", err.message);
    }
});
