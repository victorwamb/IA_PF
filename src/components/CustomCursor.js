import React, { useEffect, useState } from "react";

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false); // Pour gérer l'effet au survol
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Détection des appareils tactiles
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    const isTouch = checkTouchDevice();
    setIsTouchDevice(isTouch);

    // Si c'est un appareil tactile, on ne charge pas le curseur personnalisé
    if (isTouch) {
      return;
    }

    // Ajoute une classe globale pour forcer la disparition du curseur natif partout
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    // Utilisation de la délégation d'événements pour capter TOUS les éléments, 
    // même ceux qui sont chargés dynamiquement par React plus tard
    const handleMouseOver = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const isInteractive = e.target.closest('a, button, li, img, .featured-card, input, textarea, [role="button"]');
        if (isInteractive) setIsHovering(true);
      }
    };

    const handleMouseOut = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const isInteractive = e.target.closest('a, button, li, img, .featured-card, input, textarea, [role="button"]');
        if (isInteractive) setIsHovering(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.classList.remove('custom-cursor-active');

      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // Si c'est un appareil tactile, on ne rend rien
  if (isTouchDevice) {
    return null;
  }

  const cursorStyle = {
    position: "fixed",
    top: position.y,
    left: position.x,
    transform: "translate(-50%, -50%) scale(" + (isHovering ? 1.8 : 1) + ")",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: isHovering ? "2px solid transparent" : "2px solid white",
    backgroundColor: isHovering ? "#fff" : "transparent",
    boxShadow: isHovering
      ? "0 0 20px 5px rgba(255, 255, 255, 0.9), 0 0 40px 10px rgba(255, 255, 255, 0.5)"
      : "0 0 5px rgba(255, 255, 255, 0.2)",
    pointerEvents: "none", // pour ne pas bloquer les clics
    zIndex: 9999, // pour qu’il soit au-dessus de tout
    transition:
      "transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s ease, background-color 0.25s ease, border 0.25s ease",
  };

  return <div style={cursorStyle} />;
}

export default CustomCursor;
