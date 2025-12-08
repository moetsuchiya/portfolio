import React from 'react';
import { PanelsTopLeft, ServerCog, } from 'lucide-react';

export default function Skills() {
  const skills = [
    {
      icon: PanelsTopLeft,
      title: 'フロントエンド',
      description: 'Building interactive and responsive interfaces',
      skills: ['React', 'TypeScript', 'Next.js']
    },
    {
      icon: ServerCog,
      title: 'バックエンド',
      description: 'Building reliable server-side logic and APIs',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS']
    },
  ];

  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 py-24 pt-32">
        <div className="text-center mb-20 space-y-3">
          <p className="text-[#8799BD] tracking-[0.3em] uppercase text-xs">My Expertise</p>
          <h2 className="font-serif italic text-[#0A2C6A] text-5xl">
            My Core Skills
          </h2>
          <p className="text-[#4A5C7A] max-w-md mx-auto leading-relaxed">
            UIの構築からAPI設計、データベース設計まで、Webアプリを一通り開発できるスキルを身につけました
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-[#e8e4f3] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#a78bca] to-[#c9b4d9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <skill.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-[#6b5d7a] mb-2">{skill.title}</h3>
              <p className="text-[#8b7d9e] mb-4">{skill.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {skill.skills.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#e8e4f3] text-[#6b5d7a] rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}