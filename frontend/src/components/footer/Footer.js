import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-6 mb-4">
            <h4>Arent</h4>
            <p className="text-muted mt-2">
              Our vision is to provide convenience<br /> 
              and help increase your sales business.
            </p>
          </div>
          <div className="col-md-6 mb-4 text-md-center">
            <h5 className="fw-semibold">Socials</h5>
            <div className="mt-2">
              <a href="#">Discord</a> &nbsp;
              <a href="#">Instagram</a> &nbsp;
              <a href="#">Twitter</a> &nbsp;
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
        <div className="row bottom-line text-center text-md-between">
          <div className="col-md-6 text-muted">
            <div className='footer-text-bold'>
              ©2025 ARENT. All rights reserved
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            <a href="#" className="me-3 black-color">Privacy & Policy</a>
            <a href="#" className="black-color">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

