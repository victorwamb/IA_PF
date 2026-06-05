import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './languageContext';
import './Services.css';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  const content = {
    en: {
      title: 'Expertise',
      services: [
        {
          num: '01',
          title: 'AI & LLM Integration',
          desc: 'Building intelligent backends with RAG architectures, fine-tuning, and scalable API wrappers for modern AI models.',
        },
        {
          num: '02',
          title: 'Agentic Systems',
          desc: 'Designing autonomous AI agents capable of reasoning, tool use, and multi-step complex problem solving.',
        },
        {
          num: '03',
          title: 'Backend Architecture',
          desc: 'Developing robust, high-performance APIs and microservices using Python, FastAPI, and robust database design.',
        },
      ],
    },
    fr: {
      title: 'Expertise',
      services: [
        {
          num: '01',
          title: 'Intégration IA & LLM',
          desc: 'Création de backends intelligents avec architectures RAG, fine-tuning et wrappers API pour les modèles IA modernes.',
        },
        {
          num: '02',
          title: 'Systèmes Agentiques',
          desc: 'Conception d\'agents IA autonomes capables de raisonner, d\'utiliser des outils et de résoudre des problèmes complexes.',
        },
        {
          num: '03',
          title: 'Architecture Backend',
          desc: 'Développement d\'APIs robustes et performantes en utilisant Python, FastAPI, et une conception de base de données solide.',
        },
      ],
    },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        
        // Reveal animation
        gsap.fromTo(
          item,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Hover effect setup (GSAP for smoother lines)
        const line = item.querySelector('.service-line');
        item.addEventListener('mouseenter', () => {
          gsap.to(line, { width: '100%', duration: 0.4, ease: 'power2.out' });
        });
        item.addEventListener('mouseleave', () => {
          gsap.to(line, { width: '0%', duration: 0.4, ease: 'power2.in' });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section ref={sectionRef} className="services-section">
      <div className="services-header">
        <h2 className="services-title">{content[language].title}</h2>
      </div>

      <div className="services-list">
        {content[language].services.map((srv, i) => (
          <div
            key={i}
            className="service-item"
            ref={(el) => (itemsRef.current[i] = el)}
          >
            <div className="service-content">
              <span className="service-num">{srv.num}</span>
              <h3 className="service-name">{srv.title}</h3>
              <p className="service-desc">{srv.desc}</p>
            </div>
            <div className="service-line-container">
              <div className="service-line-base"></div>
              <div className="service-line"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
