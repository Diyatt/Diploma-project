import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from '../../utils/api';
import Pereolder from "../../assets/img/Animation.gif";
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";

// Default avatar as a data URL
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e9ecef'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

function MyChatPages() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const currentUserId = user?.id || JSON.parse(localStorage.getItem("userData"))?.id;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    api.get("/chats/").then((res) => {
      setChats(res.data);
      setLoading(false);
    });
  }, []);

  const getAvatarUrl = (userObj) => {
    if (userObj.profile_picture) {
      return userObj.profile_picture;
    }
    return DEFAULT_AVATAR;
  };

  const profilePicture = user?.profile_picture || UserImage;

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Mobile Header */}
        <div style={{
          backgroundColor: '#fff',
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Hamburger Menu */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Title */}
          <h5 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#2d3748',
            flex: 1,
            textAlign: 'center'
          }}>
            My Chats
          </h5>

          {/* User Avatar */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#4880FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => setIsAvatarMenuOpen((prev) => !prev)}
            >
              <img
                src={profilePicture || UserImage}
                alt="user-image"
                width="32"
                height="32"
                className="rounded-circle"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = UserImage;
                }}
              />
            </div>
            {isAvatarMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  zIndex: 1000,
                  minWidth: '140px',
                  padding: '8px 0'
                }}
              >
                <button
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '15px',
                    color: '#2d3748',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setIsAvatarMenuOpen(false);
                    navigate('/myprofile');
                  }}
                >
                  My Account
                </button>
                <button
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '15px',
                    color: '#dc3545',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setIsAvatarMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ marginTop: '16px' }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header mb-4">
                <div>
                  {/* Removed <h4 className="fw-bold">My Chats</h4> and its parent div for mobile layout as requested */}
                  {/* <h4 className="fw-bold">My Chats</h4> */}
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
                                    {new Date(chat.updated_at).toLocaleTimeString('en-GB', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: false 
                                    })}
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

        {/* Mobile Sidebar Overlay */}
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
              width: '280px',
              zIndex: 999
            }}>
              <Sidebar isOpen={true} toggleSidebar={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )}
      </div>
    );
  }

  // DESKTOP LAYOUT
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
                                    {new Date(chat.updated_at).toLocaleTimeString('en-GB', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: false 
                                    })}
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
