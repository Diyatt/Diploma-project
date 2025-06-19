import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // өзіңнің Axios instance
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';
import ProductImage from "../../assets/img/product1.png";
import Pereolder from "../../assets/img/Animation.gif";
import './LendPage.css'; // We'll create this file next
import { Tooltip } from 'bootstrap';
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";
// import '@fortawesome/fontawesome-free/css/all.min.css';
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

// Simple Toast Notification Component
function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`toast-notification toast-${type}`} onClick={onClose}>
      {message}
      <span className="toast-close">&times;</span>
    </div>
  );
}

function LendPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingLendPage, setLoadingLendPage] = useState(true);
    const navigate = useNavigate();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isMobile, setIsMobile] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const { user, logout } = useUser();
    const profilePicture = user?.profile_picture || UserImage;

    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth <= 991);
      };
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
      setLoadingLendPage(true);
      api.get("/myproducts/")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error("Өнімдерді жүктеу қатесі:", err);
        })
        .finally(() => {
          setLoadingLendPage(false);
        });
    }, []);

    useEffect(() => {
      // Initialize tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new Tooltip(tooltipTriggerEl);
      });
    }, []);

    const AddLend = () => {
        navigate("/lendAdd");
    };

    const handleEdit = (product) => {
      navigate(`/edit/${product.id}`);
    };

    const showToast = (message, type = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const handleDelete = async (id) => {
      const confirmed = window.confirm('Are you sure you want to delete this product?');
      if (!confirmed) return;
      try {
        await api.delete(`/products/${id}/delete/`);
        setProducts(products.filter(product => product.id !== id));
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        console.error("Delete error:", err);
        showToast("Failed to delete product.", "error");
      }
    };

    // MOBILE LAYOUT
    if (isMobile) {
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          {/* Toast Notification */}
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
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
              Lend Products
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
              <div className="lend-page-wrapper">
                <div className="lend-header">
                  <div className="lend-title">
                    {/* Hide on mobile: Lend Products heading and description */}
                    {!isMobile && (
                      <>
                        <h2>Lend Products</h2>
                      </>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary add-product-btn" 
                    onClick={AddLend}
                  >
                    <i className="fas fa-plus"></i> Add New Product
                  </button>
                </div>

                <div className="lend-content">
                  {loadingLendPage ? (
                    <div className="loading-container">
                      <div className="spinner-wrapper">
                        <img src={Pereolder} alt="Loading..." className="loading-spinner" />
                        <p>Loading products...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Card View */}
                      <div className="mobile-view">
                        <div className="products-grid">
                          {products.map((product) => (
                            <div key={product.id} className="product-card">
                              <div className="product-card-content">
                                <div className="product-card-header">
                                  <div className="product-card-image">
                                    <img
                                      src={product.images[0]?.url || ProductImage}
                                      alt={product.name || "Product"}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = ProductImage;
                                      }}
                                    />
                                  </div>
                                  <div className="product-card-info">
                                    <h3 className="product-card-title">{product.name || "No name"}</h3>
                                    <span className={`status-badge ${product.status?.toLowerCase() || 'processing'}`}>
                                      {product.status || "Processing"}
                                    </span>
                                    <div className="product-card-actions-header">
                                      <button
                                        type="button"
                                        className="btn btn-action btn-edit"
                                        onClick={() => handleEdit(product)}
                                      >
                                        <i className="fas fa-pencil-alt"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-action btn-delete"
                                        onClick={() => handleDelete(product.id)}
                                      >
                                        <i className="fas fa-trash-alt"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="product-card-details">
                                  <div className="detail-item">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{product.category_name || "No category"}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Price:</span>
                                    <span className="detail-value price">{product.price}₸</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Piece:</span>
                                    <span className="detail-value">{product.piece}</span>
                                  </div>
                                </div>
                                <div className="product-card-actions">
                                  <button
                                    type="button"
                                    className="btn btn-action btn-edit"
                                    onClick={() => handleEdit(product)}
                                  >
                                    
                                    <EditIcon />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-action btn-delete"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                   <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
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
        {/* Toast Notification */}
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container">
              <div className="lend-page-wrapper">
                <div className="lend-header">
                  <div className="lend-title">
                    {/* Hide on mobile: Lend Products heading and description */}
                    {!isMobile && (
                      <>
                        <h2>Lend Products</h2>
                      </>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary add-product-btn" 
                    onClick={AddLend}
                  >
                    <i className="fas fa-plus"></i> Add New Product
                  </button>
                </div>

                <div className="lend-content">
                  {loadingLendPage ? (
                    <div className="loading-container">
                      <div className="spinner-wrapper">
                        <img src={Pereolder} alt="Loading..." className="loading-spinner" />
                        <p>Loading products...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="table-responsive desktop-view">
                        <table className="table table-hover">
                          <thead className="table-header">
                            <tr>
                              <th scope="col">Image</th>
                              <th scope="col">Name</th>
                              <th scope="col">Category</th>
                              <th scope="col">Price</th>
                              <th scope="col">Piece</th>
                              <th scope="col">Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id} className="table-row">
                                <td>
                                  <div className="product-image-container">
                                    <img
                                      src={product.images[0]?.url || ProductImage}
                                      alt={product.name || "Product"}
                                      className="product-image"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = ProductImage;
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="product-name">{product.name || "No name"}</td>
                                <td>{product.category_name || "No category"}</td>
                                <td className="product-price">{product.price}₸</td>
                                <td>{product.piece}</td>
                                <td>
                                  <span className={`status-badge ${product.status?.toLowerCase() || 'processing'}`}>
                                    {product.status || "Processing"}
                                  </span>
                                </td>
                                <td>
                                  <div className="action-buttons">
                                    <button
                                      type="button"
                                      className="btn btn-action btn-edit"
                                      onClick={() => handleEdit(product)}
                                      title="Edit Product"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                    >
                                     <EditIcon />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-action btn-delete"
                                      onClick={() => handleDelete(product.id)}
                                      title="Delete Product"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                    >
                                     <DeleteIcon />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="mobile-view">
                        <div className="products-grid">
                          {products.map((product) => (
                            <div key={product.id} className="product-card">
                              <div className="product-card-content">
                                <div className="product-card-header">
                                  <div className="product-card-image">
                                    <img
                                      src={product.images[0]?.url || ProductImage}
                                      alt={product.name || "Product"}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = ProductImage;
                                      }}
                                    />
                                  </div>
                                  <div className="product-card-info">
                                    <h3 className="product-card-title">{product.name || "No name"}</h3>
                                    <span className={`status-badge ${product.status?.toLowerCase() || 'processing'}`}>
                                      {product.status || "Processing"}
                                    </span>
                                    <div className="product-card-actions-header">
                                      <button
                                        type="button"
                                        className="btn btn-action btn-edit"
                                        onClick={() => handleEdit(product)}
                                      >
                                        <i className="fas fa-pencil-alt"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-action btn-delete"
                                        onClick={() => handleDelete(product.id)}
                                      >
                                        <i className="fas fa-trash-alt"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="product-card-details">
                                  <div className="detail-item">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{product.category_name || "No category"}</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Price:</span>
                                    <span className="detail-value price">{product.price}₸</span>
                                  </div>
                                  <div className="detail-item">
                                    <span className="detail-label">Piece:</span>
                                    <span className="detail-value">{product.piece}</span>
                                  </div>
                                </div>
                                <div className="product-card-actions">
                                  <button
                                    type="button"
                                    className="btn btn-action btn-edit"
                                    onClick={() => handleEdit(product)}
                                  >
                                    
                                    <EditIcon />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-action btn-delete"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                   <DeleteIcon />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default LendPage;