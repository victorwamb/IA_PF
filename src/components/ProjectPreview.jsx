import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectPreview.css"; // Fichier CSS contenant le style du "livre"
import img1 from "../assets/images/project1/img1.png";
import img2 from "../assets/images/project1/img2.png";
import img3 from "../assets/images/project1/img3.png";

// Exemple de données pour les projets
const projects = [
  {
    id: 1,
    title: "Projet A",
    description: "Une description brève et intrigante pour le projet A.",
    image: img1,
  },
  {
    id: 2,
    title: "Projet B",
    description: "Une description brève et intrigante pour le projet B.",
    image: img2,
  },
  {
    id: 3,
    title: "Projet C",
    description: "Une description brève et intrigante pour le projet C.",
    image: img3,
  },
];

function ProjectPreview() {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate("/works");
  };

  return (
    <div className="project-preview-container">
      {projects.map((project) => (
        <div className="book" key={project.id}>
          {/* "inner" : le contenu intérieur du livre qu'on voit après le "flip" */}
          <div className="inner">
            {/* On y met l'image, le titre et la description */}
            <img src={project.image} alt={project.title} className="project-image" />
            <h3 className="text">{project.title}</h3>
            <p className="text">{project.description}</p>
          </div>

          {/* "cover" : la couverture du livre. 
              On peut la rendre cliquable pour naviguer vers une autre page. */}
          <div className="cover" onClick={handleDiscoverMore}>
            {/* Par exemple, on n'affiche que le titre en couverture */}
            <h3 className="text">{project.title}</h3>
            <p className="text">Hover me</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
