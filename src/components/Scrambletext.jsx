import React, { useEffect, useState } from "react";

function ScrambleText({ text, speed = 80 }) {
  const [scrambled, setScrambled] = useState("");

  useEffect(() => {
    if (!text) return;

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let iteration = 0;

    const interval = setInterval(() => {
      setScrambled((prev) => {
        return text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return char;
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
      });

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="scramble-text">{scrambled}</p>;
}

export default ScrambleText;
