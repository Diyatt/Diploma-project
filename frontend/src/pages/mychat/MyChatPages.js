import React from "react";
import { useState } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';


function MyChatPages() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="d-flex">
      {/* Sidebar ашық/жабық күйіне байланысты көрсетіледі */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        {/* Header кнопкасы sidebar-ды басқарады */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="main" style={{  marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                  <div>
                      <h4 className="">My Chat</h4>
                  </div>
              </div>
              <div className="favorites-body">
                  <div className="card">
                      <div className="card-body p-0">
                          <div className="d-flex justify-content-between p-10">
                              <div className="app-search dropdown d-none d-lg-block">
                                  <form>
                                      <div className="input-group-search">
                                          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <g opacity="0.5">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.69353 12.535C12.4234 11.3748 13.6959 8.22136 12.5357 5.49152C11.3755 2.76168 8.22208 1.4892 5.49225 2.64936C2.76241 3.80951 1.48993 6.96297 2.65008 9.69281C3.81024 12.4226 6.9637 13.6951 9.69353 12.535Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                                              <path d="M11.3902 11.3896L15.5555 15.5556" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                                              </g>
                                          </svg>
                                          <input type="search" className="" placeholder="Search..." id="top-search" />

                                      </div>
                                  </form>

                              </div>
                              <div className="btn-group btn-group-lg" role="group" aria-label="Large button group">
                                <button type="button" className="btn btn-Iborrowed">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0295 0H2.39606C1.24189 0 0.32795 0.795556 0.32795 1.77778L0.317505 14.2222C0.317505 15.2044 1.24189 16 2.39606 16H17.0295C18.1836 16 19.1185 15.2044 19.1185 14.2222V1.77778C19.1185 0.795556 18.1836 0 17.0295 0ZM17.0334 10.6667H12.8554C12.8554 12.1378 11.4506 13.3334 9.72193 13.3334C7.99329 13.3334 6.58844 12.1378 6.58844 10.6667H2.4V1.77783H17.0334V10.6667ZM11.808 6.22233H13.897L9.71897 9.77789L5.54098 6.22233H7.62998V3.55566H11.808V6.22233Z" fill="#202224"/>
                                      </svg>

                                </button>
                                <button type="button" className="btn btn-Iborrowed">
                                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2125 1.31697L14.0654 6.03091L19.5565 6.48459C19.8234 6.50309 20.053 6.6494 20.1446 6.85931C20.2362 7.06923 20.173 7.30441 19.9828 7.46165L15.4638 11.1971L17.1392 16.273C17.2092 16.4929 17.1181 16.7266 16.9063 16.8701C16.6945 17.0136 16.4016 17.0401 16.1578 16.9379L10.5909 14.6389L5.03162 16.935C4.78787 17.0373 4.4949 17.0107 4.28313 16.8673C4.07137 16.7238 3.9802 16.4901 4.05022 16.2701L5.72568 11.1943L1.20324 7.45881C1.01299 7.30156 0.949806 7.06639 1.0414 6.85647C1.13299 6.64655 1.36263 6.50025 1.62956 6.48175L7.12061 6.02806L9.9693 1.31697C10.0888 1.1224 10.3288 1 10.5909 1C10.853 1 11.093 1.1224 11.2125 1.31697Z" fill="black" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                     </svg>

                                </button>
                                <button type="button" className="btn btn-Iborrowed">
                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0385 0.888889H14.6943V2.66667H0.0712891V0.888889H3.72703L4.77153 0H9.99402L11.0385 0.888889ZM3.20536 16.0001C2.05642 16.0001 1.11637 15.2001 1.11637 14.2223V3.55566H13.6503V14.2223C13.6503 15.2001 12.7103 16.0001 11.5613 16.0001H3.20536Z" fill="black"/>
                                  </svg>

                                </button>
                              </div>
                          </div>
                          <div className="p-0">
                              <table className="table">
                                <tbody>
                                  <tr>
                                    <th><input type="checkbox" className="form-check-input" id="exampleCheck1" /></th>
                                    <td>
                                        <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5118 1.31697L14.3076 6.03091L19.6889 6.48459C19.9505 6.50309 20.1755 6.6494 20.2653 6.85931C20.355 7.06923 20.2931 7.30441 20.1067 7.46165L15.678 11.1971L17.32 16.273C17.3886 16.4929 17.2992 16.7266 17.0917 16.8701C16.8842 17.0136 16.5971 17.0401 16.3582 16.9379L10.9026 14.6389L5.45453 16.935C5.21565 17.0373 4.92854 17.0107 4.72101 16.8673C4.51348 16.7238 4.42414 16.4901 4.49276 16.2701L6.1347 11.1943L1.70271 7.45881C1.51627 7.30156 1.45435 7.06639 1.54411 6.85647C1.63387 6.64655 1.85892 6.50025 2.12051 6.48175L7.50173 6.02806L10.2935 1.31697C10.4105 1.1224 10.6457 1 10.9026 1C11.1595 1 11.3947 1.1224 11.5118 1.31697Z" stroke="#B3B3B3" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                          </svg>

                                    </td>
                                    <td><b>Jullu Jalal</b></td>
                                    <td>Our Bachelor of Commerce program is ACBSP-accredited.</td>
                                    <td>8:38 AM</td>
                                  </tr>
                                  <tr>
                                    <th><input type="checkbox" className="form-check-input" id="exampleCheck1" /></th>
                                    <td>
                                        
                                      <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5118 1.31697L14.3076 6.03091L19.6889 6.48459C19.9505 6.50309 20.1755 6.6494 20.2653 6.85931C20.355 7.06923 20.2931 7.30441 20.1067 7.46165L15.678 11.1971L17.32 16.273C17.3886 16.4929 17.2992 16.7266 17.0917 16.8701C16.8842 17.0136 16.5971 17.0401 16.3582 16.9379L10.9026 14.6389L5.45453 16.935C5.21565 17.0373 4.92854 17.0107 4.72101 16.8673C4.51348 16.7238 4.42414 16.4901 4.49276 16.2701L6.1347 11.1943L1.70271 7.45881C1.51627 7.30156 1.45435 7.06639 1.54411 6.85647C1.63387 6.64655 1.85892 6.50025 2.12051 6.48175L7.50173 6.02806L10.2935 1.31697C10.4105 1.1224 10.6457 1 10.9026 1C11.1595 1 11.3947 1.1224 11.5118 1.31697Z" fill="#FFD56D" stroke="#FFD56D" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>

                                    </td>
                                    <td><b>Jullu Jalal</b></td>
                                    <td>Our Bachelor of Commerce program is ACBSP-accredited.</td>
                                    <td>8:38 AM</td>
                                  </tr>
                                </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyChatPages;