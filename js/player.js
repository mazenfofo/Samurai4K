// Media Player Controller
class MediaPlayer {
    constructor() {
        this.player = document.getElementById('main-player');
        this.playerSection = document.getElementById('player-section');
        this.browseSection = document.getElementById('browse-section');
        this.nowPlayingTitle = document.getElementById('now-playing-title');
        this.nowPlayingDescription = document.getElementById('now-playing-description');
        this.closePlayerBtn = document.getElementById('close-player');
        
        this.currentContent = null;
        this.isPlaying = false;
        
        this.initializePlayer();
        this.setupEventListeners();
    }
    
    initializePlayer() {
        // Initialize HLS.js for live TV streaming support
        if (window.Hls && Hls.isSupported()) {
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
        }
        
        // Set up player event listeners
        this.player.addEventListener('loadstart', () => {
            this.showLoadingState();
        });
        
        this.player.addEventListener('canplay', () => {
            this.hideLoadingState();
        });
        
        this.player.addEventListener('error', (e) => {
            console.error('Player error:', e);
            this.handlePlayerError();
        });
        
        this.player.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlaybackState();
        });
        
        this.player.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlaybackState();
        });
        
        this.player.addEventListener('ended', () => {
            this.handlePlaybackEnd();
        });
    }
    
    setupEventListeners() {
        // Close player button
        this.closePlayerBtn.addEventListener('click', () => {
            this.closePlayer();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Escape key to close player
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isPlayerVisible()) {
                this.closePlayer();
            }
        });
    }
    
    playContent(content) {
        this.currentContent = content;
        this.showPlayer();
        this.updatePlayerInfo();
        
        // Determine content type and load accordingly
        if (content.isLive && content.streamUrl) {
            this.playLiveStream(content.streamUrl);
        } else if (content.videoUrl) {
            this.playVideoFile(content.videoUrl);
        } else {
            this.handlePlayerError('No playable content found');
        }
    }
    
    playLiveStream(streamUrl) {
        if (this.hls && streamUrl.includes('.m3u8')) {
            // HLS live stream
            this.hls.loadSource(streamUrl);
            this.hls.attachMedia(this.player);
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.player.play().catch(e => {
                    console.error('Auto-play failed:', e);
                    this.showPlayButton();
                });
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
                if (data.fatal) {
                    this.handlePlayerError('Failed to load live stream');
                }
            });
        } else {
            // Fallback to native video element
            this.player.src = streamUrl;
            this.player.play().catch(e => {
                console.error('Auto-play failed:', e);
                this.showPlayButton();
            });
        }
    }
    
    playVideoFile(videoUrl) {
        // Clean up HLS if previously used
        if (this.hls) {
            this.hls.destroy();
            this.hls = new Hls();
        }
        
        this.player.src = videoUrl;
        this.player.play().catch(e => {
            console.error('Auto-play failed:', e);
            this.showPlayButton();
        });
    }
    
    showPlayer() {
        this.playerSection.style.display = 'block';
        this.browseSection.style.display = 'none';
        document.body.classList.add('player-active');
    }
    
    closePlayer() {
        // Stop playback
        this.player.pause();
        this.player.src = '';
        
        // Clean up HLS
        if (this.hls) {
            this.hls.destroy();
        }
        
        // Hide player
        this.playerSection.style.display = 'none';
        this.browseSection.style.display = 'block';
        document.body.classList.remove('player-active');
        
        this.currentContent = null;
        this.isPlaying = false;
    }
    
    isPlayerVisible() {
        return this.playerSection.style.display === 'block';
    }
    
    updatePlayerInfo() {
        if (this.currentContent) {
            this.nowPlayingTitle.textContent = this.currentContent.title;
            this.nowPlayingDescription.textContent = this.currentContent.description;
            
            // Update document title
            document.title = `${this.currentContent.title} - Samurai4K`;
        }
    }
    
    showLoadingState() {
        // Add loading spinner or indicator
        this.player.style.opacity = '0.7';
    }
    
    hideLoadingState() {
        this.player.style.opacity = '1';
    }
    
    showPlayButton() {
        // Show a play button overlay for manual play
        const playOverlay = document.createElement('div');
        playOverlay.className = 'manual-play-overlay';
        playOverlay.innerHTML = `
            <button class="manual-play-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                Click to Play
            </button>
        `;
        
        playOverlay.addEventListener('click', () => {
            this.player.play();
            playOverlay.remove();
        });
        
        this.player.parentElement.appendChild(playOverlay);
    }
    
    handlePlayerError(errorMessage = 'Playback error occurred') {
        console.error('Player error:', errorMessage);
        
        // Show error message to user
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'error-overlay';
        errorOverlay.innerHTML = `
            <div class="error-content">
                <svg viewBox="0 0 24 24" class="error-icon">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <h3>Playback Error</h3>
                <p>${errorMessage}</p>
                <button class="retry-btn" onclick="this.parentElement.parentElement.remove()">Try Again</button>
            </div>
        `;
        
        this.player.parentElement.appendChild(errorOverlay);
    }
    
    handlePlaybackEnd() {
        // Handle end of content - could suggest next content
        this.isPlaying = false;
        
        if (this.currentContent && !this.currentContent.isLive) {
            // Show replay or next content suggestion
            this.showEndOfContentOptions();
        }
    }
    
    showEndOfContentOptions() {
        const endOverlay = document.createElement('div');
        endOverlay.className = 'end-overlay';
        endOverlay.innerHTML = `
            <div class="end-content">
                <h3>Content Ended</h3>
                <div class="end-actions">
                    <button class="replay-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                        </svg>
                        Replay
                    </button>
                    <button class="close-end-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        Close
                    </button>
                </div>
            </div>
        `;
        
        const replayBtn = endOverlay.querySelector('.replay-btn');
        const closeBtn = endOverlay.querySelector('.close-end-btn');
        
        replayBtn.addEventListener('click', () => {
            this.player.currentTime = 0;
            this.player.play();
            endOverlay.remove();
        });
        
        closeBtn.addEventListener('click', () => {
            this.closePlayer();
        });
        
        this.player.parentElement.appendChild(endOverlay);
    }
    
    updatePlaybackState() {
        // Update UI based on playback state
        if (this.isPlaying) {
            document.title = `▶ ${this.currentContent?.title || 'Playing'} - Samurai4K`;
        } else {
            document.title = `⏸ ${this.currentContent?.title || 'Paused'} - Samurai4K`;
        }
    }
    
    handleKeyboardShortcuts(e) {
        if (!this.isPlayerVisible()) return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (this.isPlaying) {
                    this.player.pause();
                } else {
                    this.player.play();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.player.currentTime = Math.max(0, this.player.currentTime - 10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.player.currentTime = Math.min(this.player.duration, this.player.currentTime + 10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.player.volume = Math.min(1, this.player.volume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.player.volume = Math.max(0, this.player.volume - 0.1);
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.player.muted = !this.player.muted;
                break;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.playerSection.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Quality selection for adaptive streams
    setQuality(quality) {
        if (this.hls && this.hls.levels) {
            const level = this.hls.levels.findIndex(l => l.height === quality);
            if (level !== -1) {
                this.hls.currentLevel = level;
            }
        }
    }
    
    // Get available qualities
    getAvailableQualities() {
        if (this.hls && this.hls.levels) {
            return this.hls.levels.map(level => ({
                height: level.height,
                bandwidth: level.bandwidth,
                label: `${level.height}p`
            }));
        }
        return [];
    }
}

// Initialize player when DOM is loaded
let mediaPlayer;

document.addEventListener('DOMContentLoaded', () => {
    mediaPlayer = new MediaPlayer();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediaPlayer;
}
