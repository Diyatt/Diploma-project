import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Ecommerce from "../../assets/img/E-commerce.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Pereolder  from "../../assets/img/Animation.gif";


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
              <div className="filter-group position-relative mb-4 text-center">
                <div className="btn-group btn-group-lg">
                  <button
                    type="button"
                    className="btn btn-Iborrowed"
                    onClick={() => setShowFilter(prev => !prev)}
                  >
                    Filter By
                  </button>
                  <button
                    type="button"
                    className="btn btn-Iborrowed dropdown-toggle"
                    onClick={() => setShowDropdown(prev => !prev)}
                  >
                    District
                  </button>
                  <button
                    type="button"
                    className="btn btn-Iborrowed text-danger"
                    onClick={resetFilter}
                  >
                    🔄 Reset Filter
                  </button>
                </div>

                {/* 🔸 Search және Сорттау */}
                {showFilter && (
                  <div className="filter-dropdown shadow p-3 bg-white rounded d-flex justify-content-center gap-3 mt-3 flex-wrap"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      width: "500px",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="🔍 Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: "200px" }}
                    />
                    <select
                      className="form-select btn-Iborrowed"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      style={{ maxWidth: "200px" }}
                    >
                      <option value="">Sort By</option>
                      <option value="-price">Price ↓</option>
                      <option value="price">Price ↑</option>
                      <option value="-created_at">Newest</option>
                      <option value="created_at">Oldest</option>
                    </select>
                  </div>
                )}

                {/* 📍 District таңдауы */}
                {showDropdown && (
                  <div
                    className="filter-dropdown shadow p-3 bg-white rounded"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      width: "500px",
                    }}
                  >
                    <h5 className="mb-3">Select Districts</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {districts.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleSelect(d.id)}
                          className={`btn btn-outline-dark ${selectedDistricts.includes(d.id) ? "active" : ""}`}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Apply Now
                    </button>
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
