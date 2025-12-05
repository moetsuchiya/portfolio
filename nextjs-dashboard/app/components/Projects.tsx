'use client';
import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      title: 'E-Commerce Website',
      category: 'Web Design & Development',
      description: 'モダンなECサイトのデザインと実装。レスポンシブデザインとスムーズなアニメーションが特徴です。',
      link: 'https://example.com/ecommerce',
      image: 'https://images.unsplash.com/photo-1694599048261-a1de00f0117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWdufGVufDF8fHx8MTc2NDU4MTg2MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Portfolio Design',
      category: 'UI/UX Design',
      description: 'クリエイティブなポートフォリオサイト。ユーザー体験を重視したインタラクティブなデザイン。',
      link: 'https://example.com/portfolio',
      image: 'https://images.unsplash.com/photo-1656264142377-22ae3fefdbc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlJTIwc2NyZWVufGVufDF8fHx8MTc2NDYwNjczM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Mobile App UI',
      category: 'App Design',
      description: 'モバイルファーストのアプリUIデザイン。直感的な操作性と美しいビジュアルを実現。',
      link: 'https://example.com/app',
      image: 'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY0NTgzNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Landing Page',
      category: 'Web Design',
      description: 'コンバージョンを意識したランディングページ。視覚的な魅力とユーザビリティを両立。',
      link: 'https://example.com/landing',
      image: 'https://images.unsplash.com/photo-1649150849645-92fba77775a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwbW9ja3VwJTIwc2NyZWVufGVufDF8fHx8MTc2NDUzMTE5M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Brand Identity',
      category: 'Graphic Design',
      description: '企業のブランディングデザイン。ロゴ、カラーパレット、タイポグラフィを統一。',
      link: 'https://example.com/branding',
      image: 'https://images.unsplash.com/photo-1694599048261-a1de00f0117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWdufGVufDF8fHx8MTc2NDU4MTg2MXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
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
    <section className="min-h-screen px-6 py-24 pt-32 relative overflow-hidden">
      {/* Decorative Corner Ornaments */}
      <svg className="absolute top-8 left-8 w-24 h-24 opacity-15" viewBox="0 0 100 100" fill="none">
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35" stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <circle cx="6" cy="6" r="1.5" fill="#8b7d9e" opacity="0.4"/>
      </svg>
      <svg className="absolute top-8 right-8 w-24 h-24 opacity-15" viewBox="0 0 100 100" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path d="M5 5 Q10 5 15 8 Q20 12 22 18 Q24 25 24 35" stroke="#8799BD" strokeWidth="0.8" fill="none"/>
        <circle cx="6" cy="6" r="1.5" fill="#8b7d9e" opacity="0.4"/>
      </svg>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-3">
          <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">Works</p>
          <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
            Featured Projects
          </h2>
          <p className="text-[#4A5C7A] max-w-md mx-auto leading-relaxed">
            これまでに制作したプロジェクトの一部をご紹介します。
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
                  className="absolute w-80 h-[480px] bg-white rounded-2xl overflow-hidden cursor-pointer"
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
                  <div className="absolute inset-0 pointer-events-none" style={{
                    border: '1px solid #8799BD',
                    margin: '8px',
                    borderRadius: '12px'
                  }}></div>

                  {/* Project Image */}
                  <div className="h-64 overflow-hidden relative">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <p className="text-[#8799BD] text-xs tracking-wider uppercase">
                        {project.category}
                      </p>
                      <h3 className="font-serif italic text-[#0A2C6A] text-2xl">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-[#4A5C7A] text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* View Project Button */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2 mt-4 text-white rounded-full transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)',
                        boxShadow: '0 2px 12px rgba(135, 153, 189, 0.3)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-sm tracking-wide">View Project</span>
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