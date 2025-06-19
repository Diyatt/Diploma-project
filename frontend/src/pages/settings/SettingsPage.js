import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import api from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";

function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    district: "",
    region: "",
    local_address: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [regions, setRegions] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const { user } = useUser();


  const profilePicture1 = user?.profile_picture || "/defaultProfile.png";

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    if (name === "region" || name === "district") {
      setProfileData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (profileData.region) {
      const filtered = allDistricts.filter(
        (d) => d.region.id === Number(profileData.region)
      );
      setDistricts(filtered);
      if (!profileData.district) {
        setProfileData((prev) => ({
          ...prev,
          district: "",
        }));
      }
    } else {
      setDistricts([]);
    }
  }, [profileData.region, allDistricts]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }

        const [regionsRes, districtsRes] = await Promise.all([
          api.get("/regions/"),
          api.get("/districts/"),
        ]);
  
        const regionsData = regionsRes.data;
        const districtsData = districtsRes.data;
  
        setRegions(regionsData);
        setAllDistricts(districtsData);
  
        const userRes = await api.get("/users/me/");
        const data = userRes.data;
  
        console.log("User data:", data);
        console.log("Raw district from API:", data.district);
  
        const regionObj = regionsData.find((r) => r.name === data.region);
        const regionId = regionObj ? regionObj.id : "";
  
        console.log("Found region:", regionObj);
        console.log("Region ID:", regionId);
  
        const filteredDistricts = districtsData.filter(
          (d) => d.region.id === regionId
        );
        console.log("Filtered districts:", filteredDistricts);
  
        const cleanDistrictName = data.district ? data.district.split(' (')[0] : "";
        console.log("Clean district name:", cleanDistrictName);
  
        const districtObj = filteredDistricts.find(
          (d) => d.name.toLowerCase() === cleanDistrictName.toLowerCase()
        );
        console.log("Found district object:", districtObj);
  
        const districtId = districtObj ? districtObj.id : "";
        console.log("Final district ID:", districtId);

        setDistricts(filteredDistricts);
        
        const finalProfileData = {
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          region: regionId,
          district: districtId ? Number(districtId) : "",
          local_address: data.local_address || "",
        };
        console.log("Setting final profile data:", finalProfileData);
  
        setProfileData(finalProfileData);
        setProfilePicturePreview(data.profile_picture);
      } catch (error) {
        console.error("Failed to load settings data:", error);
      }
    };
  
    fetchInitialData();
  }, []);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const updateRes = await api.put("/update-profile/", formData);
      console.log("Profile update response:", updateRes.data);

      const userRes = await api.get("/users/me/");
      const updatedUserData = {
        ...userRes.data,
        token: JSON.parse(localStorage.getItem('userData'))?.token,
        refresh: JSON.parse(localStorage.getItem('userData'))?.refresh
      };

      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setProfilePicturePreview(updatedUserData.profile_picture);
      
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Error: Profile not updated");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/change-password/", passwordData);
      alert("✅ Password changed successfully!");
    } catch (err) {
      alert("❌ Error: Password not changed");
    }
  };

  if (isMobile) {
    // Mobile Layout
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5'
      }}>
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
            Settings
          </h5>

          {/* User Avatar */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#4880FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <img
                          src={profilePicture1 || UserImage}
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
        </div>

        {/* Mobile Tabs */}
        <div style={{
          backgroundColor: '#fff',
          
          padding: '0 16px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            gap: '0'
          }}>
            <button
              onClick={() => setActiveTab("info")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "info" ? '600' : '400',
                color: activeTab === "info" ? '#4880FF' : '#666',
                borderBottom: activeTab === "info" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Main Settings
            </button>
            <button
              onClick={() => setActiveTab("security")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "security" ? '600' : '400',
                color: activeTab === "security" ? '#4880FF' : '#666',
                borderBottom: activeTab === "security" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Login & Sec
            </button>
            <button
              onClick={() => setActiveTab("delete")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "delete" ? '600' : '400',
                color: activeTab === "delete" ? '#4880FF' : '#666',
                borderBottom: activeTab === "delete" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Deletion
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div style={{ padding: '16px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            {activeTab === "info" && (
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      placeholder="Enter product name"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Select Category"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleProfileChange}
                      placeholder="Select Region"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Region
                    </label>
                    <select
                      name="region"
                      value={profileData.region || ""}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select District</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      District
                    </label>
                    <select
                      name="district"
                      value={profileData.district || ""}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select Quality</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Local Address */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Local Address
                    </label>
                    <input
                      type="text"
                      name="local_address"
                      value={profileData.local_address}
                      onChange={handleProfileChange}
                      placeholder="Enter Place"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Profile Picture
                    </label>
                    
                    <div style={{
                      width: '120px',
                      height: '120px',
                      border: '2px dashed #e0e0e0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      backgroundColor: '#f8f9fa',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      ) : (
                        <svg width="40" height="40" fill="#ccc" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                      )}
                      <input
                        type="file"
                        onChange={handlePictureChange}
                        accept="image/*"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#4880FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Change
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                                          fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#4880FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === "delete" && (
              <div style={{ textAlign: 'center' }}>
                <h5 style={{ color: '#dc3545', marginBottom: '16px' }}>⚠️ Delete Your Account</h5>
                <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
                  Some quick example text to build on the card title and make up the bulk of the card's content. This action cannot be undone.
                </p>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete your account? This action cannot be undone!"
                      )
                    ) {
                      try {
                        await api.delete("/users/delete/");
                        alert("✅ Account deleted successfully.");
                        window.location.href = "/login";
                      } catch (err) {
                        alert("❌ Error: could not delete account.");
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete My Account
                </button>
              </div>
            )}
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

  // Desktop Layout (Original)
  if (isMobile) {
    // Mobile Layout
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5'
      }}>
        {/* Mobile Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Mobile Tabs */}
        <div style={{
          backgroundColor: '#fff',
          padding: '0 16px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            gap: '0'
          }}>
            <button
              onClick={() => setActiveTab("info")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "info" ? '600' : '400',
                color: activeTab === "info" ? '#4880FF' : '#666',
                borderBottom: activeTab === "info" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Main Settings
            </button>
            <button
              onClick={() => setActiveTab("security")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "security" ? '600' : '400',
                color: activeTab === "security" ? '#4880FF' : '#666',
                borderBottom: activeTab === "security" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Login & Sec
            </button>
            <button
              onClick={() => setActiveTab("delete")}
              style={{
                flex: 1,
                padding: '16px 8px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === "delete" ? '600' : '400',
                color: activeTab === "delete" ? '#4880FF' : '#666',
                borderBottom: activeTab === "delete" ? '2px solid #4880FF' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              Deletion
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div style={{ padding: '16px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            {activeTab === "info" && (
              <form onSubmit={handleProfileSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      placeholder="Enter product name"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Select Category"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleProfileChange}
                      placeholder="Select Region"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Region
                    </label>
                    <select
                      name="region"
                      value={profileData.region || ""}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select District</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      District
                    </label>
                    <select
                      name="district"
                      value={profileData.district || ""}
                      onChange={handleProfileChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select Quality</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Local Address */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Local Address
                    </label>
                    <input
                      type="text"
                      name="local_address"
                      value={profileData.local_address}
                      onChange={handleProfileChange}
                      placeholder="Enter Place"
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Profile Picture */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Profile Picture
                    </label>
                    
                    <div style={{
                      width: '120px',
                      height: '120px',
                      border: '2px dashed #e0e0e0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      backgroundColor: '#f8f9fa',
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      ) : (
                        <svg width="40" height="40" fill="#ccc" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                      )}
                      <input
                        type="file"
                        onChange={handlePictureChange}
                        accept="image/*"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#4880FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Change
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#2d3748'
                    }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      onChange={handlePasswordChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px',
                      backgroundColor: '#4880FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === "delete" && (
              <div style={{ textAlign: 'center' }}>
                <h5 style={{ color: '#dc3545', marginBottom: '16px' }}>⚠️ Delete Your Account</h5>
                <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
                  Some quick example text to build on the card title and make up the bulk of the card's content. This action cannot be undone.
                </p>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete your account? This action cannot be undone!"
                      )
                    ) {
                      try {
                        await api.delete("/users/delete/");
                        alert("✅ Account deleted successfully.");
                        window.location.href = "/login";
                      } catch (err) {
                        alert("❌ Error: could not delete account.");
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete My Account
                </button>
              </div>
            )}
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

  // Desktop Layout (Original)
  return (
    <div className="d-flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(false)}
      />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-header mb-3">
              <h4>General Settings</h4>
            </div>

            <div
              className="card-custom bg-white rounded p-25"
              style={{ borderRadius: "15px", }}
            >
              <ul className="nav_settings nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "info" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    Account Settings
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "security" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("security")}
                  >
                    Login & Security
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "delete" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("delete")}
                  >
                    Account Deletion
                  </button>
                </li>
              </ul>

              <div className="tab-content p-3">
                {activeTab === "info" && (
                  <form
                    onSubmit={handleProfileSubmit}
                    encType="multipart/form-data"
                  >
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="full_name"
                          value={profileData.full_name}
                          onChange={handleProfileChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={profileData.phone_number}
                          onChange={handleProfileChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Region</label>
                        <select
                          name="region"
                          value={profileData.region || ""}
                          onChange={handleProfileChange}
                          className="form-select form-control-new"
                        >
                          <option value="">Select Region</option>
                          {regions.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">District</label>
                        <select
                          name="district"
                          value={profileData.district || ""}
                          onChange={handleProfileChange}
                          className="form-select form-control-new"
                        >
                          <option value="">Select District</option>
                          {districts.map((d) => {
                            console.log("Rendering district option:", d.id, d.name, "Current value:", profileData.district);
                            return (
                              <option key={d.id} value={d.id}>
                                {d.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Local Address</label>
                        <input
                          type="text"
                          name="local_address"
                          value={profileData.local_address}
                          onChange={handleProfileChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Profile Picture</label>

                        {profilePicturePreview && (
                          <div className="mb-2">
                            <img
                              src={profilePicturePreview}
                              alt="Preview"
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                        )}

                        <input
                          type="file"
                          className="form-control form-control-new"
                          onChange={handlePictureChange}
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button style={{ height: '50px'}} type="submit" className="start-btn">
                        Update Profile
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "security" && (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label">Current Password</label>
                        <input
                          type="password"
                          name="current_password"
                          onChange={handlePasswordChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          name="new_password"
                          onChange={handlePasswordChange}
                          className="form-control form-control-new"
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          onChange={handlePasswordChange}
                          className="form-control form-control-new"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="start-btn">
                        Change Password
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "delete" && (
                  <div>
                    <h5>⚠️ Delete Your Account</h5>
                    <p>
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content. make up the bulk
                      of the card's content. Some quick example text to build on
                      the card title and make up the bulk of the card's content.
                      make up the bulk of the card's content. Some quick example
                      text to build on the card title and make up the bulk of
                      the card's content. make up the bulk of the card's
                      content.Some quick example text to build on
                    </p>
                    <div className="text-center mt-4">
                      <button
                        className="btn btn-danger"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete your account? This action cannot be undone!"
                            )
                          ) {
                            try {
                              await api.delete("/users/delete/");
                              alert("✅ Account deleted successfully.");
                              window.location.href = "/login";
                            } catch (err) {
                              alert("❌ Error: could not delete account.");
                            }
                          }
                        }}
                      >
                        Delete My Account
                      </button>
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

export default SettingsPage;
