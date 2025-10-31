import React from "react";
import "./Loader2.css"; // Importez le fichier CSS
import toothlessGif from "../assets/images/toothless-dancing-toothless.gif";
// Adaptez le chemin selon l'endroit où se trouve votre GIF

const Loader = () => {
  return (
    <div className="loader-container">
      <img src={toothlessGif} alt="Toothless dancing" className="loader-gif" />
      <p className="loader-text">
        Loading
        <span className="dot dot1">.</span>
        <span className="dot dot2">.</span>
        <span className="dot dot3">.</span>
      </p>
    </div>
  );
};

export default Loader;
