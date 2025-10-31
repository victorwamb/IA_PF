import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./languageContext";
import "../styles/font.css";
import "./AdminPanel.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Variables de développement seulement (pour test local)
const DEV_ADMIN_PASSWORD = process.env.REACT_APP_DEV_PASSWORD || "admin2025";
const DEV_API_KEY = process.env.REACT_APP_DEV_API_KEY || "admin2025_secret_key_change_me";

// En production, ces variables DOIVENT être définies
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || DEV_ADMIN_PASSWORD;
const API_KEY = process.env.REACT_APP_API_KEY || DEV_API_KEY;

// Avertir si on utilise les clés par défaut en production
if (process.env.NODE_ENV === "production" && ADMIN_PASSWORD === DEV_ADMIN_PASSWORD) {
  console.error("⚠️ CRITICAL SECURITY: Using default admin password in production!");
}

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isProtected, setIsProtected] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Admin Panel",
      subtitle: "Manage your projects",
      password: "Password:",
      login: "Login",
      wrongPassword: "Wrong password!",
      addProject: "Add Project",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      projectTitle: "Project Title:",
      projectTitleSimple: "Simple Title (#XX):",
      description: "Description:",
      description2: "Description 2:",
      description3: "Description 3:",
      details: "Details:",
      technologies: "Technologies (separated by commas):",
      date: "Date:",
      category: "Category (separated by commas):",
      mainImage: "Main Image Path:",
      imageSimple: "Simple Image Path:",
      images: "Additional Images (one per line):",
      type: "Type:",
      website: "Website URL:",
      back: "Back to Portfolio",
      confirmDelete: "Are you sure you want to delete this project?",
      noProjectSelected: "No project selected",
      projectAdded: "Project added successfully!",
      projectUpdated: "Project updated successfully!",
      projectDeleted: "Project deleted successfully!",
      loading: "Loading...",
      error: "Error:",
      networkError: "Network error. Is the API running?"
    },
    fr: {
      title: "Panneau d'Administration",
      subtitle: "Gérez vos projets",
      password: "Mot de passe :",
      login: "Connexion",
      wrongPassword: "Mot de passe incorrect !",
      addProject: "Ajouter un Projet",
      edit: "Modifier",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler",
      projectTitle: "Titre du Projet :",
      projectTitleSimple: "Titre Simple (#XX) :",
      description: "Description :",
      description2: "Description 2 :",
      description3: "Description 3 :",
      details: "Détails :",
      technologies: "Technologies (séparées par des virgules) :",
      date: "Date :",
      category: "Catégorie (séparée par des virgules) :",
      mainImage: "Chemin Image Principale :",
      imageSimple: "Chemin Image Simple :",
      images: "Images Supplémentaires (une par ligne) :",
      type: "Type :",
      website: "URL du Site Web :",
      back: "Retour au Portfolio",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce projet ?",
      noProjectSelected: "Aucun projet sélectionné",
      projectAdded: "Projet ajouté avec succès !",
      projectUpdated: "Projet modifié avec succès !",
      projectDeleted: "Projet supprimé avec succès !",
      loading: "Chargement...",
      error: "Erreur :",
      networkError: "Erreur réseau. L'API est-elle démarrée ?"
    }
  };

  // Charger les projets depuis l'API
  useEffect(() => {
    if (!isProtected) {
      fetchProjects();
    }
  }, [isProtected]);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(translations[language].networkError);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsProtected(false);
    } else {
      alert(translations[language].wrongPassword);
    }
  };

  const handleAdd = () => {
    setEditingProject({
      title: "",
      titleSimple: "",
      description: "",
      description2: "",
      description3: "",
      details: "",
      technologies: "",
      date: "",
      categorie: "",
      image: "",
      imageSimple: "",
      images: "",
      type: "",
      vue: ""
    });
    setShowAddForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies || "",
      categorie: Array.isArray(project.categorie) ? project.categorie.join(", ") : project.categorie || "",
      images: Array.isArray(project.images) ? project.images.join("\n") : project.images || ""
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(translations[language].confirmDelete)) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      alert(translations[language].projectDeleted);
      fetchProjects();
    } catch (err) {
      alert(`${translations[language].error} ${err.message}`);
      console.error("Error deleting project:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Convertir les champs texte en tableaux
    const technologies = editingProject.technologies
      ? editingProject.technologies.split(",").map(t => t.trim()).filter(t => t)
      : [];
    
    const categorie = editingProject.categorie
      ? editingProject.categorie.split(",").map(c => c.trim()).filter(c => c)
      : [];
    
    const images = editingProject.images
      ? editingProject.images.split("\n").map(img => img.trim()).filter(img => img)
      : [];

    const projectData = {
      title: editingProject.title,
      titleSimple: editingProject.titleSimple,
      description: editingProject.description,
      description2: editingProject.description2 || "",
      description3: editingProject.description3 || "",
      details: editingProject.details || "",
      technologies,
      date: editingProject.date,
      categorie,
      image: editingProject.image,
      imageSimple: editingProject.imageSimple,
      images,
      type: editingProject.type,
      vue: editingProject.vue
    };

    try {
      if (editingProject.id) {
        // Mise à jour
        const response = await fetch(`${API_BASE_URL}/api/admin/projects/${editingProject.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify(projectData)
        });

        if (!response.ok) {
          throw new Error("Failed to update project");
        }

        alert(translations[language].projectUpdated);
      } else {
        // Création
        const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify(projectData)
        });

        if (!response.ok) {
          throw new Error("Failed to create project");
        }

        alert(translations[language].projectAdded);
      }

      setShowAddForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      alert(`${translations[language].error} ${err.message}`);
      console.error("Error saving project:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isProtected) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h1 style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
            {translations[language].title}
          </h1>
          <form onSubmit={handleLogin}>
            <label>{translations[language].password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{translations[language].login}</button>
          </form>
        </div>
      </div>
    );
  }

  if (showAddForm && editingProject) {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1 style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
            {editingProject.id 
              ? translations[language].edit 
              : translations[language].addProject}
          </h1>
          <button onClick={() => { setShowAddForm(false); setEditingProject(null); }}>
            {translations[language].cancel}
          </button>
        </div>

        <form onSubmit={handleSave} className="admin-form">
          <label>{translations[language].projectTitle}</label>
          <input
            type="text"
            name="title"
            value={editingProject.title}
            onChange={handleInputChange}
            required
          />

          <label>{translations[language].projectTitleSimple}</label>
          <input
            type="text"
            name="titleSimple"
            value={editingProject.titleSimple}
            onChange={handleInputChange}
          />

          <label>{translations[language].description}</label>
          <textarea
            name="description"
            value={editingProject.description}
            onChange={handleInputChange}
            rows="3"
          />

          <label>{translations[language].description2}</label>
          <textarea
            name="description2"
            value={editingProject.description2}
            onChange={handleInputChange}
            rows="3"
          />

          <label>{translations[language].description3}</label>
          <textarea
            name="description3"
            value={editingProject.description3}
            onChange={handleInputChange}
            rows="3"
          />

          <label>{translations[language].details}</label>
          <textarea
            name="details"
            value={editingProject.details}
            onChange={handleInputChange}
            rows="3"
          />

          <label>{translations[language].technologies}</label>
          <input
            type="text"
            name="technologies"
            value={editingProject.technologies}
            onChange={handleInputChange}
          />

          <label>{translations[language].date}</label>
          <input
            type="text"
            name="date"
            value={editingProject.date}
            onChange={handleInputChange}
          />

          <label>{translations[language].category}</label>
          <input
            type="text"
            name="categorie"
            value={editingProject.categorie}
            onChange={handleInputChange}
          />

          <label>{translations[language].mainImage}</label>
          <input
            type="text"
            name="image"
            value={editingProject.image}
            onChange={handleInputChange}
            placeholder="project1/img1.png"
          />

          <label>{translations[language].imageSimple}</label>
          <input
            type="text"
            name="imageSimple"
            value={editingProject.imageSimple}
            onChange={handleInputChange}
            placeholder="project1/img1.png"
          />

          <label>{translations[language].images}</label>
          <textarea
            name="images"
            value={editingProject.images}
            onChange={handleInputChange}
            rows="4"
            placeholder="project1/img2.png&#10;project1/img3.png"
          />

          <label>{translations[language].type}</label>
          <input
            type="text"
            name="type"
            value={editingProject.type}
            onChange={handleInputChange}
          />

          <label>{translations[language].website}</label>
          <input
            type="text"
            name="vue"
            value={editingProject.vue}
            onChange={handleInputChange}
          />

          <button type="submit">{translations[language].save}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {error && (
        <div style={{ 
          backgroundColor: "#4a0000", 
          color: "#fff", 
          padding: "1rem", 
          marginBottom: "1rem",
          borderRadius: "6px"
        }}>
          {error}
        </div>
      )}
      
      <div className="admin-header">
        <h1 style={{ fontFamily: "LEMONMILK-Light, Arial, sans-serif" }}>
          {translations[language].title}
        </h1>
        <div className="admin-header-actions">
          <button onClick={handleAdd}>{translations[language].addProject}</button>
          <button onClick={() => navigate("/")}>{translations[language].back}</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#e5e5e5" }}>
          {translations[language].loading}
        </div>
      ) : (
        <div className="admin-projects-list">
          {projects.map((project) => (
            <div key={project.id} className="admin-project-card">
              <div className="admin-project-info">
                <h3>{project.title}</h3>
                <p>ID: {project.id} | {project.date}</p>
                <p>{project.type}</p>
              </div>
              <div className="admin-project-actions">
                <button onClick={() => handleEdit(project)}>{translations[language].edit}</button>
                <button onClick={() => handleDelete(project.id)}>{translations[language].delete}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
