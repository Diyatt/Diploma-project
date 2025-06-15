import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import './ProductEditPage.css';


function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", category: "", region: "", district: "", piece: 1,
    price: 0, quality: "", description: ""
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [imageInputs, setImageInputs] = useState([null, null, null, null]); // жаңаларын сақтау

  useEffect(() => {
  async function fetchData() {
    const [productRes, categoriesRes, regionsRes, districtsRes, qualitiesRes] = await Promise.all([
      api.get(`/products/${id}/`),
      api.get("/categories/"),
      api.get("/regions/"),
      api.get("/districts/"),
      api.get("/qualities/"),
    ]);

    const productData = productRes.data;
    const qualitiesList = qualitiesRes.data;

    // Найти quality.id по productData.quality_type
    const matchedQuality = qualitiesList.find(q => q.quality_type === productData.quality_type);

    setFormData({
      name: productData.name,
      category: productData.category,
      region: productData.region,
      district: productData.district,
      piece: productData.piece,
      price: productData.price,
      quality: matchedQuality ? matchedQuality.id : "", // вот это ключевая часть
      description: productData.description,
    });

    setImages(productData.images);
    setCategories(categoriesRes.data);
    setRegions(regionsRes.data);
    setDistricts(districtsRes.data);
    setQualities(qualitiesList);
  }

  fetchData();
}, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/product-images/${imageId}/delete/`);
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      alert("Суретті өшіру сәтсіз аяқталды.");
    }
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - images.length - newImages.length;
    if (remainingSlots <= 0) return;
    setNewImages(prev => [...prev, ...files.slice(0, remainingSlots)]);
  };

  	const handleNewImageChange = (e, index) => {
	  const file = e.target.files[0];
	  if (!file) return;

	  const updated = [...imageInputs];
	  updated[index] = file;
	  setImageInputs(updated);
	};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      	await api.put(`/products/${id}/`, data);
      	// Жаңа суреттерді жіберу
		for (const file of imageInputs) {
		  if (file) {
		    const imgData = new FormData();
		    imgData.append("product", id);
		    imgData.append("image", file);
		    await api.post("/product-images/upload/", imgData);
		  }
		}
      	alert("Өнім жаңартылды!");
      	navigate("/lend");
    } catch (error) {
      	console.error("Өңдеу қатесі:", error);
      	alert("Өнімді жаңарту сәтсіз аяқталды.");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={false} toggleSidebar={() => {}} />
      <div className="content">
        <Header toggleSidebar={() => {}} />
        <div className="main" style={{ marginTop: "60px" }}>
          	<div className="container">
	            <div className="favorites-conntent">
	              <div className="favorites-header">
	                <nav aria-label="breadcrumb mt-5">
	                  <ol className="breadcrumb">
	                    <li className="breadcrumb-item"><Link to="/lend">Lend</Link></li>
	                    <li className="breadcrumb-item active" aria-current="page">{formData.name || "..."}</li>
	                  </ol>
	                </nav>
	              </div>
	            </div>
		        <div className="container mt-4">
		          	<div
		              className="card-custom bg-white rounded p-25 product-edit-form"
		              style={{
		                borderRadius: "15px"
		              }}
		            >
			          <form onSubmit={handleSubmit} encType="multipart/form-data">

			            {/* ✅ Бар суреттер */}
			            <label className="form-label">There are pictures:</label>
			            <div className="row mb-4">
			              {images.map((img, index) => (
			                <div key={img.id} className="col text-center image-upload">
			                  <img src={img.url} alt={`Uploaded ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
			                  <button
			                    type="button"
			                    onClick={() => handleDeleteImage(img.id)}
			                    className="btn btn-sm btn-danger mt-2"
			                  >
			                    Delete
			                  </button>
			                </div>
			              ))}
			            </div>

			            {/* ✅ Жаңа суреттер (тек орын болса) */}
			            <label className="form-label">New images:</label>
						<div className="row mb-4">
						  {[0, 1, 2, 3].map((i) => (
						    <div className="col text-center image-upload" key={i}>
						      <div className="upload-placeholder">📷</div>
						      <input
						        type="file"
						        accept="image/*"
						        onChange={(e) => handleNewImageChange(e, i)}
						        className="form-control d-none"
						        id={`new-image-${i}`}
						      />
						      <label htmlFor={`new-image-${i}`} className="btn btn-link p-0">
						        Upload Image
						      </label>
						      {imageInputs[i] && (
						        <div className="small mt-1 text-success">{imageInputs[i].name}</div>
						      )}
						    </div>
						  ))}
						</div>

			            {/* ✅ Негізгі форма */}
			            <div className="row mb-3">
			              <div className="col-md-6">
			                <label className="form-label">Name</label>
			                <input
			                  type="text"
			                  name="name"
			                  className="form-control form-control-new"
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
			                    <option key={r.id} value={r.id}>{r.name}</option>
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
			                    <option key={c.id} value={c.id}>{c.category_name}</option>
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
			                    <option key={d.id} value={d.id}>{d.name}</option>
			                  ))}
			                </select>
			              </div>
			            </div>

			            <div className="row mb-3">
			              <div className="col-md-6">
			                <label className="form-label">Piece</label>
			                <input
			                  type="number"
			                  name="piece"
			                  className="form-control form-control-new"
			                  value={formData.piece}
			                  onChange={handleChange}
			                />
			              </div>
			              <div className="col-md-6">
			                <label className="form-label">Price</label>
			                <input
			                  type="number"
			                  name="price"
			                  className="form-control form-control-new"
			                  value={formData.price}
			                  onChange={handleChange}
			                />
			              </div>
			            </div>

			            <div className="row mb-3">
			              <div className="col-md-6">
			                <label className="form-label">Quality</label>
			                <select
			                  name="quality"
			                  className="form-select form-control-new"
			                  value={formData.quality}
			                  onChange={handleChange}
			                >
			                  <option value="">Select</option>
			                  {qualities.map((q) => (
			                    <option key={q.id} value={q.id}>{q.quality_type}</option>
			                  ))}
			                </select>
			              </div>
			              <div className="col-md-6">
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

			            <div className="text-center">
			              <button type="submit" className="start-btn">Save</button>
			            </div>
			          </form>
			        </div>
		        </div>
		    </div>
		</div>
      </div>
    </div>
  );
}

export default ProductEditPage;
