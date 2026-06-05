// Import de toutes les images de projets de manière centralisée
import img1_1 from "../assets/images/project1/img1.png";
import img1_2 from "../assets/images/project1/img2.png";
import img2_1 from "../assets/images/project2/img1.png";
import img2_2 from "../assets/images/project2/img2.png";
import img2_3 from "../assets/images/project2/img3.png";
import img2_4 from "../assets/images/project2/img4.png";
import img3_1 from "../assets/images/project3/img1.png";
import img3_2 from "../assets/images/project3/img4.jpeg";
import img3_3 from "../assets/images/project3/ia.png";
import img3_4 from "../assets/images/project3/img5.png";
import img4_1 from "../assets/images/project4/img1.png";
import img4_2 from "../assets/images/project4/img2.png";
import img5_1 from "../assets/images/project5/img1.png";
import img5_2 from "../assets/images/project5/img2.png";
import img6_1 from "../assets/images/project6/img1.png";
import img6_2 from "../assets/images/project6/img2.png";
import img7_1 from "../assets/images/project7/img2.png";
import img7_2 from "../assets/images/project7/img3.png";
import img7_3 from "../assets/images/project7/img1.png";
import img7_4 from "../assets/images/project7/PokedexList.webp";
import img8_1 from "../assets/images/project8/img1.png";
import img8_2 from "../assets/images/project8/img2.png";
import img8_3 from "../assets/images/project8/img3.png";
import img8_4 from "../assets/images/project8/img4.png";
import img9_1 from "../assets/images/project9/img1.png";
import img9_2 from "../assets/images/project9/img3.png";
import img9_3 from "../assets/images/project9/img2.png";
import img9_4 from "../assets/images/project9/img4.png";
import img10_1 from "../assets/images/project10/img1.png";
import img10_2 from "../assets/images/project10/img2.png";
import img10_3 from "../assets/images/project10/img3.png";
import img10_4 from "../assets/images/project10/img4.png";
import img11_1 from "../assets/images/project11/img3.png";
import img11_2 from "../assets/images/project11/img1.png";
import img11_3 from "../assets/images/project11/img2.png";
import img11_4 from "../assets/images/project11/img4.png";

// Mapping des chemins d'images vers les imports
export const imageMap = {
  "project1/img1.png": img1_1,
  "project1/img2.png": img1_2,
  "project2/img1.png": img2_1,
  "project2/img2.png": img2_2,
  "project2/img3.png": img2_3,
  "project2/img4.png": img2_4,
  "project3/img1.png": img3_1,
  "project3/img4.jpeg": img3_2,
  "project3/ia.png": img3_3,
  "project3/img5.png": img3_4,
  "project4/img1.png": img4_1,
  "project4/img2.png": img4_2,
  "project5/img1.png": img5_1,
  "project5/img2.png": img5_2,
  "project6/img1.png": img6_1,
  "project6/img2.png": img6_2,
  "project7/img2.png": img7_1,
  "project7/img3.png": img7_2,
  "project7/img1.png": img7_3,
  "project7/PokedexList.webp": img7_4,
  "project8/img1.png": img8_1,
  "project8/img2.png": img8_2,
  "project8/img3.png": img8_3,
  "project8/img4.png": img8_4,
  "project9/img1.png": img9_1,
  "project9/img3.png": img9_2,
  "project9/img2.png": img9_3,
  "project9/img4.png": img9_4,
  "project10/img1.png": img10_1,
  "project10/img2.png": img10_2,
  "project10/img3.png": img10_3,
  "project10/img4.png": img10_4,
  "project11/img3.png": img11_1,
  "project11/img1.png": img11_2,
  "project11/img2.png": img11_3,
  "project11/img4.png": img11_4,
};

// Fonction pour obtenir une image à partir d'un chemin
export const getImage = (imagePath) => {
  if (!imagePath) return null;
  return imageMap[imagePath] || null;
};

// Fonction pour obtenir plusieurs images à partir de chemins
export const getImages = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return [];
  return imagePaths.map(path => getImage(path)).filter(img => img !== null);
};

// Mapping pour Works.jsx (images simples)
export const simpleImageMap = imageMap;

export const getSimpleImage = (imagePath) => {
  if (!imagePath) return null;
  return simpleImageMap[imagePath] || imageMap[imagePath] || null;
};
