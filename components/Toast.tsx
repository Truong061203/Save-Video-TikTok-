import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-red-900/90 text-red-100 px-4 py-3 rounded-lg shadow-lg border border-red-700/50 flex items-center gap-3 backdrop-blur-sm max-w-sm">
        <AlertCircle size={20} className="text-red-400 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto p-1 hover:bg-red-800/50 rounded-full transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;