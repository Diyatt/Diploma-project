import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from '../../utils/api';
import Pereolder from "../../assets/img/Animation.gif";
import { FaUserCircle } from 'react-icons/fa';

// Default avatar as a data URL
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e9ecef'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

function MyChatPages() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?.id;

  useEffect(() => {
    api.get("/chats/").then((res) => {
      setChats(res.data);
      setLoading(false);
    });
  }, []);

  const getAvatarUrl = (user) => {
    if (user.profile_picture) {
      return user.profile_picture;
    }
    return DEFAULT_AVATAR;
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header mb-4">
                <div>
                  <h4 className="fw-bold">My Chats</h4>
                  <p className="text-muted">Your recent conversations</p>
                </div>
              </div>
              <div className="favorites-body">
                {loading ? (
                  <div className="text-center p-5">
                    <img src={Pereolder} alt="Loading..." width={80} />
                    <p className="mt-3 text-muted">Loading your chats...</p>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="text-center p-5">
                    <FaUserCircle size={64} className="text-muted mb-3" />
                    <h5>No chats yet</h5>
                    <p className="text-muted">Start a new conversation to see it here</p>
                  </div>
                ) : (
                  <div className="card shadow-sm">
                    <div className="card-body p-0">
                      <div className="p-3">
                        {chats.map((chat) => {
                          const otherUser = chat.user1.id === currentUserId ? chat.user2 : chat.user1;
                          return (
                            <div
                              key={chat.id}
                              onClick={() => navigate(`/chat/${chat.id}`)}
                              className="chat-item p-3 border-bottom d-flex align-items-center"
                              style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderRadius: '8px',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div className="me-3">
                                <img
                                  src={getAvatarUrl(otherUser)}
                                  alt={otherUser.full_name || otherUser.username}
                                  className="rounded-circle"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                    border: '2px solid #e9ecef'
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = DEFAULT_AVATAR;
                                  }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="mb-0 fw-bold">{otherUser.full_name || otherUser.username}</h6>
                                  <small className="text-muted">
                                    {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </small>
                                </div>
                                <p className="text-muted mb-0 small">
                                  Click to open conversation
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyChatPages;
