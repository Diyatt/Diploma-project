import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // өзіңнің Axios instance
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';
import ProductImage from "../../assets/img/product1.png";
import Pereolder  from "../../assets/img/Animation.gif";

function LendPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingLendPage, setLoadingLendPage] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      setLoadingLendPage(true); // Жүктеу басталды
      api.get("/myproducts/")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error("Өнімдерді жүктеу қатесі:", err);
        })
        .finally(() => {
          setLoadingLendPage(false); // Жүктеу аяқталды
        });
    }, []);
    const AddLend = () => {
        navigate("/lendAdd"); // 👈 /lend бетіне бағыттау
    };

    const handleEdit = (product) => {
      navigate(`/edit/${product.id}`); // ✅ бұл да дұрыс
    };
    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Бұл өнімді жоюға сенімдісіз бе?");
      if (!confirmDelete) return;

      try {
        await api.delete(`/products/${id}/delete/`);
        setProducts(products.filter(product => product.id !== id));  // UI-ден өшіру
        alert("Өнім сәтті жойылды!");
      } catch (err) {
        console.error("Жою қатесі:", err);
        alert("Жою сәтсіз аяқталды.");
      }
    };
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
                            <button type="button" className=" start-btn" onClick={AddLend}>
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="Iborrowed-body">
                      {loadingLendPage ? (
                        <div className="loading-container text-center">
                          <img src={Pereolder} alt="Loading..." />
                        </div>
                      ) : (
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
                                  {products.map((product) => (
                                    <tr key={product.id}>
                                      <td>
                                        <img
                                          src={product.images[0]?.url || ProductImage}
                                          alt=""
                                          className="Lend-img"
                                        />
                                      </td>
                                      <td>{product.name || "No name"}</td>
                                      <td>{product.category_name || "No category"}</td>
                                      <td>{product.price}₸</td>
                                      <td>{product.piece}</td>
                                      <td>
                                        <span className="badge text-bg-primary">
                                          {product.status || "Processing"}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="btn-group">
                                          <button
                                            type="button"
                                            className="btn btn-Iborrowed"
                                            onClick={() => handleEdit(product)}  // ✅ объектіні толық беріп тұрсыз
                                          >
                                            ✏️
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-Iborrowed"
                                            onClick={() => handleDelete(product.id)}
                                          >
                                            🗑️
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                        </table>
                      )}
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