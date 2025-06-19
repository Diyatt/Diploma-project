import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../utils/api"; // 🔹 Axios instance
import { useUser } from "../../contexts/UserContext"; // 🔹 user context
import Pereolder  from "../../assets/img/Animation.gif";
import UserImage from "../../assets/img/defaultProfile.png";


function FavoritesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useUser();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/wishlist/");
        setWishlist(res.data); // ✅ Барлық өнімдер тізімі
      } catch (err) {
        console.error("Таңдаулыларды жүктеу қатесі:", err);
      } finally {
        setLoadingProducts(false); // Жүктеу аяқталды
      }
    };

    if (user?.id) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <div className="">
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
            Favorites
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
    <div className="d-flex">
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
        {!isMobile && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
        <div className="main" style={{ marginTop: isMobile ? "-10px" : "50px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header mb-3">
                {!isMobile && <h4>Favorites</h4>}
              </div>

              <div className="product-body">
                {loadingProducts ? (
                  <div className="loading-container text-center">
                    <img src={Pereolder} alt="Loading..." />
                  </div>
                ) : (
                  <div 
                    className="row"
                    style={isMobile ? { gap: 0, marginBottom: 0 } : {}}
                  >
                    {wishlist.map((item) => (
                      <ProductCard
                        key={item.id}
                        id={item.product.id}
                        title={item.product.name}
                        price={item.product.price}
                        images={
                          item.product.images && item.product.images.length > 0
                            ? item.product.images.map((img) => img.url)
                            : []
                        }
                        rating={Math.round(item.product.average_rating)}
                        reviews={item.product.reviewers}
                        liked={true}
                        wishlistId={item.id} // 🟥 МІНДЕТТІ! Бұл - `wishlist` жазбасын өшіру үшін керек
                        isMobile={isMobile}
                      />
                    ))}

                    {/* Егер тізім бос болса */}
                    {wishlist.length === 0 && (
                      <p className="text-muted">Сіздің таңдаулыларыңыз бос.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
    </div>
  );
}

export default FavoritesPage;
