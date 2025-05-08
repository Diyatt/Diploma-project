import React from "react";
import { useState } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';
import ProductImage from "../../assets/img/product1.png";

function LendPage() {
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
            <div className="">

              <div className="Iborrowed-conntent">
                <div className="Iborrowed-conntent">
                        <div className="Iborrowed-header">
                            <div>
                                <h4 className="mb-0">Lend</h4>
                            </div>
                            <div>
                                <a href="#" className=" start-btn">Add</a>
                            </div>
                        </div>
                        <div className="Iborrowed-body">
                            <table className="table ">
                                <thead>
                                    <tr>
                                      <th scope="col">Image</th>
                                      <th scope="col"> Name</th>
                                      <th scope="col">Category</th>
                                      <th scope="col">Price</th>
                                      <th scope="col">Piece</th>
                                      <th scope="col">Status</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>
                                          <img src={ProductImage} alt="" className="Lend-img"/>
                                      </th>
                                      <td>Microsoft Headsquare</td>
                                      <td>Digital Product</td>
                                      <td>$190.00</td>
                                      <td>13</td>
                                      <td><span className="badge text-bg-primary">Processing</span></td>
                                      <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-Iborrowed">
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.6">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.69732 10.4247L7.22266 10.7787L7.57599 8.30334L13.94 1.93934C14.5258 1.35355 15.4755 1.35355 16.0613 1.93934C16.6471 2.52513 16.6471 3.47489 16.0613 4.06068L9.69732 10.4247Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.2324 2.64648L15.3538 4.76782" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.5 10.5V15.5C13.5 16.0523 13.0523 16.5 12.5 16.5H2.5C1.94772 16.5 1.5 16.0523 1.5 15.5V5.5C1.5 4.94772 1.94772 4.5 2.5 4.5H7.5" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </g>
                                                        </svg>

                                                </button>
                                                <button type="button" className="btn btn-Iborrowed">
                                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1996 15.4004H4.79961C4.13687 15.4004 3.59961 14.8631 3.59961 14.2004V3.40039H14.3996V14.2004C14.3996 14.8631 13.8624 15.4004 13.1996 15.4004Z" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M7.19883 11.8V7" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M10.7984 11.8V7" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M1.19922 3.4H16.7992" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8 1H7.2C6.53726 1 6 1.53726 6 2.2V3.4H12V2.2C12 1.53726 11.4627 1 10.8 1Z" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>

                                                </button>
                                            </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th>
                                          <img src={ProductImage}  alt="" className="Lend-img"/>
                                      </th>
                                      <td>Microsoft Headsquare</td>
                                      <td>Digital Product</td>
                                      <td>$190.00</td>
                                      <td>13</td>
                                      <td><span className="badge text-bg-primary">Processing</span></td>
                                      <td>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-Iborrowed">
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.6">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.69732 10.4247L7.22266 10.7787L7.57599 8.30334L13.94 1.93934C14.5258 1.35355 15.4755 1.35355 16.0613 1.93934C16.6471 2.52513 16.6471 3.47489 16.0613 4.06068L9.69732 10.4247Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.2324 2.64648L15.3538 4.76782" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M13.5 10.5V15.5C13.5 16.0523 13.0523 16.5 12.5 16.5H2.5C1.94772 16.5 1.5 16.0523 1.5 15.5V5.5C1.5 4.94772 1.94772 4.5 2.5 4.5H7.5" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </g>
                                                        </svg>

                                                </button>
                                                <button type="button" className="btn btn-Iborrowed">
                                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1996 15.4004H4.79961C4.13687 15.4004 3.59961 14.8631 3.59961 14.2004V3.40039H14.3996V14.2004C14.3996 14.8631 13.8624 15.4004 13.1996 15.4004Z" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M7.19883 11.8V7" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M10.7984 11.8V7" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M1.19922 3.4H16.7992" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8 1H7.2C6.53726 1 6 1.53726 6 2.2V3.4H12V2.2C12 1.53726 11.4627 1 10.8 1Z" stroke="#EF3826" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>

                                                </button>
                                            </div>
                                      </td>
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
  );
}

export default LendPage;