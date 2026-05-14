import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey 👋 I'm your AI assistant",
    },
  ]);

  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");

    setTyping(true);

    try {
      const res = await axios.post(
        "https://chat-bot-z3i1.vercel.app/api/chat",
        {
          message: currentMessage,
        }
      );

      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res.data.reply,
        },
      ]);
    } catch (error) {
      setTyping(false);

      console.log(error);
    }
  };

  

  return (
    <div style={styles.app}>
      <div style={styles.overlay}></div>

      <div style={styles.chatContainer}>
        <div style={styles.header}>

  <div style={styles.headerLeft}>
    <div style={styles.avatar}>
      AI
    </div>

    <div>
      <div style={styles.title}>
        AI Assistant
      </div>

      <div style={styles.status}>
        Ask me anything
      </div>
    </div>
  </div>

  <button
    style={styles.closeButton}
    onClick={() => {
      window.parent.postMessage(
        {
          type: "CLOSE_CHATBOT",
        },
        "*"
      );
    }}
  >
    ✕
  </button>

</div>

        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.message,
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg,#7f5af0,#6246ea)"
                      : "rgba(255,255,255,0.08)",

                  color: "#fff",

                  border:
                    msg.role === "bot"
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div style={styles.messageWrapper}>
              <div style={styles.typingBubble}>
                <span style={styles.dot}></span>
                <span style={styles.dot}></span>
                <span style={styles.dot}></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div style={styles.inputArea}>
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Ask anything..."
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            style={styles.sendButton}
            onClick={sendMessage}
          >
            ➜
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    width: "100%",
    height: "100vh",
    background:
      `
      radial-gradient(circle at top left,
      rgba(124,58,237,0.35),
      transparent 30%),

      radial-gradient(circle at bottom right,
      rgba(6,182,212,0.25),
      transparent 30%),

      linear-gradient(
      135deg,
      #050816,
      #0f172a,
      #111827
      )
      `,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', sans-serif",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(100px)",
  },

  chatContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(30px)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 25px 80px rgba(124,58,237,0.18)",
    position: "relative",
  },

  header: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    boxShadow:
      "0 0 35px rgba(139,92,246,0.55)",
    animation:
      "floatAvatar 4s ease-in-out infinite",
  },

  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "17px",
    letterSpacing: "0.3px",
  },

  status: {
    color: "#06d6a0",
    fontSize: "12px",
    marginTop: "4px",
    opacity: 0.9,
  },

  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  messageWrapper: {
    display: "flex",
    width: "100%",
  },

  message: {
    padding: "15px 18px",
    borderRadius: "24px",
    maxWidth: "82%",
    fontSize: "14px",
    lineHeight: "1.8",
    wordBreak: "break-word",
    animation:
      "messagePop 0.35s ease",
    backdropFilter: "blur(20px)",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.18)",
  },

  typingBubble: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 18px",
    borderRadius: "22px",
    background:
      "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(30px)",
    width: "fit-content",
    boxShadow:
      "0 12px 40px rgba(0,0,0,0.22)",
    animation:
      "floatingBubble 2.2s ease-in-out infinite",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    animation:
      "typingBounce 1.4s infinite ease-in-out",
  },

  inputArea: {
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderTop:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background:
      "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: "16px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    backdropFilter: "blur(20px)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    boxShadow:
      "inset 0 0 20px rgba(255,255,255,0.03)",
  },

  sendButton: {
    width: "58px",
    height: "58px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "20px",
    color: "#fff",
    background:
      "linear-gradient(135deg,#8b5cf6,#06b6d4)",
    transition: "0.35s",
    boxShadow:
      "0 10px 35px rgba(139,92,246,0.35)",
  },

  closeButton: {
  width: "44px",
  height: "44px",
  border: "none",
  outline: "none",
  borderRadius: "16px",

  background:
    "rgba(255,255,255,0.06)",

  backdropFilter: "blur(20px)",

  color: "#fff",

  fontSize: "18px",
  fontWeight: "600",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",

  transition: "all 0.3s ease",

  border:
    "1px solid rgba(255,255,255,0.08)",

  boxShadow:
    `
    0 10px 30px rgba(0,0,0,0.18),
    inset 0 0 20px rgba(255,255,255,0.03)
    `,

  position: "relative",

  overflow: "hidden",
},
};

export default App;