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

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // On enlève le curseur natif sur tout le body
    document.body.style.cursor = "none";

    window.addEventListener("mousemove", moveCursor);

    // Gère le survol des liens et des éléments interactifs
    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);
    document.querySelectorAll("a, button, li, img").forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);

      // Nettoie les événements d'écoute sur les éléments interactifs
      document.querySelectorAll("a, button, li, img").forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });

      // Restaure le curseur natif quand ce composant se démonte (optionnel)
      document.body.style.cursor = "default";
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
    transform: "translate(-50%, -50%) scale(" + (isHovering ? 1.5 : 1) + ")",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid white",
    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.8)" : "transparent",
    boxShadow: isHovering
      ? "0 0 10px rgba(255, 255, 255, 0.8)"
      : "0 0 5px rgba(255, 255, 255, 0.4)",
    pointerEvents: "none", // pour ne pas bloquer les clics
    zIndex: 9999, // pour qu’il soit au-dessus de tout
    transition:
      "transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease",
  };

  return <div style={cursorStyle} />;
}

export default CustomCursor;
