import type { Express } from "express";
import { createServer, type Server } from "http";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not configured');
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get('/api/movies/popular', async (req, res) => {
    try {
      const page = req.query.page as string || '1';
      const data = await tmdbFetch('/movie/popular', { page });
      res.json(data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
  });

  app.get('/api/movies/trending', async (req, res) => {
    try {
      const data = await tmdbFetch('/trending/movie/week');
      res.json(data);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
  });

  app.get('/api/movies/discover', async (req, res) => {
    try {
      const { page, sort_by, with_genres } = req.query;
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
      res.status(500).json({ error: 'Failed to discover movies' });
    }
  });

  app.get('/api/movies/search/:query', async (req, res) => {
    try {
      const query = req.params.query;
      const page = req.query.page as string || '1';
      const data = await tmdbFetch('/search/movie', {
        query,
        page,
        include_adult: 'false',
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ error: 'Failed to search movies' });
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    try {
      const movieId = req.params.id;
      const data = await tmdbFetch(`/movie/${movieId}`, {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  });

  app.get('/api/movies/:id/credits', async (req, res) => {
    try {
      const movieId = req.params.id;
      const data = await tmdbFetch(`/movie/${movieId}/credits`, {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      res.status(500).json({ error: 'Failed to fetch movie credits' });
    }
  });

  app.get('/api/genres', async (req, res) => {
    try {
      const data = await tmdbFetch('/genre/movie/list', {
        language: 'en-US',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ error: 'Failed to fetch genres' });
    }
  });

  return httpServer;
}
