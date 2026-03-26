const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        const count = io.sockets.adapter.rooms.get(room)?.size || 0;
        io.to(room).emit("user_count", count);
    });

    socket.on("send_code", (data) => {
        socket.to(data.room).emit("receive_code", data.code);
    });

    socket.on("language_change", (data) => {
        socket.to(data.room).emit("receive_language", data.language);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            const count = (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
            socket.to(room).emit("user_count", count);
        });
    });

    socket.on("disconnect", () => console.log("User Disconnected", socket.id));
});

app.post("/compile", async (req, res) => {
    const { code, language, input } = req.body;
    const langMap = {
        cpp: { lang: "cpp17", ver: "0" },
        python: { lang: "python3", ver: "4" },
        java: { lang: "java", ver: "4" }
    };
    if (!langMap[language]) return res.status(400).json({ output: "Unsupported Language" });

    const program = {
        script: code, language: langMap[language].lang, versionIndex: langMap[language].ver,
        stdin: input || "", clientId: "ee32d33b5168de37c4736230b9376d4e",
        clientSecret: "5fb941d3ded6416621cd449b368c6df3f96c03c6714937728f730a1d2fd51306"
    };

    try {
        const response = await axios.post("https://api.jdoodle.com/v1/execute", program);
        res.json({ output: response.data.output });
    } catch (error) {
        res.status(500).json({ output: "Compiler Error." });
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));