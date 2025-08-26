// src/components/landing/ContactFormSection/ContactFormSection.jsx
import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Optionally, clear the form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <style>{`
        /* Global Variables from your theme */
        :root {
          --color-primary: #F91C45;
          --color-primary-dark: #C60029; /* Dark Red Theme Color */
          --font-family-main: 'Cairo', sans-serif;
        }

        /* Section Styling */
        .contact-section-pure {
          padding: 80px 0;
          background-color: var(--color-primary-dark); /* Using Dark Red from theme */
          font-family: var(--font-family-main);
          position: relative;
          overflow: hidden;
        }

        /* Animated background shapes */
        .contact-section-pure::before, .contact-section-pure::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05); /* Subtle white glow */
          animation: float-anim 15s ease-in-out infinite;
          z-index: 1;
        }
        .contact-section-pure::before {
          width: 200px;
          height: 200px;
          top: 10%;
          left: -50px;
        }
        .contact-section-pure::after {
          width: 150px;
          height: 150px;
          bottom: 5%;
          right: -40px;
          animation-delay: 3s;
          animation-duration: 20s;
        }

        /* Container */
        .contact-container-pure {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        /* Header */
        .contact-header-pure {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp-anim 1s ease-out;
        }
        .contact-header-pure h2 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          color: white;
          margin-bottom: 16px;
        }
        .contact-header-pure p {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Grid Layout */
        .contact-grid-pure {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
        }
        .contact-info-pure, .contact-form-wrapper-pure {
          flex: 1;
          min-width: 300px;
        }

        /* Info Side */
        .contact-info-pure {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeInUp-anim 1s ease-out 0.2s;
          animation-fill-mode: both;
        }
        .info-card-pure {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        .info-card-pure:hover {
          transform: translateY(-5px);
          background-color: rgba(0, 0, 0, 0.3);
        }
        .info-card-pure .icon {
          color: var(--color-primary);
        }
        .info-card-pure h3 {
          color: white;
          font-size: 1.1rem;
          margin: 0 0 4px 0;
        }
        .info-card-pure p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 1rem;
          word-break: break-all;
        }

        /* Form Side */
        .contact-form-wrapper-pure {
          animation: fadeInUp-anim 1s ease-out 0.4s;
          animation-fill-mode: both;
        }
        .contact-form-pure {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .form-input-pure, .form-textarea-pure {
          width: 100%;
          box-sizing: border-box; /* Important for padding and border */
          padding: 20px 16px;
          font-size: 1rem;
          font-family: var(--font-family-main);
          color: white;
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-input-pure::placeholder, .form-textarea-pure::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .form-input-pure:focus, .form-textarea-pure:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(249, 28, 69, 0.5);
        }
        .form-textarea-pure {
          resize: vertical;
          min-height: 150px;
        }

        /* Submit Button */
        .submit-btn-pure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 18px;
          font-size: 1.1rem;
          font-weight: bold;
          font-family: var(--font-family-main);
          color: white;
          background-color: var(--color-primary);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .submit-btn-pure:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(249, 28, 69, 0.3);
        }
        .submit-btn-pure::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
          animation: backgroundShine-anim 3s linear infinite;
        }

        /* Animations */
        @keyframes fadeInUp-anim {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-anim {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0px); }
        }
        @keyframes backgroundShine-anim {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .contact-grid-pure { flex-direction: column; }
        }
      `}</style>
      <section id="contact" className="contact-section-pure">
        <div className="contact-container-pure">
          <header className="contact-header-pure">
            <h2>تواصل معنا</h2>
            <p>هل لديك أي أسئلة أو استفسارات؟ فريقنا جاهز لمساعدتك في أي وقت.</p>
          </header>

          <div className="contact-grid-pure">
            <div className="contact-info-pure">
              <div className="info-card-pure">
                <EmailIcon className="icon" style={{ fontSize: 32 }} />
                <div>
                  <h3>البريد الإلكتروني</h3>
                  <p>contact@pulsacademy.com</p>
                </div>
              </div>
              <div className="info-card-pure">
                <WhatsAppIcon className="icon" style={{ fontSize: 32 }} />
                <div>
                  <h3>واتساب</h3>
                  <p>+20 100 123 4567</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper-pure">
              <form onSubmit={handleSubmit} className="contact-form-pure">
                <input
                  type="text"
                  name="name"
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input-pure"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input-pure"
                />
                <textarea
                  name="message"
                  placeholder="رسالتك"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-textarea-pure"
                ></textarea>
                <button type="submit" className="submit-btn-pure">
                  <span>إرسال الرسالة</span>
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactFormSection;
