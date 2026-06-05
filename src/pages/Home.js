import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleBackground from '../components/SphereParticles';
import ScrollButton from '../components/ScrollButton';
import FeaturedProjects from '../components/FeaturedProjects';
import Services from '../components/Services';
import Contact from '../components/contact';
import SmoothScroll from '../components/SmoothScroll';
import { useLanguage } from '../components/languageContext';
import { useScrollStore } from '../stores/scrollStore';
import '../styles/font.css';

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactRef = useRef(null);
  const heroRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { language, setLanguage } = useLanguage();
  const setProgress = useScrollStore((state) => state.setProgress);

  const translations = {
    en: {
      works: 'WORKS',
      chatbot: 'CHATBOT',
      contact: 'CONTACT',
      role1: 'AI —',
      role2: 'BACKEND',
      role3: 'DEVELOPER',
      intro:
        'I specialize in building intelligent systems with LLM integration, RAG architectures, fine-tuning, and agentic systems. I design scalable backend architectures and create AI-driven solutions.',
      contactMe: 'CONTACT ME',
      scroll: 'Scroll to explore',
    },
    fr: {
      works: 'TRAVAUX',
      chatbot: 'CHATBOT',
      contact: 'CONTACT',
      role1: 'IA —',
      role2: 'DÉVELOPPEUR',
      role3: 'BACKEND',
      intro:
        'Je me spécialise dans la création de systèmes intelligents avec intégration LLM, architectures RAG, fine-tuning et systèmes agentiques. Je conçois des architectures backend évolutives et des solutions pilotées par l\'IA.',
      contactMe: 'ME CONTACTER',
      scroll: 'Scrollez pour explorer',
    },
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP ScrollTrigger → particle morph progress
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Map overall page scroll to particle progress (0 → 1)
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      // Hero text animation
      if (heroRef.current) {
        const titles = heroRef.current.querySelectorAll('.hero-title-line');
        gsap.fromTo(
          titles,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.3,
          }
        );

        const introEl = heroRef.current.querySelector('.hero-intro');
        if (introEl) {
          gsap.fromTo(
            introEl,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
          );
        }
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Header scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <HomeContainer ref={scrollContainerRef}>
        {/* Fixed particle background */}
        <ParticleBackground />

        {/* Header */}
        <Header className={isScrolled ? 'scrolled' : ''}>
          <LeftHeader>
            <h1>Victor Wambersie</h1>
            <span>Backend/AI Developer</span>
          </LeftHeader>
          <MidHeader>
            <nav>
              <ul>
                <li>
                  <Link to="/works">{translations[language].works}</Link>
                </li>
                <li>
                  <Link to="/chatbotpage">
                    {translations[language].chatbot}
                  </Link>
                </li>
                <li onClick={scrollToContact}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>{translations[language].contact}</a>
                </li>
              </ul>
            </nav>
          </MidHeader>
          <RightHeader>
            <nav>
              <ul>
                <li onClick={() => setLanguage('fr')}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>FRANÇAIS</a>
                </li>
                <li onClick={() => setLanguage('en')}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>ENGLISH</a>
                </li>
              </ul>
            </nav>
          </RightHeader>

          <MobileMenuButton
            active={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </MobileMenuButton>
        </Header>

        {/* Mobile Menu */}
        <MobileMenu className={isMobileMenuOpen ? 'open' : ''}>
          <nav>
            <ul>
              <li>
                <Link
                  to="/works"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].works}
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbotpage"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {translations[language].chatbot}
                </Link>
              </li>
              <li
                onClick={() => {
                  scrollToContact();
                  setIsMobileMenuOpen(false);
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{translations[language].contact}</a>
              </li>
              <li className="language-toggle">
                <button onClick={() => setLanguage('fr')}>FRANÇAIS</button>
                <button onClick={() => setLanguage('en')}>ENGLISH</button>
              </li>
            </ul>
          </nav>
        </MobileMenu>

        {/* ── Section 1: Hero ── */}
        <HeroSection ref={heroRef}>
          <HeroContent>
            <HeroTitleGroup>
              <h2 className="hero-title-line">{translations[language].role1}</h2>
              <h2 className="hero-title-line">{translations[language].role2}</h2>
              <h2 className="hero-title-line">{translations[language].role3}</h2>
            </HeroTitleGroup>
            <HeroRight className="hero-intro">
              <p>{translations[language].intro}</p>
              <ContactButton onClick={scrollToContact}>
                {translations[language].contactMe}
              </ContactButton>
            </HeroRight>
          </HeroContent>
          <ScrollIndicator>
            <span>{translations[language].scroll}</span>
            <ScrollButton />
          </ScrollIndicator>
        </HeroSection>

        {/* ── Section 2: Services / Expertise ── */}
        <Services />

        {/* ── Section 3: Featured Projects ── */}
        <FeaturedProjects />

        {/* ── Section 4: Contact ── */}
        <div ref={contactRef}>
          <Contact />
        </div>
      </HomeContainer>
    </SmoothScroll>
  );
}

