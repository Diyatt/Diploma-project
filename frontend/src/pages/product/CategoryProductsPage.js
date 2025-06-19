import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Ecommerce from "../../assets/img/E-commerce.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Pereolder from "../../assets/img/Animation.gif";
import { FaFilter, FaMapMarkerAlt, FaSearch, FaSort, FaTimes } from "react-icons/fa";
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";
import { useNavigate } from "react-router-dom";




function CategoryProductsPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const profilePicture1 = user?.profile_picture || UserImage;
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);


  // Mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 📌 Аудандарды алу
  const fetchDistricts = async () => {
    try {
      const res = await api.get("/districts/");
      setDistricts(res.data.map(d => ({ id: d.id, name: d.name })));
    } catch (err) {
      console.error("Аудан қатесі:", err);
    }
  };

  // 📌 Өнімдерді алу (барлық фильтрлермен)
  const fetchCategoryProducts = async () => {
    setLoading(true); // 🔄 Жүктеу басталды
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("category", id);
      if (searchTerm) queryParams.append("search", searchTerm);
      if (sortOption) queryParams.append("ordering", sortOption);
      if (selectedDistricts.length > 0) {
        queryParams.append("district", selectedDistricts.join(","));
      }

      const res = await api.get(`/products/?${queryParams.toString()}`);
      setProducts(res.data);
      if (res.data.length > 0) {
        setCategoryName(res.data[0].category_name || "Selected Category");
      }
    } catch (err) {
      console.error("Өнім қатесі:", err);
    } finally {
      setLoading(false); // ✅ Жүктеу аяқталды
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    fetchCategoryProducts();
  }, [id, searchTerm, sortOption, selectedDistricts]);

  const toggleSelect = (districtId) => {
    setSelectedDistricts(prev =>
      prev.includes(districtId)
        ? prev.filter(id => id !== districtId)
        : [...prev, districtId]
    );
  };

  const resetFilter = () => {
    setSearchTerm("");
    setSortOption("");
    setSelectedDistricts([]);
  };

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
             {categoryName || "Loading..."}
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
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
        {!isMobile && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
        <div style={{ marginTop: isMobile ? "-30px" : "60px" }}>
            <div className="container mt-5">
              {/* 📍 Breadcrumb */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/home">Borrow</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {categoryName || "Loading..."}
                  </li>
                </ol>
              </nav>

              {/* 🔍 Фильтрлер */}
              <div className="filter-section mb-4">
                {isMobile ? (
                  // Mobile Filter Layout
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">Filters</h4>
                      {(searchTerm || sortOption || selectedDistricts.length > 0) && (
                        <button
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #dc3545',
                            borderRadius: '12px',
                            padding: '8px 16px',
                            color: '#dc3545',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={resetFilter}
                        >
                          <FaTimes size={12} /> Clear All
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Desktop Filter Layout
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Filters</h4>
                    {(searchTerm || sortOption || selectedDistricts.length > 0) && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={resetFilter}
                      >
                        <FaTimes className="me-1" /> Clear All
                      </button>
                    )}
                  </div>
                )}

                <div className={`filter-controls ${isMobile ? 'd-flex flex-column gap-3' : 'd-flex flex-wrap gap-2'}`}>
                  {/* Search Filter */}
                  <div className="search-filter position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={isMobile ? {
                        paddingLeft: "45px",
                        padding: "16px 16px 16px 45px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        border: "1px solid #e0e0e0"
                      } : { paddingLeft: "35px" }}
                    />
                    <FaSearch className="position-absolute" style={{ 
                      left: isMobile ? "16px" : "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "#6c757d",
                      fontSize: isMobile ? "16px" : "14px"
                    }} />
                  </div>

                  {/* Sort Filter */}
                  <div className="dropdown position-relative">
                    <button
                      className={isMobile ? "" : "btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"}
                      style={isMobile ? {
                        width: '100%',
                        padding: '16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      } : {}}
                      type="button"
                      onClick={() => setShowFilter(prev => !prev)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaSort /> Sort
                      </div>
                      {isMobile && <span>▼</span>}
                    </button>
                    {showFilter && (
                      <div className="filter-dropdown shadow p-3 bg-white rounded"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 10,
                          minWidth: "200px",
                          marginTop: "5px"
                        }}
                      >
                        <div className="d-flex flex-column gap-2">
                          <button
                            className={`btn ${sortOption === "-price" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOption("-price")}
                          >
                            Price: High to Low
                          </button>
                          <button
                            className={`btn ${sortOption === "price" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOption("price")}
                          >
                            Price: Low to High
                          </button>
                          <button
                            className={`btn ${sortOption === "-created_at" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOption("-created_at")}
                          >
                            Newest First
                          </button>
                          <button
                            className={`btn ${sortOption === "created_at" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOption("created_at")}
                          >
                            Oldest First
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* District Filter */}
                  <div className="dropdown position-relative">
                    <button
                      className={isMobile ? "" : "btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"}
                      style={isMobile ? {
                        width: '100%',
                        padding: '16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      } : {}}
                      type="button"
                      onClick={() => setShowDropdown(prev => !prev)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaMapMarkerAlt /> Districts
                        {selectedDistricts.length > 0 && (
                          <span className={isMobile ? 
                            "badge bg-primary" : 
                            "badge bg-primary ms-1"
                          } style={isMobile ? { marginLeft: '8px' } : {}}>
                            {selectedDistricts.length}
                          </span>
                        )}
                      </div>
                      {isMobile && <span>▼</span>}
                    </button>
                    {showDropdown && (
                      <div className="filter-dropdown shadow p-3 bg-white rounded"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          zIndex: 10,
                          minWidth: "300px",
                          marginTop: "5px"
                        }}
                      >
                        <div className="d-flex flex-wrap gap-2">
                          {districts.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => toggleSelect(d.id)}
                              className={`btn ${selectedDistricts.includes(d.id) ? "btn-primary" : "btn-outline-primary"}`}
                            >
                              {d.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || sortOption || selectedDistricts.length > 0) && (
                  <div className="active-filters mt-3 d-flex flex-wrap gap-2">
                    {searchTerm && (
                      <div className="badge bg-light text-dark p-2">
                        Search: {searchTerm}
                        <button
                          className="btn-close btn-close-white ms-2"
                          onClick={() => setSearchTerm("")}
                          style={{ fontSize: "0.5rem" }}
                        />
                      </div>
                    )}
                    {sortOption && (
                      <div className="badge bg-light text-dark p-2">
                        Sort: {sortOption === "-price" ? "Price ↓" : 
                               sortOption === "price" ? "Price ↑" :
                               sortOption === "-created_at" ? "Newest" : "Oldest"}
                        <button
                          className="btn-close btn-close-white ms-2"
                          onClick={() => setSortOption("")}
                          style={{ fontSize: "0.5rem" }}
                        />
                      </div>
                    )}
                    {selectedDistricts.map(districtId => {
                      const district = districts.find(d => d.id === districtId);
                      return district && (
                        <div key={districtId} className="badge bg-light text-dark p-2">
                          {district.name}
                          <button
                            className="btn-close btn-close-white ms-2"
                            onClick={() => toggleSelect(districtId)}
                            style={{ fontSize: "0.5rem" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {loading  ? (
                <div className="loading-container text-center">
                  <img src={Pereolder} alt="Loading..." />
                </div>
              ) : (
                <>
                  <div className="row">
                    {products.map((product) => (
                      <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      price={product.price}
                      images={
                        product.images && product.images.length > 0
                          ? product.images.map(img => img.url)
                          : [Ecommerce]
                      }
                      rating={Math.round(product.average_rating)}
                      reviews={product.reviewers}
                      liked={product.is_favorite} // ✅ қосылды
                      wishlistId={product.wishlist_id || null} // ⚠️ егер `wishlist_id` API-де болса
                      isMobile={isMobile}
                    />                    
                    ))}
                  </div>

                  {products.length === 0 && (
                    <div className="text-center py-5">
                      <div className="alert alert-light border shadow-sm" role="alert">
                        <h5 className="alert-heading mb-3">No products found</h5>
                        <p className="mb-3">We couldn't find any products matching your current filters.</p>
                        <hr />
                        <p className="mb-0">Try these suggestions:</p>
                        <ul className="text-start mt-2 mb-0">
                          <li>Clear your filters using the "Clear All" button</li>
                          <li>Try different search terms</li>
                          <li>Select different districts</li>
                          <li>Check back later for new products</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductsPage;
