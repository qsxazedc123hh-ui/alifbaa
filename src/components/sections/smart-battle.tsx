"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/lib/types";

interface SmartBattleProps {
  videos: Video[];
  onBack: () => void;
}

/**
 * Smart Battle — صراع الأذكياء
 * - عرض Reels-style vertical videos (9:16 preferred)
 * - Swipe يدوي + انتقال تلقائي بعد انتهاء الفيديو
 * - Autoplay بدون صوت، الصوت بالتفاعل
 */
export function SmartBattle({ videos, onBack }: SmartBattleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Intersection observer for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          const video = videoRefs.current[idx];
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            video.play().catch(() => {});
            setCurrentIndex(idx);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    videoRefs.current.forEach((v) => v && observer.observe(v.parentElement!));
    return () => observer.disconnect();
  }, [videos]);

  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      containerRef.current?.children[currentIndex + 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const toggleMute = (idx: number) => {
    const video = videoRefs.current[idx];
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  if (videos.length === 0) {
    return (
      <section id="smart-battle" className="min-h-screen pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="صراع الأذكياء" subtitle="حين يصبح ما تتعلّمه جزءاً من التحدّي" onBack={onBack} />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center mb-4">
              <Swords className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-lg">لا توجد فيديوهات حالياً</h3>
            <p className="text-sm text-muted-foreground mt-1">سيتم إضافة فيديوهات صراع الأذكياء قريباً</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="smart-battle" className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
        <SectionHeader title="صراع الأذكياء" subtitle="حين يصبح ما تتعلّمه جزءاً من التحدّي" onBack={onBack} />
      </div>

      {/* Vertical reels container */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-200px)] overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`.snap-container::-webkit-scrollbar { display: none; }`}</style>
        {videos.map((video, idx) => (
          <div
            key={video.id}
            data-index={idx}
            className="snap-start h-full flex items-center justify-center relative"
          >
            <div className="relative h-full max-h-[80vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-card">
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                src={video.videoUrl}
                poster={video.thumbnailUrl || undefined}
                muted={muted}
                loop={false}
                playsInline
                onEnded={handleVideoEnd}
                onClick={() => toggleMute(idx)}
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Mute indicator */}
              <button
                onClick={() => toggleMute(idx)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {/* Title */}
              <div className="absolute bottom-6 inset-x-6 text-white">
                <h3 className="font-display font-bold text-base sm:text-lg drop-shadow">{video.title}</h3>
                {video.description && (
                  <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">{video.description}</p>
                )}
              </div>

              {/* Tap to unmute hint (first video only) */}
              {idx === 0 && muted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 rounded-full bg-black/60 backdrop-blur text-white text-xs flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    اضغط لتشغيل الصوت
                  </motion.div>
                </div>
              )}

              {/* Counter */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-semibold">
                {idx + 1} / {videos.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
        <ArrowRight className="h-4 w-4" />
        رجوع
      </Button>
    </div>
  );
}
