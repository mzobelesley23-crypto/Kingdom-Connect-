import React, { useState } from 'react';
import { Image as ImageIcon, Calendar, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { GalleryAlbum } from '../../types';

interface GalleryViewProps {
  onOpenShareModal: (reference: string, text: string, version: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onOpenShareModal }) => {
  const [albums] = useState<GalleryAlbum[]>(() => StorageService.getGalleryAlbums());
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(albums[0] || null);

  // Lightbox state
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const currentImages = selectedAlbum ? selectedAlbum.images : [];

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const handlePrevImage = () => {
    if (activeImageIndex === null || currentImages.length === 0) return;
    setActiveImageIndex((activeImageIndex - 1 + currentImages.length) % currentImages.length);
  };

  const handleNextImage = () => {
    if (activeImageIndex === null || currentImages.length === 0) return;
    setActiveImageIndex((activeImageIndex + 1) % currentImages.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wider uppercase">
            <ImageIcon className="h-4 w-4" />
            <span>Kingdom Moments</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-slate-100">
            Gallery & Worship Moments
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
            Curated photographic chronicles of worship assemblies, baptismal celebrations, and community outreach.
          </p>
        </div>

        {/* Album Selector Tabs */}
        <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => {
                setSelectedAlbum(album);
                setActiveImageIndex(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-2 ${
                selectedAlbum?.id === album.id
                  ? 'bg-teal-500/15 border-teal-500 text-teal-300 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{album.title}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {album.images.length}
              </span>
            </button>
          ))}
        </div>

        {/* Album Description Banner */}
        {selectedAlbum && (
          <div className="mb-8 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Calendar className="h-3.5 w-3.5 text-teal-400" />
                <span>{selectedAlbum.date}</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-100">{selectedAlbum.title}</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
                {selectedAlbum.description}
              </p>
            </div>
            <button
              onClick={() =>
                onOpenShareModal(
                  selectedAlbum.title,
                  `Explore memories from ${selectedAlbum.title} at Kingdom Connect.`,
                  'Gallery'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2 text-xs font-medium self-start sm:self-auto shrink-0"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Album</span>
            </button>
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden cursor-pointer border border-slate-800/80 hover:border-teal-500/50 transition-all duration-300 shadow-md"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-200" />
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <p className="text-xs font-medium text-slate-200 leading-snug">{img.caption}</p>
                <span className="text-[10px] text-teal-400 font-semibold mt-1 inline-block">
                  Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && currentImages[activeImageIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveImageIndex(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top close button */}
            <div className="w-full flex items-center justify-between pb-3 text-slate-300">
              <span className="text-xs text-slate-400">
                {activeImageIndex + 1} / {currentImages.length}
              </span>
              <button
                onClick={() => setActiveImageIndex(null)}
                className="p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
                aria-label="Close image viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main image container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-2xl">
              <img
                src={currentImages[activeImageIndex].url}
                alt={currentImages[activeImageIndex].caption}
                className="max-h-full max-w-full object-contain select-none"
              />

              {/* Prev / Next controls */}
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors border border-slate-700"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors border border-slate-700"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Caption */}
            <div className="w-full pt-3 px-2 text-center sm:text-left">
              <p className="text-sm text-slate-200 font-medium">
                {currentImages[activeImageIndex].caption}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedAlbum?.title} • {selectedAlbum?.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
