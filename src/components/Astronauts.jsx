import React, { useState, useEffect } from 'react';
import { fetchAstronauts } from '../services/api';
import { Users, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const Astronauts = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAstros = async () => {
      try {
        const data = await fetchAstronauts();
        setPeople(data);
      } catch (error) {
        console.error('Astros error:', error);
      } finally {
        setLoading(false);
      }
    };
    getAstros();
  }, []);

  return (
    <div className="glass p-6 rounded-3xl border border-white/10 h-full shadow-xl relative overflow-hidden group">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
          <Users size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest">Orbital Crew</h2>
          <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Current Expedition</p>
        </div>
        <div className="ml-auto bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 animate-pulse">
          {people.length} LIVE
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scanning Lifeforms...</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
          {people.map((person, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 group/item"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                <Rocket size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight">{person.name}</span>
                <span className="text-[9px] text-primary font-black uppercase tracking-widest opacity-70">{person.craft}</span>
              </div>
              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Astronauts;
