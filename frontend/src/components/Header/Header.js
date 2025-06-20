import { Link } from "react-router-dom";
import UserImage from "../../assets/img/defaultProfile.png";
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext";
import Logo from "../Logo/Logo";
import { useState, useRef, useEffect } from 'react';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const username = user?.username || "Guest";
  const email = user?.email || "";
  const profilePicture = user?.profile_picture || "/defaultProfile.png";
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="topbar container-fluid">
          <div className="d-flex align-items-center gap-lg-2 gap-1">
              <button onClick={toggleSidebar} className="sidebar-toggle">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.898019">
                      <path d="M3.75 6.5625H20.25V7.9375H3.75V6.5625ZM3.75 12.0625H20.25V13.4375H3.75V12.0625ZM3.75 17.5625H20.25V18.9375H3.75V17.5625Z" fill="#202224"/>
                      </g>
                  </svg>
              </button>
          </div>

          <ul className="topbar-menu d-flex align-items-center gap-3">
              <li className="dropdown" ref={dropdownRef}>
                  <button 
                    className="nav-link dropdown-toggle arrow-none nav-user px-2" 
                    onClick={() => setIsOpen(!isOpen)}
                  >
                      <span className="account-user-avatar">
                        <img
                          src={profilePicture || UserImage}
                          alt="user-image"
                          width="32"
                          height="32"
                          className="rounded-circle"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = UserImage;
                          }}
                        />
                      </span>
                      <span className="d-lg-flex flex-column gap-1 d-none">
                        <h5 className="my-0">{username}</h5>
                        <h6 className="my-0 fw-normal">{email}</h6>
                      </span>
                  </button>
                  <div className={`custom-dropdown-menu ${isOpen ? 'show' : ''}`}>
                   
                      <Link to="/myprofile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <i className="mdi mdi-account-circle me-1"></i>
                          <span>My Account</span>
                      </Link>
                      <button onClick={() => { handleLogout(); setIsOpen(false); }} className="dropdown-item">
                          <i className="mdi mdi-logout me-1"></i>
                          <span>Logout</span>
                      </button>
                  </div>
              </li>
          </ul>    
      </div>
    </div>
  );
};

export default Header;