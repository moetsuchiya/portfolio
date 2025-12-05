'use client';
import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      {/* Decorative Corner Ornaments - Embossed Style */}
      <svg className="absolute top-8 left-8 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35 Q24 45 22 52 Q20 58 15 62 Q10 65 5 65" 
              stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <path d="M8 8 Q12 10 14 14 Q16 20 16 28 Q16 36 14 42 Q12 46 8 48" 
              stroke="#8b7d9e" strokeWidth="0.6" fill="none"/>
        <path d="M10 15 Q12 18 13 22 Q14 28 14 34 Q14 38 13 42 Q12 44 10 46" 
              stroke="#8799BD" strokeWidth="0.5" fill="none" opacity="0.6"/>
        <circle cx="6" cy="6" r="2" fill="#8b7d9e" opacity="0.4"/>
        <circle cx="6" cy="18" r="1.5" fill="#8799BD" opacity="0.3"/>
        <circle cx="12" cy="12" r="1" fill="#8b7d9e" opacity="0.3"/>
      </svg>

      <svg className="absolute top-8 right-8 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35 Q24 45 22 52 Q20 58 15 62 Q10 65 5 65" 
              stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <path d="M8 8 Q12 10 14 14 Q16 20 16 28 Q16 36 14 42 Q12 46 8 48" 
              stroke="#8b7d9e" strokeWidth="0.6" fill="none"/>
        <path d="M10 15 Q12 18 13 22 Q14 28 14 34 Q14 38 13 42 Q12 44 10 46" 
              stroke="#8799BD" strokeWidth="0.5" fill="none" opacity="0.6"/>
        <circle cx="6" cy="6" r="2" fill="#8b7d9e" opacity="0.4"/>
        <circle cx="6" cy="18" r="1.5" fill="#8799BD" opacity="0.3"/>
        <circle cx="12" cy="12" r="1" fill="#8b7d9e" opacity="0.3"/>
      </svg>

      <svg className="absolute bottom-8 left-8 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleY(-1)' }}>
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35 Q24 45 22 52 Q20 58 15 62 Q10 65 5 65" 
              stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <path d="M8 8 Q12 10 14 14 Q16 20 16 28 Q16 36 14 42 Q12 46 8 48" 
              stroke="#8b7d9e" strokeWidth="0.6" fill="none"/>
        <path d="M10 15 Q12 18 13 22 Q14 28 14 34 Q14 38 13 42 Q12 44 10 46" 
              stroke="#8799BD" strokeWidth="0.5" fill="none" opacity="0.6"/>
        <circle cx="6" cy="6" r="2" fill="#8b7d9e" opacity="0.4"/>
        <circle cx="6" cy="18" r="1.5" fill="#8799BD" opacity="0.3"/>
        <circle cx="12" cy="12" r="1" fill="#8b7d9e" opacity="0.3"/>
      </svg>

      <svg className="absolute bottom-8 right-8 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none" style={{ transform: 'scale(-1)' }}>
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35 Q24 45 22 52 Q20 58 15 62 Q10 65 5 65" 
              stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <path d="M8 8 Q12 10 14 14 Q16 20 16 28 Q16 36 14 42 Q12 46 8 48" 
              stroke="#8b7d9e" strokeWidth="0.6" fill="none"/>
        <path d="M10 15 Q12 18 13 22 Q14 28 14 34 Q14 38 13 42 Q12 44 10 46" 
              stroke="#8799BD" strokeWidth="0.5" fill="none" opacity="0.6"/>
        <circle cx="6" cy="6" r="2" fill="#8b7d9e" opacity="0.4"/>
        <circle cx="6" cy="18" r="1.5" fill="#8799BD" opacity="0.3"/>
        <circle cx="12" cy="12" r="1" fill="#8b7d9e" opacity="0.3"/>
      </svg>

      <div className="max-w-3xl w-full text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >
          {/* Top label */}
          <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">
            Portfolio
          </p>

          {/* Profile Image */}
          <motion.div 
            className="mx-auto w-40 h-40 rounded-full overflow-hidden relative"
            style={{
              border: '3px solid #8799BD',
              boxShadow: '0 4px 20px rgba(135, 153, 189, 0.2), inset 0 2px 8px rgba(139, 125, 158, 0.1)'
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#8799BD]/20 to-[#8b7d9e]/20 flex items-center justify-center">
              <span className="text-6xl text-[#0A2C6A] font-serif italic">YN</span>
            </div>
          </motion.div>

          {/* Name and Title */}
          <div className="space-y-4">
            {/* Ribbon Banner with Name */}
            <div className="relative inline-block mx-auto">
              <svg 
                viewBox="0 0 600 150" 
                className="w-full max-w-2xl mx-auto"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(10, 44, 106, 0.15))' }}
              >
                {/* Main ribbon body */}
                <path
                  d="M 50 30 L 550 30 L 580 75 L 550 120 L 50 120 L 20 75 Z"
                  fill="#0A2C6A"
                  stroke="#0A2C6A"
                  strokeWidth="2"
                />
                
                {/* Top stitching line */}
                <path
                  d="M 60 45 L 540 45"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="8,6"
                  opacity="0.4"
                />
                
                {/* Bottom stitching line */}
                <path
                  d="M 60 105 L 540 105"
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="8,6"
                  opacity="0.4"
                />
                
                {/* Left ribbon fold */}
                <path
                  d="M 50 30 L 20 75 L 50 120 L 50 110 L 35 75 L 50 40 Z"
                  fill="#062052"
                />
                <path
                  d="M 42 45 L 42 105"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
                
                {/* Right ribbon fold */}
                <path
                  d="M 550 30 L 580 75 L 550 120 L 550 110 L 565 75 L 550 40 Z"
                  fill="#062052"
                />
                <path
                  d="M 558 45 L 558 105"
                  stroke="white"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
                
                {/* Text */}
                <text
                  x="300"
                  y="85"
                  textAnchor="middle"
                  className="font-serif italic"
                  style={{
                    fill: 'white',
                    fontSize: '48px',
                    letterSpacing: '2px'
                  }}
                >
                  Your Name
                </text>
              </svg>
            </div>
            
            <p className="text-[#8799BD] tracking-[0.2em] uppercase text-sm">
              Web Designer & Developer
            </p>
          </div>

          {/* Description */}
          <p className="text-[#4A5C7A] max-w-xl mx-auto leading-relaxed px-8">
            専門学校で学んだデザインとコーディングのスキルを活かし、
            美しく使いやすいウェブサイトを制作しています。
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-16 h-[0.5px] bg-[#8799BD] opacity-30"></div>
            <span className="text-[#8b7d9e] opacity-40">✦</span>
            <div className="w-16 h-[0.5px] bg-[#8799BD] opacity-30"></div>
          </div>

          {/* Skills/Highlights */}
          <div className="flex justify-center gap-12 text-center">
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">Design</p>
              <p className="text-[#8799BD] text-xs tracking-wider">UI/UX</p>
            </div>
            <div className="w-[0.5px] h-16 bg-[#8799BD] opacity-20"></div>
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">Code</p>
              <p className="text-[#8799BD] text-xs tracking-wider">Frontend</p>
            </div>
            <div className="w-[0.5px] h-16 bg-[#8799BD] opacity-20"></div>
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">Create</p>
              <p className="text-[#8799BD] text-xs tracking-wider">Digital Art</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center pt-4">
            <motion.button 
              onClick={() => handleScroll('projects')}
              className="px-8 py-3 text-white rounded-full transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                boxShadow: '0 4px 16px rgba(135, 153, 189, 0.3)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 6px 24px rgba(135, 153, 189, 0.4)',
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>
            
            <motion.button 
              onClick={() => handleNavigate('/contact')}
              className="px-8 py-3 text-[#0A2C6A] rounded-full transition-all duration-500"
              style={{
                border: '2px solid #8799BD',
                background: 'transparent'
              }}
              whileHover={{ 
                scale: 1.05,
                background: '#8799BD',
                color: '#ffffff',
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
