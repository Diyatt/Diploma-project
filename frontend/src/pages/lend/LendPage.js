import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // өзіңнің Axios instance
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';
import TitleFilter from '../../components/TitleFilter/TitleFilter';
import ProductImage from "../../assets/img/product1.png";
import Pereolder from "../../assets/img/Animation.gif";
import './LendPage.css'; // We'll create this file next

function LendPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingLendPage, setLoadingLendPage] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      setLoadingLendPage(true);
      api.get("/myproducts/")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.error("Өнімдерді жүктеу қатесі:", err);
        })
        .finally(() => {
          setLoadingLendPage(false);
        });
    }, []);

    const AddLend = () => {
        navigate("/lendAdd");
    };

    const handleEdit = (product) => {
      navigate(`/edit/${product.id}`);
    };

    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Бұл өнімді жоюға сенімдісіз бе?");
      if (!confirmDelete) return;

      try {
        await api.delete(`/products/${id}/delete/`);
        setProducts(products.filter(product => product.id !== id));
        alert("Өнім сәтті жойылды!");
      } catch (err) {
        console.error("Жою қатесі:", err);
        alert("Жою сәтсіз аяқталды.");
      }
    };

    return (
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

        <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className="main" style={{ marginTop: "60px" }}>
            <div className="container">
              <div className="lend-page-wrapper">
                <div className="lend-header">
                  <div className="lend-title">
                    <h2>Lend Products</h2>
                    <p className="text-muted">Manage your lent products</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary add-product-btn" 
                    onClick={AddLend}
                  >
                    <i className="fas fa-plus"></i> Add New Product
                  </button>
                </div>

                <div className="lend-content">
                  {loadingLendPage ? (
                    <div className="loading-container">
                      <div className="spinner-wrapper">
                        <img src={Pereolder} alt="Loading..." className="loading-spinner" />
                        <p>Loading products...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-header">
                          <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Price</th>
                            <th scope="col">Piece</th>
                            <th scope="col">Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="table-row">
                              <td>
                                <div className="product-image-container">
                                  <img
                                    src={product.images[0]?.url || ProductImage}
                                    alt={product.name || "Product"}
                                    className="product-image"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = ProductImage;
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="product-name">{product.name || "No name"}</td>
                              <td>{product.category_name || "No category"}</td>
                              <td className="product-price">{product.price}₸</td>
                              <td>{product.piece}</td>
                              <td>
                                <span className={`status-badge ${product.status?.toLowerCase() || 'processing'}`}>
                                  {product.status || "Processing"}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    type="button"
                                    className="btn btn-edit"
                                    onClick={() => handleEdit(product)}
                                    title="Edit"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-delete"
                                    onClick={() => handleDelete(product.id)}
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default LendPage;