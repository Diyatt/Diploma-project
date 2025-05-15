import { useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Pattern from "../../assets/img/Pattern.png";
import { useNavigate } from "react-router-dom";

function Carousel() {
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
          <div className="carousel-item active">
            <img src={Pattern} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <p>Lend</p>
              <h5>Add items, Accept, Free or fee, Warranty</h5>
              <p>Add items or check what your neighbors are looking for</p>
              <button type="button" className="btn btn-warning" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        {/* Алдыңғы кнопка */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.65997 11.09L3.07997 6.5L7.65997 1.91L6.24997 0.5L0.249973 6.5L6.24997 12.5L7.65997 11.09Z" fill="#363636" />
            </svg>
          </span>
          <span className="visually-hidden">Previous</span>
        </button>

        {/* Келесі кнопка */}
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true">
            <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.339966 11.09L4.91997 6.5L0.339966 1.91L1.74997 0.5L7.74997 6.5L1.74997 12.5L0.339966 11.09Z" fill="#363636" />
            </svg>
          </span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
