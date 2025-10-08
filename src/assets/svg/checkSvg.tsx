import React from 'react';

interface SvgProps {
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

const CheckSvg: React.FC<SvgProps> = ({
    width = 20,
    height = 20,
    color = "white",
    className = ""
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6668 5L7.50016 14.1667L3.3335 10" stroke="#17B26A" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export default CheckSvg;