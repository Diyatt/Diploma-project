import React from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const borrowSteps = [
  {
    title: "Select Category",
    description: "Go to the homepage and select the category you're interested in: Electronics, Cars, Event Supplies, etc.",
    icon: "📱",
    color: "#4880FF",
    gradient: "linear-gradient(135deg, #4880FF 0%, #3563E9 100%)",
    delay: 0.1
  },
  {
    title: "Use Filters",
    description: "Use filters to narrow your search. You can filter by location, newest listings, or price (low to high / high to low).",
    icon: "🔍",
    color: "#FF8743",
    gradient: "linear-gradient(135deg, #FF8743 0%, #FF6B2B 100%)",
    delay: 0.2
  },
  {
    title: "Choose Item",
    description: "Browse the list and choose an item that suits your needs. You can call the owner or send them a message through their profile.",
    icon: "💬",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
    delay: 0.3
  },
  {
    title: "Discuss Details",
    description: "Discuss the rental details directly with the owner: price, rental duration, and delivery/pickup method. Done!",
    icon: "🤝",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
    delay: 0.4
  }
];

const lendSteps = [
  {
    title: "Create Account",
    description: "Create a new account if you're a first-time user — it only takes a minute! If you already have an account, simply log in.",
    icon: "👤",
    color: "#4880FF",
    gradient: "linear-gradient(135deg, #4880FF 0%, #3563E9 100%)",
    delay: 0.1
  },
  {
    title: "Add Item",
    description: "Click 'Add Item,' choose a category, and provide full details: name, description, price, and quantity.",
    icon: "➕",
    color: "#FF8743",
    gradient: "linear-gradient(135deg, #FF8743 0%, #FF6B2B 100%)",
    delay: 0.2
  },
  {
    title: "Publish",
    description: "Once you fill out the form, click 'Publish.' Your item will be marked as 'In Process' and sent for admin approval.",
    icon: "📤",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
    delay: 0.3
  },
  {
    title: "Get Approved",
    description: "After the admin reviews and approves your item by clicking 'Approve,' it will be live on the site — ready to be rented out!",
    icon: "✅",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
    delay: 0.4
  }
];

function IborrowedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('borrow');

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
      <div className={`content ${isSidebarOpen ? "collapsed" : ""}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main" style={{ marginTop: "60px" }}>
          <div className="container">
            <motion.div 
              className="Iborrowed-conntent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="card py-5">
                <div className="card-body">
                  <motion.div 
                    className="text-center mb-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="iborrowed-title">
                      How does <span className="brand-name">Arent</span> work?
                    </h2>
                    <p className="text-muted mb-4">Your trusted platform for hassle-free rentals</p>
                    <div className="iborrowed-tabs d-flex justify-content-center mb-4">
                      <button
                        onClick={() => setActiveTab('borrow')}
                        className={`iborrowed-tab-btn ${activeTab === 'borrow' ? 'active' : ''}`}
                        style={{
                          padding: '10px 25px',
                          margin: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1.1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: activeTab === 'borrow' ? '#4880FF' : '#f8f9fa',
                          color: activeTab === 'borrow' ? 'white' : '#6c757d',
                          boxShadow: activeTab === 'borrow' ? '0 4px 12px rgba(72, 128, 255, 0.3)' : 'none'
                        }}
                      >
                        Borrow
                      </button>
                      <button
                        onClick={() => setActiveTab('lend')}
                        className={`iborrowed-tab-btn ${activeTab === 'lend' ? 'active' : ''}`}
                        style={{
                          padding: '10px 25px',
                          margin: '0 10px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1.1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: activeTab === 'lend' ? '#4880FF' : '#f8f9fa',
                          color: activeTab === 'lend' ? 'white' : '#6c757d',
                          boxShadow: activeTab === 'lend' ? '0 4px 12px rgba(72, 128, 255, 0.3)' : 'none'
                        }}
                      >
                        Lend
                      </button>
                    </div>
                  </motion.div>

                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                    {(activeTab === 'lend' ? lendSteps : borrowSteps).map((step, idx) => (
                      <motion.div 
                        className="col" 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: step.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                      >
                        <div className="step-card h-100 text-center">
                          <div 
                            className="step-icon mb-4 d-flex justify-content-center align-items-center"
                            style={{ 
                              background: step.gradient,
                              boxShadow: `0 8px 24px ${step.color}33`
                            }}
                          >
                            <motion.span 
                              style={{ fontSize: '2rem', color: '#fff' }}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {step.icon}
                            </motion.span>
                          </div>
                          <h5 className="mb-3 fw-bold" style={{ color: step.color }}>{step.title}</h5>
                          <p className="text-muted mb-0">{step.description}</p>
                          <motion.div 
                            className="step-number mt-3" 
                            style={{ color: step.color }}
                            whileHover={{ scale: 1.1 }}
                          >
                            Step {idx + 1}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  

                  <motion.div 
                    className="text-center mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(72, 128, 255, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link 
                        to={activeTab === 'lend' ? "/lend/" : "/home"} 
                        className="btn btn-primary btn-lg start-btn"
                      >
                        <i className="fas fa-rocket me-2"></i>
                        {activeTab === 'lend' ? 'Start Lending Now' : 'Get Started Now'}
                      </Link>
                    </motion.div>
                    <motion.p 
                      className="text-muted mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {activeTab === 'lend' 
                        ? 'Join our community of trusted lenders and start earning today'
                        : 'Join thousands of satisfied users who trust Arent for their rental needs'}
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IborrowedPage;