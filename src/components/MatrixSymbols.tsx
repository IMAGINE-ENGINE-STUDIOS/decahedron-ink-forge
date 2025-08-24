import React from 'react';

const MatrixSymbols: React.FC = () => {
  const symbols = ['$', '£', '€', '¥', '₿', '₹', '₽', '₩', '₪', '₦', '₴', '₡', '₵'];
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {Array.from({ length: 300 }).map((_, i) => {
        const symbol = symbols[i % symbols.length];
        const x = (i % 30) * 3.33;
        const y = Math.floor(i / 30) * 10;
        const delay = (i * 0.1) % 15;
        const duration = 8 + Math.random() * 4;
        
        return (
          <div
            key={i}
            className="absolute font-technical text-technical-line"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animation: `matrix-fall ${duration}s linear ${delay}s infinite`,
              fontSize: `${0.7 + Math.random() * 0.3}rem`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            {symbol}
          </div>
        );
      })}
    </div>
  );
};

export default MatrixSymbols;