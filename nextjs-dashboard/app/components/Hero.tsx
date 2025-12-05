"use client";
import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      <div className="max-w-3xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-8"
        >

          {/* Name and Title */}
          <div className="space-y-4">
            {/* Ribbon Banner with Name */}
            <div className="relative inline-block mx-auto">
              {/* Profile Image*/}
              <motion.div
                className="mx-auto w-full max-w-2xl relative"
                whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
              >
                <ImageWithFallback
                  src="/name_rabel.png"
                  fallbackSrc="/opengraph-image.png" // Fallback to opengraph-image if the specified image isn't found
                  alt="Moe Tsuchiya Name Banner"
                  width={600} // Set appropriate width for the image
                  height={150} // Set appropriate height for the image
                  className="w-full h-auto"
                />
              </motion.div>
            </div>

            <p className="text-[#8799BD] tracking-[0.2em] uppercase text-sm">
              Frontend Engineer
            </p>
          </div>

          {/* Description */}
          <p className="text-[#4A5C7A] max-w-xl mx-auto leading-relaxed px-8">
            Kadokawaドワンゴ情報工科学院2年生の土屋萌恵です。
            素敵なwebアプリが作れるようになりたい！
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-16 h-[0.5px] bg-[#8799BD] opacity-30"></div>
            <span className="text-[#8b7d9e] opacity-40">✦</span>
            <div className="w-16 h-[0.5px] bg-[#8799BD] opacity-30"></div>
          </div>

          {/* Skills/Highlights */}
          <div className="flex justify-center gap-12 text-center">
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">
                Design
              </p>
              <p className="text-[#8799BD] text-xs tracking-wider">Figma</p>
            </div>
            <div className="w-[0.5px] h-16 bg-[#8799BD] opacity-20"></div>
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">
                Frontend
              </p>
              <p className="text-[#8799BD] text-xs tracking-wider">Next.js</p>
            </div>
            <div className="w-[0.5px] h-16 bg-[#8799BD] opacity-20"></div>
            <div className="space-y-2">
              <p className="text-[#0A2C6A] text-2xl font-serif italic">
                Database
              </p>
              <p className="text-[#8799BD] text-xs tracking-wider">Prisma</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center pt-4">
            <motion.button
              onClick={() => handleScroll("projects")}
              className="px-8 py-3 text-white rounded-full transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, #8799BD 0%, #8b7d9e 100%)",
                boxShadow: "0 4px 16px rgba(135, 153, 189, 0.3)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 24px rgba(135, 153, 189, 0.4)",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>

            <motion.button
              onClick={() => handleNavigate("/contact")}
              className="px-8 py-3 text-[#0A2C6A] rounded-full transition-all duration-500"
              style={{
                border: "2px solid #8799BD",
                background: "transparent",
              }}
              whileHover={{
                scale: 1.05,
                background: "#8799BD",
                color: "#ffffff",
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
