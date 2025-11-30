CineVault - Movie Discovery SPA
Overview

Features Available Now:important****
✅ Browse movies in demo mode
✅ Search movies
✅ Filter by genre
✅ Sort by popularity, rating, release date
✅ View movie details
✅ Add/remove favorites (saves to localStorage)
✅ Dark/light mode toggle
✅ Fully responsive design
✅ Pagination


CineVault is a fully functional Single Page Application (SPA) integrating with the TMDB (The Movie Database) API. Users can discover, search, and save their favorite movies. Built using React, TypeScript, and Tailwind CSS.

Technology Stack

Frontend: React 18 + TypeScript + Vite
Routing: Wouter (lightweight React router)
State Management: TanStack Query for server state, React Context for client state
Styling: Tailwind CSS with custom design tokens
Backend: Express.js (API proxy for TMDB)
Icons: Lucide React

Project Structure
client/
├── src/
│   ├── components/          
│   │   ├── ui/              
│   │   ├── Navbar.tsx       
│   │   ├── MovieCard.tsx    
│   │   ├── MovieFilters.tsx 
│   │   ├── Pagination.tsx   
│   │   ├── Loader.tsx       
│   │   ├── ErrorMessage.tsx 
│   │   └── EmptyState.tsx   
│   ├── pages/               
│   │   ├── Home.tsx         
│   │   ├── Movies.tsx       
│   │   ├── MovieDetail.tsx  
│   │   ├── Favorites.tsx    
│   │   └── not-found.tsx    
│   ├── lib/                 
│   │   ├── theme.tsx        
│   │   ├── favorites.tsx    
│   │   ├── queryClient.ts   
│   │   └── utils.ts         
│   ├── App.tsx              
│   └── index.css            
server/
├── routes.ts                
└── storage.ts                
shared/
└── schema.ts                


Features:

1. Home Page: Hero section with featured movie, trending and popular sections
2. Movies Page: Discover movies with filters, sorting, and pagination
3. Movie Detail: Full movie info with cast, crew, and metadata
4. Favorites: Save movies locally with localStorage persistence
5. Search: Live search with autocomplete
6. Dark/Light Mode: Theme toggle with localStorage persistence

API Routes

1. GET /api/movies/popular - Popular movies
2. GET /api/movies/trending - Trending movies
3. GET /api/movies/discover?page=&sort_by=&with_genres= - Discover with filters
4. GET /api/movies/search?query= - Search movies
5. GET /api/movies/:id - Movie details
6. GET /api/movies/:id/credits - Movie credits
7. GET /api/genres - Genre list

Running the Project:

Backend: Express server serving API routes
Frontend: Vite dev server with HMR
Default port: 5000

Design System:

Primary color: Purple (#8B5CF6)
Dark mode optimized for a cinema experience
Inter font family for UI
Consistent spacing using Tailwind's scale
Card-based layouts for movie grids

Recent Updates:

Full SPA functionality
TMDB API integration
Dark/light mode support
Favorites with localStorage
Autocomplete search
Responsive design for all devices
