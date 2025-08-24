// Search functionality
class SearchManager {
    constructor() {
        this.searchModal = document.getElementById('search-modal');
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchBtn = document.querySelector('.search-btn');
        
        this.isSearchOpen = false;
        this.searchTimeout = null;
        this.minSearchLength = 2;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Search button click
        this.searchBtn.addEventListener('click', () => {
            this.toggleSearch();
        });
        
        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            } else if (e.key === 'Enter') {
                this.handleSearchEnter();
            }
        });
        
        // Modal backdrop click
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) {
                this.closeSearch();
            }
        });
        
        // Global keyboard shortcut
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            // Slash to open search
            else if (e.key === '/' && !this.isInputFocused()) {
                e.preventDefault();
                this.openSearch();
            }
        });
    }
    
    toggleSearch() {
        if (this.isSearchOpen) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }
    
    openSearch() {
        this.isSearchOpen = true;
        this.searchModal.classList.add('active');
        this.searchInput.focus();
        this.searchInput.value = '';
        this.clearResults();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeSearch() {
        this.isSearchOpen = false;
        this.searchModal.classList.remove('active');
        this.clearResults();
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear any pending search
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }
    
    handleSearchInput(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    handleSearchEnter() {
        const firstResult = this.searchResults.querySelector('.search-result');
        if (firstResult) {
            firstResult.click();
        }
    }
    
    performSearch(query) {
        if (!query || query.length < this.minSearchLength) {
            this.clearResults();
            return;
        }
        
        const results = this.searchContent(query.toLowerCase());
        this.displayResults(results);
    }
    
    searchContent(query) {
        const allContent = [
            ...MEDIA_DATA.liveTV.map(item => ({ ...item, type: 'Live TV' })),
            ...MEDIA_DATA.movies.map(item => ({ ...item, type: 'Movie' })),
            ...MEDIA_DATA.series.map(item => ({ ...item, type: 'Series' }))
        ];
        
        return allContent.filter(item => {
            const searchFields = [
                item.title,
                item.description,
                item.genre || item.category,
                item.year,
                item.type
            ].join(' ').toLowerCase();
            
            return this.matchesQuery(searchFields, query);
        }).slice(0, 10); // Limit to 10 results
    }
    
    matchesQuery(text, query) {
        // Simple fuzzy search - matches if all query words are found
        const queryWords = query.split(' ').filter(word => word.length > 0);
        return queryWords.every(word => text.includes(word));
    }
    
    displayResults(results) {
        this.clearResults();
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        results.forEach(result => {
            const resultElement = this.createResultElement(result);
            this.searchResults.appendChild(resultElement);
        });
    }
    
    createResultElement(content) {
        const element = document.createElement('div');
        element.className = 'search-result';
        
        // Create thumbnail
        const thumbnail = document.createElement('div');
        thumbnail.className = 'search-result-image';
        thumbnail.style.backgroundImage = `url(${content.thumbnail})`;
        thumbnail.style.backgroundSize = 'cover';
        thumbnail.style.backgroundPosition = 'center';
        
        // Create content info
        const contentInfo = document.createElement('div');
        contentInfo.className = 'search-result-content';
        
        const title = document.createElement('h4');
        title.textContent = content.title;
        
        const description = document.createElement('p');
        const metaInfo = this.getMetaInfo(content);
        description.textContent = `${content.type} • ${metaInfo}`;
        
        contentInfo.appendChild(title);
        contentInfo.appendChild(description);
        
        element.appendChild(thumbnail);
        element.appendChild(contentInfo);
        
        // Add click handler
        element.addEventListener('click', () => {
            this.handleResultClick(content);
        });
        
        return element;
    }
    
    getMetaInfo(content) {
        if (content.type === 'Live TV') {
            return content.category || 'Live Channel';
        } else if (content.type === 'Movie') {
            return `${content.year} • ${content.duration}`;
        } else if (content.type === 'Series') {
            const seasonText = content.seasons === 1 ? '1 Season' : `${content.seasons} Seasons`;
            return `${content.year} • ${seasonText}`;
        }
        return '';
    }
    
    handleResultClick(content) {
        this.closeSearch();
        
        // Play the selected content
        if (window.mediaPlayer) {
            mediaPlayer.playContent(content);
        }
        
        // Track search result click
        this.trackSearchClick(content);
    }
    
    showNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <svg viewBox="0 0 24 24" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <p>No results found</p>
                <small>Try different keywords or browse categories</small>
            </div>
        `;
        this.searchResults.appendChild(noResults);
    }
    
    clearResults() {
        this.searchResults.innerHTML = '';
    }
    
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    }
    
    trackSearchClick(content) {
        // Analytics tracking for search result clicks
        console.log('Search result clicked:', {
            title: content.title,
            type: content.type,
            id: content.id
        });
    }
    
    // Popular searches or suggestions
    getPopularSearches() {
        return [
            'Action Movies',
            'Sci-Fi Series',
            'Live News',
            'Comedy Shows',
            'Sports Channels',
            'Documentaries'
        ];
    }
    
    showPopularSearches() {
        const popular = this.getPopularSearches();
        const container = document.createElement('div');
        container.className = 'popular-searches';
        container.innerHTML = `
            <div class="popular-searches-header">
                <h4>Popular Searches</h4>
            </div>
            <div class="popular-searches-list">
                ${popular.map(search => `
                    <button class="popular-search-item" data-search="${search}">
                        ${search}
                    </button>
                `).join('')}
            </div>
        `;
        
        // Add click handlers for popular searches
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('popular-search-item')) {
                const searchTerm = e.target.dataset.search;
                this.searchInput.value = searchTerm;
                this.performSearch(searchTerm.toLowerCase());
            }
        });
        
        this.searchResults.appendChild(container);
    }
    
    // Search history management
    saveToHistory(query) {
        let history = this.getSearchHistory();
        history = history.filter(item => item !== query); // Remove if already exists
        history.unshift(query); // Add to beginning
        history = history.slice(0, 10); // Keep only last 10
        
        try {
            localStorage.setItem('samurai4k_search_history', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save search history:', e);
        }
    }
    
    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('samurai4k_search_history') || '[]');
        } catch (e) {
            return [];
        }
    }
    
    clearSearchHistory() {
        try {
            localStorage.removeItem('samurai4k_search_history');
        } catch (e) {
            console.warn('Could not clear search history:', e);
        }
    }
}

// Initialize search when DOM is loaded
let searchManager;

document.addEventListener('DOMContentLoaded', () => {
    searchManager = new SearchManager();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchManager;
}
