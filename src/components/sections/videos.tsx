"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Volume2, VolumeX, Video as VideoIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/lib/types";

interface VideosProps {
  videos: Video[];
  onBack: () => void;
}

/**
 * Videos Section — عرض الفيديوهات العامة
 * - شبكة معاينات الفيديوهات
 * - عند الضغط: يفتح Full Screen Reels-style
 * - Swipe + Autoplay + Auto-advance
 */
export function Videos({ videos, onBack }: VideosProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const openFullscreen = (idx: number) => setFullscreenIndex(idx);
  const closeFullscreen = () => setFullscreenIndex(null);

  // Auto-advance in fullscreen
  const handleFullscreenEnd = () => {
    if (fullscreenIndex === null) return;
    if (fullscreenIndex < videos.length - 1) {
      setFullscreenIndex(fullscreenIndex + 1);
    } else {
      closeFullscreen();
    }
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    videoRefs.current.forEach((v) => v && (v.muted = !muted));
  };

  return (
    <section id="videos" className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">الفيديوهات</h2>
            <p className="mt-1 text-sm text-muted-foreground">استعرض محتوى ألف باء المرئي</p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </div>

        {/* Grid of video previews */}
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <VideoIcon className="h-12 w-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد فيديوهات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {videos.map((video, idx) => (
              <motion.button
                key={video.id}
                onClick={() => openFullscreen(idx)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-muted shadow-soft hover:shadow-card transition-all"
              >
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-navy/30 to-cyan-brand/20 flex items-center justify-center">
                    <VideoIcon className="h-8 w-8 text-white/40" />
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-4 w-4 text-navy fill-navy ms-0.5" />
                  </div>
                </div>
                {/* Title */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white text-[11px] font-semibold line-clamp-2">{video.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Reels-style player */}
      {fullscreenIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
        >
          {/* Close */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Mute */}
          <button
            onClick={toggleMute}
            className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-semibold z-10">
            {fullscreenIndex + 1} / {videos.length}
          </div>

          <div className="relative h-full max-h-screen aspect-[9/16]">
            <video
              ref={(el) => { videoRefs.current[fullscreenIndex] = el; }}
              src={videos[fullscreenIndex].videoUrl}
              poster={videos[fullscreenIndex].thumbnailUrl || undefined}
              muted={muted}
              autoPlay
              loop={false}
              playsInline
              onEnded={handleFullscreenEnd}
              className="h-full w-full object-cover"
            />
            {/* Title */}
            <div className="absolute bottom-6 inset-x-6 text-white">
              <h3 className="font-display font-bold text-base sm:text-lg drop-shadow">{videos[fullscreenIndex].title}</h3>
              {videos[fullscreenIndex].description && (
                <p className="mt-1 text-xs sm:text-sm text-white/80 line-clamp-2">{videos[fullscreenIndex].description}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
