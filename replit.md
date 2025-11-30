# CineVault - Movie Discovery SPA

## Overview
CineVault is a fully functional Single Page Application (SPA) that integrates with the TMDB (The Movie Database) API to allow users to discover, search, and save their favorite movies. Built with React, TypeScript, and Tailwind CSS.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state, React Context for client state
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Express.js (API proxy for TMDB)
- **Icons**: Lucide React

## Project Structure
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Shadcn components
│   │   ├── Navbar.tsx       # Navigation with search
│   │   ├── MovieCard.tsx    # Movie card component
│   │   ├── MovieFilters.tsx # Filter/sort controls
│   │   ├── Pagination.tsx   # Pagination component
│   │   ├── Loader.tsx       # Loading spinner
│   │   ├── ErrorMessage.tsx # Error display
│   │   └── EmptyState.tsx   # Empty state displays
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page with hero
│   │   ├── Movies.tsx       # Movie list with filters
│   │   ├── MovieDetail.tsx  # Single movie details
│   │   ├── Favorites.tsx    # User favorites
│   │   └── not-found.tsx    # 404 page
│   ├── lib/                 # Utilities and contexts
│   │   ├── theme.tsx        # Dark/light mode context
│   │   ├── favorites.tsx    # Favorites context
│   │   ├── queryClient.ts   # TanStack Query setup
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Root component
│   └── index.css            # Global styles
server/
├── routes.ts                # API endpoints (TMDB proxy)
└── storage.ts               # Storage interface
shared/
└── schema.ts                # TypeScript types/interfaces
```

## Features
1. **Home Page**: Hero section with featured movie, trending and popular sections
2. **Movies Page**: Discover movies with filters (genre), sorting, and pagination
3. **Movie Detail**: Full movie info with cast, crew, and metadata
4. **Favorites**: Save movies locally with localStorage persistence
5. **Search**: Live search with autocomplete in navbar
6. **Dark/Light Mode**: Theme toggle with localStorage persistence

## API Routes
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/trending` - Trending movies
- `GET /api/movies/discover?page=&sort_by=&with_genres=` - Discover with filters
- `GET /api/movies/search?query=` - Search movies
- `GET /api/movies/:id` - Movie details
- `GET /api/movies/:id/credits` - Movie credits (cast/crew)
- `GET /api/genres` - Genre list

## Running the Project
The app runs on port 5000 with:
- Express backend serving API routes
- Vite dev server for frontend with HMR

## Design System
- Primary color: Purple (#8B5CF6)
- Dark mode optimized for cinema experience
- Inter font family for UI
- Consistent spacing using Tailwind's spacing scale
- Card-based layouts for movie grids

## Recent Changes
- Initial project setup with full SPA functionality
- TMDB API integration
- Dark/light mode support
- Favorites with localStorage
- Search with autocomplete
- Responsive design for all devices
