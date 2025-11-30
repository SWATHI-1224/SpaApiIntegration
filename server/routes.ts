import type { Express } from "express";
import { createServer, type Server } from "http";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Sample movie data for demo mode when no API key is available
const sampleMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an arbitrary warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates for his integrity and unquenchable sense of hope.",
    poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    release_date: "1994-09-23",
    vote_average: 8.7,
    vote_count: 24892,
    popularity: 120.5,
    genre_ids: [18, 80],
    adult: false,
    original_language: "en",
    original_title: "The Shawshank Redemption",
    video: false
  },
  {
    id: 2,
    title: "The Godfather",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    release_date: "1972-03-14",
    vote_average: 8.7,
    vote_count: 18892,
    popularity: 105.2,
    genre_ids: [18, 80],
    adult: false,
    original_language: "en",
    original_title: "The Godfather",
    video: false
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 30782,
    popularity: 95.8,
    genre_ids: [28, 80, 18],
    adult: false,
    original_language: "en",
    original_title: "The Dark Knight",
    video: false
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    vote_count: 25892,
    popularity: 88.3,
    genre_ids: [53, 80],
    adult: false,
    original_language: "en",
    original_title: "Pulp Fiction",
    video: false
  },
  {
    id: 5,
    title: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all his accomplishments, his one true love eludes him.",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: "/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
    release_date: "1994-06-23",
    vote_average: 8.5,
    vote_count: 25123,
    popularity: 82.1,
    genre_ids: [35, 18, 10749],
    adult: false,
    original_language: "en",
    original_title: "Forrest Gump",
    video: false
  },
  {
    id: 6,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 34256,
    popularity: 78.5,
    genre_ids: [28, 878, 12],
    adult: false,
    original_language: "en",
    original_title: "Inception",
    video: false
  },
  {
    id: 7,
    title: "The Matrix",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 23456,
    popularity: 75.2,
    genre_ids: [28, 878],
    adult: false,
    original_language: "en",
    original_title: "The Matrix",
    video: false
  },
  {
    id: 8,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 32145,
    popularity: 72.8,
    genre_ids: [12, 18, 878],
    adult: false,
    original_language: "en",
    original_title: "Interstellar",
    video: false
  },
  {
    id: 9,
    title: "Fight Club",
    overview: "A ticking-Loss bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground 'fight clubs' forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 26789,
    popularity: 68.9,
    genre_ids: [18],
    adult: false,
    original_language: "en",
    original_title: "Fight Club",
    video: false
  },
  {
    id: 10,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.",
    poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    backdrop_path: "/pIUvQ9Ed35wlWhY2oU6OmwEsmzG.jpg",
    release_date: "2001-12-18",
    vote_average: 8.4,
    vote_count: 22567,
    popularity: 65.4,
    genre_ids: [12, 14, 28],
    adult: false,
    original_language: "en",
    original_title: "The Lord of the Rings: The Fellowship of the Ring",
    video: false
  },
  {
    id: 11,
    title: "Gladiator",
    overview: "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor. As Marcus' devious son combats Maximus is reduced to slavery.",
    poster_path: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    backdrop_path: "/hnd18NxdLvfFAFt8nxQ9nLpPlJ3.jpg",
    release_date: "2000-05-01",
    vote_average: 8.2,
    vote_count: 16234,
    popularity: 62.1,
    genre_ids: [28, 18, 12],
    adult: false,
    original_language: "en",
    original_title: "Gladiator",
    video: false
  },
  {
    id: 12,
    title: "The Avengers",
    overview: "When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster.",
    poster_path: "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    backdrop_path: "/kwUQFeFXOOpgloMgZaadhzkbCY6.jpg",
    release_date: "2012-04-25",
    vote_average: 7.7,
    vote_count: 28945,
    popularity: 58.7,
    genre_ids: [28, 12, 878],
    adult: false,
    original_language: "en",
    original_title: "The Avengers",
    video: false
  },
  {
    id: 13,
    title: "Jurassic Park",
    overview: "A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA. Before opening day, he invites a team of experts and his two eager grandchildren to experience the park and help calm anxious investors.",
    poster_path: "/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    backdrop_path: "/b35Vs4Y8g2LL7oMKIBFdPcKGQNz.jpg",
    release_date: "1993-06-11",
    vote_average: 7.9,
    vote_count: 14567,
    popularity: 55.3,
    genre_ids: [12, 878, 53],
    adult: false,
    original_language: "en",
    original_title: "Jurassic Park",
    video: false
  },
  {
    id: 14,
    title: "Titanic",
    overview: "101-year-old Rose DeWitt Bukater tells the story of her life aboard the Titanic, 84 years later. A young Rose boards the ship with her mother and fiancé. Meanwhile, Jack Dawson and Fabrizio De Rossi win third-class tickets aboard the ship.",
    poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    backdrop_path: "/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg",
    release_date: "1997-11-18",
    vote_average: 7.9,
    vote_count: 23456,
    popularity: 52.8,
    genre_ids: [18, 10749],
    adult: false,
    original_language: "en",
    original_title: "Titanic",
    video: false
  },
  {
    id: 15,
    title: "Avatar",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    poster_path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop_path: "/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
    release_date: "2009-12-15",
    vote_average: 7.6,
    vote_count: 27890,
    popularity: 50.1,
    genre_ids: [28, 12, 14, 878],
    adult: false,
    original_language: "en",
    original_title: "Avatar",
    video: false
  },
  {
    id: 16,
    title: "The Lion King",
    overview: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows up beyond the Savannah, living by a philosophy: No worries for the rest of your days.",
    poster_path: "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    backdrop_path: "/wXsQvli6tWqja51pYxXNG1LFIGV.jpg",
    release_date: "1994-06-24",
    vote_average: 8.3,
    vote_count: 16789,
    popularity: 48.5,
    genre_ids: [16, 10751, 18],
    adult: false,
    original_language: "en",
    original_title: "The Lion King",
    video: false
  },
  {
    id: 17,
    title: "Schindler's List",
    overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    backdrop_path: "/cTNYRUTXkBgPH3wP3kmPUB2ha1d.jpg",
    release_date: "1993-12-15",
    vote_average: 8.6,
    vote_count: 14234,
    popularity: 45.2,
    genre_ids: [18, 36, 10752],
    adult: false,
    original_language: "en",
    original_title: "Schindler's List",
    video: false
  },
  {
    id: 18,
    title: "The Silence of the Lambs",
    overview: "Clarice Starling is a top student at the FBI's training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath, serving life behind bars for various acts of murder and cannibalism.",
    poster_path: "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    backdrop_path: "/mfwq2nMBzArzQ7Y9RKE8SKeeTkg.jpg",
    release_date: "1991-02-01",
    vote_average: 8.3,
    vote_count: 13456,
    popularity: 42.8,
    genre_ids: [80, 18, 53],
    adult: false,
    original_language: "en",
    original_title: "The Silence of the Lambs",
    video: false
  },
  {
    id: 19,
    title: "Back to the Future",
    overview: "Eighties teenager Marty McFly is accidentally sent back in time to 1955, inadvertently disrupting his parents' first meeting and attracting his mother's romantic interest. Marty must repair the damage to history by rekindling his parents' romance.",
    poster_path: "/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
    backdrop_path: "/x4N74cycZvKu5k3KDERJay4ajR3.jpg",
    release_date: "1985-07-03",
    vote_average: 8.3,
    vote_count: 17890,
    popularity: 40.5,
    genre_ids: [12, 35, 878],
    adult: false,
    original_language: "en",
    original_title: "Back to the Future",
    video: false
  },
  {
    id: 20,
    title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/6oaL4DP75yABrd5EbC4H2zq5ghc.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    vote_count: 14567,
    popularity: 38.2,
    genre_ids: [16, 10751, 14],
    adult: false,
    original_language: "ja",
    original_title: "千と千尋の神隠し",
    video: false
  }
];

const sampleGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

// Check if we're in demo mode (no API key)
const isDemoMode = !TMDB_API_KEY;

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    throw new Error('DEMO_MODE');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Helper function to filter and sort sample movies
function getFilteredMovies(options: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  query?: string;
}) {
  let movies = [...sampleMovies];
  const page = options.page || 1;
  const perPage = 20;

  // Filter by genre
  if (options.with_genres) {
    const genreId = parseInt(options.with_genres);
    movies = movies.filter(m => m.genre_ids.includes(genreId));
  }

  // Filter by search query
  if (options.query) {
    const query = options.query.toLowerCase();
    movies = movies.filter(m => 
      m.title.toLowerCase().includes(query) || 
      m.overview.toLowerCase().includes(query)
    );
  }

  // Sort
  if (options.sort_by) {
    const [field, direction] = options.sort_by.split('.');
    movies.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (field) {
        case 'popularity':
          aVal = a.popularity;
          bVal = b.popularity;
          break;
        case 'vote_average':
          aVal = a.vote_average;
          bVal = b.vote_average;
          break;
        case 'release_date':
          aVal = new Date(a.release_date).getTime();
          bVal = new Date(b.release_date).getTime();
          break;
        default:
          aVal = a.popularity;
          bVal = b.popularity;
      }
      return direction === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }

  const totalResults = movies.length;
  const totalPages = Math.ceil(totalResults / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedMovies = movies.slice(startIndex, startIndex + perPage);

  return {
    page,
    results: paginatedMovies,
    total_pages: totalPages,
    total_results: totalResults
  };
}

// Get detailed movie info (add extra fields for detail page)
function getMovieDetails(id: number) {
  const movie = sampleMovies.find(m => m.id === id);
  if (!movie) return null;

  return {
    ...movie,
    runtime: 120 + Math.floor(Math.random() * 60),
    budget: Math.floor(Math.random() * 200000000),
    revenue: Math.floor(Math.random() * 1000000000),
    status: "Released",
    tagline: "An unforgettable cinematic experience.",
    genres: movie.genre_ids.map(id => sampleGenres.find(g => g.id === id)).filter(Boolean),
    production_companies: [
      { id: 1, logo_path: null, name: "Sample Studios", origin_country: "US" }
    ],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ english_name: "English", iso_639_1: "en", name: "English" }],
    homepage: null,
    imdb_id: null,
    belongs_to_collection: null
  };
}