export default Home;

// ── Styled Components ──

const HomeContainer = styled.div`
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  font-family: 'LEMONMILK-Light', Arial, sans-serif;
  position: relative;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2.5rem;
  background-color: transparent;
  backdrop-filter: blur(0px);
  border-bottom: 1px solid transparent;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.scrolled {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 900px) {
    padding: 0.8rem 1rem;
  }
`;

const LeftHeader = styled.div`
  h1 {
    font-size: 0.9rem;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 300;
  }
  span {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.5;
  }
  @media (max-width: 900px) {
    h1 { font-size: 0.8rem; letter-spacing: 1.5px; }
    span { font-size: 0.6rem; }
  }
`;

const MidHeader = styled.div`
  ul {
    display: flex;
    list-style: none;
    gap: 2.5rem;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 2px;
      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s ease;
        &:hover { color: #fff; }
        &:visited, &:active { color: rgba(255, 255, 255, 0.7); }
      }
    }
  }
  @media (max-width: 900px) { display: none; }
`;

const RightHeader = styled.div`
  ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      font-size: 0.65rem;
      letter-spacing: 1.5px;
      a {
        color: rgba(255, 255, 255, 0.5);
        text-decoration: none;
        transition: color 0.3s ease;
        &:hover { color: #fff; }
        &:visited, &:active { color: rgba(255, 255, 255, 0.5); }
      }
    }
  }
  @media (max-width: 900px) { display: none; }
`;

// ── Hero Section ──

const HeroSection = styled.section`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 4rem;

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 2rem;
    min-height: 100svh;
  }
`;

const HeroContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 4rem;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
  }
`;

const HeroTitleGroup = styled.div`
  h2 {
    font-family: 'Tusker Grotesk', 'LEMONMILK-Light', sans-serif;
    font-size: clamp(3.5rem, 12vw, 13rem);
    font-weight: 700;
    line-height: 0.95;
    margin: 0;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
`;

const HeroRight = styled.div`
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1rem;

  p {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 0.9rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const ContactButton = styled.button`
  font-family: 'LEMONMILK-Light', Arial, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.85rem 2rem;
  text-transform: uppercase;
  cursor: pointer;
  width: fit-content;
  transition: all 0.4s ease;

  &:hover {
    background-color: #fff;
    color: #000;
    border-color: #fff;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  span {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
  }
`;

// ── Mobile Menu ──

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1000;

  @media (max-width: 900px) { display: flex; }

  span {
    width: 22px;
    height: 1.5px;
    background-color: #fff;
    margin: 3px 0;
    transition: all 0.3s ease;
    &:nth-child(1) {
      transform: ${(props) =>
        props.active ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }
    &:nth-child(2) {
      opacity: ${(props) => (props.active ? '0' : '1')};
    }
    &:nth-child(3) {
      transform: ${(props) =>
        props.active ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
    }
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.97);
  backdrop-filter: blur(20px);
  z-index: 998;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &.open { transform: translateX(0); }

  @media (max-width: 900px) { display: block; }

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
    margin: 2.5rem 0;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 3px;

    a {
      color: white;
      text-decoration: none;
      transition: opacity 0.3s ease;
      &:hover { opacity: 0.6; }
    }

    &.language-toggle {
      margin-top: 3rem;
      display: flex;
      justify-content: center;
      gap: 1rem;

      button {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        letter-spacing: 1.5px;
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
