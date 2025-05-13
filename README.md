# AlgoArena

A modern web application built with React, TypeScript, and Vite, featuring real-time data management with Supabase and translation capabilities.

## Features

- Modern React with TypeScript
- Real-time data management with Supabase
- Translation support
- Tailwind CSS for styling
- ESLint for code quality
- Vite for fast development and building

## Prerequisites

Before you begin, ensure you have the following installed:

- npm (Latest version recommended)

## Getting Started

1. Clone the repository:

```bash
git clone [your-repository-url]
cd AlgoArena
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── data/          # Data-related utilities
├── lib/           # Utility functions and helpers
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Supabase
- Tailwind CSS
- ESLint
- Google Translate API
