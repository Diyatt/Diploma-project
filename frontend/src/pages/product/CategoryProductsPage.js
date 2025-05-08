import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import Ecommerce from "../../assets/img/E-commerce.png";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";

function CategoryProductsPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const districts = [
    { id: 5, name: "Medeu District" },
    { id: 10, name: "Other District" },
    // Қосымша аудандар осында қосылады
  ];

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/products/?category=${id}`);
        setProducts(res.data);
        if (res.data.length > 0) {
          const nameFromFirst = res.data[0].category_name || "Selected Category";
          setCategoryName(nameFromFirst);
        }
      } catch (err) {
        console.error("Өнім қатесі:", err);
      }
    };
    fetchCategoryProducts();
  }, [id]);

  const toggleSelect = (districtId) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    );
  };

  const applyFilter = () => {
    setShowDropdown(false);
  };

  const resetFilter = () => {
    setSelectedDistricts([]);
  };

  const filteredProducts =
    selectedDistricts.length === 0
      ? products
      : products.filter((p) => selectedDistricts.includes(p.district));

  return (
    <div className="">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container mt-5">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="#">Borrow</a></li>
                  <li className="breadcrumb-item active" aria-current="page">{categoryName || "Loading..."}</li>
                </ol>
              </nav>

              {/* Фильтр UI */}
              <div className="filter-group position-relative mb-4">
                <div className="btn-group">
                  <button type="button" className="btn btn-Iborrowed">Filter By</button>
                  <button
                    type="button"
                    className="btn btn-Iborrowed dropdown-toggle"
                    onClick={() => setShowDropdown((prev) => !prev)}
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

                {/* Dropdown */}
                {showDropdown && (
                  <div className="filter-dropdown shadow p-3 bg-white rounded" style={{ position: "absolute", top: "100%", zIndex: 10 }}>
                    <h5 className="mb-3">Select Order Type</h5>
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
                      onClick={applyFilter}
                    >
                      Apply Now
                    </button>
                    <p className="text-muted small mt-1">*You can choose multiple Order type</p>
                  </div>
                )}
              </div>

              {/* Өнімдер */}
              <div className="row">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    images={
                      product.images && product.images.length > 0
                        ? product.images.map((img) => img.url)
                        : [Ecommerce]
                    }
                    rating={Math.round(product.average_rating)}
                    reviews={product.views}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="alert alert-warning mt-4">Таңдалған фильтр бойынша өнім табылмады.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryProductsPage;
