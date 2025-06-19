import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductEditPage.css';
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const profilePicture = user?.profile_picture || UserImage;

  const [formData, setFormData] = useState({
    name: "", category: "", region: "", district: "", piece: 1,
    price: 0, quality: "", description: ""
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [imageInputs, setImageInputs] = useState([null, null, null, null]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [productRes, categoriesRes, regionsRes, districtsRes, qualitiesRes] = await Promise.all([
          api.get(`/products/${id}/`),
          api.get("/categories/"),
          api.get("/regions/"),
          api.get("/districts/"),
          api.get("/qualities/"),
        ]);

        const productData = productRes.data;
        const qualitiesList = qualitiesRes.data;

        const matchedQuality = qualitiesList.find(q => q.quality_type === productData.quality_type);

        setFormData({
          name: productData.name,
          category: productData.category,
          region: productData.region,
          district: productData.district,
          piece: productData.piece,
          price: productData.price,
          quality: matchedQuality ? matchedQuality.id : "",
          description: productData.description,
        });

        setImages(productData.images);
        setCategories(categoriesRes.data);
        setRegions(regionsRes.data);
        setDistricts(districtsRes.data);
        setQualities(qualitiesList);
      } catch (error) {
        toast.error("Failed to load product data. Please try again.");
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/product-images/${imageId}/delete/`);
      setImages(images.filter(img => img.id !== imageId));
      toast.success("Image deleted successfully");
    } catch (err) {
      toast.error("Failed to delete image. Please try again.");
      console.error("Error deleting image:", err);
    }
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - images.length - newImages.length;
    if (remainingSlots <= 0) return;
    setNewImages(prev => [...prev, ...files.slice(0, remainingSlots)]);
  };

  const handleNewImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...imageInputs];
    updated[index] = file;
    setImageInputs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await api.put(`/products/${id}/`, data);
      // Upload new images
      const uploadPromises = imageInputs
        .filter(file => file)
        .map(file => {
          const imgData = new FormData();
          imgData.append("product", id);
          imgData.append("image", file);
          return api.post("/product-images/upload/", imgData);
        });
      await Promise.all(uploadPromises);
      toast.success("Product updated successfully!");
      navigate("/lend");
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
      console.error("Update error:", error);
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
            Edit Product
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
                    <li className="breadcrumb-item active" aria-current="page">{formData.name || "Loading..."}</li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="container mt-4">
              <div
                className="card-custom bg-white rounded p-25 product-edit-form"
                style={{
                  borderRadius: "15px"
                }}
              >
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Existing Images */}
                  <label className="form-label">Current Images:</label>
                  <div className="row mb-4">
                    {images.map((img, index) => (
                      <div key={img.id} className="col text-center image-upload">
                        <img 
                          src={img.url} 
                          alt={`Uploaded ${index}`} 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                          className="img-thumbnail"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="btn btn-sm btn-danger mt-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* New Images */}
                  <label className="form-label">Add New Images:</label>
                  <div className="row mb-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div className="col text-center image-upload" key={i}>
                        <div className="upload-placeholder">
                          {imageInputs[i] ? (
                            <img 
                              src={URL.createObjectURL(imageInputs[i])} 
                              alt="Preview" 
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              className="img-thumbnail"
                            />
                          ) : (
                            <span>📷</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleNewImageChange(e, i)}
                          className="form-control d-none"
                          id={`new-image-${i}`}
                        />
                        <label htmlFor={`new-image-${i}`} className="btn btn-outline-primary btn-sm mt-2">
                          {imageInputs[i] ? "Change Image" : "Upload Image"}
                        </label>
                        {imageInputs[i] && (
                          <div className="small mt-1 text-success">{imageInputs[i].name}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rest of the form remains the same */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-new"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Region</label>
                      <select
                        name="region"
                        className="form-select form-control-new"
                        value={formData.region}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        className="form-select form-control-new"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">District</label>
                      <select
                        name="district"
                        className="form-select form-control-new"
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Piece</label>
                      <input
                        type="number"
                        name="piece"
                        className="form-control form-control-new"
                        value={formData.piece}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-new"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Quality</label>
                      <select
                        name="quality"
                        className="form-select form-control-new"
                        value={formData.quality}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {qualities.map((q) => (
                          <option key={q.id} value={q.id}>{q.quality_type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control form-control-new"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="start-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
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
      <Sidebar isOpen={false} toggleSidebar={() => {}} />
      <div className="content">
        <Header toggleSidebar={() => {}} />
        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                <nav aria-label="breadcrumb mt-5">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/lend">Lend</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{formData.name || "Loading..."}</li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="container mt-4">
              <div
                className="card-custom bg-white rounded p-25 product-edit-form"
                style={{
                  borderRadius: "15px"
                }}
              >
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  {/* Existing Images */}
                  <label className="form-label">Current Images:</label>
                  <div className="row mb-4">
                    {images.map((img, index) => (
                      <div key={img.id} className="col text-center image-upload">
                        <img 
                          src={img.url} 
                          alt={`Uploaded ${index}`} 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                          className="img-thumbnail"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="btn btn-sm btn-danger mt-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* New Images */}
                  <label className="form-label">Add New Images:</label>
                  <div className="row mb-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div className="col text-center image-upload" key={i}>
                        <div className="upload-placeholder">
                          {imageInputs[i] ? (
                            <img 
                              src={URL.createObjectURL(imageInputs[i])} 
                              alt="Preview" 
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                              className="img-thumbnail"
                            />
                          ) : (
                            <span>📷</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleNewImageChange(e, i)}
                          className="form-control d-none"
                          id={`new-image-${i}`}
                        />
                        <label htmlFor={`new-image-${i}`} className="btn btn-outline-primary btn-sm mt-2">
                          {imageInputs[i] ? "Change Image" : "Upload Image"}
                        </label>
                        {imageInputs[i] && (
                          <div className="small mt-1 text-success">{imageInputs[i].name}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rest of the form remains the same */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-new"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Region</label>
                      <select
                        name="region"
                        className="form-select form-control-new"
                        value={formData.region}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        className="form-select form-control-new"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.category_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">District</label>
                      <select
                        name="district"
                        className="form-select form-control-new"
                        value={formData.district}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Piece</label>
                      <input
                        type="number"
                        name="piece"
                        className="form-control form-control-new"
                        value={formData.piece}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-new"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Quality</label>
                      <select
                        name="quality"
                        className="form-select form-control-new"
                        value={formData.quality}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {qualities.map((q) => (
                          <option key={q.id} value={q.id}>{q.quality_type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control form-control-new"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button 
                      type="submit" 
                      className="start-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductEditPage;
