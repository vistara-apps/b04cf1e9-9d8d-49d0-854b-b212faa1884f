'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TransactionButtonProps {
  variant: 'enterDraw' | 'vote' | 'claimReward';
  onClick: () => Promise<void>;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TransactionButton({ 
  variant, 
  onClick, 
  disabled = false, 
  children, 
  className = '' 
}: TransactionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'enterDraw':
        return 'btn-primary';
      case 'vote':
        return 'btn-secondary';
      case 'claimReward':
        return 'bg-green-600 text-white hover:bg-green-700';
      default:
        return 'btn-primary';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${getVariantStyles()} ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      } flex items-center justify-center space-x-2`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}
