import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-6 rounded-xl border border-white/10 flex flex-col gap-2 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-center justify-between relative z-10">
        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 relative z-10">
        <h2 className="text-3xl font-black tracking-tight">{value}</h2>
        {trend && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <p className="text-muted-foreground text-[10px] font-medium relative z-10 opacity-70">{description}</p>
    </motion.div>
  );
};

export default StatCard;
