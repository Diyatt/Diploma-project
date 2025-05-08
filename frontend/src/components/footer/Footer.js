import React from "react";

function Footer() {
  return (
    <footer className="footer" style={{ backgroundColor: "#f8f9fa", padding: "20px 0" }}>
      <div className="container">
        <div className="row">
          {/* Сол жақ бөлігінде логотип және мәтін */}
          <div className="col-md-6">
            <h4>Arent</h4>
            <p style={{ width: "250px" }}>
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* Оң жақ бөлігінде 3 сілтеме блоктары */}
          <div className="footer-content col-md-6 d-flex justify-content-between">
            <div>
              <h6>About</h6>
              <ul className="list-unstyled">
                <li><a href="#">How it works</a></li>
                <li><a href="#">Featured</a></li>
                <li><a href="#">Partnership</a></li>
                <li><a href="#">Business Relation</a></li>
              </ul>
            </div>
            <div>
              <h6>Community</h6>
              <ul className="list-unstyled">
                <li><a href="#">Events</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Podcast</a></li>
                <li><a href="#">Invite a friend</a></li>
              </ul>
            </div>
            <div>
              <h6>Socials</h6>
              <ul className="list-unstyled">
                <li><a href="#">Discord</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
