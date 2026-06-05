import React, { useEffect, useState } from 'react';
import './Loader2.css';

export default function Loader2() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader2">
      <div className="loader2__content">
        <span className="loader2__name">VW</span>
        <div className="loader2__bar-track">
          <div
            className="loader2__bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="loader2__percent">
          {Math.min(Math.round(progress), 100)}%
        </span>
      </div>
    </div>
  );
}
