import React from "react";
import { useState } from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';

function NotificationsPage() {
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
            <TitleFilter text="NotificationsPage" /> 
            <div className="table-position">
              <table className="table ">
                <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">NAME</th>
                      <th scope="col">ADDRESS</th>
                      <th scope="col">DATE</th>
                      <th scope="col">TYPE</th>
                      <th scope="col">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>00001</th>
                    <td>Christine Brooks</td>
                    <td>089 Kutch Green Apt. 448</td>
                    <td>04 Sep 2019</td>
                    <td>Electric</td>
                    <td><span className="badge text-bg-light">Accept</span> <span className="badge text-bg-new">Processing</span></td>
                  </tr>
                  <tr>
                    <th>00001</th>
                    <td>Christine Brooks</td>
                    <td>089 Kutch Green Apt. 448</td>
                    <td>04 Sep 2019</td>
                    <td>Electric</td>
                    <td><span className="badge text-bg-light">Accept</span> <span className="badge text-bg-new">Processing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;