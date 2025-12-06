'use client';
import React from 'react';
import Hero from '@/app/components/Hero';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Navigation from '@/app/components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="skills" className="mb-4">
          <Skills />
        </section>
        <section id="projects">
          <Projects />
        </section>
      </main>
    </div>
  );
}