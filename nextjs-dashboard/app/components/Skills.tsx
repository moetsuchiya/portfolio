import React from 'react';
import { Code2, Palette, Layout, Sparkles } from 'lucide-react';

export default function Skills() {
  const skills = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, React',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
    },
    {
      icon: Palette,
      title: 'Design',
      description: 'UI/UX Design, Graphic Design',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator']
    },
    {
      icon: Layout,
      title: 'Responsive Design',
      description: 'Mobile-first approach',
      skills: ['Flexbox', 'Grid', 'Media Queries', 'Animation']
    },
    {
      icon: Sparkles,
      title: 'Creative Solutions',
      description: 'Problem solving & Innovation',
      skills: ['UX Research', 'Wireframing', 'Prototyping', 'Testing']
    }
  ];

  return (
    <section className="min-h-screen px-6 py-24 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#a78bca] tracking-wide">What I Can Do</p>
          <h2 className="font-serif italic text-[#6b5d7a]">
            Skills & Expertise
          </h2>
          <p className="text-[#8b7d9e] max-w-2xl mx-auto">
            専門学校で習得したスキルと、個人プロジェクトで磨いた技術をご紹介します。
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