import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Pereolder from "../../assets/img/Animation.gif";
import { Link } from 'react-router-dom';


function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?.id;

  // 1. Алғашқы хабарламалар мен чат қолданушысын жүктеу
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const [msgRes, chatRes] = await Promise.all([
          api.get(`/chats/${chatId}/messages/`),
          api.get(`/chats/${chatId}/`)
        ]);
        setMessages(msgRes.data);

        const chat = chatRes.data;
        const otherUser = chat.user1.id === currentUserId ? chat.user2 : chat.user1;
        setChatUser(otherUser);
      } catch (err) {
        console.error("Жүктеу қатесі:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  // 2. Автоматты түрде 3 секунд сайын жаңарту
  useEffect(() => {
    const interval = setInterval(() => {
      api.get(`/chats/${chatId}/messages/`).then((res) => {
        setMessages(res.data);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId]);

  // 3. Хабарлама жіберу (текст және сурет)
  const handleSend = async () => {
    if (!content.trim() && !selectedImage) return;

    const formData = new FormData();
    if (content.trim()) formData.append("content", content);
    if (selectedImage) formData.append("image", selectedImage);

    await api.post(`/chats/${chatId}/messages/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setContent("");         // ✅ Текстті тазалау
    setSelectedImage(null); // ✅ Файлды тазалау

    // 🔄 Хабарламаларды жаңарту
    const res = await api.get(`/chats/${chatId}/messages/`);
    setMessages(res.data);
  };

  return (
    <div className="">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container mt-5">
              <div className="favorites-conntent">
                <div className="favorites-header">
                  <nav aria-label="breadcrumb mt-5">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/mychat">My Chat</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      Min
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="card-custom bg-white  rounded bg-white p-0" style={{ maxWidth: "900px", margin: "0 auto" }}>
                {loading ? (
                  <div className="loading-container text-center p-5">
                    <img src={Pereolder} alt="Loading..." width={80} />
                  </div>
                ) : (
                  <>
                    <div className="chat-header p-3 border-bottom">
                      <strong>{chatUser?.full_name || chatUser?.username || "User"}</strong>
                    </div>

                    <div className="chat-body p-3" style={{ overflowY: "auto" }}>
                      {messages.map((msg) => {
                        const isOwn = msg.sender?.id === currentUserId;

                        return (
                          <div key={msg.id} className={`d-flex mb-3 ${isOwn ? "justify-content-end" : "justify-content-start"}`}>
                            <div
                              className={`px-3 py-2 rounded-3 ${isOwn ? "bg-primary text-white" : "bg-light text-dark"}`}
                              style={{
                                maxWidth: "70%",
                                borderBottomRightRadius: isOwn ? "0" : "1rem",
                                borderBottomLeftRadius: !isOwn ? "0" : "1rem"
                              }}
                            >
                              {msg.content && <div>{msg.content}</div>}
                              {msg.url && (
                                <div className="mt-2">
                                  <img src={msg.url} alt="image" style={{ maxWidth: "100%", borderRadius: "10px", width: "150px", height: "150px" }} />
                                </div>
                              )}
                              <div className="text-muted small mt-1 text-end" style={{ fontSize: "0.75rem" }}>
                                {new Date(msg.sent_at).toLocaleTimeString('en-GB', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: false 
                                })}
                                {isOwn && <span className="ms-2">{msg.is_read ? "✓✓" : "✓"}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="chat-footer p-3 border-top ">
                      <div className="d-flex align-items-center">
                        {/* 📝 Текст енгізу */}
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Write a message..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />

                        {/* 📎 Файл таңдау (тек иконка) */}
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => setSelectedImage(e.target.files[0])}
                        />
                        <label htmlFor="file-upload" className="btn btn-light ms-2" 
                          style={{
                            marginTop: "0"
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6.354 1.5H6.35a4.654 4.654 0 0 0-3.36 7.975l5.656 5.657a2.5 2.5 0 0 0 3.536-3.535L6.818 4.586a1.5 1.5 0 1 0-2.121 2.122l5.303 5.303a.5.5 0 0 0 .708-.707L5.405 6.001a2.5 2.5 0 0 1 3.536-3.535l5.303 5.303a3.5 3.5 0 0 1-4.95 4.95l-5.656-5.657A5.654 5.654 0 0 1 6.354 1.5z"/>
                          </svg>
                        </label>

                        {/* 🚀 Жіберу */}
                        <button className="btn btn-primary ms-2" onClick={handleSend}>
                          Send <i className="bi bi-send ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
