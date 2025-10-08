import React from 'react';

interface SvgProps {
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export const LinkSvg: React.FC<SvgProps> = ({
    width = 55,
    height = 55,
    color = "white",
    className = ""
}) => {
    return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.75 17.5H17.5C10.5964 17.5 5 23.0964 5 30C5 36.9036 10.5964 42.5 17.5 42.5H22.5C29.4036 42.5 35 36.9036 35 30M41.25 42.5H42.5C49.4036 42.5 55 36.9036 55 30C55 23.0964 49.4036 17.5 42.5 17.5H37.5C30.5964 17.5 25 23.0964 25 30" stroke="#7F56D9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export const UsereditSvg: React.FC<SvgProps> = ({
    width = 55,
    height = 55,
    color = "white",
    className = ""
}) => {
    return (
        <svg width="55" height="50" viewBox="0 0 55 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 33.75H16.75C13.2611 33.75 11.5166 33.75 10.0971 34.1806C6.90114 35.1501 4.4001 37.6511 3.4306 40.8471C3 42.2666 3 44.0111 3 47.5M34.25 13.75C34.25 19.9632 29.2132 25 23 25C16.7868 25 11.75 19.9632 11.75 13.75C11.75 7.5368 16.7868 2.5 23 2.5C29.2132 2.5 34.25 7.5368 34.25 13.75ZM25.5 47.5L33.2534 45.2847C33.6247 45.1787 33.8103 45.1256 33.9835 45.0461C34.1372 44.9755 34.2834 44.8895 34.4198 44.7894C34.5733 44.6767 34.7099 44.5401 34.9829 44.2671L51.1251 28.1251C52.8511 26.3992 52.8511 23.6008 51.1251 21.8749C49.3992 20.1491 46.6009 20.1491 44.875 21.875L28.7329 38.0171C28.4599 38.2901 28.3233 38.4267 28.2106 38.5802C28.1105 38.7166 28.0245 38.8628 27.9539 39.0165C27.8744 39.1897 27.8213 39.3753 27.7152 39.7466L25.5 47.5Z" stroke="#7F56D9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};




