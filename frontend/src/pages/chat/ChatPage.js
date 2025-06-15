import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Pereolder from "../../assets/img/Animation.gif";

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
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#fff',
        padding: '16px 24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Hamburger Menu */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* User Avatar */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#4880FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '600',
          fontSize: '18px'
        }}>
          {chatUser?.full_name?.charAt(0) || chatUser?.username?.charAt(0) || 'U'}
        </div>

        {/* User Name */}
        <div style={{ flex: 1 }}>
          <h5 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#2d3748'
          }}>
            {chatUser?.full_name || chatUser?.username || "User"}
          </h5>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#68737d',
            marginTop: '2px'
          }}>
            Online
          </p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%'
          }}>
            <img src={Pereolder} alt="Loading..." width={80} />
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender?.id === currentUserId;
            
            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{
                  maxWidth: '70%',
                  minWidth: '120px',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  backgroundColor: isOwn ? '#4880FF' : '#fff',
                  color: isOwn ? '#fff' : '#2d3748',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderBottomRightRadius: isOwn ? '6px' : '20px',
                  borderBottomLeftRadius: !isOwn ? '6px' : '20px',
                  position: 'relative'
                }}>
                  {msg.content && (
                    <div style={{ 
                      fontSize: '16px',
                      lineHeight: '1.5',
                      wordWrap: 'break-word',
                      marginBottom: msg.url ? '8px' : '0'
                    }}>
                      {msg.content}
                    </div>
                  )}
                  {msg.url && (
                    <div style={{ marginTop: msg.content ? '8px' : '0' }}>
                      <img 
                        src={msg.url} 
                        alt="image" 
                        style={{ 
                          maxWidth: '100%', 
                          borderRadius: '12px',
                          height: 'auto',
                          maxHeight: '300px',
                          objectFit: 'cover'
                        }} 
                      />
                    </div>
                  )}
                  <div style={{
                    fontSize: '12px',
                    opacity: 0.8,
                    marginTop: '6px',
                    textAlign: 'right',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>
                      {new Date(msg.sent_at).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </span>
                    {isOwn && (
                      <span style={{ 
                        fontSize: '14px',
                        color: msg.is_read ? '#90EE90' : 'rgba(255,255,255,0.7)'
                      }}>
                        {msg.is_read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Area */}
      <div style={{
        backgroundColor: '#fff',
        padding: '16px 24px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
      }}>
        {/* Text Input */}
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{
              width: '100%',
              padding: '14px 20px',
              border: '1px solid #e0e0e0',
              borderRadius: '25px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f8f9fa',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#4880FF';
              e.target.style.boxShadow = '0 0 0 3px rgba(72, 128, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Attachment Button */}
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
        <label 
          htmlFor="file-upload" 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
            color: '#68737d'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#e9ecef';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.354 1.5H6.35a4.654 4.654 0 0 0-3.36 7.975l5.656 5.657a2.5 2.5 0 0 0 3.536-3.535L6.818 4.586a1.5 1.5 0 1 0-2.121 2.122l5.303 5.303a.5.5 0 0 0 .708-.707L5.405 6.001a2.5 2.5 0 0 1 3.536-3.535l5.303 5.303a3.5 3.5 0 0 1-4.95 4.95l-5.656-5.657A5.654 5.654 0 0 1 6.354 1.5z"/>
          </svg>
        </label>

        {/* Send Button */}
        <button 
          onClick={handleSend}
          disabled={!content.trim() && !selectedImage}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: (!content.trim() && !selectedImage) ? '#ccc' : '#4880FF',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (!content.trim() && !selectedImage) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s, transform 0.1s'
          }}
          onMouseOver={(e) => {
            if (content.trim() || selectedImage) {
              e.target.style.backgroundColor = '#3366CC';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (content.trim() || selectedImage) {
              e.target.style.backgroundColor = '#4880FF';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54L13.026 8.5l2.938 7.814a.5.5 0 0 1-.11.54.5.5 0 0 1-.54.11L8 13.026.146 15.964a.5.5 0 0 1-.54-.11.5.5 0 0 1-.11-.54L2.974 7.5.036-.314a.5.5 0 0 1 .11-.54.5.5 0 0 1 .54-.11L8 2.974 15.314.036a.5.5 0 0 1 .54.11z"/>
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 998
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '300px',
            zIndex: 999
          }}>
            <Sidebar isOpen={true} toggleSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}

export default ChatPage;
