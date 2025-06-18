import { useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Pattern from "../../assets/img/Pattern.png";
import { useNavigate } from "react-router-dom";

function Carousel({ isMobile }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.bootstrap) { // Bootstrap анықталғанын тексеру
      const carouselElement = document.getElementById("carouselExampleAutoplaying");
      if (carouselElement) {
        new window.bootstrap.Carousel(carouselElement, { interval: 3000 });
      }
    }
  }, []);

  const handleGetStarted = () => {
    navigate("/lend"); // 👈 /lend бетіне бағыттау
  };

  return (
    <div className="carousel-content">
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active"
            style={isMobile ? { minHeight: 0, height: 'auto' } : {}}>
            <img
              src={Pattern}
              className="d-block w-100"
              alt="..."
              style={isMobile ? { maxHeight: 180, objectFit: 'cover' } : {}}
            />
            <div
              className={`carousel-caption ${isMobile ? 'd-block' : 'd-none d-md-block'}`}
              style={
                isMobile
                  ? {
                      bottom: 'unset',
                      top: '8%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '95%',
                      padding: '10px 6px 6px 6px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.0)',
                    }
                  : {}
              }
            >
              <p style={isMobile ? { fontSize: 12, marginBottom: 4, fontWeight: 500 } : {}}>Lend</p>
              <h5 style={isMobile ? { fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.15 } : {}}>
                Add items, Accept, Free or fee, Warranty
              </h5>
              <p style={isMobile ? { fontSize: 11, marginBottom: 10, lineHeight: 1.2 } : {}}>
                Add items or check what your neighbors are looking for
              </p>
              <button
                onClick={handleGetStarted}
                className="btn btn-primary"
                style={
                  isMobile
                    ? {
                        width: '100%',
                        fontSize: 13,
                        padding: '7px 0',
                        borderRadius: 10,
                        fontWeight: 600,
                      }
                    : {}
                }
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        {/* Алдыңғы кнопка */}
        {/* <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.65997 11.09L3.07997 6.5L7.65997 1.91L6.24997 0.5L0.249973 6.5L6.24997 12.5L7.65997 11.09Z" fill="#363636" />
            </svg>
          </span>
          <span className="visually-hidden">Previous</span>
        </button> */}

        {/* Келесі кнопка */}
        {/* <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.339966 11.09L4.91997 6.5L0.339966 1.91L1.74997 0.5L7.74997 6.5L1.74997 12.5L0.339966 11.09Z" fill="#363636" />
            </svg>
          </span>
          <span className="visually-hidden">Next</span>
        </button> */}
      </div>
    </div>
  );
}

export default Carousel;