import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SphereAnimation from "../components/SphereParticles";
import "../styles/font.css";
import { Link } from "react-router-dom";
import ScrollButton from "../components/ScrollButton";
import Products from "../components/Products";
import Contact from "../components/contact";
import { useLanguage } from "../components/languageContext"; // Importation du contexte

function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactRef = useRef(null);
  const { language, setLanguage } = useLanguage(); // Utilisation du contexte

  const translations = {
    en: {
      works: "WORKS",
      chatbot: "CHATBOT",
      contact: "CONTACT",
      designer: "AI -",
      developer: "BACKEND DEVELOPER",
      intro:
        "I AM A BACKEND & AI DEVELOPER BASED IN SOPHIA ANTIPOLIS. I SPECIALIZE IN BUILDING INTELLIGENT SYSTEMS WITH LLM INTEGRATION, RAG ARCHITECTURES, FINE-TUNING, AND AGENTIC SYSTEMS. I HAVE EXPERIENCE WITH PYTHON, FASTAPI, STREAMLIT, OLLAMA, OPENAI, TORCH, FAISS, AND PROMPT ENGINEERING. I DESIGN SCALABLE BACKEND ARCHITECTURES AND CREATE AI-DRIVEN SOLUTIONS.",
      contactMe: "CONTACT ME",

    },
    fr: {
      works: "TRAVAUX",
      chatbot: "CHATBOT",
      contact: "CONTACT",
      designer: "IA -",
      developer: "DÉVELOPPEUR BACKEND",
      intro:
        "JE SUIS DÉVELOPPEUR BACKEND & IA BASÉ À SOPHIA ANTIPOLIS. JE ME SPÉCIALISE DANS LA CRÉATION DE SYSTÈMES INTELLIGENTS AVEC INTÉGRATION LLM, ARCHITECTURES RAG, FINE-TUNING ET SYSTÈMES AGENTIQUES. J'AI DE L'EXPÉRIENCE AVEC PYTHON, FASTAPI, STREAMLIT, OLLAMA, OPENAI, TORCH, FAISS ET LE PROMPT ENGINEERING. JE CONÇOIS DES ARCHITECTURES BACKEND ÉVOLUTIVES ET CRÉE DES SOLUTIONS PILOTÉES PAR L'IA.",
      contactMe: "ME CONTACTER",

    },
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HomeContainer
      onMouseMove={handleMouseMove}
      style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` }}
    >
      <Header className={isScrolled ? "scrolled" : ""}>
        <LeftHeader>
          <h1>Victor Wambersie</h1>
          <span>Backend/AI, DEVELOPER</span>
        </LeftHeader>
        <MidHeader>
          <nav>
            <ul>
              <li>
                <Link to="/works">{translations[language].works}</Link>
              </li>
              <li>
                <Link to="/chatbotpage">{translations[language].chatbot}</Link>
              </li>
              <li onClick={scrollToContact}>
                <a>{translations[language].contact}</a>
              </li>
            </ul>
          </nav>
        </MidHeader>
        <RightHeader>
          <nav>
            <ul>
              <li onClick={() => setLanguage("fr")}>
                <a>FRANCAIS</a>
              </li>
              <li onClick={() => setLanguage("en")}>
                <a>ENGLISH</a>
              </li>
            </ul>
          </nav>
        </RightHeader>
        
        {/* Menu burger pour mobile */}
        <MobileMenuButton active={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </Header>

      {/* Menu mobile */}
      <MobileMenu className={isMobileMenuOpen ? "open" : ""}>
        <nav>
          <ul>
            <li>
              <Link to="/works" onClick={() => setIsMobileMenuOpen(false)}>{translations[language].works}</Link>
            </li>
            <li>
              <Link to="/chatbotpage" onClick={() => setIsMobileMenuOpen(false)}>{translations[language].chatbot}</Link>
            </li>
            <li onClick={() => { scrollToContact(); setIsMobileMenuOpen(false); }}>
              <a>{translations[language].contact}</a>
            </li>
            <li className="language-toggle">
              <button onClick={() => setLanguage("fr")}>FRANÇAIS</button>
              <button onClick={() => setLanguage("en")}>ENGLISH</button>
            </li>
          </ul>
        </nav>
      </MobileMenu>

      <MainContent>
        <LeftSection>
          <BigTitle>
            <div>
              <h2>{translations[language].designer}</h2>
            </div>
            <h2>{translations[language].developer}</h2>
          </BigTitle>
          <a>{translations[language].info}</a>
        </LeftSection>
        <CenterSection>
          <SphereAnimation />
        </CenterSection>
        <RightSection>
          <RightSectionP>
            <p>{translations[language].intro}</p>
            <ContactButton onClick={scrollToContact}>
              {translations[language].contactMe}
            </ContactButton>
          </RightSectionP>
          <ScrollButton />
        </RightSection>
      </MainContent>
      <MainContent3>
        <Products language={language} />
      </MainContent3>
      <div ref={contactRef}>
        <Contact />
      </div>
    </HomeContainer>
  );
}
export default Home;

export const HomeContainer = styled.div`
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  font-family: "LEMONMILK-Light", Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

/* HEADER */
export const Header = styled.header`
  position: sticky; /* Reste collé en haut */
  top: 0;
  z-index: 999; /* Toujours au-dessus du contenu */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0); /* Transparent par défaut */
  backdrop-filter: blur(0px); /* Pas de flou par défaut */
  border-bottom: 1px solid transparent; /* Invisible par défaut */
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease,
    border-bottom 0.3s ease;

  /* Appliquer les styles lorsque la page est scrollée */
  &.scrolled {
    background-color: rgba(255, 255, 255, 0.2); /* Blanc semi-transparent */
    backdrop-filter: blur(5px); /* Ajoute un léger flou */
    border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* Bordure visible */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Légère ombre pour le grain */
  }

  /* --- MEDIA QUERIES pour tablette et mobile --- */
  @media (max-width: 900px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 1rem;
  }

  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

export const LeftHeader = styled.div`
  h1 {
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  span {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  @media (max-width: 900px) {
    margin-bottom: 0;
    
    h1 {
      font-size: 0.9rem;
      letter-spacing: 1px;
      margin-bottom: 0;
    }
    
    span {
      font-size: 0.7rem;
      letter-spacing: 0.5px;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 0.85rem;
    }
    
    span {
      font-size: 0.65rem;
    }
  }
`;
export const MidHeader = styled.div`
  ul {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;

    li {
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 1px;

      a {
        color: white; /* Couleur par défaut du texte */
        text-decoration: none; /* Pas de soulignement */
        transition: color 0.2s ease;

        &:hover {
          text-decoration: underline;
        }

        &:visited,
        &:active {
          color: white;
        }
      }
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;
export const RightHeader = styled.div`
  ul {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;

    li {
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 1px;

      a {
        color: white; /* Couleur par défaut du texte */
        text-decoration: none; /* Pas de soulignement */
        transition: color 0.2s ease;

        &:hover {
          text-decoration: underline;
        }

        &:visited,
        &:active {
          color: white;
        }
      }
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

/* ----------------------- */
/*  MAIN CONTENT  (3 colonnes) */
/* ----------------------- */
export const MainContent = styled.main`
  flex: 1;
  display: grid;
  grid-template-columns: 0.8fr 1.8fr 0.8fr; /* 3 colonnes */
  column-gap: 2rem;
  padding: 2rem 3rem;
  margin-bottom: 200px;

  /* --- MEDIA QUERIES pour tablette moyenne (max-width: 992px) --- */
  @media (max-width: 992px) {
    /* Passe en 2 colonnes : gauche + (centre+droite) */
    grid-template-columns: 1fr 1fr;
    row-gap: 2rem;
    margin-bottom: 100px;
  }

  /* --- MEDIA QUERIES pour petite tablette (max-width: 768px) --- */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2rem 1.5rem;
    row-gap: 2rem;
    margin-bottom: 100px;
  }

  /* --- MOBILE (max-width: 600px) : une seule colonne --- */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    margin-bottom: 80px;
  }
`;

export const MainContent2 = styled.main`
  flex: 1;
  display: flex;
  padding: 2rem 3rem;
  margin-bottom: 200px;

  /* --- MOBILE (max-width: 600px) : stack en colonne --- */
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 80px;
  }
`;
export const MainContent3 = styled.main`
  flex: 1;
  display: grid;
  flex-direction: row-reverse;
  padding: 2rem 3rem;
  margin-bottom: 200px;

  @media (max-width: 600px) {
    diplay: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    margin-bottom: 80px;
  }
`;

/* SECTION GAUCHE (GROS TEXTE) */
export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 90vh;
  padding-bottom: 2rem;

  /* Sur tablette, la hauteur auto pour éviter tout débordement */
  @media (max-width: 992px) {
    min-height: auto;
  }

  /* Sur mobile, on aligne plutôt en haut */
  @media (max-width: 600px) {
    text-align: center;
  }
`;

export const BigTitle = styled.div`
  font-family: "Tusker Grotesk", sans-serif;
  text-transform: uppercase;

  h2 {
    font-size: 14rem;
    font-weight: 700;
    line-height: 0.98;
    margin: 0;
    letter-spacing: 0.5rem;
  }

  div h2 {
    margin-bottom: 0.1em;
  }

  /* -- Sur grande tablette -- */
  @media (max-width: 1200px) {
    h2 {
      font-size: 10rem;
      letter-spacing: 0.4rem;
    }
  }

  /* -- Sur tablette -- */
  @media (max-width: 992px) {
    h2 {
      font-size: 8rem; /* Réduit le texte massif */
      letter-spacing: 0.3rem;
    }
  }

  /* -- Sur petite tablette -- */
  @media (max-width: 768px) {
    h2 {
      font-size: 6rem;
      letter-spacing: 0.25rem;
    }
  }

  /* -- Sur mobile -- */
  @media (max-width: 600px) {
    h2 {
      font-size: 4rem; /* Encore plus réduit */
      letter-spacing: 0.2rem;
      align-items: center;
    }
  }
`;

/* SmallText (creative) */
export const SmallText = styled.span`
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  font-size: 1.8rem;
  color: #ccc;
  margin-bottom: 1rem;

  /* -- Sur tablette -- */
  @media (max-width: 992px) {
    font-size: 1.4rem;
  }

  /* -- Sur mobile -- */
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

/* SECTION MILIEU (LOSANGE / SPHERE ANIMATION) */
export const CenterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* SECTION DROITE (TEXTE + BOUTON) */
export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  max-width: 400px;
  height: 83vh;

  p {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    text-align: justify;
  }

  /* -- Sur tablette -- */
  @media (max-width: 992px) {
    max-width: 100%;
    align-items: flex-start;
    height: auto;
  }

  /* -- Sur mobile -- */
  @media (max-width: 600px) {
    align-items: flex-start;
    height: auto;
  }
`;
export const RightSectionP = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width: 600px) {
    align-items: center;
  }
`;
export const ContactButton = styled.button`
  background-color: white;
  color: black;
  border: 1px solid #fff;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background-color: black;
    color: white;
  }
`;

/* Menu burger pour mobile */
export const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  z-index: 1000;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px) {
    display: flex;
  }

  span {
    width: 25px;
    height: 2px;
    background-color: #fff;
    margin: 3px 0;
    transition: all 0.3s ease;

    &:nth-child(1) {
      transform: ${props => props.active ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }
    &:nth-child(2) {
      opacity: ${props => props.active ? '0' : '1'};
    }
    &:nth-child(3) {
      transform: ${props => props.active ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
    }
  }
`;

/* Menu mobile */
export const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 998;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  &.open {
    transform: translateX(0);
  }

  @media (max-width: 900px) {
    display: block;
  }

  nav {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    text-align: center;
  }

  li {
    margin: 2rem 0;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;

    a {
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        text-decoration: underline;
        opacity: 0.8;
      }
    }

    &.language-toggle {
      margin-top: 3rem;
      display: flex;
      justify-content: center;
      gap: 1rem;

      button {
        background: transparent;
        border: 1px solid white;
        color: white;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: white;
          color: black;
        }
      }
    }
  }
`;
