# 🚀 CodeSync Pro | Real-Time Collaborative Development Environment

**CodeSync Pro** is a high-performance, real-time collaborative code editor designed to bridge the gap between competitive programming and seamless team collaboration. Whether you are pair-programming for an interview or debugging with a teammate, CodeSync Pro provides a synchronized, low-latency workspace.

---

## 🌟 Core Features

- **⚡ Real-Time Code Sync:** Sub-millisecond code synchronization across multiple clients using Socket.io and custom loop-breaking logic.
- **🖥️ Multi-Language Cloud Compiler:** Integrated with a powerful cloud engine to execute C++, Java, and Python 3 with full STDIN/STDOUT support.
- **💬 Integrated Live Chat:** Discuss logic, share hints, and debug together without switching tabs.
- **👥 User Presence & Analytics:** Real-time tracking of active users in private rooms.
- **📝 Smart Language Sync:** Automatically switches the editor environment and boilerplate code for all participants when the host changes the language.
- **🎨 Premium UI/UX:** A sleek, dark-themed interface built with Framer Motion animations and Lucide-React icons for a pro-developer feel.

---

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Monaco Editor (VS Code Engine), Framer Motion |
| **Backend** | Node.js, Express.js |
| **Real-time** | Socket.io (WebSockets) |
| **Styling** | Modern CSS3 (Glassmorphism), Lucide Icons |
| **API** | JDoodle Compiler API |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- npm or yarn

### 2. Installation
**Clone the repo:**
```bash
git clone [https://github.com/sunnybhardwaj2027/codesync-pro.git](https://github.com/sunnybhardwaj2027/codesync-pro.git)
cd codesync-pro

### Setup Backend:
cd server
npm install
npm start

### Setup Frontend:
cd client
npm install
npm run dev

### 🧠 Why I Built This?
As a competitive programmer who has solved 1000+ DSA problems, I realized that the biggest hurdle in remote learning is the lack of a shared, executable environment. CodeSync Pro was built to solve this—combining the power of a professional editor with the speed of real-time WebSockets.

🤝 Contributing
Contributions, issues, and feature requests are welcome!

Developed with ❤️ by Sunny Kumar