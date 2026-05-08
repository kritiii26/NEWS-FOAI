import { useState, useEffect } from 'react';
import { fetchNews } from '../services/api';
import toast from 'react-hot-toast';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  const getNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (!forceRefresh) {
        const cached = localStorage.getItem('orbit_news');
        const cacheTime = localStorage.getItem('orbit_news_time');
        if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 1000 * 60 * 30) {
          setNews(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const articles = await fetchNews();
      setNews(articles);
      localStorage.setItem('orbit_news', JSON.stringify(articles));
      localStorage.setItem('orbit_news_time', Date.now().toString());
    } catch (err) {
      setError('Failed to fetch news');
      toast.error('Could not load latest space news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const filteredNews = news
    .filter(article => 
      article.title?.toLowerCase().includes(search.toLowerCase()) || 
      article.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'publishedAt') return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  return { news: filteredNews, loading, error, search, setSearch, sortBy, setSortBy, refresh: () => getNews(true) };
};
