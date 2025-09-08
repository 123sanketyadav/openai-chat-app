import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt,
    setReply,
    currThreadId,
    prevChats, setPrevChats,
    setNewChat
  } = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return; // empty input avoid

    setLoading(true);
    console.log("message", prompt, "threadId", currThreadId);

    try {
     const response = await fetch("https://openai-chat-app-backend-ok6u.onrender.com/api/chat", {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId || "thread1"
        })
      });

      const res = await response.json();
      console.log("✅ server response:", res);
      setReply(res.reply);

      // ✅ add user & GPT messages to chat history
      setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt },
        { role: "gpt", content: res.reply }
      ]);

      // ✅ mark that chat is no longer new
      setNewChat(false);

      // ✅ clear input
      setPrompt("");
    } catch (err) {
      console.error("❌ error:", err);
    }
    setLoading(false);
  };

  // ✅ Yeh function alag se close hoga
  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="ChatWindow">
      <div className="navbar">
        <span>
         VertexAI
          <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
             Settings <i className="fa-solid fa-gear"></i>
          </div>
          <div className="dropDownItem">
            
             <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem">
            Log out <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt || ""}
            onChange={e => setPrompt(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === "Enter" ? getReply() : null}
          />
          <div id="submit" onClick={getReply}>
            <i class="fa-sharp-duotone fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
  VertexAI can make mistakes. Check important info. See{" "}
  <a 
    href="https://openai.com/policies/cookie-policy/" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "#0A66C2", textDecoration: "underline" }}
  >
    Cookie Preferences
  </a>.
</p>
      </div>
    </div>
  );
}

export default ChatWindow;
