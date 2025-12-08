'use client';
import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      title: 'Standup-Timer',
      category: 'Django',
      description: '初めて作ったwebアプリケーション。Djangoを使用',
      link: 'https://github.com/moetsuchiya/standup-timer',
      image: '/standup-timer.jpeg'
    },
    {
      title: 'flea-market-system',
      category: '作成中(リポジトリなし)',
      description: '現在作成中のSpring Bootのフリマサイト風アプリケーション',
      link: 'https://github.com/moetsuchiya',
      image: '/dashboard-screenshot.jpeg'
    },
    {
      title: 'Map-Capsule',
      category: '作成中(リポジトリなし)',
      description: '現在開発中のモバイルアプリケーション',
      link: 'https://github.com/moetsuchiya',
      image: '/completion-screen.png'
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getCardStyle = (offset: number) => {
    const rotation = offset * 15; // 15 degrees per card
    const translateX = offset * 80; // Horizontal spacing
    const translateY = Math.abs(offset) * 30; // Cards further from center are lower
    const scale = 1 - Math.abs(offset) * 0.15; // Cards get smaller as they move away
    const zIndex = 10 - Math.abs(offset);
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex,
      opacity: Math.abs(offset) > 2 ? 0 : 1
    };
  };

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Decorative Corner Ornaments */}
      <svg className="absolute top-8 left-8 w-24 h-24 opacity-15" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35" stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <circle cx="6" cy="6" r="1.5" fill="#8b7d9e" opacity="0.4"/>
      </svg>
      <svg className="absolute top-8 right-8 w-24 h-24 opacity-15" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35" stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <circle cx="6" cy="6" r="1.5" fill="#8b7d9e" opacity="0.4"/>
      </svg>

      <div className="max-w-5xl mx-auto px-6 py-24 pt-32">
        {/* Header */}
        <div className="text-center mb-20 space-y-3">
          <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Works</p>
          <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
            Projects
          </h2>
          <p className="text-[#4A5C7A] max-w-md mx-auto leading-relaxed">
            作成中/完成したプロジェクトの一部をご紹介します。
          </p>
        </div>

        {/* Card Fan Display */}
        <div className="relative h-[600px] flex items-center justify-center mb-20">
          <div className="relative w-full h-full flex items-center justify-center">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const actualIndex = (currentIndex + offset + projects.length) % projects.length;
              const project = projects[actualIndex];
              
              return (
                <motion.div
                  key={`${actualIndex}-${offset}`}
                  className="absolute w-80 h-[480px] bg-white rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                  style={{
                    ...getCardStyle(offset),
                    border: '3px solid #0A2C6A',
                    boxShadow: offset === 0 
                      ? '0 12px 48px rgba(10, 44, 106, 0.25)' 
                      : '0 4px 16px rgba(10, 44, 106, 0.12)'
                  }}
                  initial={false}
                  animate={getCardStyle(offset)}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  onClick={() => {
                    if (offset !== 0) {
                      offset > 0 ? handleNext() : handlePrev();
                    }
                  }}
                >
                  {/* Card Border Decoration */}
                  <div className="absolute inset-0 pointer-events-none z-10" style={{
                    border: '1px solid #8799BD',
                    margin: '8px',
                    borderRadius: '12px'
                  }}></div>

                  {/* Project Image */}
                  <div className="h-64 overflow-hidden relative shrink-0">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="space-y-2">
                      <p className="text-[#8799BD] text-xs tracking-wider uppercase">
                        {project.category}
                      </p>
                      <h3 className="font-serif italic text-[#0A2C6A] text-2xl">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-[#4A5C7A] text-sm leading-relaxed line-clamp-3 mt-4">
                      {project.description}
                    </p>

                    {/* View Project Button */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2 mt-auto text-white rounded-full transition-all duration-500 self-start"
                      style={{
                        background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                        boxShadow: '0 2px 12px rgba(135, 153, 189, 0.3)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-sm tracking-wide">作品リンク</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hand Navigation Buttons */}
        <div className="flex items-center justify-center gap-16">
          {/* Left Hand Button */}
          <motion.button
            onClick={handlePrev}
            className="w-20 h-20 flex items-center justify-center transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(135, 153, 189, 0.2))'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <img 
              src="/pointing-hand.svg" 
              alt="Previous" 
              className="w-full h-full" 
              style={{ transform: 'scaleX(-1)' }} 
            />
          </motion.button>

          {/* Center indicator */}
          <div className="flex items-center gap-2">
            {projects.map((_, index) => (
              <div
                key={index}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === currentIndex ? '24px' : '8px',
                  height: '8px',
                  background: index === currentIndex 
                    ? 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)'
                    : '#8799BD',
                  opacity: index === currentIndex ? 1 : 0.3
                }}
              ></div>
            ))}
          </div>

          {/* Right Hand Button */}
          <motion.button
            onClick={handleNext}
            className="w-20 h-20 flex items-center justify-center transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(135, 153, 189, 0.2))'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <img 
              src="/pointing-hand.svg" 
              alt="Next" 
              className="w-full h-full" 
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
}