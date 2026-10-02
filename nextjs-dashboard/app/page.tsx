import React from 'react';
import Hero from '@/app/components/Hero';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Navigation from '@/app/components/Navigation';
import { listProjects } from '@/app/lib/projects';

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const projects = await listProjects();
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main id="main-content">
        <section id="home">
          <Hero />
        </section>
        <section id="skills" className="mb-4">
          <Skills />
        </section>
        <section id="projects">
          <Projects initialProjects={projects} />
        </section>
      </main>
    </div>
  );
}
