import React, { useState } from 'react';
import { VideoData, DownloadOption } from '../types';
import { Download, ExternalLink, Play, Loader2, Music, Video, ImageOff } from 'lucide-react';
import { handleDownload } from '../services/downloader';

interface MediaCardProps {
  data: VideoData;
}

const MediaCard: React.FC<MediaCardProps> = ({ data }) => {
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);

  const onDownloadClick = async (option: DownloadOption) => {
    if (downloadingUrl) return; 

    setDownloadingUrl(option.url);
    setStatusMsg('Processing...');

    const filename = `tiksaver_${data.id}_${option.type}.${option.ext}`;
    
    // On mobile, sometimes it's better to give visual feedback that the download started
    // even if the browser takes over.
    await handleDownload(option.url, filename, (msg) => setStatusMsg(msg));
    
    setStatusMsg('Saved!');
    setTimeout(() => {
      setDownloadingUrl(null);
      setStatusMsg('');
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* LEFT: Thumbnail Section */}
      <div className="md:w-5/12 relative group bg-black aspect-[9/16] md:aspect-auto h-96 md:h-auto overflow-hidden">
        {/* Fallback or Main Image */}
        {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-900">
                <ImageOff size={48} className="mb-2 opacity-50"/>
                <span className="text-xs">No Preview Available</span>
            </div>
        ) : (
            <>
                <div className="absolute inset-0 bg-cover bg-center blur-md opacity-40" style={{ backgroundImage: `url(${data.coverUrl})` }}></div>
                <img 
                  src={data.coverUrl} 
                  alt={data.title} 
                  className="absolute inset-0 w-full h-full object-contain z-10"
                  onError={() => setImgError(true)}
                />
            </>
        )}
        
        {/* Mobile Gradient Overlay for text readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent md:hidden"></div>
        
        {/* Mobile-only Author overlay */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-3 md:hidden">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/50 bg-slate-800">
                <img 
                    src={data.author.avatarUrl} 
                    alt={data.author.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + data.author.name }}
                />
             </div>
             <div className="text-left">
                <p className="font-bold text-white text-sm shadow-black drop-shadow-md leading-tight">@{data.author.name}</p>
                <p className="text-xs text-slate-300">Original Audio</p>
             </div>
        </div>
      </div>

      {/* RIGHT: Metadata & Actions */}
      <div className="md:w-7/12 p-4 md:p-8 flex flex-col bg-slate-900">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
                 <img 
                    src={data.author.avatarUrl} 
                    alt={data.author.name} 
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + data.author.name }}
                 />
                 <div>
                    <h3 className="text-white font-bold">@{data.author.name}</h3>
                    <p className="text-slate-400 text-xs">TikTok Video</p>
                 </div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-full text-cyan-400">
                <Play size={16} fill="currentColor" />
            </div>
        </div>

        {/* Title / Description */}
        <div className="mb-6">
             <h2 className="text-base md:text-lg text-slate-200 line-clamp-3 md:line-clamp-2 leading-relaxed">
                {data.title || 'No description available for this video.'}
             </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6 border-y border-slate-800 py-4">
            <StatItem label="Plays" value={data.stats.plays} />
            <StatItem label="Likes" value={data.stats.likes} />
            <StatItem label="Comms" value={data.stats.comments} />
            <StatItem label="Shares" value={data.stats.shares} />
        </div>

        {/* Download Actions */}
        <div className="mt-auto space-y-3">
            <div className="flex flex-col gap-3">
                {data.downloads.map((option, idx) => {
                    const isProcessing = downloadingUrl === option.url;
                    const isAudio = option.type.includes('audio');
                    
                    return (
                        <div key={idx} className="flex flex-col gap-1">
                            <button
                                onClick={() => onDownloadClick(option)}
                                disabled={!!downloadingUrl}
                                className={`
                                    relative w-full flex items-center justify-between px-4 py-3.5 rounded-lg font-medium transition-all active:scale-[0.98]
                                    ${isProcessing 
                                        ? 'bg-slate-800 text-slate-400 cursor-wait' 
                                        : isAudio 
                                            ? 'bg-slate-800 text-amber-500 hover:bg-slate-700' 
                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {isProcessing ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        isAudio ? <Music size={20} /> : <Download size={20} />
                                    )}
                                    <span>{isProcessing ? statusMsg : option.label}</span>
                                </div>
                                
                                {!isProcessing && (
                                    <div className="text-xs opacity-70 font-normal bg-black/10 px-2 py-0.5 rounded">
                                        {option.size || option.ext.toUpperCase()}
                                    </div>
                                )}
                            </button>
                            
                            {/* Mobile Fallback Link for Video */}
                            {!isAudio && !isProcessing && (
                                <div className="md:hidden text-center mt-1">
                                    <p className="text-[10px] text-slate-500">
                                        If download doesn't start, <a href={option.url} target="_blank" rel="noreferrer" className="text-cyan-500 underline decoration-dotted">click here</a> to open direct link.
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            
            {/* Desktop Direct Link Fallback */}
            <div className="hidden md:block text-center mt-2">
                 <a href={data.downloads[0]?.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
                    <ExternalLink size={12} />
                    <span>Open direct video link (server fallback)</span>
                 </a>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: number }) => (
    <div className="text-center">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm font-bold text-slate-200">
            {Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)}
        </div>
    </div>
);

export default MediaCard;