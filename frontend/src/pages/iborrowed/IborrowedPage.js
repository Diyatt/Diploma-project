import React from "react";
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const steps = [
  {
    title: "Browse Categories",
    description: "Explore our diverse categories from Electronics to Event Supplies. Find exactly what you need with our intuitive search.",
    icon: "🔍",
    color: "#4880FF",
    gradient: "linear-gradient(135deg, #4880FF 0%, #3563E9 100%)",
    delay: 0.1
  },
  {
    title: "Choose Items",
    description: "Browse through carefully curated items, read reviews, and compare options to make the best choice for your needs.",
    icon: "✨",
    color: "#FF8743",
    gradient: "linear-gradient(135deg, #FF8743 0%, #FF6B2B 100%)",
    delay: 0.2
  },
  {
    title: "Request Rental",
    description: "Submit your rental request with preferred dates. Our secure system ensures smooth communication with item owners.",
    icon: "📝",
    color: "#4CAF50",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
    delay: 0.3
  },
  {
    title: "Enjoy & Return",
    description: "Use your rented item worry-free. Our platform ensures safe returns and handles any issues that may arise.",
    icon: "🔄",
    color: "#9C27B0",
    gradient: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
    delay: 0.4
  }
];

const benefits = [
  {
    title: "Secure Payments",
    description: "All transactions are protected with industry-standard encryption",
    icon: "🔒",
    color: "#4880FF",
    delay: 0.1
  },
  {
    title: "24/7 Support",
    description: "Our dedicated team is always here to help you",
    icon: "💬",
    color: "#FF8743",
    delay: 0.2
  },
  {
    title: "Verified Users",
    description: "Every user is verified for your peace of mind",
    icon: "✓",
    color: "#4CAF50",
    delay: 0.3
  }
];

function IborrowedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
                    <Link
                        to="/home/"
                        className="iborrowed-tab-btn"
                      >
                        Borrow
                      </Link>
                      <Link
                        to="/lend/"
                        className="iborrowed-tab-btn"
                      >
                        Lend
                      </Link>
                    </div>
                  </motion.div>

                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
                    {steps.map((step, idx) => (
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

                  <div className="benefits-section py-5 bg-light rounded-4 mb-5">
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                      {benefits.map((benefit, idx) => (
                        <motion.div 
                          className="col" 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: benefit.delay, duration: 0.5 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <div 
                            className="benefit-card text-center p-4"
                            style={{
                              background: `linear-gradient(135deg, ${benefit.color}15 0%, ${benefit.color}08 100%)`,
                              border: `1px solid ${benefit.color}20`,
                              boxShadow: `0 4px 16px ${benefit.color}15`
                            }}
                          >
                            <motion.span 
                              className="benefit-icon mb-3 d-inline-block" 
                              style={{ 
                                fontSize: '2.5rem',
                                color: benefit.color,
                                transform: 'rotate(-10deg)',
                                transition: 'transform 0.3s ease'
                              }}
                              whileHover={{ rotate: 0, scale: 1.2 }}
                            >
                              {benefit.icon}
                            </motion.span>
                            <h5 className="mb-2 fw-bold" style={{ color: benefit.color }}>{benefit.title}</h5>
                            <p className="text-muted mb-0">{benefit.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
                      <Link to="/home" className="btn btn-primary btn-lg start-btn">
                        <i className="fas fa-rocket me-2"></i>
                        Get Started Now
                      </Link>
                    </motion.div>
                    <motion.p 
                      className="text-muted mt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Join thousands of satisfied users who trust Arent for their rental needs
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