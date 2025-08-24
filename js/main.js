// Main application logic
class Samurai4KApp {
    constructor() {
        this.currentCategory = 'live-tv';
        this.contentGrids = {
            'live-tv': document.getElementById('live-tv-grid'),
            'movies': document.getElementById('movies-grid'),
            'series': document.getElementById('series-grid')
        };
        this.contentSections = {
            'live-tv': document.getElementById('live-tv-content'),
            'movies': document.getElementById('movies-content'),
            'series': document.getElementById('series-content')
        };
        this.navItems = document.querySelectorAll('.nav-item');
        this.heroPlayBtn = document.getElementById('hero-play');
        
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadContentForCategory(this.currentCategory);
        this.setupHeroSection();
        
        // Preload content for other categories
        setTimeout(() => {
            this.preloadContent();
        }, 1000);
        
        console.log('Samurai4K Media Player initialized');
    }
    
    setupEventListeners() {
        // Navigation items
        this.navItems.forEach(navItem => {
            navItem.addEventListener('click', () => {
                const category = navItem.dataset.category;
                this.switchCategory(category);
            });
        });
        
        // Hero play button
        this.heroPlayBtn.addEventListener('click', () => {
            this.playFeaturedContent();
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }
    
    switchCategory(category) {
        if (category === this.currentCategory || this.isLoading) return;
        
        // Update navigation
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });
        
        // Update content sections
        Object.values(this.contentSections).forEach(section => {
            section.classList.remove('active');
        });
        this.contentSections[category].classList.add('active');
        
        this.currentCategory = category;
        
        // Load content if not already loaded
        if (!this.contentGrids[category].hasChildNodes()) {
            this.loadContentForCategory(category);
        }
        
        // Analytics tracking
        this.trackCategorySwitch(category);
    }
    