// Get sample credits
function getMovieCredits(id: number) {
  const movie = sampleMovies.find(m => m.id === id);
  if (!movie) return null;

  return {
    cast: [
      { id: 101, name: "Lead Actor", character: "Main Character", profile_path: null, order: 0 },
      { id: 102, name: "Supporting Actor", character: "Supporting Role", profile_path: null, order: 1 },
      { id: 103, name: "Lead Actress", character: "Female Lead", profile_path: null, order: 2 },
      { id: 104, name: "Character Actor", character: "Memorable Role", profile_path: null, order: 3 },
    ],
    crew: [
      { id: 201, name: "Famous Director", job: "Director", department: "Directing", profile_path: null },
      { id: 202, name: "Talented Writer", job: "Screenplay", department: "Writing", profile_path: null },
    ]
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Log demo mode status
  if (isDemoMode) {
    console.log('🎬 Running in DEMO MODE - Using sample movie data');
    console.log('   To use live TMDB data, add TMDB_API_KEY to your secrets');
  } else {
    console.log('🎬 Connected to TMDB API');
  }

  app.get('/api/movies/popular', async (req, res) => {
    try {
      if (isDemoMode) {
        res.json(getFilteredMovies({ sort_by: 'popularity.desc' }));
        return;
      }
      const page = req.query.page as string || '1';
      const data = await tmdbFetch('/movie/popular', { page });
      res.json(data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        res.json(getFilteredMovies({ sort_by: 'popularity.desc' }));
      } else {
        res.status(500).json({ error: 'Failed to fetch popular movies' });
      }
    }
  });

  app.get('/api/movies/trending', async (req, res) => {
    try {
      if (isDemoMode) {
        res.json(getFilteredMovies({ sort_by: 'vote_average.desc' }));
        return;
      }
      const data = await tmdbFetch('/trending/movie/week');
      res.json(data);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        res.json(getFilteredMovies({ sort_by: 'vote_average.desc' }));
      } else {
        res.status(500).json({ error: 'Failed to fetch trending movies' });
      }
    }
  });

  app.get('/api/movies/discover', async (req, res) => {
    try {
      const { page, sort_by, with_genres } = req.query;
      
      if (isDemoMode) {
        res.json(getFilteredMovies({
          page: parseInt(page as string) || 1,
          sort_by: sort_by as string || 'popularity.desc',
          with_genres: with_genres as string
        }));
        return;
      }
      
      const data = await tmdbFetch('/discover/movie', {
        page: page as string || '1',
        sort_by: sort_by as string || 'popularity.desc',
        with_genres: with_genres as string || '',
        include_adult: 'false',
        include_video: 'false',
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching discover movies:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        const { page, sort_by, with_genres } = req.query;
        res.json(getFilteredMovies({
          page: parseInt(page as string) || 1,
          sort_by: sort_by as string || 'popularity.desc',
          with_genres: with_genres as string
        }));
      } else {
        res.status(500).json({ error: 'Failed to discover movies' });
      }
    }
  });

  app.get('/api/movies/search/:query', async (req, res) => {
    try {
      const query = req.params.query;
      const page = req.query.page as string || '1';
      
      if (isDemoMode) {
        res.json(getFilteredMovies({ query, page: parseInt(page) }));
        return;
      }
      
      const data = await tmdbFetch('/search/movie', {
        query,
        page,
        include_adult: 'false',
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error searching movies:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        const query = req.params.query;
        res.json(getFilteredMovies({ query }));
      } else {
        res.status(500).json({ error: 'Failed to search movies' });
      }
    }
  });

  app.get('/api/movies/:id/credits', async (req, res) => {
    try {
      const movieId = req.params.id;
      
      if (isDemoMode) {
        const credits = getMovieCredits(parseInt(movieId));
        if (credits) {
          res.json(credits);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
        return;
      }
      
      const data = await tmdbFetch(`/movie/${movieId}/credits`, {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        const credits = getMovieCredits(parseInt(req.params.id));
        if (credits) {
          res.json(credits);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } else {
        res.status(500).json({ error: 'Failed to fetch movie credits' });
      }
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      
      if (isDemoMode) {
        const movie = getMovieDetails(parseInt(movieId));
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
        return;
      }
      
      const data = await tmdbFetch(`/movie/${movieId}`, {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        const movie = getMovieDetails(parseInt(req.params.id));
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } else {
        res.status(500).json({ error: 'Failed to fetch movie details' });
      }
    }
  });

  app.get('/api/genres', async (req, res) => {
    try {
      if (isDemoMode) {
        res.json({ genres: sampleGenres });
        return;
      }
      
      const data = await tmdbFetch('/genre/movie/list', {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      if (isDemoMode || (error as Error).message === 'DEMO_MODE') {
        res.json({ genres: sampleGenres });
      } else {
        res.status(500).json({ error: 'Failed to fetch genres' });
      }
    }
  });

  return httpServer;
}
