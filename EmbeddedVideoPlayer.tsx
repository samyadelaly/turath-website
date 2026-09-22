import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Film, AlertCircle } from 'lucide-react';
import { videoManager, sendIframeCommand } from './videoManager';

interface EmbeddedVideoPlayerProps {
  videoUrl: string;
  title: string;
  posterImage?: string;
  autoPlay?: boolean;
  className?: string;
}

/**
 * Transforms any video link (YouTube, Vimeo, direct MP4/WebM/Blob)
 * into a safe, embedded player with NO external outbound links.
 */
export interface EmbedOptions {
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export const getCleanEmbedUrl = (
  url: string,
  options?: EmbedOptions
): { type: 'youtube' | 'vimeo' | 'html5' | 'iframe'; embedUrl: string; rawId?: string } => {
  if (!url || !url.trim()) {
    return { type: 'html5', embedUrl: '' };
  }

  const trimmed = url.trim();

  // 1. Direct HTML5 Video File or Data URL / Blob
  if (
    trimmed.startsWith('data:video/') ||
    trimmed.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)
  ) {
    return { type: 'html5', embedUrl: trimmed };
  }

  // 2. YouTube URLs (standard watch, short youtu.be, embed, shorts)
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    const autoPlayParam = options?.autoPlay ? '1' : '0';
    const mutedParam = options?.muted !== false ? '1' : '0';
    const controlsParam = options?.controls === false ? '0' : '1';
    const loopParam = options?.loop ? `&loop=1&playlist=${videoId}` : '';
    const originParam =
      typeof window !== 'undefined' && window.location?.origin
        ? `&origin=${encodeURIComponent(window.location.origin)}`
        : '';

    return {
      type: 'youtube',
      rawId: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoPlayParam}&mute=${mutedParam}&controls=${controlsParam}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${originParam}${loopParam}`,
    };
  }

  // 3. Vimeo URLs
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    const autoPlayParam = options?.autoPlay ? '1' : '0';
    const mutedParam = options?.muted !== false ? '1' : '0';
    const loopParam = options?.loop ? '1' : '0';
    const controlsParam = options?.controls === false ? '0' : '1';

    return {
      type: 'vimeo',
      rawId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlayParam}&muted=${mutedParam}&loop=${loopParam}&controls=${controlsParam}&playsinline=1&title=0&byline=0&portrait=0&api=1`,
    };
  }

  // 4. Fallback generic iframe embed
  return { type: 'iframe', embedUrl: trimmed };
};

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  videoUrl,
  title,
  posterImage,
  autoPlay = false,
  className = '',
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerId = useRef<string>(`evp-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`).current;

  // Register with Global Video Coordinator
  useEffect(() => {
    const unregister = videoManager.register({
      id: playerId,
      getElement: () => containerRef.current,
      pauseAndMute: () => {
        setIsPlaying(false);
        setIsMuted(true);
        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.muted = true;
          } catch {}
        }
        const iframeEl = containerRef.current?.querySelector('iframe');
        sendIframeCommand(iframeEl, 'pause');
        sendIframeCommand(iframeEl, 'mute');
      },
      playIfVisible: () => {
        if (autoPlay && videoRef.current) {
          setIsPlaying(true);
          videoRef.current.play().catch(() => {});
        }
      },
    });

    return () => {
      unregister();
    };
  }, [playerId, autoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.muted = true;
        } catch {}
      }
      const iframeEl = containerRef.current?.querySelector('iframe');
      sendIframeCommand(iframeEl, 'pause');
      sendIframeCommand(iframeEl, 'mute');
    };
  }, []);

  // Sync state with DOM video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = isMuted;
    if (isPlaying) {
      if (!isMuted) {
        videoManager.notifyPlay(playerId);
      }
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, isMuted, reloadKey, playerId]);

  const { type, embedUrl } = getCleanEmbedUrl(videoUrl);

  const handleReload = () => {
    setHasError(false);
    setReloadKey((prev) => prev + 1);
  };

  if (!embedUrl) {
    return (
      <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-center border border-[#d4c59d]/30 rounded-xl ${className}`}>
        <Film className="w-12 h-12 text-[#d4c59d]/60 mb-3" />
        <h4 className="text-sm font-bold text-[#f5f0e6]">No Video Assigned</h4>
        <p className="text-xs text-[#9e9174] mt-1">You can add an embedded craft video or upload an MP4 via the editor.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] bg-[#000000] rounded-xl overflow-hidden group/player select-none flex flex-col justify-between ${className}`}
    >
      {/* Top Banner Indicator */}
      <div className="absolute top-2.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md border border-[#d4c59d]/40 text-[#d4c59d] text-[11px] font-semibold tracking-wider uppercase shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>فيديو القطعة المباشر • Embedded Video</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md border border-[#d4c59d]/30 text-[#9e9174] text-[10px]">
          <span>In-Site Player</span>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative w-full h-full flex-1 flex items-center justify-center overflow-hidden bg-[#000000]">
        {hasError ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#d4c59d] mb-2" />
            <p className="text-xs text-[#f5f0e6] font-medium">Video could not be loaded</p>
            <button
              onClick={handleReload}
              className="mt-3 px-3 py-1.5 rounded bg-[#d4c59d] text-[#000000] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e6d8b5]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : type === 'html5' ? (
          <video
            ref={videoRef}
            key={reloadKey}
            src={embedUrl}
            poster={posterImage}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            autoPlay={isPlaying}
            muted={isMuted}
            playsInline
            loop
            onPlay={() => {
              setIsPlaying(true);
              if (!isMuted) {
                videoManager.notifyPlay(playerId);
              }
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onVolumeChange={(e) => {
              const nowMuted = e.currentTarget.muted;
              setIsMuted(nowMuted);
              if (!nowMuted && !e.currentTarget.paused) {
                videoManager.notifyPlay(playerId);
              }
            }}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain max-h-[70vh]"
          />
        ) : (
          <iframe
            key={reloadKey}
            src={embedUrl}
            title={`${title} - Embedded Showcase Video`}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {/* Embedded Controls Helper for HTML5 */}
      {type === 'html5' && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-2 rounded-lg bg-[#000000]/85 backdrop-blur-md border border-[#d4c59d]/30 text-[#f5f0e6] opacity-0 group-hover/player:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextPlay = !isPlaying;
                setIsPlaying(nextPlay);
                if (nextPlay && !isMuted) {
                  videoManager.notifyPlay(playerId);
                }
              }}
              className="p-1.5 rounded bg-[#d4c59d] text-[#000000] hover:bg-[#e6d8b5] transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (!nextMuted) {
                  setIsPlaying(true);
                  videoManager.notifyPlay(playerId);
                }
              }}
              className="p-1.5 rounded bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#252525] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-[11px] text-[#d4c59d] font-medium hidden sm:inline">
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleReload}
            className="p-1.5 rounded bg-[#1a1a1a] text-[#d4c59d] hover:bg-[#252525] transition-colors"
            title="Reload Video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
