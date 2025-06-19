import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LendAddPage.css';
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";

// Add custom styles for Toastify
const toastStyles = `
  .Toastify__toast-container {
    z-index: 9999 !important;
    position: fixed !important;
    top: 80px !important;
  }
`;

function LendAddPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const profilePicture = user?.profile_picture || UserImage;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    region: "",
    district: "",
    piece: 1,
    price: 0,
    quality: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [imageInputs, setImageInputs] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualities, setQualities] = useState([]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, regionsRes, districtsRes, qualitiesRes] = await Promise.all([
          api.get("/categories/"),
          api.get("/regions/"),
          api.get("/districts/"),
          api.get("/qualities/")
        ]);
        setCategories(categoriesRes.data);
        setRegions(regionsRes.data);
        setDistricts(districtsRes.data);
        setQualities(qualitiesRes.data);
      } catch (error) {
        toast.error("Failed to load form data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.quality) newErrors.quality = "Quality is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.piece < 1) newErrors.piece = "Piece must be at least 1";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (!imageInputs.some(img => img !== null)) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageInputChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const updatedInputs = [...imageInputs];
    updatedInputs[index] = file;
    setImageInputs(updatedInputs);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = reader.result;
      setImagePreviews(updatedPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        const updatedInputs = [...imageInputs];
        const updatedPreviews = [...imagePreviews];
        
        // Clear the image at the specified index
        updatedInputs[index] = null;
        updatedPreviews[index] = null;
        
        setImageInputs(updatedInputs);
        setImagePreviews(updatedPreviews);
        
        // Show success message
        toast.success('Image removed successfully');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        data.append(key, value);
      }
    });

    imageInputs.forEach((file) => {
      if (file) {
        data.append("images", file);
      }
    });

    try {
      await api.post("/products/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      navigate("/lend");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // MOBILE LAYOUT
  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <style>{toastStyles}</style>
        <ToastContainer position="top-right" autoClose={3000} />
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
            Add Product
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
              <div className="favorites-header">
                <nav aria-label="breadcrumb mt-5">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/lend">Lend</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add</li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="card-custom bg-white rounded p-25 lend-add-form" style={{ borderRadius: "15px" }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div className="col-md-3 col-sm-6 mb-3" key={i}>
                      <div 
                        className="image-upload-container"
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingBottom: '100%',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          border: '2px dashed #dee2e6',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                          const overlay = e.currentTarget.querySelector('.image-overlay');
                          if (overlay) {
                            overlay.style.opacity = 1;
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          const overlay = e.currentTarget.querySelector('.image-overlay');
                          if (overlay) {
                            overlay.style.opacity = 0;
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            handleImageInputChange({ target: { files: [file] } }, i);
                          }
                        }}
                      >
                        {imagePreviews[i] ? (
                          <div style={{
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={imagePreviews[i]} 
                              alt={`Preview ${i + 1}`}
                              style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <div 
                              className="image-overlay"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                gap: '10px',
                                zIndex: 10,
                                pointerEvents: 'auto'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="btn btn-light btn-sm"
                                style={{
                                  borderRadius: '50%',
                                  width: '44px',
                                  height: '44px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '24px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  color: '#dc3545',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = '#dc3545';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                                  e.currentTarget.style.color = '#dc3545';
                                }}
                              >
                                ×
                              </button>
                              <button
                                type="button"
                                onClick={() => document.getElementById(`image-upload-${i}`).click()}
                                className="btn btn-light btn-sm"
                                style={{
                                  borderRadius: '50%',
                                  width: '44px',
                                  height: '44px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '18px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  color: '#0d6efd',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = '#0d6efd';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                                  e.currentTarget.style.color = '#0d6efd';
                                }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '1rem'
                            }}
                          >
                            <div 
                              style={{
                                
                                borderRadius: '50%',
                                backgroundColor: '#e9ecef',
                               
                                padding:'5px',
                                marginBottom: '0.75rem'
                              }}
                            >
                              <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ color: '#6c757d' }}
                              >
                                <path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor"/>
                              </svg>
                            </div>
                            <span style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              color: '#495057',
                              marginBottom: '0.25rem'
                            }}>
                              Upload Image
                            </span>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: '#6c757d',
                              textAlign: 'center'
                            }}>
                              PNG, JPG up to 5MB
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageInputChange(e, i)}
                          className="d-none"
                          id={`image-upload-${i}`}
                        />
                        <label 
                          htmlFor={`image-upload-${i}`} 
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.images && <div className="text-danger text-center mb-3">{errors.images}</div>}

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control form-control-new ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category <span className="text-danger">*</span></label>
                    <select
                      name="category"
                      className={`form-select form-control-new ${errors.category ? 'is-invalid' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Region <span className="text-danger">*</span></label>
                    <select
                      name="region"
                      className={`form-select form-control-new ${errors.region ? 'is-invalid' : ''}`}
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="">Select region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                    {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District <span className="text-danger">*</span></label>
                    <select
                      name="district"
                      className={`form-select form-control-new ${errors.district ? 'is-invalid' : ''}`}
                      value={formData.district}
                      onChange={handleChange}
                    >
                      <option value="">Select district</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Quality <span className="text-danger">*</span></label>
                    <select
                      name="quality"
                      className={`form-select form-control-new ${errors.quality ? 'is-invalid' : ''}`}
                      value={formData.quality}
                      onChange={handleChange}
                    >
                      <option value="">Select quality</option>
                      {qualities.map((quality) => (
                        <option key={quality.id} value={quality.id}>{quality.quality_type}</option>
                      ))}
                    </select>
                    {errors.quality && <div className="invalid-feedback">{errors.quality}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Piece <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="piece"
                      className={`form-control form-control-new ${errors.piece ? 'is-invalid' : ''}`}
                      placeholder="Enter piece"
                      value={formData.piece}
                      onChange={handleChange}
                    />
                    {errors.piece && <div className="invalid-feedback">{errors.piece}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="price"
                      className={`form-control form-control-new ${errors.price ? 'is-invalid' : ''}`}
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea
                      name="description"
                      className={`form-control form-control-new ${errors.description ? 'is-invalid' : ''}`}
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
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
      <style>{toastStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                <nav aria-label="breadcrumb mt-5">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/lend">Lend</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add</li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="card-custom bg-white rounded p-25 lend-add-form" style={{ borderRadius: "15px" }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div className="col-md-3 col-sm-6 mb-3" key={i}>
                      <div 
                        className="image-upload-container"
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingBottom: '100%',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          border: '2px dashed #dee2e6',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                          const overlay = e.currentTarget.querySelector('.image-overlay');
                          if (overlay) {
                            overlay.style.opacity = 1;
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          const overlay = e.currentTarget.querySelector('.image-overlay');
                          if (overlay) {
                            overlay.style.opacity = 0;
                          }
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#0d6efd';
                          e.currentTarget.style.backgroundColor = '#f0f7ff';
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#dee2e6';
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            handleImageInputChange({ target: { files: [file] } }, i);
                          }
                        }}
                      >
                        {imagePreviews[i] ? (
                          <div style={{
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={imagePreviews[i]} 
                              alt={`Preview ${i + 1}`}
                              style={{ 
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <div 
                              className="image-overlay"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                gap: '10px',
                                zIndex: 10,
                                pointerEvents: 'auto'
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="btn btn-light btn-sm"
                                style={{
                                  borderRadius: '50%',
                                  width: '44px',
                                  height: '44px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '24px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  color: '#dc3545',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = '#dc3545';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                                  e.currentTarget.style.color = '#dc3545';
                                }}
                              >
                                ×
                              </button>
                              <button
                                type="button"
                                onClick={() => document.getElementById(`image-upload-${i}`).click()}
                                className="btn btn-light btn-sm"
                                style={{
                                  borderRadius: '50%',
                                  width: '44px',
                                  height: '44px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '18px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: 'none',
                                  color: '#0d6efd',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = '#0d6efd';
                                  e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                                  e.currentTarget.style.color = '#0d6efd';
                                }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '1rem'
                            }}
                          >
                            <div 
                              style={{
                                
                                borderRadius: '50%',
                                backgroundColor: '#e9ecef',
                               
                                padding:'5px',
                                marginBottom: '0.75rem'
                              }}
                            >
                              <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ color: '#6c757d' }}
                              >
                                <path d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z" fill="currentColor"/>
                              </svg>
                            </div>
                            <span style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500', 
                              color: '#495057',
                              marginBottom: '0.25rem'
                            }}>
                              Upload Image
                            </span>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              color: '#6c757d',
                              textAlign: 'center'
                            }}>
                              PNG, JPG up to 5MB
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageInputChange(e, i)}
                          className="d-none"
                          id={`image-upload-${i}`}
                        />
                        <label 
                          htmlFor={`image-upload-${i}`} 
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                            zIndex: 5
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {errors.images && <div className="text-danger text-center mb-3">{errors.images}</div>}

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control form-control-new ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category <span className="text-danger">*</span></label>
                    <select
                      name="category"
                      className={`form-select form-control-new ${errors.category ? 'is-invalid' : ''}`}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                      ))}
                    </select>
                    {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Region <span className="text-danger">*</span></label>
                    <select
                      name="region"
                      className={`form-select form-control-new ${errors.region ? 'is-invalid' : ''}`}
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="">Select region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                    {errors.region && <div className="invalid-feedback">{errors.region}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District <span className="text-danger">*</span></label>
                    <select
                      name="district"
                      className={`form-select form-control-new ${errors.district ? 'is-invalid' : ''}`}
                      value={formData.district}
                      onChange={handleChange}
                    >
                      <option value="">Select district</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Quality <span className="text-danger">*</span></label>
                    <select
                      name="quality"
                      className={`form-select form-control-new ${errors.quality ? 'is-invalid' : ''}`}
                      value={formData.quality}
                      onChange={handleChange}
                    >
                      <option value="">Select quality</option>
                      {qualities.map((quality) => (
                        <option key={quality.id} value={quality.id}>{quality.quality_type}</option>
                      ))}
                    </select>
                    {errors.quality && <div className="invalid-feedback">{errors.quality}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Piece <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="piece"
                      className={`form-control form-control-new ${errors.piece ? 'is-invalid' : ''}`}
                      placeholder="Enter piece"
                      value={formData.piece}
                      onChange={handleChange}
                    />
                    {errors.piece && <div className="invalid-feedback">{errors.piece}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      name="price"
                      className={`form-control form-control-new ${errors.price ? 'is-invalid' : ''}`}
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea
                      name="description"
                      className={`form-control form-control-new ${errors.description ? 'is-invalid' : ''}`}
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LendAddPage;