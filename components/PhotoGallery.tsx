import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Maximize2, 
  Calendar, 
  Image as ImageIcon, 
  X,
  Clock
} from 'lucide-react';

interface Photo {
  id: string;
  imageUrl: string;
  type: 'pixel' | 'photo' | 'gif';
  createdAt: any;
}

interface PhotoGalleryProps {
  userId: string;
  onBack: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ userId, onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [userId]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'photos'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const photoData: Photo[] = [];
      querySnapshot.forEach((doc) => {
        photoData.push({ id: doc.id, ...doc.data() } as Photo);
      });
      setPhotos(photoData);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full font-['Kanit'] bg-gray-50 -m-6">
      {/* Header */}
      <div className="bg-white p-6 border-b-2 border-gray-100 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">📸 รูปภาพที่เก็บไว้</h1>
          <p className="text-xs text-gray-400">ความทรงจำทั้งหมดจากภารกิจ</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-gray-400">กำลังโหลดรูปภาพ...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
            <ImageIcon size={64} className="opacity-20" />
            <p className="text-sm font-bold">ยังไม่มีรูปภาพที่เก็บไว้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {photos.map((photo) => (
              <motion.div 
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 group"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={photo.imageUrl} 
                    alt="Memory" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setSelectedPhoto(photo)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md text-gray-700 hover:bg-white transition-colors"
                    >
                      <Maximize2 size={18} />
                    </button>
                    <a 
                      href={photo.imageUrl} 
                      download 
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md text-gray-700 hover:bg-white transition-colors"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                      photo.type === 'pixel' ? 'bg-blue-500' : 
                      photo.type === 'photo' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}>
                      {photo.type}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold">{formatDate(photo.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold">SAVED</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            <div className="p-6 flex justify-end">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <img 
                src={selectedPhoto.imageUrl} 
                alt="Full Preview" 
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
            <div className="p-8 text-center text-white space-y-2">
              <p className="text-sm font-bold">{formatDate(selectedPhoto.createdAt)}</p>
              <p className="text-xs opacity-60 uppercase tracking-widest">{selectedPhoto.type} MEMORY</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
