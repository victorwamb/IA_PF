import React from "react";
import { useNavigate } from "react-router-dom";
import "./products.css";
import img11 from "../assets/images/project1/img1.png";
import img12 from "../assets/images/project1/img2.png";
import img13 from "../assets/images/project1/img3.png";
import img21 from "../assets/images/project2/img1.png";
import img22 from "../assets/images/project2/img2.png";
import img23 from "../assets/images/project2/img3.png";
import img31 from "../assets/images/project6/img1.png";
import img32 from "../assets/images/project6/img2.png";
import img33 from "../assets/images/project6/img3.png";
import styled from "styled-components";
import { useLanguage } from "./languageContext"; 

const translations = {
  en: {
    title: "My Works",
    description:
      "This is a description of my works. It talks about the projects, the creativity involved, and the inspiration behind them. Explore to discover more about my journey.",
    seeMore: "SEE MORE",
    products: ["Product 1", "Product 2", "Product 3"],
  },
  fr: {
    title: "Mes Travaux",
    description:
      "Voici une description de mes œuvres. Elle parle des projets, de la créativité impliquée et de l'inspiration derrière eux. Explorez pour en savoir plus sur mon parcours.",
    seeMore: "VOIR PLUS",
    products: ["Produit 1", "Produit 2", "Produit 3"],
  },
};

const productsData = [
  {
    id: 1,
    creationDate: "2024",
    mainImage: img11,
    topImage: img12,
    bottomImage: img13,
  },
  {
    id: 2,
    creationDate: "2025",
    mainImage: img22,
    topImage: img21,
    bottomImage: img23,
  },
  {
    id: 3,
    creationDate: "2023",
    mainImage: img31,
    topImage: img32,
    bottomImage: img33,
  },
];

const Products = () => {
  const navigate = useNavigate();
  const { language } = useLanguage(); 

  const handleDiscoverMore = (id) => {
    navigate(`/project-detail/${id}`);
  };

  const goToStyledPage = () => {
    navigate(`/works`);
  };

  return (
    <div className="products-container">
      {/* Section combinée avec le premier bloc et le texte */}
      <div className="first-section">
        <div className="product-card left">
          <div className="product-background">
            <span className="product-id">01</span>
            <span className="product-date">2024</span>
            <div className="images-wrapper">
              <img
                onClick={() => handleDiscoverMore(1)}
                src={img11}
                alt={translations[language]?.products?.[0] || "Product"}
                className="main-image"
              />
              <img
                src={img12}
                alt={`${translations[language]?.products?.[0] || "Product"} top`}
                className="secondary-image top-image"
              />
              <img
                src={img13}
                alt={`${translations[language]?.products?.[0] || "Product"} bottom`}
                className="secondary-image bottom-image"
              />
            </div>
          </div>
        </div>

        {/* Texte à droite du premier bloc */}
        <div className="text-section">
          <h2>{translations[language]?.title || "Title"}</h2>
          <p>{translations[language]?.description || "Description"}</p>
          <ContactButton onClick={goToStyledPage}>
            {translations[language]?.seeMore || "See More"}
          </ContactButton>
        </div>
      </div>

      {/* Les autres produits */}
      {productsData.slice(1).map((product, index) => (
        <div
          key={product.id}
          className={`product-card ${index % 2 === 0 ? "right" : "left"}`}
        >
          <div className="product-background">
            <span className="product-id">0{product.id}</span>
            <span className="product-date">{product.creationDate}</span>
            <div className="images-wrapper">
              <img
                onClick={() => handleDiscoverMore(product.id)}
                src={product.mainImage}
                alt={translations[language]?.products?.[index + 1] || "Product"}
                className="main-image"
              />
              <img
                src={product.topImage}
                alt={`${translations[language]?.products?.[index + 1] || "Product"} top`}
                className="secondary-image top-image"
              />
              <img
                src={product.bottomImage}
                alt={`${translations[language]?.products?.[index + 1] || "Product"} bottom`}
                className="secondary-image bottom-image"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;

export const ContactButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.75rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  width: fit-content;
  margin-left: 25%; /* Marge par défaut */

  &:hover {
    background-color: #fff;
    color: #000;
  }

  /* Media query pour enlever la marge sur les petits écrans */
  @media (max-width: 768px) {
    margin-left: 0; /* Enlève la marge sur les écrans petits */
  }
`;
