// Media content data
const MEDIA_DATA = {
    liveTV: [
        {
            id: 'tv-1',
            title: 'CNN International',
            description: 'Breaking news and analysis from around the world',
            category: 'News',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/DC2626/white?text=CNN',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef123/ip/0.0.0.0/id/xyz123/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r1---sn-sample.googlevideo.com/playlist_type/DVR/mh/Aa/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/1/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl123/playlist/index.m3u8'
        },
        {
            id: 'tv-2',
            title: 'BBC World News',
            description: 'International news and current affairs',
            category: 'News',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/7C2D12/white?text=BBC',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef124/ip/0.0.0.0/id/xyz124/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r2---sn-sample.googlevideo.com/playlist_type/DVR/mh/Bb/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/2/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl124/playlist/index.m3u8'
        },
        {
            id: 'tv-3',
            title: 'National Geographic',
            description: 'Premium nature and science documentaries',
            category: 'Documentary',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/059669/white?text=NAT+GEO',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef125/ip/0.0.0.0/id/xyz125/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r3---sn-sample.googlevideo.com/playlist_type/DVR/mh/Cc/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/3/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl125/playlist/index.m3u8'
        },
        {
            id: 'tv-4',
            title: 'Discovery Channel',
            description: 'Science, technology and adventure programming',
            category: 'Discovery',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/1E40AF/white?text=DISCOVERY',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef126/ip/0.0.0.0/id/xyz126/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r4---sn-sample.googlevideo.com/playlist_type/DVR/mh/Dd/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/4/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl126/playlist/index.m3u8'
        },
        {
            id: 'tv-5',
            title: 'ESPN Sports',
            description: 'Live sports coverage and highlights',
            category: 'Sports',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/DC2626/white?text=ESPN',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef127/ip/0.0.0.0/id/xyz127/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r5---sn-sample.googlevideo.com/playlist_type/DVR/mh/Ee/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/5/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl127/playlist/index.m3u8'
        },
        {
            id: 'tv-6',
            title: 'Music TV',
            description: 'Latest music videos and concerts',
            category: 'Music',
            isLive: true,
            thumbnail: 'https://via.placeholder.com/280x200/7C2D12/white?text=MUSIC+TV',
            streamUrl: 'https://manifest.googlevideo.com/api/manifest/hls_variant/expire/1692892800/ei/abcdef128/ip/0.0.0.0/id/xyz128/itag/96/source/yt_live_broadcast/requiressl/yes/hls_chunk_host/r6---sn-sample.googlevideo.com/playlist_type/DVR/mh/Ff/mm/44/mn/sn-sample/ms/lva/mv/u/mvi/6/pl/26/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl/lsig/AG3C_xAwRQIhAMockStreamUrl128/playlist/index.m3u8'
        }
    ],
    
    movies: [
        {
            id: 'movie-1',
            title: 'The Last Samurai',
            description: 'An American military advisor embraces the Samurai culture he was hired to destroy.',
            genre: 'Action, Drama',
            year: '2003',
            duration: '154 min',
            rating: '7.7',
            thumbnail: 'https://via.placeholder.com/280x200/4F46E5/white?text=SAMURAI',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        },
        {
            id: 'movie-2',
            title: 'Blade Runner 2049',
            description: 'A young blade runner discovers a secret that leads him to Rick Deckard.',
            genre: 'Sci-Fi, Thriller',
            year: '2017',
            duration: '164 min',
            rating: '8.0',
            thumbnail: 'https://via.placeholder.com/280x200/7C3AED/white?text=BLADE+RUNNER',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        },
        {
            id: 'movie-3',
            title: 'Dune',
            description: 'Feature adaptation of Frank Herbert\'s science fiction novel.',
            genre: 'Sci-Fi, Adventure',
            year: '2021',
            duration: '155 min',
            rating: '8.1',
            thumbnail: 'https://via.placeholder.com/280x200/F59E0B/white?text=DUNE',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        },
        {
            id: 'movie-4',
            title: 'Inception',
            description: 'A thief who enters people\'s dreams and steals secrets from their subconscious.',
            genre: 'Sci-Fi, Thriller',
            year: '2010',
            duration: '148 min',
            rating: '8.8',
            thumbnail: 'https://via.placeholder.com/280x200/059669/white?text=INCEPTION',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
        },
        {
            id: 'movie-5',
            title: 'The Matrix',
            description: 'A hacker discovers reality as he knows it is a simulation.',
            genre: 'Sci-Fi, Action',
            year: '1999',
            duration: '136 min',
            rating: '8.7',
            thumbnail: 'https://via.placeholder.com/280x200/DC2626/white?text=MATRIX',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
        },
        {
            id: 'movie-6',
            title: 'Interstellar',
            description: 'Earth\'s future has been riddled by disasters, famines, and droughts.',
            genre: 'Sci-Fi, Drama',
            year: '2014',
            duration: '169 min',
            rating: '8.6',
            thumbnail: 'https://via.placeholder.com/280x200/1E40AF/white?text=INTERSTELLAR',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
        }
    ],
    
    series: [
        {
            id: 'series-1',
            title: 'The Mandalorian',
            description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.',
            genre: 'Sci-Fi, Action',
            year: '2019-present',
            seasons: 3,
            episodes: 24,
            rating: '8.7',
            thumbnail: 'https://via.placeholder.com/280x200/4F46E5/white?text=MANDALORIAN',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
        },
        {
            id: 'series-2',
            title: 'Stranger Things',
            description: 'A group of young friends witness supernatural forces in their small town.',
            genre: 'Horror, Sci-Fi',
            year: '2016-2025',
            seasons: 4,
            episodes: 42,
            rating: '8.7',
            thumbnail: 'https://via.placeholder.com/280x200/DC2626/white?text=STRANGER+THINGS',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        },
        {
            id: 'series-3',
            title: 'The Crown',
            description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.',
            genre: 'Drama, Biography',
            year: '2016-2023',
            seasons: 6,
            episodes: 60,
            rating: '8.6',
            thumbnail: 'https://via.placeholder.com/280x200/7C2D12/white?text=THE+CROWN',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
        },
        {
            id: 'series-4',
            title: 'House of Dragons',
            description: 'An internal succession war within House Targaryen at the height of its power.',
            genre: 'Fantasy, Drama',
            year: '2022-present',
            seasons: 2,
            episodes: 18,
            rating: '8.5',
            thumbnail: 'https://via.placeholder.com/280x200/7C3AED/white?text=HOUSE+DRAGONS',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
        },
        {
            id: 'series-5',
            title: 'Breaking Bad',
            description: 'A high school chemistry teacher turned methamphetamine manufacturer.',
            genre: 'Crime, Drama',
            year: '2008-2013',
            seasons: 5,
            episodes: 62,
            rating: '9.5',
            thumbnail: 'https://via.placeholder.com/280x200/F59E0B/white?text=BREAKING+BAD',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        },
        {
            id: 'series-6',
            title: 'The Witcher',
            description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place.',
            genre: 'Fantasy, Adventure',
            year: '2019-present',
            seasons: 3,
            episodes: 24,
            rating: '8.2',
            thumbnail: 'https://via.placeholder.com/280x200/059669/white?text=THE+WITCHER',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
    ]
};

// Featured content for hero section
const FEATURED_CONTENT = {
    title: 'The Last Samurai',
    description: 'Experience the epic tale of honor, courage, and redemption in stunning 4K quality.',
    thumbnail: 'https://via.placeholder.com/1200x600/4F46E5/white?text=FEATURED+CONTENT',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MEDIA_DATA, FEATURED_CONTENT };
}
