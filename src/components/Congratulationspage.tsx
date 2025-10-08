import React, { useEffect, useState } from 'react'
import LottieAnimation from './LottieAnimation'
import Header from './Header'
import { useRouter } from 'next/navigation'

// Import Lottie animation data
import confettiAnimation from '../assets/animations/confetti.json'

interface CongratulationsPageProps {
    title?: string;
    description?: string;
    buttonText?: string;
    navigationLink?: string;
    headerTitle?: string;
    closeLink?: string;
}

const Congratulationspage: React.FC<CongratulationsPageProps> = ({
    title = "Congratulations!",
    description = "You have finished your organization setup. Now you are all set and ready to begin your journey in the organization. You can go back to the home page and explore other tasks which are waiting for you.",
    buttonText = "Go to home page",
    navigationLink = "/",
    headerTitle = "MSP setup",
    closeLink = "/"
}) => {
    const [showAnimations, setShowAnimations] = useState(false)
    const router = useRouter()
    
    useEffect(() => {
        // Trigger animations on component mount
        setShowAnimations(true)
    }, [])

    const handleNavigation = () => {
        router.push(navigationLink)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header
                title={headerTitle}
                showMenuButton={false}
                showCloseButton={true}
                closebuttononclick={() => router.push('/')}
            />

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full text-center relative overflow-hidden">
                    {/* Lottie Confetti Animation */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        {showAnimations && (
                            <LottieAnimation
                                animationData={confettiAnimation}
                                loop={false}
                                autoplay={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        )}
                    </div>

                    {/* Checkmark circle */}
                    <div className="mt-8 mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Congratulations heading with fade-in animation */}
                    <h1 className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-1000 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '0.8s' }}>
                        {title}
                    </h1>

                    {/* Description text with fade-in animation */}
                    <p className={`text-gray-700 text-base leading-relaxed mb-8 transition-all duration-1000 ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: '1s' }}>
                        {description}
                    </p>

                    {/* Button with fade-in animation */}
                    <button
                        onClick={handleNavigation}
                        className={`bg-purple hover:bg-purple text-white font-medium py-3 px-6 rounded-lg transition-all duration-200  ${showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ animationDelay: '1.2s' }}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Congratulationspage