import React, { useState, useRef, useEffect } from 'react';
import { videoManager, sendIframeCommand } from "./videoManager";
import {
  MediaType,
  MediaRatioPreset,
  MediaObjectFit,
  MediaObjectPosition,
  MediaRatioConfig,
  ComputedMediaRatio,
  ComputedImageRatio,
  computeMediaRatio,
  computeImageRatio,
} from "./imageRatioUtils";
import { getCleanEmbedUrl } from "./EmbeddedVideoPlayer";
import { Film, Play, Pause, Volume2, VolumeX, RotateCcw, AlertCircle } from 'lucide-react';

export interface TurathMediaProps {
  type?: MediaType;
  src?: string | null;
  videoUrl?: string | null;
  poster?: string;
  alt?: string;
  title?: string;

  // Global Media Ratio System
  ratio?: MediaRatioPreset | string;
  customWidth?: number | string;
  customHeight?: number | string;
  fit?: MediaObjectFit | string;
  position?: MediaObjectPosition | string;
  ratioConfig?: MediaRatioConfig;
  computedRatio?: ComputedMediaRatio | ComputedImageRatio;
  defaultType?: 'product' | 'product_main' | 'category' | 'hero' | 'gallery' | 'general' | 'video';

  // Styling & layout
  className?: string;
  containerClassName?: string;
  mediaClassName?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
  mediaStyle?: React.CSSProperties;

  // Video playback options
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  showSoundToggle?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  showVideoBadge?: boolean;
  allowIframeFullscreen?: boolean;
  soundTogglePosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left';

  // Image loading options
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  decoding?: 'async' | 'auto' | 'sync';

  // Handlers & slot
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80';

/**
 * TURATH Global Media Component (<TurathMedia />)
 * 
 * Implements ONE centralized aspect-ratio system for BOTH images and videos:
 * 1. Admin selected ratio: Original, 1:1, 4:5, 3:4, 16:9, 4:3, 16:7, or Custom (width & height).
 * 2. Admin selected fit: Contain (default for complete product view) or Cover.
 * 3. Admin selected position: Center, Top, Bottom, Left, Right.
 * 4. CSS aspect-ratio is applied to the visual container.
 * 5. Original media files/URLs are strictly preserved without permanent alteration.
 */
export const TurathMedia: React.FC<TurathMediaProps> = ({
  type,
  src,
  videoUrl,
  poster,
  alt = 'TURATH Brass Art Piece',
  title = 'TURATH Luxury Media',
  ratio,
  customWidth,
  customHeight,
  fit,
  position,
  ratioConfig,
  computedRatio,
  defaultType,
  className = '',
  containerClassName = '',
  mediaClassName = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  style = {},
  mediaStyle = {},
  autoPlay = false,
  controls = true,
  muted = false,
  showSoundToggle = true,
  soundTogglePosition = 'bottom-right',
  loop = true,
  playsInline = true,
  showVideoBadge = false,
  allowIframeFullscreen = true,
  loading = 'lazy',
  priority = false,
  decoding = 'async',
  onClick,
  children,
}) => {
  // Determine if active media is video or image
  const resolvedVideoUrl = videoUrl || (type === 'video' ? src : undefined);
  const isVideo =
    type === 'video' ||
    Boolean(
      resolvedVideoUrl ||
      (src && (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src) || src.startsWith('data:video/')))
    );

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerId = useRef<string>(`turath-media-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`).current;
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted !== undefined ? muted : true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Keep references to latest states to prevent tearing down registration on state toggle
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Sync external muted prop
  useEffect(() => {
    if (muted !== undefined) {
      setIsMuted(muted);
    }
  }, [muted]);

