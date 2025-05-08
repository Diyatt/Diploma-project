import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Carousel from "../../components/Carousel/Carousel";
import ReusableHeading from "../../components/ReusableHeading/ReusableHeading";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Footer from "../../components/footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import Ecommerce from "../../assets/img/E-commerce.png";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  // Категорияларды жүктеу
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Категория қатесі:", err);
      }
    };
    fetchCategories();
  }, []);

  // Өнімдерді жүктеу (категория бойынша немесе толық)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategoryId
          ? `/products/?category=${selectedCategoryId}`
          : "/products/";
        const res = await api.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("Өнім қатесі:", err);
      }
    };
    fetchProducts();
  }, [selectedCategoryId]);

  // Категорияға басылғанда
  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    setShowAll(true); // Категория таңдағанда толығымен көрсетіледі
  };

  return (
    <div className="">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container">
              <ReusableHeading text="Rent anything in any time, don’t think just do it" />
              <Carousel />

              {/* Категориялар */}
              <ReusableHeading text="Category" />
              <div className="row p-45">
                {categories.map((category) => (
                  <div
                    className="col-md-3"
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <CategoryCard
                      title={category.category_name}
                      imageSrc={category.image}
                      isActive={selectedCategoryId === category.id} // 🔹 Активтілік тексеріледі
                    />
                  </div>
                ))}
              </div>

              {/* Өнімдер */}
              <div className="product-conntent">
                <div className="product-header d-flex justify-content-between">
                  <h4 className="mb-0">Recommendations</h4>
                  <a href="#" onClick={() => setShowAll(true)}>
                    View All
                  </a>
                </div>
                <div className="product-body">
                  <div className="row ">
                    {(showAll ? products : products.slice(0, 6)).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id} // 🔹 Міне осыны қостық!
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
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
