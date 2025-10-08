import type { Metadata } from 'next'
import '../index.css'
import { ToastProvider } from '../contexts/ToastContext'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Modern dashboard application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    )
}
