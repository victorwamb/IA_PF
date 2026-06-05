import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './languageContext';
import { getSimpleImage } from '../utils/projectImages';
import projectsDefault from '../data/projects.json';
import './FeaturedProjects.css';

gsap.registerPlugin(ScrollTrigger);

// Pick 3 featured projects (first 3 from the JSON)
const featured = projectsDefault.slice(0, 3).map((p) => ({
  id: p.id,
  title: p.title,
  titleSimple: p.titleSimple,
  description: p.description,
  image: getSimpleImage(p.image || p.imageSimple),
  date: p.date,
  type: p.type,
  technologies: p.technologies,
}));

export default function FeaturedProjects() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const translations = {
    en: {
      sectionTitle: 'Selected Works',
      viewProject: 'View Project',
      viewAll: 'View All Projects',
    },
    fr: {
      sectionTitle: 'Projets Sélectionnés',
      viewProject: 'Voir le Projet',
      viewAll: 'Voir Tous les Projets',
    },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          {
            y: 80,
            opacity: 0,
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="featured-section">
      <div className="featured-header">
        <h2 className="featured-title">
          {translations[language].sectionTitle}
        </h2>
        <div className="featured-line" />
      </div>

      <div className="featured-grid">
        {featured.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`featured-card featured-card--${i}`}
            onClick={() => navigate(`/project-detail/${project.id}`)}
          >
            <div className="featured-card__image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="featured-card__image"
              />
              <div className="featured-card__overlay">
                <span className="featured-card__number">
                  {project.titleSimple}
                </span>
                <span className="featured-card__cta">
                  {translations[language].viewProject} →
                </span>
              </div>
            </div>
            <div className="featured-card__info">
              <h3 className="featured-card__title">{project.title}</h3>
              <p className="featured-card__meta">
                {project.date} — {project.type}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="featured-footer">
        <button
          className="featured-view-all"
          onClick={() => navigate('/works')}
        >
          {translations[language].viewAll}
        </button>
      </div>
    </section>
  );
}
