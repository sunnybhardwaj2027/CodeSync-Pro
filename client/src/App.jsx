import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect("http://localhost:3001");

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const snippets = {
    cpp: "#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    cout << \"Value from Input: \" << n;\n    return 0;\n}",
    python: "n = input()\nprint(f'Value from Input: {n}')",
    java: "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.next();\n        System.out.println(\"Value from Input: \" + n);\n    }\n}"
  };

  useEffect(() => { setCode(snippets[language]); }, [language]);

  const joinRoom = () => { if (room) socket.emit("join_room", room); };

  const handleEditorChange = (value) => {
    setCode(value);
    if (room) socket.emit("send_code", { room, code: value });
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("Running...");
    try {
      const { data } = await axios.post("http://localhost:3001/compile", { code, language, input });
      setOutput(data.output);
    } catch (err) {
      setOutput("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("receive_code", (newCode) => setCode(newCode));
    return () => socket.off("receive_code");
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#1e1e1e", color: "white" }}>
      {/* Navbar */}
      <div style={{ padding: "10px 20px", display: "flex", gap: "10px", alignItems: "center", background: "#2d2d2d", borderBottom: "1px solid #444" }}>
        <h3 style={{ margin: 0, color: "#4CAF50" }}>CodeSync Pro</h3>
        <input placeholder="Room ID" onChange={(e) => setRoom(e.target.value)} style={{ padding: "5px", background: "#3c3c3c", color: "white", border: "1px solid #555" }} />
        <button onClick={joinRoom} style={{ padding: "5px 15px", background: "#007acc", color: "white", border: "none", cursor: "pointer" }}>Join</button>
        
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "5px", background: "#3c3c3c", color: "white" }}>
          <option value="cpp">C++</option>
          <option value="python">Python 3</option>
          <option value="java">Java</option>
        </select>

        <button onClick={runCode} disabled={loading} style={{ marginLeft: "auto", padding: "8px 20px", background: "#4CAF50", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "..." : "RUN"}
        </button>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 0.7 }}>
          <Editor height="100%" language={language} theme="vs-dark" value={code} onChange={handleEditorChange} options={{ fontSize: 16, minimap: { enabled: false } }} />
        </div>
        
        <div style={{ flex: 0.3, display: "flex", flexDirection: "column", background: "#000", borderLeft: "2px solid #333" }}>
          <div style={{ height: "40%", padding: "10px", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "12px", color: "#888" }}>INPUT (STDIN)</span>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, background: "#1e1e1e", color: "white", border: "1px solid #333", marginTop: "5px", padding: "10px" }} />
          </div>
          <div style={{ height: "60%", padding: "10px", borderTop: "2px solid #333", overflowY: "auto" }}>
            <span style={{ fontSize: "12px", color: "#888" }}>OUTPUT</span>
            <pre style={{ color: "#00ff00", marginTop: "10px", fontSize: "14px" }}>{output || "> Success! Ready to compile."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;