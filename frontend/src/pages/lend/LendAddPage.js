import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link, useNavigate } from 'react-router-dom';

function LendAddPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    region: "",
    district: "",
    piece: 1,
    price: 0,
    quality: "",
    description: ""
  });

  const [imageInputs, setImageInputs] = useState([null, null, null, null]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualities, setQualities] = useState([]);

  useEffect(() => {
    api.get("/categories/").then(res => setCategories(res.data));
    api.get("/regions/").then(res => setRegions(res.data));
    api.get("/districts/").then(res => setDistricts(res.data));
    api.get("/qualities/").then(res => setQualities(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageInputChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedInputs = [...imageInputs];
    updatedInputs[index] = file;
    setImageInputs(updatedInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!formData.name || !formData.category || !formData.region || !formData.district || !formData.quality || !formData.description) {
      alert("Барлық өрістерді толтырыңыз.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        data.append(key, value);
      }
    });

    imageInputs.forEach((file) => {
      if (file) {
        data.append("images", file);
      }
    });

    // Логирование
    console.log("FormData being sent:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await api.post("/products/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Өнім сәтті қосылды!");
      navigate("/lend");
    } catch (error) {
      console.error("Жүктеу қатесі:", error);
      alert("Өнімді қосу сәтсіз аяқталды.");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <div className="favorites-conntent">
              <div className="favorites-header">
                <nav aria-label="breadcrumb mt-5">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/lend">Lend</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add</li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="card-custom bg-white rounded p-25" style={{ borderRadius: "15px", padding: "45px 180px" }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div className="col text-center image-upload" key={i}>
                      <div className="upload-placeholder">📷</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageInputChange(e, i)}
                        className="form-control d-none"
                        id={`image-upload-${i}`}
                      />
                      <label htmlFor={`image-upload-${i}`} className="btn btn-link p-0">
                        Upload Image
                      </label>
                      {imageInputs[i] && (
                        <div className="small mt-1 text-success">{imageInputs[i].name}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-new"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Region</label>
                    <select
                      name="region"
                      className="form-select form-control-new"
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-select form-control-new"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District</label>
                    <select
                      name="district"
                      className="form-select form-control-new"
                      value={formData.district}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Piece</label>
                      <input
                        type="number"
                        name="piece"
                        className="form-control form-control-new"
                        value={formData.piece}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-new"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quality</label>
                      <select
                        name="quality"
                        className="form-select form-control-new"
                        value={formData.quality}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {qualities.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.quality_type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control form-control-new"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="start-btn">
                    Save Product
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LendAddPage;
