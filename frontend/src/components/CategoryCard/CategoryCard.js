import React from "react";

function CategoryCard({ title, imageSrc, isActive }) {
  return (
    <div className={`card card-border-none ${isActive ? "active" : ""}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <img src={imageSrc || "/default.jpg"} className="img-category" alt={title} />
      </div>
    </div>
  );
}

export default CategoryCard;
