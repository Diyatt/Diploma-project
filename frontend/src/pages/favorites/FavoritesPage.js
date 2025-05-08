import React from "react";
import { useState } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductImage from "../../assets/img/product1.png";
import BitmapImage from "../../assets/img/Bitmap.png";

function FavoritesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="d-flex">
      {/* Sidebar ашық/жабық күйіне байланысты көрсетіледі */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        {/* Header кнопкасы sidebar-ды басқарады */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="main" style={{  marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                  <div>
                      <h4 class="">Favorites</h4>
                  </div>
              </div>
              <div className="product-body">
                <div className="row">
                  <ProductCard
                    title="Apple Watch Series 4"
                    price="120.00"
                    images={[ProductImage, BitmapImage]}
                    rating={3}
                    reviews={131}
                  />
                  <ProductCard
                    title="Minimal Chair Tool"
                    price="$24.59"
                    images={[BitmapImage, ProductImage]}
                    rating={4}
                    reviews={250}
                  />
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