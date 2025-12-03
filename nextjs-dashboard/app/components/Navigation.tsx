import React from 'react';

// 親コンポーネントと型を共有
type Section = 'home' | 'skills' | 'projects' | 'contact';

interface NavigationProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  // navItemsの型をより厳密に定義
  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

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
                  onClick={() => setActiveSection(item.id)}
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