    loadContentForCategory(category) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState(category);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            const content = this.getContentForCategory(category);
            this.renderContent(category, content);
            this.hideLoadingState(category);
            this.isLoading = false;
        }, 500);
    }
    
    getContentForCategory(category) {
        switch (category) {
            case 'live-tv':
                return MEDIA_DATA.liveTV;
            case 'movies':
                return MEDIA_DATA.movies;
            case 'series':
                return MEDIA_DATA.series;
            default:
                return [];
        }
    }
    
    renderContent(category, content) {
        const grid = this.contentGrids[category];
        grid.innerHTML = '';
        
        content.forEach(item => {
            const card = this.createContentCard(item);
            grid.appendChild(card);
        });
    }
    
    createContentCard(content) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.setAttribute('data-content-id', content.id);
        
        // Card image with play overlay
        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        
        if (content.thumbnail) {
            cardImage.style.backgroundImage = `url(${content.thumbnail})`;
            cardImage.style.backgroundSize = 'cover';
            cardImage.style.backgroundPosition = 'center';
        }
        
        const playOverlay = document.createElement('div');
        playOverlay.className = 'play-overlay';
        playOverlay.innerHTML = '<div class="play-button">▶</div>';
        
        cardImage.appendChild(playOverlay);
        
        // Card content
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const title = document.createElement('h4');
        title.className = 'card-title';
        title.textContent = content.title;
        
        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = content.description;
        
        const meta = document.createElement('div');
        meta.className = 'card-meta';
        meta.innerHTML = this.getCardMeta(content);
        
        cardContent.appendChild(title);
        cardContent.appendChild(description);
        cardContent.appendChild(meta);
        
        card.appendChild(cardImage);
        card.appendChild(cardContent);
        
        // Add click handler
        card.addEventListener('click', () => {
            this.handleContentClick(content);
        });
        
        // Add hover effects
        this.addCardHoverEffects(card);
        
        return card;
    }
    
    getCardMeta(content) {
        let meta = '';
        
        if (content.isLive) {
            meta += '<span class="live-indicator"><span class="live-dot"></span>LIVE</span>';
        }
        
        if (content.genre) {
            meta += `<span>${content.genre}</span>`;
        }
        
        if (content.category) {
            meta += `<span>${content.category}</span>`;
        }
        
        if (content.year) {
            meta += `<span>${content.year}</span>`;
        }
        
        if (content.duration) {
            meta += `<span>${content.duration}</span>`;
        }
        
        if (content.seasons) {
            const seasonText = content.seasons === 1 ? '1 Season' : `${content.seasons} Seasons`;
            meta += `<span>${seasonText}</span>`;
        }
        
        if (content.rating) {
            meta += `<span>⭐ ${content.rating}</span>`;
        }
        
        return meta;
    }
    
    addCardHoverEffects(card) {
        let hoverTimeout;
        
        card.addEventListener('mouseenter', () => {
            hoverTimeout = setTimeout(() => {
                this.showCardPreview(card);
            }, 1000);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            this.hideCardPreview(card);
        });
    }
    
    showCardPreview(card) {
        // Add enhanced preview on hover
        card.classList.add('hovered');
    }
    
    hideCardPreview(card) {
        card.classList.remove('hovered');
    }
    
    handleContentClick(content) {
        // Play content using media player
        if (window.mediaPlayer) {
            mediaPlayer.playContent(content);
        }
        
        // Track content selection
        this.trackContentPlay(content);
    }
    
    setupHeroSection() {
        // Set up featured content
        const heroSection = document.querySelector('.hero-section');
        if (FEATURED_CONTENT.thumbnail) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${FEATURED_CONTENT.thumbnail})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
    
    playFeaturedContent() {
        if (window.mediaPlayer) {
            mediaPlayer.playContent(FEATURED_CONTENT);
        }
    }
    
    preloadContent() {
        // Preload content for better performance
        const categories = ['movies', 'series'];
        categories.forEach(category => {
            if (!this.contentGrids[category].hasChildNodes()) {
                const content = this.getContentForCategory(category);
                this.renderContent(category, content);
            }
        });
    }
    
    showLoadingState(category) {
        const grid = this.contentGrids[category];
        grid.innerHTML = this.getLoadingHTML();
    }
    
    hideLoadingState(category) {
        // Content will replace loading state
    }
    
    getLoadingHTML() {
        return `
            <div class="loading-container">
                ${Array(6).fill().map(() => `
                    <div class="content-card loading-card">
                        <div class="card-image loading-shimmer"></div>
                        <div class="card-content">
                            <div class="loading-shimmer loading-title"></div>
                            <div class="loading-shimmer loading-description"></div>
                            <div class="loading-shimmer loading-meta"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    handleResize() {
        // Handle responsive layout changes
        const isSmallScreen = window.innerWidth < 768;
        
        if (isSmallScreen && !document.body.classList.contains('mobile')) {
            document.body.classList.add('mobile');
            this.handleMobileLayout();
        } else if (!isSmallScreen && document.body.classList.contains('mobile')) {
            document.body.classList.remove('mobile');
            this.handleDesktopLayout();
        }
    }
    
    handleMobileLayout() {
        // Optimize for mobile
        console.log('Switched to mobile layout');
    }
    
    handleDesktopLayout() {
        // Optimize for desktop
        console.log('Switched to desktop layout');
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause any non-live content when tab is not visible
            if (window.mediaPlayer && mediaPlayer.currentContent && !mediaPlayer.currentContent.isLive) {
                mediaPlayer.player.pause();
            }
        }
    }
    
    // Analytics and tracking methods
    trackCategorySwitch(category) {
        console.log('Category switched to:', category);
        
        // Track with analytics service
        this.sendAnalytics('category_switch', {
            category: category,
            timestamp: Date.now()
        });
    }
    
    trackContentPlay(content) {
        console.log('Content played:', content.title);
        
        // Track with analytics service
        this.sendAnalytics('content_play', {
            content_id: content.id,
            content_title: content.title,
            content_type: content.isLive ? 'live-tv' : (content.genre ? 'movie' : 'series'),
            timestamp: Date.now()
        });
    }
    
    sendAnalytics(event, data) {
        // Send analytics data to service
        // This is a placeholder - replace with actual analytics implementation
        try {
            // Example: gtag('event', event, data);
            console.log('Analytics:', event, data);
        } catch (e) {
            console.warn('Analytics error:', e);
        }
    }
    
    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize app when DOM is loaded
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new Samurai4KApp();
    
    // Handle initial resize
    app.handleResize();
    
    // Service worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
});

// Handle app install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show install button or banner
    console.log('App can be installed');
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Samurai4KApp;
}
