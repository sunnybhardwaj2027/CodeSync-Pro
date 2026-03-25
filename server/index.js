const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

// SSL bypass for university/college networks
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
    socket.on("join_room", (room) => socket.join(room));
    socket.on("send_code", (data) => socket.to(data.room).emit("receive_code", data.code));
});

// --- DYNAMIC COMPILER ROUTE (JDoodle) ---
app.post("/compile", async (req, res) => {
    const { code, language, input } = req.body;

    // JDoodle Language Mapping
    const langMap = {
        cpp: { lang: "cpp17", ver: "0" },
        python: { lang: "python3", ver: "4" },
        java: { lang: "java", ver: "4" }
    };

    const program = {
        script: code,
        language: langMap[language].lang,
        versionIndex: langMap[language].ver,
        stdin: input || "", 
        clientId: "ee32d33b5168de37c4736230b9376d4e",
        clientSecret: "5fb941d3ded6416621cd449b368c6df3f96c03c6714937728f730a1d2fd51306"
    };

    try {
        console.log(`Compiling ${language}...`);
        const response = await axios.post("https://api.jdoodle.com/v1/execute", program);
        res.json({ output: response.data.output });
    } catch (error) {
        console.error("JDoodle Error:", error.message);
        res.status(500).json({ output: "Error: Compiler Service Unreachable." });
    }
});

server.listen(3001, () => console.log("SERVER RUNNING ON 3001"));