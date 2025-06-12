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
import Pereolder  from "../../assets/img/Animation.gif";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  
  // Категорияларды жүктеу
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Категория қатесі:", err);
      } finally {
        setLoadingCategories(false); // Жүктеу аяқталды
      }
    };
    fetchCategories();
  }, []);
  // Өнімдерді жүктеу (категория бойынша немесе толық)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await api.get("/products/top-viewed");
        console.log("Өнімдер:", res.data); // Debug
        setProducts(res.data);
      } catch (err) {
        console.error("Өнім қатесі:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return (
    <div className="">
      <div className="d-flex">
        {/* Only show Sidebar on desktop */}
        {/* {!isMobile && ( */}
          <Sidebar  isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        {/* )} */}
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div style={{ marginTop: "60px" }}>
            <div className="container">
              <ReusableHeading text="Rent anything in any time, don’t think just do it" />
              <Carousel />

              {/* Категориялар */}
              <ReusableHeading text="Category" />
              <div className="row p-2">
                {loadingCategories ? (
                  <div className="loading-container text-center">
                    <img src={Pereolder} alt="Loading..." />
                  </div>
                ) : (
                  categories.map((category) => (
                    <div
                      className="col-12 col-sm-6 col-md-3 mb-3"
                      key={category.id}
                      onClick={() => navigate(`/category/${category.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <CategoryCard
                        isMobile={isMobile}
                        title={category.category_name}
                        imageSrc={category.image}
                      />
                    </div>
                  ))
                )}
              </div>
              {/* Өнімдер */}
              <div className="product-conntent">
                <div className="product-header d-flex justify-content-between">
                  <h4 className="mb-0">Recommendations</h4>
                </div>
                <div className="product-body">
                  {loadingProducts ? (
                    <div className="loading-container text-center">
                      <img src={Pereolder} alt="Loading..." />
                    </div>
                  ) : (
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
                  )}
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
