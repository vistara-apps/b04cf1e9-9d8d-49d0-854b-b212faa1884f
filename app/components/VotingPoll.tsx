'use client';

import { Vote, Clock, Users } from 'lucide-react';
import { Initiative } from '@/lib/types';
import { formatTimeRemaining, calculateVotePercentage } from '@/lib/utils';

interface VotingPollProps {
  initiative: Initiative;
  variant?: 'open' | 'closed';
  onVote?: (initiativeId: string, optionId: string) => void;
}

export function VotingPoll({ initiative, variant = 'open', onVote }: VotingPollProps) {
  const totalVotes = initiative.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="voting-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-fg mb-1">{initiative.name}</h3>
          <p className="text-muted text-sm">{initiative.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-surface ${
          variant === 'open' ? 'text-green-400' : 'text-gray-400'
        }`}>
          {variant === 'open' ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {initiative.options.map((option) => {
          const percentage = calculateVotePercentage(option.votes, totalVotes);
          
          return (
            <div key={option.id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-fg">{option.text}</span>
                <span className="text-xs text-muted">{percentage}%</span>
              </div>
              
              <div className="relative h-2 bg-surface rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-accent transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted">{option.votes} votes</span>
                {variant === 'open' && onVote && (
                  <button
                    onClick={() => onVote(initiative.initiativeId, option.id)}
                    className="text-xs text-accent hover:text-opacity-80 transition-colors"
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-muted" />
            <span className="text-sm text-muted">{totalVotes} votes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-muted" />
            <span className="text-sm text-muted">
              {variant === 'open' ? 'Ends in' : 'Ended'} {formatTimeRemaining(initiative.votingDeadline)}
            </span>
          </div>
        </div>
        
        <Vote className="w-4 h-4 text-accent" />
      </div>
    </div>
  );
}
