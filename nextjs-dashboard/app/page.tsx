'use client';
import React, { useState } from 'react';
import Hero from '@/app/components/Hero';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Chat from '@/app/components/Chat';
import Navigation from '@/app/components/Navigation';

type Section = 'home' | 'skills' | 'projects' | 'contact';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  // A function to handle smooth scrolling, which can be passed to the Navigation component if needed.
  const handleNavigation = (sectionId: Section) => {
    setActiveSection(sectionId);
    // You can add smooth scrolling logic here if you decide to use section IDs and scrollIntoView
    // For now, we are just swapping components.
  };

  return (
    // The background color is set to a specific value from the original design.
    // Ensure this color is available or define it in your tailwind.config.js if it's not a standard color.
    <div className="min-h-screen">
      <Navigation activeSection={activeSection} setActiveSection={handleNavigation} />
      
      <main>
        {activeSection === 'home' && <Hero />}
        {activeSection === 'skills' && <Skills />}
        {activeSection === 'projects' && <Projects />}
        {activeSection === 'contact' && <Chat />}
      </main>
    </div>
  );
}