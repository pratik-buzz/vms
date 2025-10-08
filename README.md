# Next.js Dashboard

This project has been converted from a Vite React application to Next.js using the App Router.

## Features

- Modern dashboard interface with sidebar navigation
- Responsive design with Tailwind CSS
- TypeScript support
- Component-based architecture
- Modal setup functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # Reusable components
│   ├── DashboardContent.tsx
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   ├── SetupModal.tsx
│   ├── Sidebar.tsx
│   └── TopNavbar.tsx
└── index.css             # Global styles
```

## Key Changes Made

1. **Package.json**: Updated dependencies from Vite to Next.js
2. **App Router**: Converted to Next.js 13+ App Router structure
3. **TypeScript**: Updated configuration for Next.js
4. **Components**: Added 'use client' directive to interactive components
5. **Configuration**: Replaced Vite config with Next.js config
6. **Build System**: Switched from Vite to Next.js build system

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
