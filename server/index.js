const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

// SSL bypass for university networks (Optional for production)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// --- SOCKET.IO CONFIG (CORS FIX) ---
const io = new Server(server, {
    cors: { 
        origin: "*", // Production ke liye "*" allow karna zaroori hai
        methods: ["GET", "POST"] 
    },
});

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on("send_code", (data) => {
        // Sirf us room ke baki logo ko bhejega
        socket.to(data.room).emit("receive_code", data.code);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// --- DYNAMIC COMPILER ROUTE (JDoodle) ---
app.post("/compile", async (req, res) => {
    const { code, language, input } = req.body;

    const langMap = {
        cpp: { lang: "cpp17", ver: "0" },
        python: { lang: "python3", ver: "4" },
        java: { lang: "java", ver: "4" }
    };

    // Safety check for language
    if (!langMap[language]) {
        return res.status(400).json({ output: "Error: Unsupported Language" });
    }

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

// Root route for Health Check (Render ke liye zaroori hai)
app.get("/", (req, res) => {
    res.send("CodeSync-Pro Server is Running...");
});

// --- DYNAMIC PORT (Render requirement) ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));