import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../components/languageContext";
import emailjs from '@emailjs/browser';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const formRef = useRef(null);

  const { language } = useLanguage();

  const translations = {
    en: {
      contactMe: "Let's Talk",
      name: "Your Name",
      email: "Your Email",
      message: "Tell me about your project...",
      send: "SEND MESSAGE",
      infoTitle: "VICTOR WAMBERSIE",
      emailLabel: "EMAIL",
      githubLabel: "GITHUB",
      locationLabel: "LOCATION",
      hardSkillsLabel: "EXPERTISE",
      successMessage: "Message sent successfully! I'll get back to you soon.",
      errorMessage: "Failed to send message. Please try again or contact me directly at victor.wambersie@gmail.com",
      sending: "SENDING...",
      locationDesc: "Antibes, Cannes, Nice (France)",
      skillsDesc: "Python, FastAPI, PyTorch, LLM Integration, RAG, Fine-tuning, Agentic Systems, AI Engineering"
    },
    fr: {
      contactMe: "Discutons",
      name: "Votre Nom",
      email: "Votre Email",
      message: "Parlez-moi de votre projet...",
      send: "ENVOYER LE MESSAGE",
      successMessage: "Message envoyé avec succès ! Je vous répondrai bientôt.",
      errorMessage: "Échec de l'envoi. Veuillez réessayer ou me contacter directement à victor.wambersie@gmail.com",
      sending: "ENVOI...",
      infoTitle: "VICTOR WAMBERSIE",
      emailLabel: "EMAIL",
      githubLabel: "GITHUB",
      locationLabel: "LOCALISATION",
      hardSkillsLabel: "EXPERTISE",
      locationDesc: "Antibes, Cannes, Nice (France)",
      skillsDesc: "Python, FastAPI, PyTorch, Intégration LLM, RAG, Fine-tuning, Systèmes Agentiques, Ingénierie IA"
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const emailjsServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_34l3ggh';
      const emailjsTemplateId = process.env.REACT_APP_EMAILJS_Template_ID || 'template_srkaodk';
      const emailjsPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '9zAhBQLQtejwzEgXs';
      
      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        emailjsPublicKey
      );

      setSubmitStatus({ type: "success", message: translations[language].successMessage });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({ type: "error", message: translations[language].errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* Info Section */}
        <div className="contact-info">
          <h2 className="contact-title">{translations[language].infoTitle}</h2>
          
          <div className="contact-info__block">
            <span className="contact-info__label">{translations[language].emailLabel}</span>
            <a href="mailto:victor.wambersie@gmail.com" className="contact-info__link">
              victor.wambersie@gmail.com
            </a>
          </div>
          
          <div className="contact-info__block">
            <span className="contact-info__label">{translations[language].githubLabel}</span>
            <a href="https://github.com/bubom6755" target="_blank" rel="noopener noreferrer" className="contact-info__link">
              github.com/bubom6755
            </a>
          </div>
          
          <div className="contact-info__block">
            <span className="contact-info__label">{translations[language].locationLabel}</span>
            <span className="contact-info__text">{translations[language].locationDesc}</span>
          </div>

          <div className="contact-info__block">
            <span className="contact-info__label">{translations[language].hardSkillsLabel}</span>
            <span className="contact-info__text">{translations[language].skillsDesc}</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="contact-form">
          <h2 className="contact-title">{translations[language].contactMe}</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="form-elements">
            <div className="input-group">
              <input
                type="text"
                placeholder={translations[language].name}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="contact-input"
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder={translations[language].email}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-input"
              />
            </div>
            <div className="input-group">
              <textarea
                name="message"
                placeholder={translations[language].message}
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="contact-textarea"
              ></textarea>
            </div>
            
            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            
            <button type="submit" className="contact-btn" disabled={isSubmitting}>
              {isSubmitting ? translations[language].sending : translations[language].send}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
