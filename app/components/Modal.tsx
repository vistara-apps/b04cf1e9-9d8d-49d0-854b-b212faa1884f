'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'confirmation';
}

export function Modal({ isOpen, onClose, title, children, variant = 'default' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative bg-surface border border-border rounded-xl p-6 max-w-md w-full mx-4 ${
        variant === 'confirmation' ? 'shadow-modal' : 'shadow-card'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-fg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-border transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}
