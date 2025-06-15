import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from "../../utils/api";
import Pereolder from "../../assets/img/Animation.gif";

function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/users/me/")
      .then((res) => setUserData(res.data))
      .catch((err) => console.error("Қате:", err));
  }, []);

  if (!userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <img src={require("../../assets/img/Animation.gif")} alt="Loading..." width={80} />
      </div>
    );
  }
  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-header mb-3">
              <h4>My Account</h4>
            </div>

            {/* Профиль Хэдер */}
            <div className="profile-header shadow-sm d-flex align-items-center card-custom bg-white mb-4">
              <img
                src={userData.profile_picture || "https://via.placeholder.com/120"}
                alt="Profile"
                className="me-3 rounded-circle"
                width={120}
                height={120}
              />
              <div className="profile-info">
                <h5 className="mb-1 profile-title">Full Name</h5>
                <h4 className='profile-h4'>{userData.full_name || "Аты-жөні көрсетілмеген"}</h4>

                <h5 className="mb-1 profile-title">Phone Number</h5>
                <h4 className='profile-h4'>{userData.phone_number || "Бос"}</h4>
              </div>
            </div>

            {/* Профиль деректері */}
            <div className="bg-white card-custom shadow-sm"
              style={{
                borderRadius: "15px",
                padding: "45px 180px",
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control form-control-new" value={userData.username} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-control form-control-new" value={userData.email} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Region</label>
                  <input type="text" className="form-control form-control-new" value={userData.region || ""} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">District</label>
                  <input type="text" className="form-control form-control-new" value={userData.district || ""} readOnly />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Local Address</label>
                  <input type="text" className="form-control form-control-new" value={userData.local_address || ""} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
