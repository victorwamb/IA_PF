import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './projectDetail.css';
import '../styles/font.css';
import { useLanguage } from './languageContext';
import { getImages } from '../utils/projectImages';
import projectsDefault from '../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const pageRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${base}/api/projects`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const projectData = data.projects || projectsDefault;
        const projectsWithImages = projectData.map((project) => ({
          ...project,
          images: getImages(project.images),
        }));
        setProjects(projectsWithImages);
      } catch {
        const projectsWithImages = projectsDefault.map((project) => ({
          ...project,
          images: getImages(project.images),
        }));
        setProjects(projectsWithImages);
      }
    };
    fetchProjects();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (projects.length === 0) return;

    const ctx = gsap.context(() => {
      // Sections reveal
      const sections = pageRef.current?.querySelectorAll('.pd-section');
      sections?.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Images parallax
      const images = pageRef.current?.querySelectorAll('.pd-image');
      images?.forEach((img) => {
        gsap.to(img, {
          y: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [projects, id]);

  const project = projects.find((p) => p.id === parseInt(id));

  const translations = {
    en: {
      notFound: 'Project not found.',
      allProjects: 'All projects',
      technologies: 'Technologies',
      date: 'Date',
      categorie: 'Category',
      website: 'Website',
      back: 'Previous',
      next: 'Next',
    },
    fr: {
      notFound: 'Projet non trouvé.',
      allProjects: 'Tous les projets',
      technologies: 'Technologies',
      date: 'Date',
      categorie: 'Catégorie',
      website: 'Site web',
      back: 'Précédent',
      next: 'Suivant',
    },
  };

  if (projects.length === 0) {
    return (
      <div className="pd-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Loading...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pd-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span>{translations[language].notFound}</span>
      </div>
    );
  }

  const goBack = () => navigate('/works');
  const goToNextProject = () => {
    const nextIndex = (projects.findIndex((p) => p.id === project.id) + 1) % projects.length;
    navigate(`/project-detail/${projects[nextIndex].id}`);
  };
  const goToBeforeProject = () => {
    const currentIndex = projects.findIndex((p) => p.id === project.id);
    const previousIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    navigate(`/project-detail/${projects[previousIndex].id}`);
  };

  return (
    <div className="pd-page" ref={pageRef}>
      {/* Top bar */}
      <div className="pd-topbar">
        <button className="pd-topbar__back" onClick={goBack}>
          ← {translations[language].allProjects}
        </button>
        <span className="pd-topbar__id">#{project.id}</span>
      </div>

      {/* Title & Meta info (No more hero banner) */}
      <div className="pd-header-block">
        <h1 className="pd-header__title">{project.title}</h1>
        
        <div className="pd-meta__grid">
          <div className="pd-meta__item">
            <span className="pd-meta__label">{translations[language].technologies}</span>
            <span className="pd-meta__value">{project.technologies?.join(', ')}</span>
          </div>
          <div className="pd-meta__item">
            <span className="pd-meta__label">{translations[language].date}</span>
            <span className="pd-meta__value">{project.date}</span>
          </div>
          <div className="pd-meta__item">
            <span className="pd-meta__label">{translations[language].categorie}</span>
            <span className="pd-meta__value">{project.categorie?.join(', ')}</span>
          </div>
          {project.vue && (
            <div className="pd-meta__item">
              <span className="pd-meta__label">{translations[language].website}</span>
              <a href={project.vue} target="_blank" rel="noopener noreferrer" className="pd-meta__link">
                {project.vue}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className="pd-section pd-content-block" style={{ paddingTop: '2rem' }}>
        <div className="pd-content-row">
          <p className="pd-text">{project.description}</p>
          <div className="pd-image-wrapper">
            {project.images[0] && <img src={project.images[0]} alt="" className="pd-image" />}
          </div>
        </div>
      </div>

      {project.images[1] && (
        <div className="pd-section pd-content-block">
          <div className="pd-content-row pd-content-row--reverse">
            <div className="pd-image-wrapper">
              <img src={project.images[1]} alt="" className="pd-image" />
            </div>
            <p className="pd-text">{project.details}</p>
          </div>
        </div>
      )}

      <div className="pd-section pd-content-block">
        <div className="pd-content-row">
          <p className="pd-text">{project.description2}</p>
          {project.images[2] && (
            <div className="pd-image-wrapper">
              <img src={project.images[2]} alt="" className="pd-image" />
            </div>
          )}
        </div>
      </div>

      {project.images[3] && (
        <div className="pd-section pd-content-block">
          <div className="pd-content-row pd-content-row--reverse">
            <div className="pd-image-wrapper">
              <img src={project.images[3]} alt="" className="pd-image" />
            </div>
            <p className="pd-text">{project.description3}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="pd-nav">
        <button className="pd-nav__btn" onClick={goToBeforeProject}>
          ← {translations[language].back}
        </button>
        <button className="pd-nav__btn" onClick={goToNextProject}>
          {translations[language].next} →
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
