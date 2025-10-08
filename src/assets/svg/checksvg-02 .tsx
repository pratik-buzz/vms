import React from 'react';

interface SvgProps {
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

const CheckSvg2: React.FC<SvgProps> = ({
    width = 38,
    height = 38,
    color = "white",
    className = ""
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.3">
                <rect x="6" y="6" width="26" height="26" rx="13" stroke="#079455" stroke-width="2" />
            </g>
            <g opacity="0.1">
                <rect x="1" y="1" width="36" height="36" rx="18" stroke="#079455" stroke-width="2" />
            </g>
            <g clip-path="url(#clip0_211_1160)">
                <path d="M15.2501 19L17.7501 21.5L22.7501 16.5M27.3334 19C27.3334 23.6023 23.6025 27.3333 19.0001 27.3333C14.3977 27.3333 10.6667 23.6023 10.6667 19C10.6667 14.3976 14.3977 10.6666 19.0001 10.6666C23.6025 10.6666 27.3334 14.3976 27.3334 19Z" stroke="#079455" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_211_1160">
                    <rect width="20" height="20" fill="white" transform="translate(9 9)" />
                </clipPath>
            </defs>
        </svg>



    );
};

export default CheckSvg2;