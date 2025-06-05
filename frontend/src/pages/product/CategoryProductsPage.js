import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Ecommerce from "../../assets/img/E-commerce.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Pereolder from "../../assets/img/Animation.gif";
import { FaFilter, FaMapMarkerAlt, FaSearch, FaSort, FaTimes } from "react-icons/fa";

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
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
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

                <div className="filter-controls d-flex flex-wrap gap-2">
                  {/* Search Filter */}
                  <div className="search-filter position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: "35px" }}
                    />
                    <FaSearch className="position-absolute" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }} />
                  </div>

                  {/* Sort Filter */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
                      type="button"
                      onClick={() => setShowFilter(prev => !prev)}
                    >
                      <FaSort /> Sort
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
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
                      type="button"
                      onClick={() => setShowDropdown(prev => !prev)}
                    >
                      <FaMapMarkerAlt /> Districts
                      {selectedDistricts.length > 0 && (
                        <span className="badge bg-primary ms-1">{selectedDistricts.length}</span>
                      )}
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

              {/* 📦 Өнімдер */}
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
                    />                    
                    ))}
                  </div>

                  {products.length === 0 && (
                    <div className="alert alert-warning mt-4">
                      Таңдалған фильтр бойынша өнім табылмады.
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
