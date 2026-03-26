import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Zap, Users, MessageSquare, 
  ChevronRight, Terminal, Globe, Shield 
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  // Animation Variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#0a0a0a", 
      color: "#fff", 
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden" 
    }}>
      {/* --- NAVBAR --- */}
      <nav style={{ 
        padding: "20px 50px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #1a1a1a",
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "#4CAF50", padding: "6px", borderRadius: "8px" }}>
            <Code2 color="white" size={24} />
          </div>
          <span style={{ fontWeight: "800", fontSize: "20px", letterSpacing: "1px" }}>
            CODESYNC <span style={{ color: "#4CAF50" }}>PRO</span>
          </span>
        </div>
        <button 
          onClick={() => navigate('/editor')}
          style={{ 
            background: "#4CAF50", 
            color: "white", 
            border: "none", 
            padding: "10px 24px", 
            borderRadius: "8px", 
            fontWeight: "bold", 
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseOver={(e) => e.target.style.opacity = "0.8"}
          onMouseOut={(e) => e.target.style.opacity = "1"}
        >
          Launch Editor
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        textAlign: "center", 
        padding: "120px 20px 80px" 
      }}>
        <motion.div {...fadeIn}>
          <span style={{ 
            background: "#1a1a1a", 
            color: "#4CAF50", 
            padding: "8px 16px", 
            borderRadius: "20px", 
            fontSize: "12px", 
            fontWeight: "bold",
            border: "1px solid #333",
            marginBottom: "20px",
            display: "inline-block"
          }}>
            v2.0 IS NOW LIVE 🚀
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            fontSize: "clamp(40px, 8vw, 90px)", 
            margin: "20px 0", 
            fontWeight: "900", 
            lineHeight: "1",
            letterSpacing: "-2px"
          }}
        >
          Real-Time Coding. <br />
          <span style={{ 
            background: "linear-gradient(90deg, #4CAF50, #81C784)", 
            WebkitBackgroundClip: "text", 
            WebkitTextFillColor: "transparent" 
          }}>
            Zero Boundaries.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ color: "#888", maxWidth: "650px", fontSize: "18px", lineHeight: "1.6" }}
        >
          Collaborate with your team in a powerful, synchronized environment. 
          Write, chat, and compile code instantly from anywhere in the world.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: "flex", gap: "20px", marginTop: "40px" }}
        >
          <button 
            onClick={() => navigate('/editor')}
            style={{ 
              background: "#4CAF50", 
              color: "white", 
              border: "none", 
              padding: "18px 45px", 
              borderRadius: "40px", 
              fontSize: "18px", 
              fontWeight: "bold", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 40px rgba(76, 175, 80, 0.4)"
            }}
          >
            Start Coding Now <ChevronRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section style={{ padding: "80px 50px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          <FeatureCard 
            icon={<Zap color="#4CAF50" size={32} />} 
            title="Instant Sync" 
            desc="Socket.io powered synchronization ensures everyone sees the code change in real-time." 
          />
          <FeatureCard 
            icon={<Terminal color="#4CAF50" size={32} />} 
            title="Cloud Compiler" 
            desc="Run C++, Python, and Java programs instantly with integrated stdin/stdout support." 
          />
          <FeatureCard 
            icon={<MessageSquare color="#4CAF50" size={32} />} 
            title="Team Chat" 
            desc="Built-in messaging allows you to discuss logic and bugs without switching tabs." 
          />
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section style={{ 
        padding: "100px 50px", 
        background: "#080808", 
        borderTop: "1px solid #1a1a1a",
        textAlign: "center"
      }}>
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ fontSize: "40px", fontWeight: "800", marginBottom: "60px" }}
        >
          How It <span style={{ color: "#4CAF50" }}>Works</span>
        </motion.h2>
        
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "center", 
          gap: "60px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          <Step 
            number="1" 
            title="Create Space" 
            desc="Pick a unique Room ID to generate your private, secure workspace." 
          />
          <Step 
            number="2" 
            title="Share Link" 
            desc="Invite friends by sharing the Room ID. They'll join you in a click." 
          />
          <Step 
            number="3" 
            title="Build Together" 
            desc="Write code, debug in the chat, and run tests. Collaborative coding at its best." 
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ 
        padding: "60px 20px", 
        textAlign: "center", 
        borderTop: "1px solid #1a1a1a",
        color: "#555",
        fontSize: "14px"
      }}>
        <p>© 2026 CodeSync Pro. Built by <span style={{ color: "#888" }}>Sunny Kumar</span></p>
      </footer>
    </div>
  );
};

// --- Helper Components ---

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10, borderColor: "#4CAF50" }}
    style={{ 
      background: "#111", 
      padding: "40px", 
      borderRadius: "24px", 
      border: "1px solid #222", 
      transition: "0.3s" 
    }}
  >
    <div style={{ marginBottom: "20px" }}>{icon}</div>
    <h3 style={{ fontSize: "22px", marginBottom: "15px" }}>{title}</h3>
    <p style={{ color: "#777", lineHeight: "1.6", fontSize: "15px" }}>{desc}</p>
  </motion.div>
);

const Step = ({ number, title, desc }) => (
  <div style={{ flex: "1", minWidth: "250px" }}>
    <div style={{ 
      width: "60px", 
      height: "60px", 
      background: "linear-gradient(135deg, #4CAF50, #2E7D32)", 
      borderRadius: "20px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      fontSize: "24px", 
      fontWeight: "900", 
      margin: "0 auto 25px",
      transform: "rotate(-10deg)",
      boxShadow: "0 10px 20px rgba(76, 175, 80, 0.2)"
    }}>
      <span style={{ transform: "rotate(10deg)" }}>{number}</span>
    </div>
    <h4 style={{ fontSize: "20px", marginBottom: "12px", color: "#eee" }}>{title}</h4>
    <p style={{ color: "#666", lineHeight: "1.6", fontSize: "14px" }}>{desc}</p>
  </div>
);

export default Landing;