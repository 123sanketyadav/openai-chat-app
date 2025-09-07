import "./Sidebar.css";
import { useEffect, useContext } from "react";
import { v1 as uuidv1 } from "uuid";
import { MyContext } from "./MyContext.jsx";

function Sidebar() {
  const { 
    allThreads, setAllThreads, 
    currThreadId, setCurrThreadId, 
    setPrevChats, setNewChat, setReply 
  } = useContext(MyContext);

  // ✅ FIXED: Reset everything on new chat
  const handleNewChat = () => {
    const newId = uuidv1();
    setCurrThreadId(newId);
    setPrevChats([]);   // clear old chats
    setNewChat(true);   // mark as new chat
    setReply(null);     // clear GPT reply
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredThreads = res.map(thread => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log("all threads", filteredThreads);
      setAllThreads(filteredThreads); // ✅ update context
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { 
    getAllThreads();
  }, [currThreadId]);

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const res = await response.json();
      console.log("single thread data", res);
      setPrevChats(res); // ✅ update context
      setNewChat(false); // ✅ update context
      setReply(null);    // ✅ Clear any ongoing reply
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method: "DELETE",
      });
      const res = await response.json();
      console.log("delete response", res);

      if (res.success) {
        // ✅ Remove from UI also
        setAllThreads((prev) => prev.filter(t => t.threadId !== threadId));

        // ✅ If current thread is deleted, start fresh chat
        if (currThreadId === threadId) {
          handleNewChat();   // ✅ FIXED
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={handleNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/* history */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} 
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}>
            {thread.title}
            <i 
              className="fa-solid fa-trash" 
              onClick={(e) => {
                e.stopPropagation(); // ✅ prevent triggering changeThread
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
  <p>
    {" "}
    <a 
      href="https://www.linkedin.com/in/sanket-yadav10/" 
      target="_blank" 
      rel="noopener noreferrer"
      style={{ color: "#0A66C2", textDecoration: "none", fontWeight: "bold" }}
    >
       By Sankit Yadav 😎 🤘
    </a>
  </p>
</div>
    </section>
  );
}

export default Sidebar;
