'use client';

import { Clock, Users, Trophy } from 'lucide-react';
import { Draw } from '@/lib/types';
import { formatTimeRemaining } from '@/lib/utils';

interface DrawCardProps {
  draw: Draw;
  variant?: 'upcoming' | 'active' | 'completed';
  onEnter?: (drawId: string) => void;
}

export function DrawCard({ draw, variant = 'active', onEnter }: DrawCardProps) {
  const getStatusColor = () => {
    switch (variant) {
      case 'upcoming': return 'text-yellow-400';
      case 'active': return 'text-green-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-green-400';
    }
  };

  const getStatusText = () => {
    switch (variant) {
      case 'upcoming': return 'Upcoming';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return 'Active';
    }
  };

  return (
    <div className="draw-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-fg mb-1">{draw.name}</h3>
          <p className="text-muted text-sm">{draw.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-surface ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted">Prize Pool</p>
            <p className="text-sm font-medium text-fg">{draw.prizePool}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted">Participants</p>
            <p className="text-sm font-medium text-fg">{draw.participantCount}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">
            {variant === 'active' ? 'Ends in' : 'Draws in'} {formatTimeRemaining(draw.entryDeadline)}
          </span>
        </div>
        
        {variant === 'active' && onEnter && (
          <button
            onClick={() => onEnter(draw.drawId)}
            className="btn-primary text-sm px-4 py-2"
          >
            Enter Draw
          </button>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted">
          Entry Fee: <span className="text-fg font-medium">{draw.entryFee}</span>
        </p>
      </div>
    </div>
  );
}
