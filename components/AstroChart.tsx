import React from 'react';

// Type definitions
type PlanetSymbol = {
  [key in PlanetName]: string;
};

type PlanetColor = {
  [key in PlanetName]: string;
};

type PlanetPositions = {
  [key in PlanetName]: number;
};

type House = {
  house: number;
  degree: number;
};

type PlanetName = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Rahu' | 'Ketu';

type Position = {
  x: number;
  y: number;
};

const PLANET_SYMBOLS: PlanetSymbol = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '⛢',
  Neptune: '♆',
  Rahu: '☊',
  Ketu: '☋'
};

const PLANET_COLORS: PlanetColor = {
  Sun: '#FFD700',
  Moon: '#C0C0C0',
  Mercury: '#A0522D',
  Venus: '#FF69B4',
  Mars: '#FF4500',
  Jupiter: '#4169E1',
  Saturn: '#708090',
  Uranus: '#40E0D0',
  Neptune: '#00BFFF',
  Rahu: '#4B0082',
  Ketu: '#800080'
};

interface AstroChartProps {
  planetPositions: PlanetPositions;
  houses: House[];
}

const AstroChart: React.FC<AstroChartProps> = ({ planetPositions, houses }) => {
  const calculatePosition = (degree: number, radius: number): Position => {
    // Convert degree to radians and adjust for SVG coordinate system
    const radian = (degree - 90) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(radian),
      y: 200 + radius * Math.sin(radian)
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <svg viewBox="0 0 400 400" className="w-full">
        {/* Background */}
        <circle cx="200" cy="200" r="200" fill="#1a1a1a" />

        {/* Outer circle */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

        {/* Inner circles */}
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Zodiac divisions - 30 degrees each */}
        {[...Array(12)].map((_, i) => (
          <g key={i}>
            <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(255,255,255,0.2)" strokeWidth="1" transform={`rotate(${i * 30} 200 200)`} />
            <text
              x={calculatePosition(i * 30, 190).x}
              y={calculatePosition(i * 30, 190).y}
              fill="white"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {i * 30}°
            </text>
          </g>
        ))}

        {/* Planets */}
        {Object.entries(planetPositions).map(([planet, degree]) => {
          const pos = calculatePosition(degree, 150);
          return (
            <g key={planet}>
              <circle cx={pos.x} cy={pos.y} r="4" fill={PLANET_COLORS[planet as PlanetName]} />
              <text
                x={pos.x}
                y={pos.y - 10}
                fill={PLANET_COLORS[planet as PlanetName]}
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold"
              >
                {PLANET_SYMBOLS[planet as PlanetName]}
              </text>
              <text
                x={pos.x}
                y={pos.y + 15}
                fill="white"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(degree)}°
              </text>
            </g>
          );
        })}

        {/* Houses */}
        {houses.map((house) => {
          const housePos = calculatePosition(house.degree, 100);
          return (
            <g key={house.house}>
              <text
                x={housePos.x}
                y={housePos.y}
                fill="white"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {house.house}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AstroChart;
