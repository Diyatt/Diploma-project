// src/pages/ProductDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";


function ProductDetailPage() {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Қате:", err));
  }, [id]);

  if (!product) return <p>Жүктелуде...</p>;

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
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={product.images[0]?.url || "https://via.placeholder.com/500"}
                        alt={product.name}
                        className="main-img mb-3 w-100"
                      />
                      <div className="d-flex gap-2">
                        {product.images.map((img) => (
                          <div className="thumbnail" key={img.id}>
                            <img src={img.url} alt="" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card-custom bg-white p-3 rounded">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h4>
                              <strong>{product.name}</strong>
                            </h4>
                            <div className="star-rating">
                              {"\u2605".repeat(Math.round(product.average_rating))}
                              {"\u2606".repeat(5 - Math.round(product.average_rating))} {" "}
                              <span className="text-muted small">
                                {product.views} Reviewer
                              </span>
                            </div>
                          </div>
                          <div>
                            <button className="btn btn-outline-danger btn-sm rounded-circle">
                              ♥
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 desc-text p-card">
                          {product.description}
                          <br />
                          <strong>Color:</strong> White, <strong>Size:</strong> 5 <br />
                        </p>

                        <div className="row mt-3 mb-2">
                          <div className="col-6">
                            <strong>Category:</strong> {product.category_name || "N/A"}
                          </div>
                          <div className="col-6">
                            <strong>Quality:</strong> <span className="tag">{product.quality}</span>
                          </div>
                          <div className="col-6 mt-2">
                            <strong>District:</strong> {product.district_name || product.district}
                          </div>
                          <div className="col-6 mt-2">
                            <strong>Piece:</strong> <span className="tag">{product.piece}</span>
                          </div>
                        </div>

                        <div className="price mt-4">
                          ₸{product.price} <small className="text-muted fs-6">/ per day</small>
                        </div>
                      </div>
                    </div>
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
