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
import { useUser } from "../../contexts/UserContext";
import UserImage from "../../assets/img/defaultProfile.png";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const profilePicture1 = user?.profile_picture || UserImage;
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  
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
            Home
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
                    navigate('/settings');
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
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="d-flex">
        <Sidebar  isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
          {/* Desktop Header */}
          {!isMobile && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
          <div style={{ marginTop: isMobile ? "0px" : "60px" }}>
            <div className="container">
              <ReusableHeading text="Rent anything in any time, don't think just do it" />
              <Carousel isMobile={isMobile} />

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
                      className={`${isMobile ? 'col-4' : 'col-12 col-sm-6 col-md-3'} mb-3`}
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
                        isMobile={isMobile}
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
