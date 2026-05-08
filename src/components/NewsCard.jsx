import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 right-2 flex gap-2">
          {new Date() - new Date(article.publishedAt) < 24 * 60 * 60 * 1000 && (
            <span className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded-md animate-pulse">NEW</span>
          )}
        </div>
        <div className="absolute bottom-2 left-3 right-3 text-white text-[10px] flex items-center gap-2">
          <Calendar size={10} />
          {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          <span className="ml-auto bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full font-bold">{article.source.name}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 flex-grow">
          {article.description}
        </p>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-white text-xs font-semibold transition-all"
        >
          Read Full Story <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
};

export default NewsCard;
