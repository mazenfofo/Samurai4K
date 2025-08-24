# Samurai4K Media Player

A premium 4K media player application that supports live TV streaming, movies, and TV series playback. Built with modern web technologies and optimized for performance across all devices.

## Features

### 🎬 Content Categories
- **Live TV**: Real-time streaming of television channels including news, sports, documentaries, and entertainment
- **Movies**: High-quality movie collection with 4K support
- **TV Series**: Complete seasons and episodes of popular TV shows

### 📺 Media Player Features
- **Multi-format Support**: HLS, MP4, and adaptive streaming
- **4K Quality**: Optimized for ultra-high-definition content
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Controls**: Full keyboard navigation and shortcuts
- **Fullscreen Mode**: Immersive viewing experience
- **Auto-play Prevention**: Respects browser policies and user preferences

### 🔍 Search & Discovery
- **Global Search**: Find content across all categories
- **Real-time Results**: Instant search with fuzzy matching
- **Popular Suggestions**: Trending and recommended searches
- **Search History**: Recently searched terms (locally stored)

### 📱 Progressive Web App (PWA)
- **Offline Support**: Basic functionality works offline
- **App Installation**: Can be installed on devices like a native app
- **Push Notifications**: Updates and new content alerts
- **Service Worker**: Background sync and caching

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML and ARIA labels
- **High Contrast Mode**: Support for users with visual impairments
- **Reduced Motion**: Respects user preferences for animations

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, CSS Grid, Flexbox
- **Media Streaming**: HLS.js for live TV and adaptive streaming
- **PWA**: Service Worker, Web App Manifest
- **Icons**: SVG icons for scalability and performance

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server for serving files (development)

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd samurai4k-media-player
   ```

2. **Serve the files using a web server**
   
   Using Python (recommended for development):
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js (if you have it installed):
   ```bash
   npx serve .
   ```
   
   Or use any other static file server.

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Setup

1. **Install dependencies** (optional, for package management):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

## Usage

### Navigation
- Use the top navigation to switch between Live TV, Movies, and Series
- Click the search icon or press `/` to open search
- Use `Ctrl/Cmd + K` for quick search access

### Media Player Controls
- **Space**: Play/Pause
- **Left/Right Arrow**: Skip backward/forward 10 seconds
- **Up/Down Arrow**: Volume up/down
- **F**: Toggle fullscreen
- **M**: Toggle mute
- **Escape**: Close player or exit fullscreen

### Content Interaction
- Click any content card to start playback
- Hover over cards to see preview information
- Use the featured content section for quick access to popular titles

## File Structure

```
samurai4k-media-player/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── package.json           # Project configuration
├── README.md              # Documentation
├── .gitignore             # Git ignore rules
├── styles/
│   └── main.css           # Main stylesheet
└── js/
    ├── main.js            # Application logic
    ├── player.js          # Media player controller
    ├── search.js          # Search functionality
    └── media-data.js      # Content data and configuration
```

## Configuration

### Adding New Content

Edit `js/media-data.js` to add new content:

```javascript
// Add to MEDIA_DATA.liveTV for live channels
{
    id: 'unique-id',
    title: 'Channel Name',
    description: 'Channel description',
    category: 'News',
    isLive: true,
    thumbnail: 'thumbnail-url',
    streamUrl: 'stream-url'
}

// Add to MEDIA_DATA.movies for movies
{
    id: 'unique-id',
    title: 'Movie Title',
    description: 'Movie description',
    genre: 'Action, Drama',
    year: '2023',
    duration: '120 min',
    rating: '8.5',
    thumbnail: 'thumbnail-url',
    videoUrl: 'video-url'
}

// Add to MEDIA_DATA.series for TV series
{
    id: 'unique-id',
    title: 'Series Title',
    description: 'Series description',
    genre: 'Drama, Thriller',
    year: '2020-present',
    seasons: 3,
    episodes: 30,
    rating: '9.0',
    thumbnail: 'thumbnail-url',
    videoUrl: 'video-url'
}
```

### Customizing Appearance

Modify CSS custom properties in `styles/main.css`:

```css
:root {
    --primary-color: #4F46E5;        /* Main brand color */
    --secondary-color: #7C3AED;      /* Secondary brand color */
    --background-dark: #0F0F23;      /* Dark background */
    --background-light: #1E1E3F;     /* Light background */
    /* ... other variables */
}
```

## Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

### Required Features
- ES6+ JavaScript support
- CSS Custom Properties
- CSS Grid and Flexbox
- Media Source Extensions (for HLS)
- Service Workers (for PWA features)

## Performance Optimizations

- **Lazy Loading**: Content is loaded on demand
- **Image Optimization**: Responsive images and placeholders
- **Code Splitting**: Modular JavaScript architecture
- **Caching**: Service worker caches static assets
- **Debounced Search**: Optimized search input handling

## Security Considerations

- **HTTPS Required**: For PWA features and secure streaming
- **Content Security Policy**: Implement CSP headers
- **Secure Streaming**: Use authenticated stream URLs in production
- **Input Sanitization**: Search inputs are properly sanitized

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review browser console for errors

## Roadmap

- [ ] User authentication and profiles
- [ ] Content recommendations
- [ ] Watchlist functionality
- [ ] Chromecast/AirPlay support
- [ ] Multiple language support
- [ ] Parental controls
- [ ] Download for offline viewing
- [ ] Social features and sharing
