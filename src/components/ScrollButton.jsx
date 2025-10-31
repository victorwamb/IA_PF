import React from 'react';
import styled from 'styled-components';

const ScrollButton = () => {
  return (
    <StyledWrapper>
      <button className="btn">
        <div className="scroll"> </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    width: 30px;
    height: 50px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    outline: 2px solid rgb(255, 255, 255);
    box-shadow: 0px 0px 10px rgb(255, 255, 255);
    position: relative;
  }
  

  .scroll {
    width: 5px;
    height: 10px;
    border-radius: 10px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 10px rgb(255, 255, 255);
    animation: scroll_4013 2s linear infinite;
    transform: translateY(40%);
  }
  .btn:after {
    content: 'scroll';
    position: absolute;
    top: 140%;
    color: whitesmoke;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
  }
  @media (max-width: 600px) {
    .btn {
      display: none;
    }
  }
  /* Trait descendant */
  .btn:before {
    content: '';
    position: absolute;
    top: 200%; /* Aligne avec le texte */
    left: 50%;
    transform: translateX(-50%);
    width: 2px; /* Largeur du trait */
    height: 600px; /* Hauteur du trait - ajustable */
    background-color: whitesmoke; /* Couleur du trait */
    box-shadow: 0px 0px 10px rgb(255, 255, 255);
  }

  @keyframes scroll_4013 {
    0% {
      transform: translateY(40%);
    }

    50% {
      transform: translateY(90%);
    }
  };`;

export default ScrollButton;
