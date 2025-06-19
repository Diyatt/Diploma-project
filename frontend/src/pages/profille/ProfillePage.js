import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import api from "../../utils/api";
import Pereolder from "../../assets/img/Animation.gif";
import UserImage from "../../assets/img/defaultProfile.png";
import { useUser } from "../../contexts/UserContext";



function ProfillePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profilePicture1 = user?.profile_picture || UserImage;
  const navigate = useNavigate();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);





  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className="">
     {/* Mobile Header - OUTSIDE of .content and .container */}
     {isMobile && (
        <div style={{
          backgroundColor: '#fff',
          height: '56px',
          width: '100%',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: 'none',
          margin: 0,
          position: 'relative',
          zIndex: 10
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
            My account
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
                src={profilePicture1}
                alt="user-image"
                width="32"
                height="32"
                className="rounded-circle"
                onError={e => { e.target.onerror = null; e.target.src = UserImage; }}
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
      )}
      {isMobile && isSidebarOpen && (
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
      <div className="d-flex">
        <Sidebar  isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
          {/* Desktop Header */}
          {!isMobile && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
          <div style={{ marginTop: isMobile ? "0px" : "60px" }}>
          <div className="container">
          {!isMobile && (
                     <div className="favorites-header mb-3">
                     <h4>My Account</h4>
                   </div>
                    )}
           

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
    </div>
  );
}

export default ProfillePage;