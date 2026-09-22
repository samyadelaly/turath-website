/**
 * Comprehensive Video & Audio Coordinator for Turath
 * Ensures:
 * 1. Scrolling away from any video immediately pauses and mutes it.
 * 2. Navigating, opening/closing modals, or tab switching silences and pauses all videos.
 * 3. Only ONE video can ever play with audio at any time across the entire website.
 * 4. Supports HTML5 <video>, YouTube embeds, and Vimeo embeds with zero sound collisions.
 */

export interface VideoPlayerRegistration {
  id: string;
  getElement: () => HTMLElement | null;
  pauseAndMute: () => void;
  playIfVisible?: () => void;
  unmute?: () => void;
}

/**
 * Universal safe command dispatcher for embedded iframes (YouTube & Vimeo)
 */
export function sendIframeCommand(
  iframe: HTMLIFrameElement | null | undefined,
  action: 'play' | 'pause' | 'mute' | 'unmute'
) {
  if (!iframe || !iframe.contentWindow) return;

  try {
    const win = iframe.contentWindow;

    switch (action) {
      case 'pause':
        // YouTube API formats
        win.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
        // Vimeo API format
        win.postMessage(JSON.stringify({ method: 'pause' }), '*');
        break;

      case 'mute':
        // YouTube API formats
        win.postMessage('{"event":"command","func":"mute","args":""}', '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
        // Vimeo API format
        win.postMessage(JSON.stringify({ method: 'setVolume', value: 0 }), '*');
        break;

      case 'play':
        // YouTube API formats
        win.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
        // Vimeo API format
        win.postMessage(JSON.stringify({ method: 'play' }), '*');
        break;

      case 'unmute':
        // YouTube API formats (volume 0-100)
        win.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
        win.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
        // Vimeo API format (volume 0-1)
        win.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), '*');
        win.postMessage(JSON.stringify({ method: 'play' }), '*');
        break;
    }
  } catch (err) {
    // Cross-origin messaging may fail gracefully if iframe is destroyed
  }
}

