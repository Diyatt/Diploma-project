import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from "../../utils/api";
import Pereolder from "../../assets/img/Animation.gif";

function ProfillePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me/");
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <img src={Pereolder} alt="Loading..." width={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <h4 className="text-danger">{error}</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <h4>No profile data available</h4>
        </div>
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

            {/* Profile Header */}
            <div className="profile-header shadow-sm d-flex flex-column flex-md-row align-items-center card-custom bg-white mb-4 p-3 p-md-4">
              <img
                src={userData.profile_picture || "https://via.placeholder.com/120"}
                alt="Profile"
                className="me-md-3 rounded-circle mb-3 mb-md-0"
                width={120}
                height={120}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/120";
                }}
              />
              <div className="profile-info text-center text-md-start">
                <h5 className="mb-1 profile-title">Full Name</h5>
                <h4 className='profile-h4'>{userData.full_name || "Not specified"}</h4>

                <h5 className="mb-1 profile-title">Phone Number</h5>
                <h4 className='profile-h4'>{userData.phone_number || "Not specified"}</h4>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white card-custom shadow-sm"
              style={{
                borderRadius: "15px",
                padding: "20px",
                "@media (min-width: 768px)": {
                  padding: "45px 180px"
                }
              }}
            >
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control form-control-new" value={userData.username} readOnly />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-control form-control-new" value={userData.email} readOnly />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Region</label>
                  <input type="text" className="form-control form-control-new" value={userData.region || ""} readOnly />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">District</label>
                  <input type="text" className="form-control form-control-new" value={userData.district || ""} readOnly />
                </div>
                <div className="col-12">
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

export default ProfillePage;
