import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Works.css";
import "../styles/font.css";
import ScrambleText from "./Scrambletext";
import { useLanguage } from "./languageContext";
import { getSimpleImage } from "../utils/projectImages";
import projectsDefault from "../data/projects.json";

function Works() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [animatePreview, setAnimatePreview] = useState(false);

  const navigate = useNavigate();
  const { language } = useLanguage();

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
          id: project.id,
          title: project.titleSimple || project.title,
          description: project.title,
          image: getSimpleImage(project.image || project.imageSimple),
          type: project.type
        }));
        
        setProjects(projectsWithImages);
        if (projectsWithImages.length > 0) {
          setSelectedProject(projectsWithImages[0]);
        }
      } catch (err) {
        console.error("Error fetching projects from API, using defaults:", err);
        // Fallback sur les données par défaut
        const projectsWithImages = projectsDefault.map(project => ({
          id: project.id,
          title: project.titleSimple || project.title,
          description: project.title,
          image: getSimpleImage(project.image || project.imageSimple),
          type: project.type
        }));
        setProjects(projectsWithImages);
        if (projectsWithImages.length > 0) {
          setSelectedProject(projectsWithImages[0]);
        }
      }
    };
    
    fetchProjects();
  }, []);

  const translations = {
    en: {
      home: "Home",
      work: "Work",
      about: "About"
    },
    fr: {
      home: "Accueil",
      work: "Travail",
      about: "À propos"
    }
  };

  const handleProjectHover = (project) => {
    setSelectedProject(project);
    setAnimatePreview(true);
  };

  const handleAnimationEnd = () => {
    setAnimatePreview(false);
  };

  const Goback = () => {
    navigate("/");
  };

  // 🔥 Mettre à jour GoON pour inclure l'ID du projet sélectionné
  const GoON = (id) => {
    navigate(`/project-detail/${id}`);
  };

  if (!selectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="styled-page-container"
      style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}
    >
      {/* Menu latéral gauche */}
      <div className="sidebar">
        <h1>Wambersie Victor</h1>
        <ul className="navigation">
          <li onClick={Goback}>{translations[language].home}</li>
          <li className="active">{translations[language].work}</li>
          <li onClick={Goback}>{translations[language].about}</li>
        </ul>
      </div>

      {/* Liste des projets */}
      <div className="projects-list">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-item"
            onMouseEnter={() => handleProjectHover(project)}
            onClick={() => GoON(project.id)}
          >
            <img src={project.image} alt={project.title} />
            <div className="project-item-content">
              <div className="project-title">{project.title}</div>
              <div className="project-description">{project.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview du projet sélectionné */}
      <div className="preview-container">
        <div className="preview2">
          <div className="preview-header">
            <h2
              style={{
                fontFamily: "LEMONMILK-Light, Arial, sans-serif",
              }}
            >
              <ScrambleText text={selectedProject.description} />
            </h2>
          </div>
          <div className="preview-desc">{selectedProject.type}</div>
          <div className="preview-desc">{selectedProject.title}</div>
        </div>
        <div className="preview" onClick={() => GoON(selectedProject.id)}>
          <img
            src={selectedProject.image}
            alt={selectedProject.title}
            className={animatePreview ? "preview-image animate" : "preview-image"}
            onAnimationEnd={handleAnimationEnd}
          />
          <div
            className="preview-text"
            style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Works;