class VideoManager {
  private players = new Map<string, VideoPlayerRegistration>();
  private activeAudioPlayerId: string | null = null;
  private observer: IntersectionObserver | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIntersectionObserver();
      this.initGlobalListeners();
    }
  }

  private initIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const playerId = target.getAttribute('data-turath-player-id');
          if (!playerId) return;

          const player = this.players.get(playerId);
          if (!player) return;

          if (!entry.isIntersecting || entry.intersectionRatio <= 0.05) {
            // When video is off-screen or less than 5% visible, pause and mute immediately
            player.pauseAndMute();
            if (this.activeAudioPlayerId === playerId) {
              this.activeAudioPlayerId = null;
            }
          } else if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            // When video re-enters the viewport, resume smooth visual preview
            if (player.playIfVisible) {
              player.playIfVisible();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px 0px 0px', // Strict boundary: no delay or hidden margin
        threshold: [0, 0.1, 0.25],
      }
    );
  }

  private initGlobalListeners() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Real-time passive scroll listener for instantaneous audio cutoff upon scrolling away
    let scrollRaf: number | null = null;
    window.addEventListener(
      'scroll',
      () => {
        if (scrollRaf) return;
        scrollRaf = window.requestAnimationFrame(() => {
          scrollRaf = null;
          this.checkOffscreenPlayers();
        });
      },
      { passive: true }
    );

    // Page lifecycle and background tab events
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAndMuteAll();
      }
    });

    window.addEventListener('pagehide', () => this.pauseAndMuteAll());
    window.addEventListener('blur', () => this.pauseAndMuteAll());
    window.addEventListener('popstate', () => this.pauseAndMuteAll());
    window.addEventListener('hashchange', () => this.pauseAndMuteAll());

    // Custom site-wide event for route transitions and modal changes
    window.addEventListener('turath-pause-all-videos', () => this.pauseAndMuteAll());

    // Intercept postMessage from YouTube/Vimeo iframes to detect direct play
    window.addEventListener('message', (event) => {
      try {
        let payload: any = event.data;
        if (typeof payload === 'string' && (payload.startsWith('{') || payload.startsWith('['))) {
          payload = JSON.parse(payload);
        }

        // YouTube state 1 is PLAYING
        const isYouTubePlaying =
          payload?.event === 'onStateChange' && (payload?.info === 1 || payload?.data === 1);
        const isVimeoPlaying = payload?.event === 'play';

        if (isYouTubePlaying || isVimeoPlaying) {
          const iframes = Array.from(document.querySelectorAll('iframe'));
          const sourceIframe = iframes.find((f) => f.contentWindow === event.source);
          if (sourceIframe) {
            const container = sourceIframe.closest('[data-turath-player-id]');
            const playerId = container?.getAttribute('data-turath-player-id');
            if (playerId) {
              this.notifyPlay(playerId);
            }
          }
        }
      } catch {}
    });
  }

  /**
   * Register a video player instance
   */
  public register(player: VideoPlayerRegistration): () => void {
    this.players.set(player.id, player);

    const el = player.getElement();
    if (el && this.observer) {
      el.setAttribute('data-turath-player-id', player.id);
      this.observer.observe(el);
    }

    return () => {
      if (this.activeAudioPlayerId === player.id) {
        this.activeAudioPlayerId = null;
      }
      if (el && this.observer) {
        this.observer.unobserve(el);
      }
      this.players.delete(player.id);
    };
  }

  /**
   * Called when a player begins playback or is unmuted.
   * Pauses and mutes all OTHER players immediately so the current video's audio is clear.
   */
  public notifyPlay(playerId: string) {
    this.activeAudioPlayerId = playerId;

    // Pause and mute all other registered players
    this.players.forEach((player, id) => {
      if (id !== playerId) {
        try {
          player.pauseAndMute();
        } catch (e) {
          console.warn('Error pausing player:', id, e);
        }
      }
    });

    // Also silence any native video tags and iframes in DOM not inside the active player
    if (typeof document !== 'undefined') {
      const activeEl = this.players.get(playerId)?.getElement();

      document.querySelectorAll('video').forEach((vid) => {
        if (!activeEl || !activeEl.contains(vid)) {
          try {
            vid.muted = true;
            vid.pause();
          } catch {}
        }
      });

      document.querySelectorAll('iframe').forEach((iframe) => {
        if (!activeEl || !activeEl.contains(iframe)) {
          sendIframeCommand(iframe, 'pause');
          sendIframeCommand(iframe, 'mute');
        }
      });
    }
  }

  /**
   * Pauses and mutes all video players across the entire application
   */
  public pauseAndMuteAll(exceptId?: string) {
    this.players.forEach((player, id) => {
      if (id !== exceptId) {
        try {
          player.pauseAndMute();
        } catch (e) {
          console.warn('Error in pauseAndMuteAll:', id, e);
        }
      }
    });

    if (typeof document !== 'undefined') {
      const exceptEl = exceptId ? this.players.get(exceptId)?.getElement() : null;

      document.querySelectorAll('video').forEach((vid) => {
        if (!exceptEl || !exceptEl.contains(vid)) {
          try {
            vid.muted = true;
            vid.pause();
          } catch {}
        }
      });

      document.querySelectorAll('iframe').forEach((iframe) => {
        if (!exceptEl || !exceptEl.contains(iframe)) {
          sendIframeCommand(iframe, 'pause');
          sendIframeCommand(iframe, 'mute');
        }
      });
    }

    if (!exceptId || this.activeAudioPlayerId !== exceptId) {
      this.activeAudioPlayerId = exceptId || null;
    }
  }

  /**
   * Updates the tracked DOM element for an existing player (e.g. after re-render)
   */
  public updateElement(playerId: string, el: HTMLElement | null) {
    const player = this.players.get(playerId);
    if (!player) return;

    if (this.observer && el) {
      el.setAttribute('data-turath-player-id', playerId);
      this.observer.observe(el);
    }
  }

  /**
   * Get the ID of the current player producing sound
   */
  public getActiveAudioPlayerId(): string | null {
    return this.activeAudioPlayerId;
  }

  /**
   * Evaluates viewport coordinates of all registered players on scroll.
   * If any playing video leaves the viewport (top or bottom), immediately mutes & pauses it.
   */
  public checkOffscreenPlayers() {
    if (typeof window === 'undefined') return;

    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    this.players.forEach((player, id) => {
      const el = player.getElement();
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // Video is considered off-screen if it has scrolled past the top or bottom of the screen
      const isOffscreen =
        rect.bottom <= 15 ||
        rect.top >= windowHeight - 15 ||
        rect.right <= 0 ||
        rect.left >= windowWidth;

      if (isOffscreen) {
        player.pauseAndMute();
        if (this.activeAudioPlayerId === id) {
          this.activeAudioPlayerId = null;
        }
      }
    });
  }
}

export const videoManager = new VideoManager();
export const pauseAndMuteAllVideos = (exceptId?: string) => videoManager.pauseAndMuteAll(exceptId);


