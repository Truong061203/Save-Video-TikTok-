import React, { useState } from 'react';
import PlatformSelector from './components/PlatformSelector';
import MediaCard from './components/MediaCard';
import Toast from './components/Toast';
import { PLATFORMS } from './constants';
import { fetchVideoData } from './services/api';
import { VideoData } from './types';
import { Link2, Search, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [platformId, setPlatformId] = useState<string>('tiktok');
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string>('');

  // Derived
  const activePlatform = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];

  // Handlers
  const handlePlatformChange = (id: string) => {
    setPlatformId(id);
    setError('');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 1. Validation
    if (!url.trim()) {
      setError('Please paste a URL first.');
      return;
    }

    // 2. Regex Check (Edge Case)
    if (!activePlatform.regex.test(url)) {
      const correctPlatform = PLATFORMS.find(p => p.regex.test(url));
      if (correctPlatform) {
        setError(`That looks like a ${correctPlatform.name} link. Please switch to the ${correctPlatform.name} tab.`);
      } else {
        setError(`Invalid URL. Please ensure it matches the selected platform.`);
      }
      return;
    }

    // 3. Implemented Check
    if (!activePlatform.isImplemented) {
        setError(`${activePlatform.name} support is coming soon. Please try TikTok.`);
        return;
    }

    // 4. API Call
    setLoading(true);
    setData(null);
    
    try {
      const videoData = await fetchVideoData(url, activePlatform.id);
      setData(videoData);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching video data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-8 px-3 sm:px-6 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 text-center mb-8 max-w-2xl mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tik</span>Saver
        </h1>
        <p className="text-slate-400 text-sm md:text-lg px-4">
          Download HD Videos without Watermark. <br className="md:hidden"/> Fast & Free.
        </p>
      </header>

      {/* Platform Tabs */}
      <div className="relative z-10 w-full max-w-4xl">
        <PlatformSelector currentPlatformId={platformId} onSelect={handlePlatformChange} />
      </div>

      {/* Main Input Area */}
      <div className="relative z-10 w-full max-w-xl mb-10">
        <form onSubmit={handleSearch} className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${loading ? 'animate-pulse' : ''}`}></div>
          <div className="relative flex items-center bg-slate-900 rounded-lg p-1.5 ring-1 ring-slate-800 shadow-xl">
            <div className="pl-3 pr-2 text-slate-500 hidden sm:block">
              <Link2 size={20} />
            </div>
            <input 
              type="text" 
              placeholder={activePlatform.placeholder}
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base py-3 px-2 outline-none w-full min-w-0"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`
                ml-1 px-4 sm:px-6 py-3 rounded-md font-semibold text-white flex items-center justify-center gap-2 transition-all shrink-0
                ${loading 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95'}
              `}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Search size={20} className="sm:hidden" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError('')} />}

      {/* Result Card */}
      {data && (
        <div className="relative z-10 w-full px-0 sm:px-2">
            <MediaCard data={data} />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-16 pb-6 text-slate-600 text-xs sm:text-sm text-center">
        <p>© {new Date().getFullYear()} TikSaver. Optimized for Mobile & PC.</p>
      </footer>
    </div>
  );
};

export default App;