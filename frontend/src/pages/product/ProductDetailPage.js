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
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profilePicture = userData?.profile_picture || "https://via.placeholder.com/60";
  const fullName = userData?.full_name || userData?.username || "Сіз";
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

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
    api.get(`/products/${id}/`)
      .then((res) => {
        console.log("🔍 Product data:", res.data); // ✅ API-дан не келіп жатқанын тексеру
        setProduct(res.data);
      })
      .catch((err) => console.error("Қате:", err));

    api.get(`/products/${id}/reviews/`)
      .then(async (res) => {
        setReviews(res.data);
        const userMap = {};
        await Promise.all(
          res.data.map(async (review) => {
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
      })
      .catch((err) => console.error("Пікір қатесі:", err))
      .finally(() => setLoading(false));
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
        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container">
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

                    <div className="row align-items-stretch">
                     <div className="col-md-6 d-flex justify-content-center align-items-center flex-column">
                        {/* Негізгі сурет - кішірек етіп */}
                        <div className='card-custom bg-white p-3 rounded w-100' style={{ height: "300px" }}>
                          <img
                            src={product.images[0]?.url || "https://via.placeholder.com/500"}
                            alt={product.name}
                            className="rounded"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain", // созылмайды, ішінде орналасады
                            }}
                          />
                        </div>

                        {/* Thumbnail-дар */}
                        <div className="d-flex gap-2 mt-3"
                          style ={{
                            padding: "10px",
                            borderRadius: "8px",
                          }}
                        >
                          {product.images.map((img) => (
                            <img
                              key={img.id}
                              src={img.url}
                              style={{
                                
                                objectFit: "cover",
                                borderRadius: "6px",
                                width: '120px',
                                height: '120px'
                              }}
                              alt=""
                            />
                          ))}
                        </div>
                      </div>


                      <div className="col-md-6 d-flex">
                        <div className="card-custom bg-white p-3 w-100 h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h4><strong className='product-title'>{product.name}</strong></h4>
                                <div className="star-rating">
                                  {"\u2605".repeat(Math.round(product.average_rating))}
                                  {"\u2606".repeat(5 - Math.round(product.average_rating))}{" "}
                                  <span className="text-muted small">({product.reviewers})</span>
                                </div>
                              </div>
                              <button className="btn btn-outline-danger btn-sm rounded-circle">♥</button>
                            </div>

                            <p className="mt-3 desc-text p-card">
                              {product.description}
                            
                            </p>

                            <div className="row mt-3 mb-2">
                              <div className="col-6"><strong>Category:</strong> {product.category_name || "N/A"}</div>
                              <div className="col-6"><strong>Quality:</strong> <span className="tag">{product.quality_type}</span></div>
                              <div className="col-6 mt-2"><strong>District:</strong> {product.district_name || product.district}</div>
                              <div className="col-6 mt-2"><strong>Piece:</strong> <span className="tag">{product.piece} </span></div>
                            </div>
                          </div>

                          <div className="price mt-4">
                            {product.price}₸<small className="text-muted fs-6">/ per day</small>
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
                        <div className="contact-box text-center flex-fill d-flex flex-column  align-items-center p-3  rounded shadow-sm w-100">
                          <h4 className="fw-bold mb-4">Contacts</h4>
                          {product?.owner && (
                            <>
                              <button
                                className="btn btn-blue mb-3 w-50"
                                onClick={async () => {
                                  setIsOpeningChat(true);
                                  try {
                                    const ownerId = typeof product.owner === "object" ? product.owner.id : product.owner;
                                    await handleStartChat(ownerId);
                                  } finally {
                                    setIsOpeningChat(false);
                                  }
                                }}
                              >
                                {isOpeningChat ? "Opening..." : "Message"}
                              </button>

                              <button
                                className="btn btn-blue w-50"
                                onClick={() => setShowPhone(true)}
                              >
                                {showPhone
                                  ? product.owner_phone || "Phone number unavailable"
                                  : "Call"}
                              </button>
                            </>
                          )}

                        </div>
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
