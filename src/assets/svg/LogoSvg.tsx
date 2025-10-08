import React from 'react';

interface LogoSvgProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const LogoSvg: React.FC<LogoSvgProps> = ({ 
  width = 49, 
  height = 32, 
  color = "white",
  className = ""
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 49 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M18.709 12.4445H31.1817" stroke={color} strokeWidth="2.66667" />
      <path d="M18.709 19.5555H31.1817" stroke={color} strokeWidth="2.66667" />
      <path d="M2.67285 8.88867H20.491" stroke={color} strokeWidth="2.66667" />
      <path d="M1.78223 16H19.6004" stroke={color} strokeWidth="2.66667" />
      <path d="M2.67285 23.1113H20.491" stroke={color} strokeWidth="2.66667" />
      <path d="M16.0361 1.33301C24.1592 1.33301 30.7393 7.90268 30.7393 16C30.7393 24.0973 24.1592 30.667 16.0361 30.667C7.91312 30.6669 1.33301 24.0972 1.33301 16C1.33301 7.90275 7.91312 1.33313 16.0361 1.33301Z" stroke={color} strokeWidth="2.66667" />
      <path d="M29.3994 8.88867L46.3267 8.88867" stroke={color} strokeWidth="2.66667" />
      <path d="M29.3994 16L48.1085 16" stroke={color} strokeWidth="2.66667" />
      <path d="M29.3994 23.1113L46.3267 23.1113" stroke={color} strokeWidth="2.66667" />
      <path d="M32.9629 1.33301C41.086 1.33301 47.666 7.90268 47.666 16C47.666 24.0973 41.086 30.667 32.9629 30.667C24.8399 30.6669 18.2598 24.0972 18.2598 16C18.2598 7.90275 24.8399 1.33313 32.9629 1.33301Z" stroke={color} strokeWidth="2.66667" />
    </svg>
  );
};

export default LogoSvg;
