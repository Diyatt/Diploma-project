import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import api from "../../utils/api";

function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

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
      
      alert("✅ Профиль сәтті жаңартылды!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Қате: Профиль жаңартылмады");
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
      alert("✅ Құпиясөз сәтті өзгертілді!");
    } catch (err) {
      alert("❌ Қате: Құпиясөз өзгертілмеді");
    }
  };

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
              style={{ borderRadius: "15px", padding: "45px 180px" }}
            >
              <ul className="nav nav-tabs mb-3">
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
                      <button type="submit" className="start-btn">
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
                              "Аккаунтыңызды өшіргіңіз келетініне сенімдісіз бе? Бұл әрекет қайтымсыз!"
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
