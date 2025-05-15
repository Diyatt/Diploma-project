import { useState } from "react";
import { Link } from "react-router-dom";
import UserImage from "../../assets/img/defaultProfile.png";
import UsImage from "../../assets/img/us.jpg";
import { NavLink ,useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext"; 

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useUser(); // 👈 қолданушының барлық мәліметі осы жерде

  const username = user?.username || "Guest";
  const email = user?.email || "";
  const profilePicture = user?.profile_picture || "/defaultProfile.png";
  const { logout } = useUser();

  const handleLogout = () => {
    logout();           // 🔐 Жүйеден шығу
    navigate("/");      // ⬅ Басты бетке бағыттау (қаласаң /login немесе /landing деп өзгерте аласың)
  };
  
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

              <div className="app-search dropdown d-none d-lg-block">
                  <form>
                      <div className="input-group-search">
                          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g opacity="0.5">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.69353 12.535C12.4234 11.3748 13.6959 8.22136 12.5357 5.49152C11.3755 2.76168 8.22208 1.4892 5.49225 2.64936C2.76241 3.80951 1.48993 6.96297 2.65008 9.69281C3.81024 12.4226 6.9637 13.6951 9.69353 12.535Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11.3902 11.3896L15.5555 15.5556" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                              </g>
                          </svg>
                          <input type="search" className="" placeholder="Search..." id="top-search" />
                      </div>
                  </form>

              </div>

          </div>

          <ul className="topbar-menu d-flex align-items-center gap-3">
              <li className="dropdown">
                <NavLink className="nav-link"  to="/notifications">
                  <svg width="25" height="25" style={{ opacity: "1" }}  viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.74488 12.9829C6.62404 9.67995 9.19851 6.9019 12.5011 6.77148C15.8038 6.9019 18.3782 9.67995 18.2574 12.9829C18.2574 14.3548 19.748 15.6913 19.7918 17.0663C19.7918 17.0857 19.7918 17.1052 19.7918 17.1246C19.824 18.0056 19.1372 18.7464 18.2563 18.7809H14.9313C14.9344 19.4559 14.68 20.1067 14.2199 20.6007C13.7775 21.0811 13.1542 21.3544 12.5011 21.3544C11.848 21.3544 11.2248 21.0811 10.7824 20.6007C10.3223 20.1067 10.0678 19.4559 10.0709 18.7809H6.74488C5.86402 18.7464 5.17721 18.0056 5.20947 17.1246C5.20947 17.1052 5.20947 17.0857 5.20947 17.0663C5.25426 15.6954 6.74488 14.3559 6.74488 12.9829Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.0709 18.0302C9.65671 18.0302 9.32092 18.366 9.32092 18.7802C9.32092 19.1944 9.65671 19.5302 10.0709 19.5302V18.0302ZM14.9313 19.5302C15.3456 19.5302 15.6813 19.1944 15.6813 18.7802C15.6813 18.366 15.3456 18.0302 14.9313 18.0302V19.5302ZM13.5428 5.4375C13.957 5.4375 14.2928 5.10171 14.2928 4.6875C14.2928 4.27329 13.957 3.9375 13.5428 3.9375V5.4375ZM11.4595 3.9375C11.0453 3.9375 10.7095 4.27329 10.7095 4.6875C10.7095 5.10171 11.0453 5.4375 11.4595 5.4375V3.9375ZM10.0709 19.5302H14.9313V18.0302H10.0709V19.5302ZM13.5428 3.9375H11.4595V5.4375H13.5428V3.9375Z" fill="black"/>
                  </svg>

                </NavLink>
              </li>
              <li className="dropdown">
                  <a className="nav-link dropdown-toggle arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                      <img src={UsImage} alt="user-image" className="me-0 me-sm-1" height="12" />
                      <span className="align-middle d-none d-lg-inline-block">English</span> <i className="mdi mdi-chevron-down d-none d-sm-inline-block align-middle"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated">

                
                      <a href="#" className="dropdown-item">
                        <img src={UsImage || "/default-image.png"} alt="user-image" className="me-1" height="12" />
                        <span className="align-middle">German</span>
                      </a>

                  </div>
              </li>
              <li className="dropdown">
                  <a className="nav-link dropdown-toggle arrow-none nav-user px-2" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                      <span className="account-user-avatar">
                      
                        <img
                          src={profilePicture || UserImage}
                          alt="user-image"
                          width="32"
                          height="32"
                          className="rounded-circle"
                          onError={(e) => {
                            e.target.onerror = null; // Шексіз цикл болмас үшін
                            e.target.src = UserImage;
                          }}
                        />
                      </span>
                      <span className="d-lg-flex flex-column gap-1 d-none">
                        <h5 className="my-0">{username}</h5>
                        <h6 className="my-0 fw-normal">{email}</h6>
                      </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated profile-dropdown">
                      <div className=" dropdown-header noti-title">
                          <h6 className="text-overflow m-0">Welcome !</h6>
                      </div>
                      <Link to="/myprofille" className="dropdown-item">
                        <i className="mdi mdi-account-circle me-1"></i>
                          <span>My Account</span>
                      </Link>
                      <a onClick={handleLogout} className="dropdown-item">
                          <i className="mdi mdi-logout me-1"></i>
                          <span>Logout</span>
                      </a>
                  </div>
              </li>
          </ul>    
      </div>
     
  </div>
  );
};

export default Header;
