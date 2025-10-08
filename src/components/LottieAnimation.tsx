import React from 'react'
import Lottie from 'lottie-react'

interface LottieAnimationProps {
    animationData: any
    loop?: boolean
    autoplay?: boolean
    style?: React.CSSProperties
    className?: string
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
    animationData,
    loop = true,
    autoplay = true,
    style = {},
    className = ''
}) => {
    return (
        <Lottie
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            style={style}
            className={className}
        />
    )
}

export default LottieAnimation
