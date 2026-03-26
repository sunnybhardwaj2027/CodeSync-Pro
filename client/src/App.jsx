import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Play, Copy, Users, MessageSquare, Send, Code2, ChevronRight, Terminal } from 'lucide-react';

const API_URL = window.location.hostname === "localhost" ? "http://localhost:3001" : "https://codesync-pro-tb71.onrender.com";
const socket = io(API_URL, { transports: ["websocket"] });

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [room, setRoom] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  
  const chatEndRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const snippets = {
    cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello Sunny!\";\n    return 0;\n}",
    python: "print('Hello Sunny!')",
    java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Sunny!\");\n    }\n}"
  };

  useEffect(() => { setCode(snippets[language]); }, [language]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  useEffect(() => {
    socket.on("receive_code", (newCode) => { isRemoteUpdate.current = true; setCode(newCode); });
    socket.on("user_count", (count) => setUserCount(count));
    socket.on("receive_language", (lang) => { setLanguage(lang); toast(`Language: ${lang}`, { icon: '📝' }); });
    socket.on("receive_message", (data) => setChat((prev) => [...prev, { ...data, type: "remote" }]));
    return () => socket.removeAllListeners();
  }, []);

  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", room);
      toast.success(`Joined: ${room}`);
    } else toast.error("Enter Room ID");
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && room) {
      const msgData = { text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      socket.emit("send_message", { room, ...msgData });
      setChat((prev) => [...prev, { ...msgData, type: "me" }]);
      setMessage("");
    }
  };

  const runCode = async () => {
    setLoading(true);
    const tid = toast.loading("Compiling...");
    try {
      const { data } = await axios.post(`${API_URL}/compile`, { code, language, input });
      setOutput(data.output);
      toast.success("Success!", { id: tid });
    } catch { toast.error("Failed!", { id: tid }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0a", color: "#eee" }}>
      <Toaster position="top-right" />
      
      {/* Premium Navbar */}
      <nav style={{ height: "60px", padding: "0 24px", display: "flex", alignItems: "center", background: "#161616", borderBottom: "1px solid #2a2a2a", justifyContent: "space-between", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#4CAF50", padding: "6px", borderRadius: "6px" }}><Code2 size={20} color="white" /></div>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "800", letterSpacing: "1px" }}>CODESYNC <span style={{ color: "#4CAF50" }}>PRO</span></h2>
          {room && <div style={{ marginLeft: "15px", display: "flex", alignItems: "center", gap: "6px", background: "#222", padding: "4px 10px", borderRadius: "15px", fontSize: "11px", border: "1px solid #333" }}>
             <Users size={12} color="#4CAF50" /> {userCount} Online
          </div>}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ display: "flex", background: "#222", borderRadius: "6px", border: "1px solid #333" }}>
            <input placeholder="Room ID" value={room} onChange={(e) => setRoom(e.target.value)} style={{ background: "transparent", border: "none", color: "white", padding: "0 10px", outline: "none", width: "100px", fontSize: "13px" }} />
            <button onClick={joinRoom} style={{ background: "#4CAF50", border: "none", color: "white", padding: "8px 15px", borderRadius: "0 5px 5px 0", cursor: "pointer", fontWeight: "600" }}>Join</button>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(room); toast.success("Copied!"); }} style={{ background: "#222", border: "1px solid #333", padding: "8px", borderRadius: "6px", color: "#aaa", cursor: "pointer" }}><Copy size={16} /></button>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); socket.emit("language_change", { room, language: e.target.value }); }} style={{ background: "#222", color: "white", border: "1px solid #333", padding: "0 10px", borderRadius: "6px", fontSize: "13px" }}>
            <option value="cpp">C++</option>
            <option value="python">Python 3</option>
            <option value="java">Java</option>
          </select>
          <button onClick={runCode} disabled={loading} style={{ background: "#4CAF50", border: "none", color: "white", padding: "8px 20px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
            <Play size={14} fill="white" /> {loading ? "..." : "RUN"}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Editor Area */}
        <div style={{ flex: 1, borderRight: "1px solid #2a2a2a" }}>
          <Editor height="100%" language={language} theme="vs-dark" value={code} onChange={(v) => { if (!isRemoteUpdate.current) { setCode(v); socket.emit("send_code", { room, code: v }); } isRemoteUpdate.current = false; }} options={{ fontSize: 15, padding: { top: 15 }, minimap: { enabled: false }, fontFamily: "'Fira Code', monospace" }} />
        </div>

        {/* Sidebar: Console + Chat */}
        <div style={{ width: "320px", display: "flex", flexDirection: "column", background: "#0f0f0f" }}>
          {/* Console */}
          <div style={{ height: "45%", display: "flex", flexDirection: "column", borderBottom: "1px solid #2a2a2a" }}>
            <div style={{ padding: "8px 15px", background: "#161616", fontSize: "11px", fontWeight: "bold", color: "#666", display: "flex", alignItems: "center", gap: "5px" }}><Terminal size={12}/> CONSOLE</div>
            <textarea placeholder="Input (stdin)..." value={input} onChange={(e) => setInput(e.target.value)} style={{ height: "60px", background: "transparent", color: "#ccc", border: "none", padding: "12px", outline: "none", resize: "none", fontSize: "13px" }} />
            <div style={{ flex: 1, padding: "12px", background: "#050505", color: "#4CAF50", fontSize: "12px", overflowY: "auto", borderTop: "1px solid #1a1a1a" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{output || "> Success."}</pre>
            </div>
          </div>

          {/* Chat */}
          <div style={{ height: "55%", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 15px", background: "#161616", fontSize: "11px", fontWeight: "bold", color: "#666", display: "flex", alignItems: "center", gap: "5px" }}><MessageSquare size={12}/> CHAT</div>
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {chat.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.type === "me" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                  <div style={{ background: msg.type === "me" ? "#4CAF50" : "#252525", color: msg.type === "me" ? "white" : "#ddd", padding: "6px 12px", borderRadius: "10px", fontSize: "13px", borderBottomRightRadius: msg.type === "me" ? "2px" : "10px", borderBottomLeftRadius: msg.type === "remote" ? "2px" : "10px" }}>{msg.text}</div>
                  <div style={{ fontSize: "9px", color: "#555", marginTop: "2px", textAlign: msg.type === "me" ? "right" : "left" }}>{msg.time}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ padding: "12px", borderTop: "1px solid #2a2a2a", display: "flex", gap: "6px" }}>
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say something..." style={{ flex: 1, background: "#1a1a1a", border: "1px solid #333", color: "white", padding: "8px 12px", borderRadius: "6px", outline: "none", fontSize: "13px" }} />
              <button type="submit" style={{ background: "#4CAF50", border: "none", color: "white", padding: "8px", borderRadius: "6px", cursor: "pointer" }}><Send size={16} /></button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;