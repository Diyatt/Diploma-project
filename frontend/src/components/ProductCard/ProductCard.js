import React from "react";
import { Link } from "react-router-dom";


function ProductCard({ id, title, price, images, rating, reviews }) {
  const roundedRating = Math.min(5, Math.round(rating || 0)); // ⭐ max 5

  return (
    <div className="col-md-4">
      <div className="card card-border-none">
        <div className="card-body">
          <div className="carousel-card">
            <div id={`carousel-${title.replace(/\s+/g, "-")}`} className="carousel slide">
              <div className="carousel-inner">
                {images.map((img, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <img src={img} className="d-block w-100" alt={title} />
                  </div>
                ))}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${title.replace(/\s+/g, "-")}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true">
                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.65997 11.09L3.07997 6.5L7.65997 1.91L6.24997 0.5L0.249973 6.5L6.24997 12.5L7.65997 11.09Z" fill="#363636"/>
                  </svg>
                </span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${title.replace(/\s+/g, "-")}`} data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true">
                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.339966 11.09L4.91997 6.5L0.339966 1.91L1.74997 0.5L7.74997 6.5L1.74997 12.5L0.339966 11.09Z" fill="#363636"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <h5 className="card-title">{title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">${price}</h6>

          <div className="star">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 10.88L3.29772 14.4721L5.26096 8.88997L0.391548 5.52786L6.30718 5.67003L8 0L9.69282 5.67003L15.6085 5.52786L10.739 8.88997L12.7023 14.4721L8 10.88Z"
                  fill={index < roundedRating ? "#FF9500" : "#E0E0E0"}
                />
              </svg>
            ))}
            ({reviews})
          </div>

          <Link to={`/product/${id}`} className="btn btn-light">
            More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
