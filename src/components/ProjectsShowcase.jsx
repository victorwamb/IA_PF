import React, { useState } from "react";
import CustomCursor from "./CustomCursor"; // Composant pour le curseur personnalisé
import "./ProjectShowcase.css";
import img1 from "../assets/images/project1/img1.png";
import img2 from "../assets/images/project1/img2.png";
import img3 from "../assets/images/project1/img3.png";

function ProjectShowcase() {
  // Tableau fictif de projets
  const projects = [
    {
      id: 1,
      title: "Projet A",
      image: img1,
    },
    {
      id: 2,
      title: "Projet B",
      image: img2,
    },
    {
      id: 3,
      title: "Projet C",
      image: img3,
    },
  ];

  // État pour stocker l'image du projet sélectionné
  const [selectedImage, setSelectedImage] = useState(null);

  // Fonction pour mettre à jour l'image quand on survole un projet
  const handleMouseEnter = (image) => {
    setSelectedImage(image);
  };

  // Fonction pour retirer l'image quand on quitte le survol
  const handleMouseLeave = () => {
    setSelectedImage(null);
  };

  return (
    <div className="app-container">
      <CustomCursor />
      <div className="content-container">
        {/* Colonne gauche : conteneur d'image */}
        <div className="image-container">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Project preview"
              className="animated-image"
            />
          )}
        </div>

        {/* Colonne droite : liste des projets */}
        <aside className="sidebar">
          <h1 className="sidebar-title">Projets</h1>
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="project-item"
                onMouseEnter={() => handleMouseEnter(project.image)}
                onMouseLeave={handleMouseLeave}
              >
                {project.title}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default ProjectShowcase;
