import { useUser } from "../../contexts/UserContext";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from "../Logo/Logo";
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, toggleSidebar}) => {
  const navigate = useNavigate();
  const handleLogin = () => {
    // Логин логикасын қосуға болады
    navigate("/"); // Басты бетке бағыттау
  };
  const { logout } = useUser(); 

  const handleLogout = () => {
    logout();           // 🔐 Жүйеден шығу
    navigate("/");      // ⬅ Басты бетке бағыттау (қаласаң /login немесе /landing деп өзгерте аласың)
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  console.log(isOpen)
  return (
    <div
      style={{
        zIndex: isMobile ? 9999 : 1,
        display: isMobile && !isOpen ? 'none' : 'block'
      }}
      className={`sidebar${isMobile && !isOpen ? ' collapsed' : ''}${!isMobile && isOpen ? ' collapsed' : ''}`}
    >
      <div className="sidebar-header">
        <Link to="/home" className="sidebar-logo-link">
                  <Logo width={isOpen ? "50" : "170"} height={isOpen ? "30" : "30"} />
        </Link>
      </div>


      
      <nav className="nav flex-column">
          <NavLink className="nav-link" activeClassName="active" to="/home">
              <svg className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="1.300291">
<rect opacity="0.01" width="24" height="24" fill="gray"/>
<path d="M11.25 11.83L3 8.35999V16.09C3.00888 16.7482 3.3991 17.3413 4 17.61L11.19 21H11.25V11.83Z" fill="gray"/>
<path d="M12 10.5L20.51 6.93001C20.3668 6.77089 20.1934 6.64173 20 6.55001L12.8 3.18001C12.2936 2.94032 11.7064 2.94032 11.2 3.18001L3.99999 6.55001C3.80655 6.64173 3.63321 6.77089 3.48999 6.93001L12 10.5Z" fill="gray"/>
<path d="M12.75 11.83V21H12.8L20 17.61C20.5977 17.3428 20.9873 16.7545 21 16.1V8.35999L12.75 11.83Z" fill="gray"/>
</g>
</svg>
        <span>Borrow</span>
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/favorites">
            <svg 
              className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                  <g opacity="1.300291">
                  <rect opacity="0.01" width="24" height="24" fill="gray"/>
                  <path d="M12 21C11.7342 21.0016 11.4787 20.8972 11.29 20.71L3.51999 12.93C1.49154 10.8804 1.49154 7.57966 3.51999 5.53002C5.56514 3.49065 8.87485 3.49065 10.92 5.53002L12 6.61002L13.08 5.53002C15.1251 3.49065 18.4349 3.49065 20.48 5.53002C22.5084 7.57966 22.5084 10.8804 20.48 12.93L12.71 20.71C12.5213 20.8972 12.2658 21.0016 12 21Z" fill="gray"/>
                  </g>
              </svg>

              <span>Favorites</span>
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/mychat">
            <svg 
              className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                  <g opacity="1.300291">
                  <rect opacity="0.01" width="24" height="24" fill="gray"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.37742 3.69206C10.3567 1.00339 15.6853 1.52307 19.07 4.92993L19.12 4.94993C22.5269 8.33469 23.0466 13.6633 20.3579 17.6425C17.6692 21.6218 12.5315 23.1278 8.12004 21.2299C7.91816 21.1448 7.69757 21.1138 7.48004 21.1399L3.20004 21.9999H3.00004C2.72733 22.0069 2.46363 21.9021 2.27004 21.7099C2.03263 21.4714 1.93117 21.1294 2.00004 20.7999L2.88004 16.5699C2.91739 16.3524 2.88593 16.1287 2.79004 15.9299C0.892129 11.5184 2.39819 6.38073 6.37742 3.69206ZM7.00004 11.9999C7.00004 12.5522 7.44775 12.9999 8.00004 12.9999C8.55232 12.9999 9.00004 12.5522 9.00004 11.9999C9.00004 11.4476 8.55232 10.9999 8.00004 10.9999C7.44775 10.9999 7.00004 11.4476 7.00004 11.9999ZM12 12.9999C11.4478 12.9999 11 12.5522 11 11.9999C11 11.4476 11.4478 10.9999 12 10.9999C12.5523 10.9999 13 11.4476 13 11.9999C13 12.5522 12.5523 12.9999 12 12.9999ZM15 11.9999C15 12.5522 15.4478 12.9999 16 12.9999C16.5523 12.9999 17 12.5522 17 11.9999C17 11.4476 16.5523 10.9999 16 10.9999C15.4478 10.9999 15 11.4476 15 11.9999Z" fill="gray"/>
                  </g>
              </svg>

              <span>Chat</span>
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/Iborrowed">
            <svg 
              className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                  <g opacity="1.300291">
                  <rect opacity="0.01" x="24" y="24" width="24" height="24" transform="rotate(180 24 24)" fill="gray"/>
                  <path d="M3.24005 7.28991L11.7601 11.9199C11.9101 11.9999 12.0901 11.9999 12.2401 11.9199L20.7601 7.28991C20.919 7.21142 21.0153 7.04521 21.0044 6.86828C20.9935 6.69135 20.8774 6.53826 20.7101 6.47991L12.1901 2.99991C12.0683 2.9499 11.9318 2.9499 11.8101 2.99991L3.29005 6.47991C3.12266 6.53826 3.00663 6.69135 2.99571 6.86828C2.98479 7.04521 3.08111 7.21142 3.24005 7.28991Z" fill="gray"/>
                  <path d="M20.71 10.6599L18.88 9.87988L12.24 13.4899C12.09 13.5699 11.91 13.5699 11.76 13.4899L5.11998 9.87988L3.28998 10.6599C3.13202 10.7428 3.03308 10.9065 3.03308 11.0849C3.03308 11.2633 3.13202 11.427 3.28998 11.5099L11.81 16.4099C11.9573 16.5 12.1427 16.5 12.29 16.4099L20.81 11.5099C20.9604 11.4098 21.0419 11.2337 21.0208 11.0542C20.9996 10.8747 20.8795 10.7224 20.71 10.6599Z" fill="gray"/>
                  <path d="M20.71 15.0999L19.15 14.4199L12.24 18.1799C12.09 18.2599 11.91 18.2599 11.76 18.1799L4.84996 14.4199L3.28996 15.0999C3.12749 15.1842 3.02551 15.3519 3.02551 15.5349C3.02551 15.7179 3.12749 15.8857 3.28996 15.9699L11.81 20.9699C11.96 21.0499 12.14 21.0499 12.29 20.9699L20.81 15.9699C20.9649 15.8684 21.0494 15.6881 21.0282 15.5041C21.0071 15.32 20.8839 15.1636 20.71 15.0999Z" fill="gray"/>
                  </g>
              </svg>
              <span>Guideline</span>
          </NavLink>
          <NavLink className="nav-link" activeClassName="active"  to="/lend">
            <svg 
              className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                  <g opacity="1.300291">
                  <rect opacity="0.01" width="24" height="24" fill="black"/>
                  <path d="M21 8V6C21 4.34315 19.6569 3 18 3H6C4.34315 3 3 4.34315 3 6V8H21Z" fill="gray"/>
                  <path d="M3 10V18C3 19.6569 4.34315 21 6 21H11V10H3Z" fill="gray"/>
                  <path d="M13 10V21H18C19.6569 21 21 19.6569 21 18V10H13Z" fill="gray"/>
                  </g>
              </svg>

              <span>Lend</span>
          </NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/settings">
            <svg 
              className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
                  <g opacity="1.300291">
                  <rect opacity="0.01" x="24" y="24" width="24" height="24" transform="rotate(180 24 24)" fill="gray"/>
                  <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="gray"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.23 9.37H20.32C21.2495 9.3755 22 10.1305 22 11.06V13C21.9952 13.901 21.2805 14.6378 20.38 14.67H19.29C19.1589 14.6811 19.046 14.7667 19 14.89C18.927 15.0025 18.927 15.1475 19 15.26L19.73 15.99C20.0457 16.3035 20.2233 16.7301 20.2233 17.175C20.2233 17.6199 20.0457 18.0465 19.73 18.36L18.39 19.7C18.0801 20.0189 17.6546 20.1991 17.21 20.2C16.7635 20.1941 16.3367 20.0148 16.02 19.7L15.26 18.93C15.1475 18.857 15.0025 18.857 14.89 18.93C14.74 18.99 14.63 19.09 14.63 19.23V20.32C14.6245 21.2495 13.8695 22 12.94 22H11.05C10.1451 22.0006 9.40232 21.2843 9.37 20.38V19.29C9.35895 19.1589 9.27326 19.046 9.15 19C9.02506 18.9199 8.86494 18.9199 8.74 19L7.97 19.74C7.65648 20.0557 7.22994 20.2333 6.785 20.2333C6.34006 20.2333 5.91352 20.0557 5.6 19.74L4.26 18.38C3.93962 18.067 3.75931 17.6379 3.76 17.19C3.76586 16.7435 3.94517 16.3167 4.26 16L5.07 15.26C5.14298 15.1475 5.14298 15.0025 5.07 14.89C5.01 14.74 4.91 14.63 4.77 14.63H3.68C2.75055 14.6245 1.99998 13.8695 2 12.94V11.05C2 10.1222 2.75216 9.37 3.68 9.37H4.71C4.84109 9.35895 4.95403 9.27326 5 9.15C5.08005 9.02506 5.08005 8.86494 5 8.74L4.26 8C3.93494 7.68539 3.75142 7.25237 3.75142 6.8C3.75142 6.34763 3.93494 5.91461 4.26 5.6L5.63 4.26C5.9399 3.94115 6.36536 3.76087 6.81 3.76C7.25653 3.76586 7.68328 3.94517 8 4.26L8.74 5.07C8.85254 5.14298 8.99746 5.14298 9.11 5.07C9.26 5.01 9.37 4.91 9.37 4.77V3.68C9.3755 2.75055 10.1305 1.99998 11.06 2H13C13.9083 2.02704 14.6304 2.77134 14.63 3.68V4.71C14.6411 4.84109 14.7267 4.95403 14.85 5C14.9749 5.08005 15.1351 5.08005 15.26 5L16.03 4.26C16.3435 3.94428 16.7701 3.76672 17.215 3.76672C17.6599 3.76672 18.0865 3.94428 18.4 4.26L19.74 5.63C20.0594 5.94362 20.2396 6.37235 20.24 6.82C20.2414 7.2651 20.0608 7.69143 19.74 8L18.93 8.74C18.857 8.85254 18.857 8.99746 18.93 9.11C18.99 9.26 19.09 9.37 19.23 9.37ZM8.76642 13.3394C9.30816 14.6473 10.5844 15.5 12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.5844 14.6473 9.30816 13.3394 8.76642C12.0315 8.22469 10.5261 8.52413 9.52513 9.52513C8.52413 10.5261 8.22469 12.0315 8.76642 13.3394Z" fill="gray"/>
                  </g>
              </svg>
              <span>Settings</span>
          </NavLink>
          <a onClick={handleLogout} className="nav-link" style={{ cursor: "pointer" }}>
          

              <svg className={`svg-nav ${isMobile ? "d-none" : ""} ${isOpen ? "d-opacity" : ""}`}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="1.3003">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 22C17.5228 22 21.9999 17.5228 21.9999 12C21.9999 6.47715 17.5228 2 11.9999 2C6.81459 2 2.55104 5.94668 2.04932 11H11.5857L8.29283 7.70711L9.70705 6.29289L14.707 11.2929L15.4142 12L14.707 12.7071L9.70705 17.7071L8.29283 16.2929L11.5857 13H2.04932C2.55104 18.0533 6.81459 22 11.9999 22Z" fill="gray"/>
                   </g>
</svg>

              

              <span>Logout</span>
          </a>
      </nav>
    </div>
  );
};

export default Sidebar;
