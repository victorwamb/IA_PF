import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../components/languageContext"; // Importation du contexte
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const formRef = useRef(null);

  const { language } = useLanguage(); // Utilisation du contexte

  const translations = {
    en: {
      contactMe: "Contact Me",
      name: "Name",
      email: "Email",
      message: "Your message",
      send: "SEND",
      infoTitle: "Victor Wambersie",
      emailLabel: "Email:",
      githubLabel: "GitHub:",
      locationLabel: "Location:",
      hardSkillsLabel: "Hard Skills:",
      passionsLabel: "Passions:",
      passionsLabel2: " Artificial Intelligence, Rally and drawing",
      hobbiesLabel: "Hobbies:",
      hobbiesLabel2: "Basketball, video games and drawing",
      futureProjectsLabel: "Future Projects:",
      futureProjectsLabel2: "Advanced agentic AI systems",
      successMessage: "Message sent successfully! I'll get back to you soon.",
      errorMessage: "Failed to send message. Please try again or contact me directly at victor.wambersie@gmail.com",
      sending: "Sending...",
    },
    fr: {
      contactMe: "Me Contacter",
      name: "Nom",
      email: "Email",
      message: "Votre message",
      send: "ENVOYER",
      successMessage: "Message envoyé avec succès ! Je vous répondrai bientôt.",
      errorMessage: "Échec de l'envoi. Veuillez réessayer ou me contacter directement à victor.wambersie@gmail.com",
      sending: "Envoi...",
      infoTitle: "Victor Wambersie",
      emailLabel: "Email :",
      githubLabel: "GitHub :",
      locationLabel: "Localisation :",
      hardSkillsLabel: "Compétences Techniques :",
      passionsLabel: "Passions :",
      passionsLabel2: " Intelligence Artificielle, Rallye et dessin",
      hobbiesLabel: "Loisirs :",
      hobbiesLabel2: "Basket, jeux vidéos et dessin",
      futureProjectsLabel: "Projets Futurs :",
      futureProjectsLabel2: "Systèmes IA agentiques avancés",
    },
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    // Gestion du resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      // Envoi via EmailJS avec credentials depuis variables d'environnement
      const emailjsServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_34l3ggh';
      const emailjsTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_srkaodk';
      const emailjsPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '9zAhBQLQtejwzEgXs';
      
      const result = await emailjs.send(
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
      setFormData({ name: "", email: "", message: "" }); // Reset le formulaire
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({ type: "error", message: translations[language].errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMobile = windowWidth <= 768;

  return (
    <div className={isMobile ? "contact-mobile" : ""} style={{ ...styles.container, flexDirection: isMobile ? "column" : "row" }}>
      {/* Formulaire de contact */}
      <div className={isMobile ? "contact-form-mobile" : ""} style={{ ...styles.contactForm, borderRight: isMobile ? "none" : "1px solid white"}}>
        <h2 style={styles.title}>{translations[language].contactMe}</h2>
        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder={translations[language].name}
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder={translations[language].email}
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="message"
            placeholder={translations[language].message}
            value={formData.message}
            onChange={handleChange}
            rows="5"
            style={styles.textarea}
            required
          ></textarea>
          
          {submitStatus.message && (
            <div style={{
              padding: "10px",
              backgroundColor: submitStatus.type === "success" ? "rgba(0, 200, 0, 0.2)" : "rgba(200, 0, 0, 0.2)",
              border: `1px solid ${submitStatus.type === "success" ? "#00c800" : "#c80000"}`,
              borderRadius: "4px",
              color: submitStatus.type === "success" ? "#00ff00" : "#ff0000",
              fontSize: "14px"
            }}>
              {submitStatus.message}
            </div>
          )}
          
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? translations[language].sending : translations[language].send}
          </button>
        </form>
      </div>

      {/* Informations */}
      <div style={styles.infoSection}>
        <h2 style={styles.title}>{translations[language].infoTitle}</h2>
        <p style={styles.text}>
          <strong style={{ color: "#686aff" }}>{translations[language].emailLabel}</strong>{" "}
          <a href="mailto: victor.wambersie@gmail.com" style={{ color: "#fff", textDecoration: "none" }}>
            victor.wambersie@gmail.com
          </a>
        </p>
        <p style={styles.text}>
          <strong style={{ color: "#686aff" }}>{translations[language].githubLabel}</strong>{" "}
          <a
            href="https://github.com/bubom6755"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            github.com/bubom6755
          </a>
        </p>
        <p style={styles.text}>
          <strong>{translations[language].locationLabel}</strong> Antibes, Cannes, Nice (France)
        </p>
        <p style={styles.text}>
          <strong style={{ color: "#686aff" }}>{translations[language].hardSkillsLabel}</strong> Python, FastAPI, Streamlit, PyTorch, Ollama, OpenAI API, LLM Integration, RAG, Fine-tuning, FAISS, Agentic Systems, Prompt Engineering
        </p>
        <p style={styles.text}>
          <strong>{translations[language].passionsLabel}</strong>{translations[language].passionsLabel2}
        </p>
        <p style={styles.text}>
          <strong>{translations[language].hobbiesLabel}</strong> {translations[language].hobbiesLabel2}
        </p>
        <p style={styles.text}>
          <strong>{translations[language].futureProjectsLabel}</strong> {translations[language].futureProjectsLabel2}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // Par défaut en ligne (row)
    backgroundColor: "#000",
    color: "#fff",
    padding: "20px",
    border: "1px solid #fff",
    maxWidth: "1500px",
    margin: "auto",
    gap: "20px",
  },
  contactForm: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRight: "1px solid #fff",
  },
  infoSection: {
    flex: 1,
    padding: "20px",
  },
  title: {
    fontFamily: "LEMONMILK-Light, sans-serif",
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    fontFamily: "LEMONMILK-Light, sans-serif",
    fontSize: "16px",
    padding: "10px",
    border: "1px solid #fff",
    backgroundColor: "#000",
    color: "#fff",
  },
  textarea: {
    fontFamily: "LEMONMILK-Light, sans-serif",
    fontSize: "16px",
    padding: "15px",
    height: "200px",
    border: "1px solid #fff",
    backgroundColor: "#000",
    color: "#fff",
  },
  button: {
    fontFamily: "LEMONMILK-Light, sans-serif",
    fontSize: "16px",
    padding: "10px",
    border: "1px solid #fff",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  text: {
    fontFamily: "LEMONMILK-Light, sans-serif",
    fontSize: "16px",
    lineHeight: "2.5",
    margin: "10px 0",
  },
  link: {
    color: "#fff",
    textDecoration: "underline",
    transition: "opacity 0.3s",
  },

    "@media (max-width: 600px)": {
      flexDirection: "column", // Passe en colonne sur mobile
      gap: "15px", // Espace ajusté pour les petits écrans
      padding: "10px", // Réduit le padding pour mobile
    },
  
};

export default Contact;