  // Safe playback helpers to eliminate AbortError and frame drops
  const safePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      const p = vid.play();
      if (p !== undefined) {
        playPromiseRef.current = p;
        p.catch((err) => {
          // If browser policy blocks unmuted autoplay without prior interaction,
          // mute temporarily so the video plays visually without stuttering
          if (!vid.muted && (err.name === 'NotAllowedError' || err.name === 'AbortError')) {
            vid.muted = true;
            setIsMuted(true);
            setAudioBlocked(true);
            vid.play().catch(() => {});
          }
        }).finally(() => {
          playPromiseRef.current = null;
        });
      }
    }
  };

  const safePause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!vid.paused) {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            vid.pause();
          })
          .catch(() => {});
      } else {
        vid.pause();
      }
    }
  };

  // Register with Global Video & Audio Coordinator
  useEffect(() => {
    if (!isVideo) return;

    const unregister = videoManager.register({
      id: playerId,
      getElement: () => containerRef.current,
      pauseAndMute: () => {
        safePause();
        setIsPlaying(false);
        if (!isMutedRef.current) {
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
          }
        }
        const iframeEl = iframeRef.current || containerRef.current?.querySelector('iframe');
        sendIframeCommand(iframeEl, 'pause');
        sendIframeCommand(iframeEl, 'mute');
      },
      playIfVisible: () => {
        if (autoPlay) {
          setIsPlaying(true);
          safePlay();
        }
      },
    });

    return () => {
      unregister();
    };
  }, [isVideo, playerId, autoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safePause();
      const iframeEl = iframeRef.current || containerRef.current?.querySelector('iframe');
      sendIframeCommand(iframeEl, 'pause');
      sendIframeCommand(iframeEl, 'mute');
    };
  }, []);

  // Handle video audio and playback
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = isMuted;
    if (!isMuted) {
      vid.volume = 1.0;
    }

    if (isPlaying) {
      if (!isMuted) {
        videoManager.notifyPlay(playerId);
      }
      safePlay();
    } else {
      safePause();
    }
  }, [isPlaying, reloadKey, isMuted, playerId]);

  // Unmute automatically on user's first interaction if user wanted sound
  useEffect(() => {
    if (!audioBlocked || muted) return;

    const handleUserGesture = () => {
      const vid = videoRef.current;
      if (vid && isMuted) {
        vid.muted = false;
        setIsMuted(false);
        setAudioBlocked(false);
        vid.volume = 1.0;
        videoManager.notifyPlay(playerId);
      }
    };

    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };
  }, [audioBlocked, isMuted, muted, playerId]);

  const handleToggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setAudioBlocked(false);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      if (!nextMuted) {
        // User unmuted this video: ensure it plays and tell coordinator to silence all others
        setIsPlaying(true);
        videoManager.notifyPlay(playerId);
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
    const iframeEl = iframeRef.current || containerRef.current?.querySelector('iframe');
    if (!nextMuted) {
      videoManager.notifyPlay(playerId);
      sendIframeCommand(iframeEl, 'unmute');
      sendIframeCommand(iframeEl, 'play');
    } else {
      sendIframeCommand(iframeEl, 'mute');
    }
  };

  // Compute final aspect ratio & object fit/position
  let finalRatio: ComputedImageRatio;

  if (computedRatio) {
    finalRatio = computedRatio;
  } else if (ratioConfig) {
    finalRatio = computeImageRatio(ratioConfig);
  } else {
    // Resolve defaults based on media type & context
    let activePreset = ratio;
    let activeFit = fit;
    let activePosition = position;

    if (!activePreset) {
      switch (defaultType) {
        case 'product':
        case 'product_main':
          activePreset = '4:5';
          activeFit = activeFit || 'contain';
          break;
        case 'category':
          activePreset = '16:7';
          activeFit = activeFit || 'cover';
          break;
        case 'hero':
          activePreset = '16:9';
          activeFit = activeFit || 'cover';
          break;
        case 'video':
          activePreset = 'Original';
          activeFit = activeFit || 'contain';
          break;
        case 'gallery':
        case 'general':
        default:
          activePreset = 'Original';
          activeFit = activeFit || (isVideo ? 'contain' : 'contain');
          break;
      }
    }

    const normalizedFit: MediaObjectFit = activeFit === 'cover' ? 'cover' : 'contain';

    finalRatio = computeImageRatio({
      ratio: activePreset,
      customWidth,
      customHeight,
      fit: normalizedFit,
      position: (activePosition as MediaObjectPosition) || 'center',
    });
  }

  // Container aspect-ratio styling
  const containerAspectStyle: React.CSSProperties = {
    ...(finalRatio.isOriginal ? {} : { aspectRatio: finalRatio.aspectRatioCss }),
    ...style,
  };

  // Video embed url parsing with preview/controls options
  // Always initialize iframe as muted so autoplay succeeds without popup blockers,
  // and use postMessage (sendIframeCommand) for real-time mute/unmute so iframe does NOT reload when unmuted!
  const activeVideoUrl = resolvedVideoUrl || src || '';
  const videoEmbed = isVideo && activeVideoUrl ? getCleanEmbedUrl(activeVideoUrl, {
    autoPlay,
    muted: true,
    loop,
    controls,
  }) : null;

  const handleRetryVideo = () => {
    setVideoError(false);
    setReloadKey((prev) => prev + 1);
  };

  const soundTogglePositionClass = {
    'bottom-right': 'bottom-3 right-3',
    'top-right': 'top-3 right-3 sm:top-4 sm:right-4',
    'bottom-left': 'bottom-3 left-3',
    'top-left': 'top-3 left-3 sm:top-4 sm:left-4',
  }[soundTogglePosition] || 'bottom-3 right-3';

  return (
    <div
      ref={containerRef}
      className={`turath-media-container relative w-full overflow-hidden bg-[#0c0c10] flex items-center justify-center transition-all ${containerClassName} ${className}`}
      style={containerAspectStyle}
      onClick={onClick}
    >
      {isVideo ? (
        // VIDEO RENDERING
        activeVideoUrl && videoEmbed?.embedUrl ? (
          videoError ? (
            <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-[#07070a]">
              <AlertCircle className="w-8 h-8 text-[#d4c59d] mb-2" />
              <p className="text-xs text-[#f5f0e6] font-medium">Video could not be loaded</p>
              <button
                type="button"
                onClick={handleRetryVideo}
                className="mt-2 px-3 py-1 rounded bg-[#d4c59d] text-black text-xs font-bold flex items-center gap-1 hover:bg-[#e6d8b5]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black group/turath-video">
              {videoEmbed.type === 'html5' ? (
                <video
                  ref={videoRef}
                  key={reloadKey}
                  src={videoEmbed.embedUrl}
                  poster={poster}
                  controls={controls}
                  controlsList="nodownload noplaybackrate"
                  autoPlay={autoPlay}
                  muted={isMuted}
                  preload="auto"
                  loop={loop}
                  playsInline={playsInline}
                  disablePictureInPicture={true}
                  onContextMenu={(e) => e.preventDefault()}
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
                  onError={() => setVideoError(true)}
                  className={`w-full h-full transform-gpu transition-transform duration-500 select-none ${mediaClassName}`}
                  style={{
                    objectFit: finalRatio.objectFit,
                    objectPosition: finalRatio.objectPosition,
                    ...mediaStyle,
                  }}
                />
              ) : (
                // Embedded YouTube / Vimeo / iframe
                <iframe
                  ref={iframeRef}
                  key={reloadKey}
                  src={videoEmbed.embedUrl}
                  title={`${title} - Craft Video`}
                  className={`w-full h-full border-0 absolute inset-0 transform-gpu ${controls ? '' : 'pointer-events-none'} ${mediaClassName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={allowIframeFullscreen}
                  loading="lazy"
                />
              )}

              {/* In-container floating video badge if requested */}
              {showVideoBadge && (
                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-[#d4c59d]/40 text-[#d4c59d] text-[10px] font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Video</span>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0f]">
            <Film className="w-10 h-10 text-[#d4c59d]/40 mb-2" />
            <p className="text-xs text-[#9e9174]">No video available for this piece</p>
          </div>
        )
      ) : (
        // IMAGE RENDERING
        <img
          src={imageError || !src ? fallbackSrc : src}
          alt={alt}
          title={title}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          onError={() => setImageError(true)}
          className={`w-full h-full transition-transform duration-500 select-none pointer-events-auto ${mediaClassName}`}
          style={{
            objectFit: finalRatio.objectFit,
            objectPosition: finalRatio.objectPosition,
            ...mediaStyle,
          }}
        />
      )}

      {/* Children overlay slot (badges, interactive hover overlays, play buttons, etc.) */}
      {children}

      {/* Floating Audio Sound Control Button - Rendered after children with high z-index so it is always accessible and unobstructed */}
      {isVideo && showSoundToggle && (
        <button
          type="button"
          onClick={handleToggleMute}
          className={`absolute ${soundTogglePositionClass} z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/90 hover:bg-black text-[#d4c59d] hover:text-white border border-[#d4c59d]/60 hover:border-[#d4c59d] backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer select-none group/sound-btn pointer-events-auto`}
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-300 group-hover/sound-btn:scale-110 transition-transform" />
              <span className="text-[11px] font-arabic font-bold text-amber-200">تشغيل الصوت</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse group-hover/sound-btn:scale-110 transition-transform" />
              <span className="text-[11px] font-arabic font-bold text-[#d4c59d]">الصوت يعمل</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TurathMedia;
