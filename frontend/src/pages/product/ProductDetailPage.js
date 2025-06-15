// src/pages/ProductDetailPage.js
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Pereolder from "../../assets/img/Animation.gif";
import ContactBox from "../../components/ContactBox/ContactBox";

function ProductDetailPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profilePicture = userData?.profile_picture || "https://via.placeholder.com/60";
  const fullName = userData?.full_name || userData?.username || "Сіз";
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
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

  

  const handleWishlist = async () => {
    try {
      if (!userData?.id) {
        alert("Сіз жүйеге кірмегенсіз!");
        return;
      }

      if (!liked) {
        // ✅ Таңдаулыларға қосу
        await api.post("/wishlist/", { product_id: id });
        setLiked(true);
      } else {
        // ✅ Таңдаулылардан өшіру
        if (!product.wishlist_id) {
          alert("Өнім ID табылмады.");
          return;
        }

        await api.delete(`/wishlist/${id}/`);
        setLiked(false);
      }
    } catch (error) {
      console.error("Тізім өңдеу қатесі:", error);
      alert("Қате орын алды. Қайта көріңіз.");
    }
  };

  const handleSubmitReview = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const userId = userData?.id;
      if (!userId) {
        alert("Сіз жүйеге кірмегенсіз!");
        return;
      }

      await api.post(`/products/${id}/reviews/add/`, {
        product: id,
        user: userId,
        rating: newRating,
        comment: newComment,
      });

      alert("Пікір сәтті қосылды!");
      const res = await api.get(`/products/${id}/reviews/`);
      setReviews(res.data);
      setNewComment("");
      setNewRating(0);
    } catch (error) {
      console.error("Пікір жіберу қатесі:", error.response?.data || error);
      alert("Қате орын алды: " + JSON.stringify(error.response?.data));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartChat = async (user2Id) => {
    const currentUserId = userData?.id;

    // 🔐 Өз-өзіне хат жібермеу
    if (user2Id === currentUserId) {
      return alert("Can't open a chat with yourself.");
    }

    if (!user2Id || isNaN(user2Id)) {
      return alert("Error: user not detected to open chat.");
    }

    try {
      const res = await api.post("/chats/", { user2_id: Number(user2Id) });
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      const errorData = err.response?.data;
      if (Array.isArray(errorData) && errorData[0]?.includes("already exists")) {
        try {
          const res = await api.get("/chats/");
          const existingChat = res.data.find(chat =>
            (chat.user1.id === currentUserId && chat.user2.id === user2Id) ||
            (chat.user2.id === currentUserId && chat.user1.id === user2Id)
          );
          if (existingChat) {
            return navigate(`/chat/${existingChat.id}`);
          } else {
            alert("Chat not found.");
          }
        } catch (e) {
          console.error("Error loading chats:", e);
          alert("There was an error finding the chat.");
        }
      } else {
        console.error("Error opening chat:", errorData);
        alert("There was an error when opening the chat.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await api.get(`/products/${id}/`);
        const productData = productResponse.data;
        
        // Set initial wishlist state from product data
        setLiked(productData.is_favorite || false);
        setProduct(productData);
        
        // Fetch reviews
        const reviewsResponse = await api.get(`/products/${id}/reviews/`);
        setReviews(reviewsResponse.data);

        // Fetch user details for reviews
        const userMap = {};
        await Promise.all(
          reviewsResponse.data.map(async (review) => {
            if (!userMap[review.user]) {
              try {
                const userRes = await api.get(`/users/${review.user}/`);
                userMap[review.user] = userRes.data;
              } catch (e) {
                console.error("Қолданушы жүктеу қатесі:", e);
              }
            }
          })
        );
        setUserDetails(userMap);
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <img src={require("../../assets/img/Animation.gif")} alt="Loading..." width={80} />
      </div>
    );
  }

  // ⬆ Барлық басқа render логикасын бұрынғы қалпында қалдыр
  return (
    <div className="">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`} style={isMobile ? { marginLeft: 0 } : {}}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
            <div className={isMobile ? "container-fluid px-3" : "container"}>
              <div className="favorites-conntent">
                <div className="favorites-header">
                  <nav aria-label="breadcrumb mt-5">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Borrow</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {product.name}
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="favorites-body">
                  <div className="">

                    <div className={`row ${isMobile ? 'g-3' : 'align-items-stretch'}`}>
                     <div className={`${isMobile ? 'col-12' : 'col-md-6'} d-flex justify-content-center align-items-center flex-column`}>
                        {/* Main image with loading state and quality optimization */}
                        <div className='card-custom bg-white p-3 rounded w-100 shadow-sm' 
                          style={{ 
                            height: "400px",
                            transition: "all 0.3s ease",
                            border: "1px solid #eee",
                            backgroundColor: "#f8f9fa" // Light background for better image visibility
                          }}>
                          {product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="rounded main-product-image"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                transition: "transform 0.3s ease",
                                cursor: "zoom-in",
                                imageRendering: "high-quality", // Improve image rendering
                                WebkitBackfaceVisibility: "hidden", // Prevent blur on transform
                                backfaceVisibility: "hidden",
                                transform: "translateZ(0)", // Force GPU acceleration
                                WebkitFontSmoothing: "antialiased" // Smoother text rendering
                              }}
                              onMouseOver={(e) => e.target.style.transform = "scale(1.02) translateZ(0)"}
                              onMouseOut={(e) => e.target.style.transform = "scale(1) translateZ(0)"}
                              loading="eager" // Prioritize loading
                            />
                          ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Thumbnails with hover effects and quality optimization */}
                        <div className="d-flex gap-3 mt-4 overflow-auto py-2 px-1"
                          style={{
                            maxWidth: "100%",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#888 #f1f1f1",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px"
                          }}>
                          {product.images.map((img, index) => (
                            <div 
                              key={img.id}
                              className="thumbnail-container"
                              style={{
                                position: "relative",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                padding: "2px"
                              }}
                              onClick={() => {
                                // Move clicked image to first position
                                const newImages = [...product.images];
                                const clickedImage = newImages.splice(index, 1)[0];
                                newImages.unshift(clickedImage);
                                setProduct(prev => ({...prev, images: newImages}));
                              }}
                            >
                              <img
                                src={img.url}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  width: '100px',
                                  height: '100px',
                                  border: "2px solid #eee",
                                  transition: "all 0.3s ease",
                                  imageRendering: "high-quality",
                                  WebkitBackfaceVisibility: "hidden",
                                  backfaceVisibility: "hidden",
                                  transform: "translateZ(0)",
                                  WebkitFontSmoothing: "antialiased"
                                }}
                                className="thumbnail-image"
                                alt={`${product.name} - view ${index + 1}`}
                                onMouseOver={(e) => {
                                  e.target.style.transform = "scale(1.05) translateZ(0)";
                                  e.target.style.borderColor = "#007bff";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.transform = "scale(1) translateZ(0)";
                                  e.target.style.borderColor = "#eee";
                                }}
                                loading="lazy" // Lazy load thumbnails
                              />
                            </div>
                          ))}
                        </div>
                      </div>


                      <div className={`${isMobile ? 'col-12' : 'col-md-6'} d-flex`}>
                        <div className={`card-custom bg-white ${isMobile ? 'p-3' : 'p-4'} w-100 h-100 d-flex flex-column justify-content-between shadow-sm rounded-3`}>
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h3 className="product-title mb-2" style={{ 
                                  fontSize: isMobile ? '1.5rem' : '1.75rem',
                                  fontWeight: '600',
                                  color: '#2c3e50',
                                  wordBreak: 'break-word',
                                  lineHeight: '1.3'
                                }}>{product.name}</h3>
                                <div className="star-rating d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                  <div className="d-flex" style={{ color: '#ffc107' }}>
                                    {"\u2605".repeat(Math.round(product.average_rating))}
                                    {"\u2606".repeat(5 - Math.round(product.average_rating))}
                                  </div>
                                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                    ({product.reviewers} reviews)
                                  </span>
                                </div>
                              </div>
                              <button 
                                className="circle-btn" 
                                onClick={handleWishlist}
                                style={{ 
                                  border: 'none', 
                                  background: 'none',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  transition: 'transform 0.2s ease',
                                  transform: liked ? 'scale(1.1)' : 'scale(1)'
                                }}
                              >
                                <svg 
                                  width="24" 
                                  height="24" 
                                  viewBox="0 0 20 17" 
                                  fill="none" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10 15.883L17.191 8.383C18.4872 7.08786 18.8084 5.10828 17.9883 3.46975C17.3766 2.24665 16.2142 1.39215 14.8643 1.17313C13.5144 0.954121 12.1416 1.3973 11.1745 2.36425L10 3.538L8.82552 2.36425C7.85848 1.3973 6.4856 0.954121 5.13572 1.17313C3.78583 1.39215 2.6235 2.24665 2.01177 3.46975C1.1928 5.10758 1.51363 7.08571 2.80827 8.38075L10 15.883Z"
                                    stroke={liked ? "red" : "#2c3e50"}
                                    strokeWidth="1.5"
                                    fill={liked ? "red" : "none"}
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="product-description mb-4">
                              <p className="desc-text" style={{
                                fontSize: isMobile ? '0.9rem' : '1rem',
                                lineHeight: '1.6',
                                color: '#4a5568',
                                marginBottom: '0',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                              }}>
                                {product.description}
                              </p>
                            </div>

                            <div className="product-details">
                              <div className={`row ${isMobile ? 'g-2' : 'g-3'}`}>
                                <div className={isMobile ? "col-12" : "col-6"}>
                                  <div className="detail-item p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Category</div>
                                    <div className="fw-semibold" style={{
                                      wordBreak: 'break-word',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: isMobile ? 'normal' : 'nowrap'
                                    }}>
                                      {product.category_name || "N/A"}
                                    </div>
                                  </div>
                                </div>
                                <div className={isMobile ? "col-12" : "col-6"}>
                                  <div className="detail-item p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Quality</div>
                                    <div className="fw-semibold">
                                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill" style={{
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal'
                                      }}>
                                        {product.quality_type}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className={isMobile ? "col-12" : "col-6"}>
                                  <div className="detail-item p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>District</div>
                                    <div className="fw-semibold" style={{
                                      wordBreak: 'break-word',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: isMobile ? 'normal' : 'nowrap'
                                    }}>
                                      {product.district_name || product.district}
                                    </div>
                                  </div>
                                </div>
                                <div className={isMobile ? "col-12" : "col-6"}>
                                  <div className="detail-item p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Quantity</div>
                                    <div className="fw-semibold">
                                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill" style={{
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal'
                                      }}>
                                        {product.piece} available
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="price-section mt-4 pt-3 border-top">
                            <div className={`d-flex ${isMobile ? 'flex-column align-items-start' : 'align-items-baseline'}`}>
                              <span className="price fw-bold" style={{ 
                                fontSize: isMobile ? '1.75rem' : '2rem',
                                color: '#2c3e50'
                              }}>
                                {product.price}₸
                              </span>
                              <small className={`text-muted ${isMobile ? 'mt-1' : 'ms-2'}`} style={{ fontSize: '0.9rem' }}>/ per day</small>
                            </div>
                            <div className="text-muted mt-1" style={{ 
                              fontSize: '0.875rem',
                              wordBreak: 'break-word'
                            }}>
                              Flexible rental terms available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                  <br/>
                  <div className="info-product">
                    <div className="row g-4">
                      {/* 🗺 Location */}
                      <div className="col-md-6 d-flex">
                        <div className="contact-box text-center flex-fill d-flex flex-column justify-content-center align-items-center p-3 rounded shadow-sm w-100">
                          <h4 className="fw-bold mb-4">Locations</h4>
                          <div style={{ width: "100%", height: "230px" }}>
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.0499728496176!2d76.85081041529453!3d43.23290287913726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836a7a38ef1fbd%3A0x66d4041073df5a18!2sSalut%20Hotel%20Almaty!5e0!3m2!1sen!2skz!4v1655960000000!5m2!1sen!2skz"
                              allowFullScreen=""
                              loading="lazy"
                              style={{ width: "100%", height: "100%", border: "0" }}
                            ></iframe>
                          </div>
                        </div>
                      </div>

                      {/* 📞 Contacts */}
                      <div className="col-md-6 d-flex">
                        <ContactBox product={product} handleStartChat={handleStartChat} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="comment-box">
                    <h4><strong>Comments</strong></h4>

                 
                    {/* Add New Review */}
                    <div className="d-flex align-items-center mt-4">
                      <img
                        src={profilePicture}
                        className="comment-avatar"
                        alt="User"
                      />
                      <div>
                        <h6 className="mb-0"><strong>{fullName}</strong></h6>
                        <div className="star">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <span
                              key={num}
                              className={num <= newRating ? "star" : "star-outline"}
                              style={{ cursor: "pointer" }}
                              onClick={() => setNewRating(num)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <textarea
                        className="form-control comment-textarea"
                        rows="3"
                        placeholder="Your comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button
                        className="btn btn-blue mt-3"
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Add"}
                      </button>
                    </div>

                    {reviews.length === 0 ? (
                      <p className="text-muted">Пікірлер жоқ.</p>
                    ) : (
                      reviews.map((review) => {
                        const user = userDetails[review.user];
                        return (
                          <div key={review.id} className="d-flex align-items-start mt-4">
                            <img
                              src={user?.profile_picture || "https://via.placeholder.com/60"}
                              className="comment-avatar me-3"
                              alt="User"
                            />
                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">
                                    <strong>{user?.full_name || `User #${review.user}`}</strong>
                                  </h6>
                                  <div className="star">
                                    {[...Array(5)].map((_, index) => (
                                      <span key={index} className={index < review.rating ? "star" : "star-outline"}>★</span>
                                    ))}
                                  </div>
                                </div>
                                <small className="text-muted">
                                  {new Date(review.review_date).toLocaleDateString()}
                                </small>
                              </div>
                              <p className="mt-2 review-text">{review.comment}</p>
                            </div>
                          </div>
                        );
                      })
                    )}


                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default ProductDetailPage;
