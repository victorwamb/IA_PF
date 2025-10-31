import React from "react";
import styled from "styled-components";

function ImageSlider() {
  return (
    <SliderContainer>
      {/* Ligne supérieure */}
      <HorizontalLine />

      {/* Conteneur des images qui défilent */}
      <ScrollingImages>
        <ImagesWrapper>
          {/* Ajoutez autant d'images que nécessaire */}
          <img src="../images/logo/lg1.png" alt="Logo 1" />
          <img src="lg2.png" alt="Logo 2" />
          <img src="lg3.png" alt="Logo 3" />
          <img src="lg4.png" alt="Logo 4" />
          <img src="lg5.png" alt="Logo 5" />
          {/* Duplication pour un défilement infini */}
          <img src="lg1.png" alt="Logo 1" />
          <img src="lg2.png" alt="Logo 2" />
          <img src="lg3.png" alt="Logo 3" />
          <img src="lg4.png" alt="Logo 4" />
          <img src="lg5.png" alt="Logo 5" />
        </ImagesWrapper>
      </ScrollingImages>

      {/* Ligne inférieure */}
      <HorizontalLine />
    </SliderContainer>
  );
}

export default ImageSlider;

/* ---------------------- */
/*       Styles CSS       */
/* ---------------------- */

const SliderContainer = styled.div`
  position: relative;
  width: 72%;
  max-height: 250px;
  overflow: hidden; /* Cache les éléments qui débordent */
  background-color: #000; /* Optionnel, couleur de fond */
`;

const HorizontalLine = styled.div`
  position: absolute;
  width: 100%;
  height: 2px; /* Épaisseur de la ligne */
  background-color: white;
  top: 0; /* Ligne supérieure */
  &:last-of-type {
    top: auto;
    bottom: 0; /* Ligne inférieure */
  }
`;

const ScrollingImages = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center; /* Centrage vertical des images */
  overflow: hidden; /* Cache tout débordement horizontal */
`;

const ImagesWrapper = styled.div`
  display: flex;
  animation: scroll 4s linear infinite; /* Animation de défilement */

  img {
    height: 100%; /* Les images remplissent la hauteur du conteneur */
    margin-right: 20px; /* Espacement entre les images */
    object-fit: contain; /* Les images gardent leur proportion */
  }

  /* Animation pour faire défiler les images */
  @keyframes scroll {
    from {
      transform: translateX(0); /* Position initiale */
    }
    to {
      transform: translateX(-10%); /* Déplace vers la gauche */
    }
  }
`;
