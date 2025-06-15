import React from "react";

function CategoryCard({ title, imageSrc, isActive, isMobile }) {
  if (isMobile) {
    // Mobile: Compact 3-column layout
    return (
      <div className={`card card-border-none ${isActive ? "active" : ""}`} style={{
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        minHeight: '120px'
      }}>
        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-2">
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '8px',
            background: '#f8f9ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={imageSrc || "/default.jpg"} 
              className="img-category" 
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <h6 className="card-title mb-0" style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#2d3748',
            lineHeight: '1.2'
          }}>
            {title}
          </h6>
        </div>
      </div>
    );
  }

  // Desktop: Original larger layout
  return (
    <div className={`card card-border-none ${isActive ? "active" : ""}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <img src={imageSrc || "/default.jpg"} className="img-category w-120" alt={title} />
      </div>
    </div>
  );
}

export default CategoryCard;