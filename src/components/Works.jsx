import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Works.css';
import '../styles/font.css';
import ScrambleText from './Scrambletext';
import { useLanguage } from './languageContext';
import { getSimpleImage } from '../utils/projectImages';
import projectsDefault from '../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

function Works() {
  const [projects, setProjects] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${base}/api/projects`);
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        const projectData = data.projects || projectsDefault;
        const projectsWithImages = projectData.map((project) => ({
          id: project.id,
          title: project.title,
          titleSimple: project.titleSimple || project.title,
          description: project.description,
          image: getSimpleImage(project.image || project.imageSimple),
          type: project.type,
          date: project.date,
          technologies: project.technologies,
        }));
        setProjects(projectsWithImages);
      } catch {
        const projectsWithImages = projectsDefault.map((project) => ({
          id: project.id,
          title: project.title,
          titleSimple: project.titleSimple || project.title,
          description: project.description,
          image: getSimpleImage(project.image || project.imageSimple),
          type: project.type,
          date: project.date,
          technologies: project.technologies,
        }));
        setProjects(projectsWithImages);
      }
    };
    fetchProjects();
  }, []);

  // GSAP stagger reveal
  useEffect(() => {
    if (projects.length === 0) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  const translations = {
    en: {
      title: 'All Projects',
      back: '← Back',
    },
    fr: {
      title: 'Tous les Projets',
      back: '← Retour',
    },
  };

  return (
    <div className="works-page" ref={containerRef}>
      {/* Header bar */}
      <div className="works-header">
        <button className="works-back" onClick={() => navigate('/')}>
          {translations[language].back}
        </button>
        <h1 className="works-title">
          {translations[language].title}
        </h1>
        <span className="works-count">{projects.length} projects</span>
      </div>

      {/* Project list */}
      <div className="works-list">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`works-card ${hoveredId === project.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => navigate(`/project-detail/${project.id}`)}
          >
            <div className="works-card__left">
              <span className="works-card__number">{project.titleSimple}</span>
              <div className="works-card__info">
                <h2 className="works-card__title">
                  {hoveredId === project.id ? (
                    <ScrambleText text={project.title} />
                  ) : (
                    project.title
                  )}
                </h2>
                <p className="works-card__meta">
                  {project.date} — {project.type}
                </p>
              </div>
            </div>
            <div className="works-card__right">
              <div className="works-card__image-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="works-card__image"
                />
              </div>
              <span className="works-card__arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Works;
