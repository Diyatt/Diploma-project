import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ProductCard from "../../components/ProductCard/ProductCard";
import api from "../../utils/api"; // 🔹 Axios instance
import { useUser } from "../../contexts/UserContext"; // 🔹 user context
import Pereolder  from "../../assets/img/Animation.gif";

function FavoritesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useUser();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header mb-3">
                <h4>Favorites</h4>
              </div>

              <div className="product-body">
                {loadingProducts ? (
                  <div className="loading-container text-center">
                    <img src={Pereolder} alt="Loading..." />
                  </div>
                ) : (
                  <div className="row">
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
  );
}

export default FavoritesPage;
