'use client';
import React, { useState, useEffect } from 'react';

type Section = 'home' | 'skills' | 'projects' | 'contact';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
  ];

  const handleScroll = (sectionId: Section) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScrollObserver = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(section.id as Section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollObserver);
    return () => {
      window.removeEventListener('scroll', handleScrollObserver);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#e8e4f3]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="font-serif italic text-[#8b7d9e]">
            Portfolio
          </div>
          
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleScroll(item.id)}
                  className={`transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-[#a78bca] border-b-2 border-[#a78bca]'
                      : 'text-[#6b5d7a] hover:text-[#a78bca]'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
