// Import de toutes les images de projets de manière centralisée
import img1 from "../assets/images/project1/img1.png";
import img11 from "../assets/images/project1/ia.png";
import img12 from "../assets/images/project1/img4.jpeg";
import img13 from "../assets/images/project1/img5.png";
import img2 from "../assets/images/project2/img2.png";
import img22 from "../assets/images/project2/PokedexList.webp";
import img21 from "../assets/images/project2/img1.png";
import img23 from "../assets/images/project2/img3.png";
import img3 from "../assets/images/project3/img1.png";
import img32 from "../assets/images/project3/img2.png";
import img31 from "../assets/images/project3/img3.png";
import img33 from "../assets/images/project3/img4.png";
import img4 from "../assets/images/project4/img1.png";
import img41 from "../assets/images/project4/img2.png";
import img42 from "../assets/images/project4/img3.png";
import img43 from "../assets/images/project4/img4.png";
import img5 from "../assets/images/project5/img3.png";
import img51 from "../assets/images/project5/img1.png";
import img52 from "../assets/images/project5/img2.png";
import img53 from "../assets/images/project5/img4.png";
import img6 from "../assets/images/project6/img1.png";
import img61 from "../assets/images/project6/img2.png";
import img62 from "../assets/images/project6/img3.png";
import img63 from "../assets/images/project6/img4.png";

// Mapping des chemins d'images vers les imports
export const imageMap = {
  "project1/img1.png": img1,
  "project1/ia.png": img11,
  "project1/img4.jpeg": img12,
  "project1/img5.png": img13,
  "project2/img2.png": img2,
  "project2/PokedexList.webp": img22,
  "project2/img1.png": img21,
  "project2/img3.png": img23,
  "project3/img1.png": img3,
  "project3/img2.png": img32,
  "project3/img3.png": img31,
  "project3/img4.png": img33,
  "project4/img1.png": img4,
  "project4/img2.png": img41,
  "project4/img3.png": img42,
  "project4/img4.png": img43,
  "project5/img3.png": img5,
  "project5/img1.png": img51,
  "project5/img2.png": img52,
  "project5/img4.png": img53,
  "project6/img1.png": img6,
  "project6/img2.png": img61,
  "project6/img3.png": img62,
  "project6/img4.png": img63,
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
export const simpleImageMap = {
  "project1/img1.png": img1,
  "project2/img2.png": img2,
  "project3/img1.png": img3,
  "project4/img1.png": img4,
  "project5/img3.png": img5,
  "project6/img1.png": img6,
};

export const getSimpleImage = (imagePath) => {
  if (!imagePath) return null;
  return simpleImageMap[imagePath] || imageMap[imagePath] || null;
};

