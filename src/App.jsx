import React from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  Globe, 
  Newspaper, 
  MessageSquare, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  Search, 
  RefreshCw,
  Activity,
  Map as MapIcon,
  Users
} from 'lucide-react';
import ISSMap from './components/ISSMap';
import NewsCard from './components/NewsCard';
import ChatBot from './components/ChatBot';
import StatCard from './components/StatCard';
import Astronauts from './components/Astronauts';
import { SpeedChart, NewsDistributionChart } from './components/Charts';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import { useTheme } from './context/ThemeContext';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';

function Dashboard() {
  const { location, path, speed, speedHistory } = useISS();
  const { news, loading, search, setSearch, sortBy, setSortBy, refresh } = useNews();
  const { isDark, toggleTheme } = useTheme();
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading && !location && news.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-20 h-20 border-t-4 border-primary rounded-full animate-spin"></div>
            <Globe className="absolute inset-0 m-auto text-primary animate-bounce" size={32} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tighter">ORBIT NEWS AI</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-2">Connecting to Orbital Network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 glass p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20 animate-pulse">
            <Globe size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">ORBIT NEWS AI</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Satellite Intelligence Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search space news..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary/50 rounded-xl border border-white/10 focus:ring-2 focus:ring-primary/20 outline-none transition-all w-64 text-sm"
            />
          </div>
          <button 
            onClick={toggleTheme}
            className="p-3 glass rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Tracking & Metrics */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard 
              title="ISS Speed" 
              value={`${speed.toLocaleString()} km/h`} 
              icon={Activity}
              description="Orbital velocity"
              trend={0.2}
            />
            <StatCard 
              title="Altitude" 
              value="408 km" 
              icon={Globe}
              description="Average orbital height"
            />
            <StatCard 
              title="Articles" 
              value={news.length} 
              icon={Newspaper}
              description="Live news feed"
            />
          </div>

          {/* Map Container */}
          <div className="h-[500px] xl:h-[600px] glass rounded-3xl overflow-hidden relative border border-white/10">
            <div className="absolute top-6 left-6 z-[1000] flex items-center gap-2 glass px-4 py-2 rounded-xl border border-white/20">
              <MapIcon size={16} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider">Live ISS Tracking</span>
            </div>
            <ISSMap location={location} path={path} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-sm font-bold uppercase mb-4 text-muted-foreground flex items-center gap-2">
                <Activity size={14} /> Velocity History (km/h)
              </h3>
              <SpeedChart data={speedHistory} />
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-sm font-bold uppercase mb-4 text-muted-foreground flex items-center gap-2">
                <Newspaper size={14} /> News Distribution
              </h3>
              <NewsDistributionChart news={news} />
            </div>
          </div>
        </div>

        {/* Right Column: AI & News */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          
          {/* AI Chatbot */}
          <ChatBot dashboardData={{ location, news: news.slice(0, 5), speed }} />

          {/* Astronauts */}
          <Astronauts />

          {/* News Sidebar Toggle/Sort */}
          <div className="glass p-6 rounded-2xl flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2">
                <Newspaper size={20} className="text-primary" />
                Latest Intel
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={refresh}
                  className="p-2 hover:bg-primary hover:text-white rounded-lg transition-all"
                >
                  <RefreshCw size={16} />
                </button>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary/50 text-xs font-bold rounded-lg px-2 py-1 outline-none border border-white/10"
                >
                  <option value="publishedAt">Latest</option>
                  <option value="title">A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-64 rounded-xl bg-secondary/50 animate-pulse" />
                ))
              ) : (
                news.map((article, i) => (
                  <NewsCard key={i} article={article} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center glass p-6 rounded-2xl border border-white/10">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Orbit News AI Dashboard &copy; 2026 • Powered by Mistral-7B & OpenNotify
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <div className="selection:bg-primary selection:text-white">
      <Dashboard />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
