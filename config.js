// Samurai Plus 4K Configuration File
// يمكنك تخصيص هذه الإعدادات حسب احتياجاتك

const SAMURAI_CONFIG = {
    // Player settings
    player: {
        autoplay: false,
        defaultVolume: 0.8,
        seekStep: 10, // seconds
        volumeStep: 0.1,
        enableKeyboardShortcuts: true,
        showLoadingSpinner: true,
        errorRetryDelay: 2000, // milliseconds
    },
    
    // UI settings
    ui: {
        theme: {
            primaryColor: '#8B0000',      // Dark red
            secondaryColor: '#DC143C',    // Bright red
            backgroundColor: '#0a0a0a',   // Dark background
            accentColor: '#ff4444'        // Accent glow
        },
        showThumbnails: true,
        animationSpeed: 300, // milliseconds
        enableGlowEffects: true,
        responsiveBreakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        }
    },
    
    // M3U parsing settings
    m3u: {
        supportedFormats: ['.m3u', '.m3u8'],
        maxPlaylistSize: 10000, // maximum number of items
        timeoutDuration: 30000, // milliseconds
        retryAttempts: 3,
        parseGroups: true,
        parseTvgInfo: true
    },
    
    // Streaming settings
    streaming: {
        bufferSize: 90, // seconds
        enableLowLatency: true,
        enableWorker: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        enableHLS: true,
        hlsFragLoadingTimeOut: 20000,
        hlsManifestLoadingTimeOut: 10000
    },
    
    // Keyboard shortcuts (can be customized)
    shortcuts: {
        playPause: 'Space',
        seekForward: 'ArrowRight',
        seekBackward: 'ArrowLeft',
        volumeUp: 'ArrowUp',
        volumeDown: 'ArrowDown',
        mute: 'KeyM',
        fullscreen: 'KeyF',
        nextTrack: 'KeyN',
        previousTrack: 'KeyP',
        shuffle: 'KeyS',
        repeat: 'KeyR'
    },
    
    // Sample M3U URLs for testing
    samplePlaylists: [
        {
            name: "Sample Test Playlist",
            url: "./sample.m3u",
            description: "Local sample playlist for testing"
        }
        // Add your own playlists here
        // {
        //     name: "Your Playlist Name",
        //     url: "https://your-m3u-url.com/playlist.m3u8",
        //     description: "Description of your playlist"
        // }
    ],
    
    // Advanced settings
    advanced: {
        enableConsoleLogging: true,
        enablePerformanceMonitoring: false,
        enableServiceWorker: false, // Set to true for PWA functionality
        enableOfflineMode: false,
        maxConcurrentConnections: 6,
        enableCORS: true
    },
    
    // Localization
    language: {
        default: 'en', // 'en' for English, 'ar' for Arabic
        supportedLanguages: ['en', 'ar'],
        rtlSupport: true // Right-to-left text support for Arabic
    }
};

// Apply configuration on load
if (typeof window !== 'undefined') {
    window.SAMURAI_CONFIG = SAMURAI_CONFIG;
    
    // Apply theme colors to CSS variables
    if (SAMURAI_CONFIG.ui.theme) {
        const root = document.documentElement;
        Object.entries(SAMURAI_CONFIG.ui.theme).forEach(([key, value]) => {
            const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(`--${cssVar}`, value);
        });
    }
    
    console.log('%c🗾 Samurai Plus 4K Configuration Loaded!', 
                'color: #DC143C; font-size: 14px; font-weight: bold;');
}
