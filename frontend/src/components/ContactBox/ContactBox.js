import { useState } from "react";
import { FaPhone, FaCopy, FaCheck, FaEnvelope } from "react-icons/fa";
import "./ContactBox.css";

function ContactBox({ product, handleStartChat }) {
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (product.owner_phone) {
      navigator.clipboard.writeText(product.owner_phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="contact-box text-center flex-fill d-flex flex-column align-items-center p-4 rounded shadow-sm w-100">
      <h4 className="fw-bold mb-4 contact-title">Contact Information</h4>
      {product?.owner ? (
        <div className="contact-content">
          <button
            className="btn btn-primary contact-btn message-btn mb-3 w-100"
            onClick={async () => {
              setIsOpeningChat(true);
              try {
                const ownerId =
                  typeof product.owner === "object"
                    ? product.owner.id
                    : product.owner;
                await handleStartChat(ownerId);
              } finally {
                setIsOpeningChat(false);
              }
            }}
            disabled={isOpeningChat}
          >
            <FaEnvelope className="me-2" />
            {isOpeningChat ? "Opening Chat..." : "Send Message"}
          </button>

          <div className="phone-section">
            <button
              className="btn btn-outline-primary contact-btn phone-btn w-100 mb-2"
              onClick={() => setShowPhone(true)}
            >
              <FaPhone className="me-2" />
              {showPhone
                ? product.owner_phone || "Phone number unavailable"
                : "Show Phone Number"}
            </button>

            {showPhone && product.owner_phone && (
              <button
                className={`btn contact-btn copy-btn w-100 ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <FaCheck className="me-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="me-2" />
                    Copy Number
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="no-owner-message">
          <p className="text-muted">Contact information is not available</p>
        </div>
      )}
    </div>
  );
}

export default ContactBox; 