import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Website',
      category: 'Web Design & Development',
      description: 'モダンなECサイトのデザインと実装。レスポンシブデザインとスムーズなアニメーションが特徴です。',
      tags: ['React', 'Tailwind', 'Animation'],
      color: 'from-[#ffd4d4] to-[#ffb3c1]'
    },
    {
      title: 'Portfolio Design',
      category: 'UI/UX Design',
      description: 'クリエイティブなポートフォリオサイト。ユーザー体験を重視したインタラクティブなデザイン。',
      tags: ['Figma', 'Prototyping', 'UX'],
      color: 'from-[#c9b4d9] to-[#a78bca]'
    },
    {
      title: 'Mobile App UI',
      category: 'App Design',
      description: 'モバイルファーストのアプリUIデザイン。直感的な操作性と美しいビジュアルを実現。',
      tags: ['Mobile', 'UI Design', 'Figma'],
      color: 'from-[#b4d9d4] to-[#8bc9c1]'
    },
    {
      title: 'Brand Identity',
      category: 'Graphic Design',
      description: '企業のブランディングデザイン。ロゴ、カラーパレット、タイポグラフィを統一。',
      tags: ['Branding', 'Logo', 'Identity'],
      color: 'from-[#ffd4b4] to-[#ffc18b]'
    }
  ];

  return (
    <section className="min-h-screen px-6 py-24 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#a78bca] tracking-wide">My Work</p>
          <h2 className="font-serif italic text-[#6b5d7a]">
            Featured Projects
          </h2>
          <p className="text-[#8b7d9e] max-w-2xl mx-auto">
            これまでに制作したプロジェクトの一部をご紹介します。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white border border-[#e8e4f3] hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-white/30 rounded-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="absolute w-24 h-24 border-4 border-white/50 rounded-2xl -rotate-12 group-hover:rotate-0 transition-transform duration-500"></div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-[#a78bca] text-sm tracking-wide">{project.category}</p>
                  <h3 className="text-[#6b5d7a] flex items-center justify-between">
                    {project.title}
                    <ExternalLink className="w-5 h-5 text-[#a78bca] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </h3>
                </div>
                
                <p className="text-[#8b7d9e]">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#e8e4f3] text-[#6b5d7a] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}