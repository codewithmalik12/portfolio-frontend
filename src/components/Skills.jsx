import React, { useState, useEffect } from 'react';

const Skills = () => {
  const [animated, setAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Small delay to trigger the doughnut progress ring animation on mount
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const skillsList = [
    { 
      name: 'HTML', 
      level: '95%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
      gradient: ['#ef4444', '#f97316'],
      glow: 'rgba(239, 68, 68, 0.15)',
      badgeBg: 'bg-red-500/10 border-red-500/20 text-red-400'
    },
    { 
      name: 'CSS', 
      level: '90%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
      gradient: ['#3b82f6', '#06b6d4'],
      glow: 'rgba(59, 130, 246, 0.15)',
      badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    },
    { 
      name: 'JavaScript', 
      level: '85%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
      gradient: ['#f59e0b', '#eab308'],
      glow: 'rgba(245, 158, 11, 0.15)',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    },
    { 
      name: 'Node.js', 
      level: '80%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
      gradient: ['#10b981', '#22c55e'],
      glow: 'rgba(16, 185, 129, 0.15)',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    { 
      name: 'Express.js', 
      level: '85%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
      gradient: ['#8b5cf6', '#d946ef'],
      glow: 'rgba(139, 92, 246, 0.15)',
      badgeBg: 'bg-violet-500/10 border-violet-500/20 text-violet-400'
    },
    { 
      name: 'MongoDB', 
      level: '80%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
      gradient: ['#0d9488', '#10b981'],
      glow: 'rgba(13, 148, 136, 0.15)',
      badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400'
    },
    { 
      name: 'React', 
      level: '90%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
      gradient: ['#0ea5e9', '#2563eb'],
      glow: 'rgba(14, 165, 233, 0.15)',
      badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
    },
    { 
      name: 'Tailwind CSS', 
      level: '95%', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
      gradient: ['#06b6d4', '#0d9488'],
      glow: 'rgba(6, 182, 212, 0.15)',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
    },
  ];

  return (
    <section id="skills" className="section-padding bg-[var(--color-bg-base)] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            My <span className="text-emerald-500">Skills</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg">
            A comprehensive list of the technologies and tools I work with on a daily basis. Each technology represents a core pillar of my development stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skillsList.map((skill, index) => {
            const percentage = parseInt(skill.level);
            // Circumference of circle with r=40 is 2 * pi * 40 = 251.327
            const strokeDasharray = 251.2;
            const strokeDashoffset = animated 
              ? strokeDasharray - (strokeDasharray * percentage) / 100 
              : strokeDasharray;

            const isHovered = hoveredIndex === index;

            return (
              <div 
                key={index} 
                className="card p-8 flex flex-col items-center justify-center text-center group hover:-translate-y-1.5 relative overflow-hidden transition-all duration-300" 
                style={{
                  borderColor: isHovered ? skill.gradient[0] : 'var(--color-border-subtle)',
                  boxShadow: isHovered ? `0 15px 30px -10px ${skill.glow}` : 'none'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                {/* Custom glowing background on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                  style={{
                    background: `radial-gradient(circle at center, ${skill.glow}, transparent 70%)`
                  }}
                />

                {/* Multi-color Doughnut Chart */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={skill.gradient[0]} />
                        <stop offset="100%" stopColor={skill.gradient[1]} />
                      </linearGradient>
                      <filter id={`shadow-${index}`} x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={skill.gradient[0]} floodOpacity="0.35" />
                      </filter>
                    </defs>
                    {/* Background track circle */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="rgba(255,255,255,0.03)" 
                      strokeWidth="10" 
                      fill="transparent" 
                    />
                    {/* Active progress indicator ring */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke={`url(#gradient-${index})`} 
                      strokeWidth="10" 
                      fill="transparent" 
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round" 
                      filter={`url(#shadow-${index})`}
                      className="transition-all duration-1000 ease-out" 
                    />
                  </svg>

                  {/* Centered Logo & Percentage inside Doughnut cutout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="w-9 h-9 object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-110" 
                      style={{ filter: skill.name === 'Express.js' ? 'invert(1)' : 'none' }} 
                    />
                    <span className="text-white font-mono text-base font-extrabold mt-1 tracking-tight">
                      {skill.level}
                    </span>
                  </div>
                </div>

                {/* Unique Tech-Colored Title */}
                <h3 
                  className="text-xl font-bold text-white transition-colors duration-300 mb-2"
                  style={{ color: isHovered ? skill.gradient[0] : '#fff' }}
                >
                  {skill.name}
                </h3>
                
                {/* Tech-matching percentage completed badge */}
                <span className={`font-mono text-xs font-bold tracking-wider px-3 py-1 rounded-full border shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-colors duration-300 ${skill.badgeBg}`}>
                  {skill.level} Completed
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
