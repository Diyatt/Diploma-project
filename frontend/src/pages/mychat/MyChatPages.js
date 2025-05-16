import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from '../../utils/api';
import Pereolder  from "../../assets/img/Animation.gif";


function MyChatPages() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const currentUserId = JSON.parse(localStorage.getItem("userData"))?.id;

  useEffect(() => {
    api.get("/chats/").then((res) => {
      setChats(res.data);
      setLoading(false); // ✅ Жауап келді
    });
  }, []);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                <div>
                  <h4 className="">My Chats</h4>
                </div>
              </div>
              <div className="favorites-body">
                {loading ? (
                  <div className="text-center p-5">
                    <img src={Pereolder} alt="Loading..." width={80} />
                  </div>
                ) : (
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="p-3">
                        <table className="table">
                          <tbody>
                            {chats.map((chat) => {
                              const otherUser = chat.user1.id === currentUserId ? chat.user2 : chat.user1;
                              return (
                                <tr key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} style={{ cursor: 'pointer' }}>
                                  <td><strong>{otherUser.full_name || otherUser.username}</strong></td>
                                  <td>{new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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
