// Samurai Plus 4K - M3U Player JavaScript

class SamuraiPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.hls = null;
        this.originalPlaylist = [];
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeHLS();
    }

    initializeElements() {
        // Video elements
        this.videoPlayer = document.getElementById('videoPlayer');
        this.videoOverlay = document.getElementById('videoOverlay');
        this.playButton = document.getElementById('playButton');

        // Control elements
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');

        // Input elements
        this.m3uFileInput = document.getElementById('m3uFileInput');
        this.m3uUrlInput = document.getElementById('m3uUrlInput');
        this.loadUrlBtn = document.getElementById('loadUrlBtn');

        // Playlist elements
        this.playlistElement = document.getElementById('playlist');
        this.playlistCount = document.getElementById('playlistCount');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');

        // Modal elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');

        // Other elements
        this.loadingIndicator = document.getElementById('loadingIndicator');
    }

    initializeEventListeners() {
        // Video events
        this.videoPlayer.addEventListener('loadstart', () => this.showLoading());
        this.videoPlayer.addEventListener('canplay', () => this.hideLoading());
        this.videoPlayer.addEventListener('play', () => this.onPlay());
        this.videoPlayer.addEventListener('pause', () => this.onPause());
        this.videoPlayer.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.videoPlayer.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.videoPlayer.addEventListener('ended', () => this.onVideoEnded());
        this.videoPlayer.addEventListener('error', (e) => this.onVideoError(e));

        // Overlay events
        this.videoOverlay.addEventListener('click', () => this.togglePlay());
        this.playButton.addEventListener('click', () => this.togglePlay());

        // Control events
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
        this.progressBar.addEventListener('input', () => this.seekVideo());

        // File input events
        this.m3uFileInput.addEventListener('change', (e) => this.handleFileInput(e));
        this.loadUrlBtn.addEventListener('click', () => this.loadM3UFromUrl());
        this.m3uUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadM3UFromUrl();
        });

        // Playlist control events
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        // Modal events
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.closeSettings.addEventListener('click', () => this.hideSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.hideSettings();
        });

        // Fullscreen events
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    initializeHLS() {
        if (Hls.isSupported()) {
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
        }
    }

    // File handling methods
    async handleFileInput(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading();
        try {
            const content = await this.readFileContent(file);
            this.parseM3U(content);
        } catch (error) {
            this.showError('Error reading M3U file: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    async loadM3UFromUrl() {
        const url = this.m3uUrlInput.value.trim();
        if (!url) {
            this.showError('Please enter a valid M3U URL');
            return;
        }

        this.showLoading();
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            const content = await response.text();
            this.parseM3U(content);
            this.m3uUrlInput.value = '';
        } catch (error) {
            this.showError('Error loading M3U from URL: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // M3U parsing
    parseM3U(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const newPlaylist = [];
        let currentItem = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith('#EXTINF:')) {
                // Parse EXTINF line: #EXTINF:duration,artist - title
                const match = line.match(/#EXTINF:([^,]*),(.*)$/);
                if (match) {
                    currentItem.duration = match[1];
                    currentItem.title = match[2] || 'Unknown Title';
                }
            } else if (line.startsWith('#EXTGRP:')) {
                // Parse group: #EXTGRP:group_name
                currentItem.group = line.substring(8);
            } else if (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://') || line.startsWith('rtsp://')) {
                // This is a URL
                currentItem.url = line;
                currentItem.id = newPlaylist.length;
                
                if (!currentItem.title) {
                    currentItem.title = this.extractTitleFromUrl(line);
                }
                
                newPlaylist.push({ ...currentItem });
                currentItem = {};
            }
        }

        this.originalPlaylist = [...newPlaylist];
        this.playlist = [...newPlaylist];
        this.currentIndex = 0;
        this.renderPlaylist();
        
        if (this.playlist.length > 0) {
            this.loadCurrentTrack();
        }

        this.showSuccess(`Loaded ${this.playlist.length} channels successfully!`);
    }

    extractTitleFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            const filename = path.split('/').pop();
            return filename || 'Unknown Channel';
        } catch {
            return 'Unknown Channel';
        }
    }

    // Playlist rendering
    renderPlaylist() {
        this.playlistElement.innerHTML = '';
        this.playlistCount.textContent = `(${this.playlist.length})`;

        this.playlist.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `playlist-item ${index === this.currentIndex ? 'active' : ''}`;
            li.innerHTML = `
                <h4>${this.escapeHtml(item.title)}</h4>
                <p>Duration: ${item.duration || 'Unknown'}</p>
                ${item.group ? `<p>Group: ${this.escapeHtml(item.group)}</p>` : ''}
            `;
            
            li.addEventListener('click', () => {
                this.currentIndex = index;
                this.loadCurrentTrack();
                this.renderPlaylist();
            });

            this.playlistElement.appendChild(li);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Media playback
    loadCurrentTrack() {
        if (!this.playlist[this.currentIndex]) return;

        const currentTrack = this.playlist[this.currentIndex];
        this.showLoading();

        // Clean up previous HLS instance
        if (this.hls) {
            this.hls.destroy();
            this.hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
        }

        // Check if it's an HLS stream
        if (currentTrack.url.includes('.m3u8') || currentTrack.url.includes('m3u8')) {
            if (Hls.isSupported()) {
                this.hls.loadSource(currentTrack.url);
                this.hls.attachMedia(this.videoPlayer);
                
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    this.hideLoading();
                    document.title = `${currentTrack.title} - Samurai Plus 4K`;
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS Error:', data);
                    this.onVideoError({ message: data.details || 'HLS playback error' });
                });
            } else if (this.videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                this.videoPlayer.src = currentTrack.url;
            }
        } else {
            // Regular video file
            this.videoPlayer.src = currentTrack.url;
        }

        // Update video attributes
        this.videoPlayer.load();
        document.title = `${currentTrack.title} - Samurai Plus 4K`;
        
        this.renderPlaylist();
        this.showVideoOverlay();
    }

    togglePlay() {
        if (this.videoPlayer.paused) {
            this.videoPlayer.play().catch(error => {
                console.error('Play error:', error);
                this.showError('Unable to play video: ' + error.message);
            });
        } else {
            this.videoPlayer.pause();
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.hideVideoOverlay();
    }

    onPause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.showVideoOverlay();
    }

    onTimeUpdate() {
        if (this.videoPlayer.duration) {
            const progress = (this.videoPlayer.currentTime / this.videoPlayer.duration) * 100;
            this.progressBar.value = progress;
            
            this.currentTimeDisplay.textContent = this.formatTime(this.videoPlayer.currentTime);
        }
    }

    onLoadedMetadata() {
        this.durationDisplay.textContent = this.formatTime(this.videoPlayer.duration);
    }

    onVideoEnded() {
        if (this.isRepeat) {
            this.videoPlayer.currentTime = 0;
            this.videoPlayer.play();
        } else {
            this.nextTrack();
        }
    }

    onVideoError(error) {
        this.hideLoading();
        console.error('Video Error:', error);
        this.showError('Video playback error. Trying next track...');
        
        // Try next track after error
        setTimeout(() => {
            this.nextTrack();
        }, 2000);
    }

    // Navigation
    nextTrack() {
        if (this.playlist.length === 0) return;

        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }
        
        this.loadCurrentTrack();
    }

    previousTrack() {
        if (this.playlist.length === 0) return;

        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = this.currentIndex === 0 ? this.playlist.length - 1 : this.currentIndex - 1;
        }
        
        this.loadCurrentTrack();
    }

    // Controls
    seekVideo() {
        if (this.videoPlayer.duration) {
            const seekTime = (this.progressBar.value / 100) * this.videoPlayer.duration;
            this.videoPlayer.currentTime = seekTime;
        }
    }

    updateVolume() {
        const volume = this.volumeSlider.value / 100;
        this.videoPlayer.volume = volume;
        
        if (volume === 0) {
            this.muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            this.muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            this.muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    toggleMute() {
        if (this.videoPlayer.muted) {
            this.videoPlayer.muted = false;
            this.muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.volumeSlider.value = this.videoPlayer.volume * 100;
        } else {
            this.videoPlayer.muted = true;
            this.muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        
        if (this.isShuffle) {
            this.shuffleBtn.style.background = 'linear-gradient(45deg, var(--bright-red), #ff6b6b)';
        } else {
            this.shuffleBtn.style.background = '';
        }
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
        
        if (this.isRepeat) {
            this.repeatBtn.style.background = 'linear-gradient(45deg, var(--bright-red), #ff6b6b)';
        } else {
            this.repeatBtn.style.background = '';
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('Error entering fullscreen:', err);
            });
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen().catch(err => {
                console.error('Error exiting fullscreen:', err);
            });
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }

    // Modal management
    showSettings() {
        this.settingsModal.classList.add('show');
    }

    hideSettings() {
        this.settingsModal.classList.remove('show');
    }

    // UI feedback
    showVideoOverlay() {
        this.videoOverlay.classList.add('show');
    }

    hideVideoOverlay() {
        this.videoOverlay.classList.remove('show');
    }

    showLoading() {
        this.loadingIndicator.classList.add('show');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('show');
    }

    showError(message) {
        console.error(message);
        // You can implement toast notifications here
        alert('Error: ' + message);
    }

    showSuccess(message) {
        console.log(message);
        // You can implement toast notifications here
        // For now, we'll just log it
    }

    // Utility methods
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Keyboard shortcuts
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT') return;
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.videoPlayer.currentTime += 10;
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.videoPlayer.currentTime -= 10;
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 10);
                this.updateVolume();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 10);
                this.updateVolume();
                break;
            case 'KeyM':
                event.preventDefault();
                this.toggleMute();
                break;
            case 'KeyF':
                event.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyN':
                event.preventDefault();
                this.nextTrack();
                break;
            case 'KeyP':
                event.preventDefault();
                this.previousTrack();
                break;
        }
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.samuraiPlayer = new SamuraiPlayer();
    
    // Add some demo functionality
    console.log('%c🗾 Samurai Plus 4K Player Loaded! 🗾', 'color: #DC143C; font-size: 16px; font-weight: bold;');
    console.log('%cKeyboard shortcuts:', 'color: #8B0000; font-weight: bold;');
    console.log('Space: Play/Pause');
    console.log('← →: Seek backward/forward');
    console.log('↑ ↓: Volume up/down');
    console.log('M: Mute/Unmute');
    console.log('F: Fullscreen');
    console.log('N: Next track');
    console.log('P: Previous track');
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

// Service worker registration for PWA functionality
if ('serviceWorker' in navigator && window.SAMURAI_CONFIG?.advanced?.enableServiceWorker) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('🗾 Service Worker registered successfully:', registration);
                
                // Update available
                registration.addEventListener('updatefound', () => {
                    console.log('🗾 Service Worker update available');
                    const newWorker = registration.installing;
                    
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content is available
                                    console.log('🗾 New content available, refreshing...');
                                    window.location.reload();
                                }
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.error('🗾 Service Worker registration failed:', error);
            });
    });
}

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🗾 PWA install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button or notification
    // You can implement a custom install UI here
});

// PWA installed
window.addEventListener('appinstalled', (evt) => {
    console.log('🗾 Samurai Plus 4K PWA installed successfully!');
    deferredPrompt = null;
});
