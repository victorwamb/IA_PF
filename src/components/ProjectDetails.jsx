import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./projectDetail.css";
import "../styles/font.css";
import { useLanguage } from "./languageContext";
import { getImages } from "../utils/projectImages";
import projectsDefault from "../data/projects.json";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const base = process.env.REACT_APP_API_URL || '';
        const response = await fetch(`${base}/api/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        const projectData = data.projects || projectsDefault;
        
        // Transformer les données pour ajouter les images
        const projectsWithImages = projectData.map(project => ({
          ...project,
          images: getImages(project.images)
        }));
        
        setProjects(projectsWithImages);
      } catch (err) {
        console.error("Error fetching projects from API, using defaults:", err);
        // Fallback sur les données par défaut
        const projectsWithImages = projectsDefault.map(project => ({
          ...project,
          images: getImages(project.images)
        }));
        setProjects(projectsWithImages);
      }
    };
    
    fetchProjects();
  }, []);
  
  const project = projects.find((p) => p.id === parseInt(id));

  const translations = {
    en: {
      notFound: "Project not found.",
      allProjects: "All projects",
      technologies: "Technologies :",
      date: "Date :",
      categorie: "Category :",
      website: "Website :",
      back: "Back",
      next: "Next"
    },
    fr: {
      notFound: "Projet non trouvé.",
      allProjects: "Tous les projets",
      technologies: "Technologies :",
      date: "Date :",
      categorie: "Categorie :",
      website: "Site web :",
      back: "Précédent",
      next: "Suivant"
    }
  };

  if (projects.length === 0) {
    return <div className="project-details-container" style={{ color: "#e5e5e5" }}>Loading...</div>;
  }

  if (!project) {
    return <div className="project-details-container">{translations[language].notFound}</div>;
  }

  const goBack = () => navigate("/works");
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
    <>
        <div className="sidebar-bar" onClick={goBack}>
        <p className="sidebar-text">{translations[language].allProjects}</p>
        </div>

            <div className="projects-banner">
        <img src={project.images[0]} alt={project.title} className="banner" />
        </div>
    <div className="projects-details-container">
      <div className="projects-content">
      <div className="projects-info">
        <div className="top-pro">
      <h2 className="projects-title"
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>{project.title}</h2>
      <h2 className="projects-title"
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>#{project.id}</h2>
      </div>
      <hr className="projects-divider"/>


        <div className="projects-meta-container">
            <div className="meta-info">
      <p className="projects-meta" 
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
        <strong>{translations[language].technologies}</strong> {project.technologies}
      </p>
      <p className="projects-meta"
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
        <strong>{translations[language].date}</strong> {project.date}
      </p>
      <p className="projects-meta"
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
        <strong>{translations[language].categorie}</strong> {project.categorie}
      </p>
      <p className="projects-meta" style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
  <strong>{translations[language].website}</strong> 
  <a href={project.vue} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: " none" }}>
    {project.vue}
  </a>
</p>

      </div>
      <div className="meta-info2" style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
      <p className="projects-details"style={{ margin : 0 }}>{project.details}</p>
      </div>
        </div>
    </div>

        <div className="projects-section">
          <p className="projects-description">{project.description}</p>
          <img src={project.images[0]} alt={project.title} className="projects-image" />
        </div>
        <div className="projects-section reverse">
          <img src={project.images[1]} alt={project.title} className="projects-image" />
          <p className="projects-details">{project.details}</p>
        </div>
      </div>
      <div className="projects-content">
        <div className="projects-section">
          <p className="projects-description">{project.description2}</p>
          <img src={project.images[2]} alt={project.title} className="projects-image" />
        </div>
        <div className="projects-section reverse">
          <img src={project.images[3]} alt={project.title} className="projects-image" />
          <p className="projects-details">{project.description3}</p>
        </div>
      </div>
      <div className="projects-buttons">
        <button onClick={goToBeforeProject} className="projects-button">{translations[language].back}</button>
        <button onClick={goToNextProject} className="projects-button">{translations[language].next}</button>
      </div>
    </div>
    </>
  );
};

export default ProjectDetails;
