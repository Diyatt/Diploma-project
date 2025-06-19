import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

function ProductCard({ id, title, price, images, rating, reviews, is_favorite, liked: likedFromProps = false, wishlistId: wishlistIdFromProps = null, isMobile }) {
  const [liked, setLiked] = useState(likedFromProps);
  const [wishlistId, setWishlistId] = useState(wishlistIdFromProps);
  const { user } = useUser();

  const handleWishlist = async () => {
    try {
      if (!user || !user.id) {
        alert("You are not logged in!");
        return;
      }

      if (!liked) {
        // ✅ Таңдаулыларға қосу
        const response = await api.post("/wishlist/", { product_id: id });
        setLiked(true);
        setWishlistId(response.data.id); // жаңа ID-ны есте сақтау
      } else {
        // ✅ Таңдаулылардан өшіру
        if (!wishlistId) {
          alert("Product ID not found.");
          return;
        }

        await api.delete(`/wishlist/${id}/`);
        setLiked(false);
        setWishlistId(null);
      }
    } catch (error) {
      console.error("Тізім өңдеу қатесі:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const roundedRating = Math.min(5, Math.round(rating || 0));

  if (isMobile) {
    // Mobile: Horizontal card layout
    return (
      <div className="col-12 mb-3">
        <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{
            borderRadius: '16px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
          }}>
            {/* Heart button positioned at top right of entire card */}
            <button 
              className="btn p-0" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist();
              }}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '3px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10
              }}
            >
              <svg width="18" height="18" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 15.883L17.191 8.383C18.4872 7.08786 18.8084 5.10828 17.9883 3.46975C17.3766 2.24665 16.2142 1.39215 14.8643 1.17313C13.5144 0.954121 12.1416 1.3973 11.1745 2.36425L10 3.538L8.82552 2.36425C7.85848 1.3973 6.4856 0.954121 5.13572 1.17313C3.78583 1.39215 2.6235 2.24665 2.01177 3.46975C1.1928 5.10758 1.51363 7.08571 2.80827 8.38075L10 15.883Z"
                  stroke="#666"
                  strokeWidth="1.5"
                  fill={liked ? "#FF6B6B" : "none"}
                />
              </svg>
            </button>
            <div className="row g-0">
              {/* Image Section */}
              <div className="col-5">
                <div style={{ height: '140px', backgroundColor: '#f8f9fa' }}>
                  <img 
                    src={images[0] || "/default.jpg"} 
                    className="img-fluid"
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '10px'
                    }}
                  />
                </div>
              </div>
              
              {/* Content Section */}
              <div className="col-7">
                <div className="card-body" style={{ 
                  height: '140px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  padding: '16px'
                }}>
                  {/* Title and Rating */}
                  <div>
                    <h6 className="card-title mb-2" style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#2d3748',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '8px'
                    }}>
                      {title}
                    </h6>
                    
                    {/* Rating */}
                    <div className="d-flex align-items-center mb-3">
                      {[...Array(5)].map((_, index) => (
                        <svg key={index} width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '2px' }}>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 10.88L3.29772 14.4721L5.26096 8.88997L0.391548 5.52786L6.30718 5.67003L8 0L9.69282 5.67003L15.6085 5.52786L10.739 8.88997L12.7023 14.4721L8 10.88Z"
                            fill={index < roundedRating ? "#FF9500" : "#E0E0E0"}
                          />
                        </svg>
                      ))}
                      <span style={{ fontSize: '14px', color: '#666', marginLeft: '6px' }}>({reviews})</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'black'
                      }}>
                        {price}₸
                      </span>
                  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Desktop: Original layout
  return (
    <div className="col-md-4">
      <div className="card card-border-none">
        <div className="card-body">
          <div className="carousel-card">
            <div id={`carousel-${id}`} className="carousel slide">
              <div className="carousel-inner">
                {images.map((img, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <img src={img} className="d-block w-100 product-img" alt={title} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${id}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon" />
              </button>
              <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${id}`} data-bs-slide="next">
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              <h5 className="card-title">{title}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">{price}₸</h6>
            </div>

            <button className="circle-btn" onClick={handleWishlist}>
              <svg width="20" height="20" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 15.883L17.191 8.383C18.4872 7.08786 18.8084 5.10828 17.9883 3.46975C17.3766 2.24665 16.2142 1.39215 14.8643 1.17313C13.5144 0.954121 12.1416 1.3973 11.1745 2.36425L10 3.538L8.82552 2.36425C7.85848 1.3973 6.4856 0.954121 5.13572 1.17313C3.78583 1.39215 2.6235 2.24665 2.01177 3.46975C1.1928 5.10758 1.51363 7.08571 2.80827 8.38075L10 15.883Z"
                  stroke="black"
                  strokeWidth="1.5"
                  fill={liked ? "red" : "none"}
                />
              </svg>
            </button>
          </div>

          <div className="star">
            {[...Array(5)].map((_, index) => (
              <svg key={index} width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 10.88L3.29772 14.4721L5.26096 8.88997L0.391548 5.52786L6.30718 5.67003L8 0L9.69282 5.67003L15.6085 5.52786L10.739 8.88997L12.7023 14.4721L8 10.88Z"
                  fill={index < roundedRating ? "#FF9500" : "#E0E0E0"}
                />
              </svg>
            ))} ({reviews})
          </div>

          <Link to={`/product/${id}`} className="btn btn-light mt-2">More</Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
