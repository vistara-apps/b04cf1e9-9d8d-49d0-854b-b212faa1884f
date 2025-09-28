'use client';

import { useState } from 'react';
import { useTokenContract } from '@/lib/blockchain/hooks';
import { TransactionButton } from './TransactionButton';
import { Gift, CheckCircle } from 'lucide-react';

interface RewardClaimProps {
  className?: string;
}

export function RewardClaim({ className = '' }: RewardClaimProps) {
  const [claimType, setClaimType] = useState<'draw_win' | 'voting' | null>(null);
  const { balance, isWritePending, isConfirming, isConfirmed } = useTokenContract();

  // Mock available rewards - in real app, this would come from contract
  const availableRewards = {
    draw_win: { amount: '100', description: 'Draw Win Reward' },
    voting: { amount: '5', description: 'Voting Reward' },
  };

  const handleClaim = async (type: 'draw_win' | 'voting') => {
    setClaimType(type);
    // TODO: Implement actual claiming logic
    // This would call the appropriate contract function
    console.log(`Claiming ${type} reward`);
  };

  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-lg flex items-center justify-center">
          <Gift className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-fg">Claim Rewards</h3>
          <p className="text-sm text-muted">Collect your earned tokens</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Draw Win Reward */}
        <div className="flex items-center justify-between p-4 bg-surface bg-opacity-50 rounded-lg">
          <div>
            <p className="text-fg font-medium">{availableRewards.draw_win.description}</p>
            <p className="text-sm text-muted">Win a draw to claim this reward</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-fg font-bold">+{availableRewards.draw_win.amount} VERI</span>
            <TransactionButton
              variant="claimReward"
              onClick={() => handleClaim('draw_win')}
              disabled={isWritePending}
            >
              {isWritePending && claimType === 'draw_win' ? 'Claiming...' : 'Claim'}
            </TransactionButton>
          </div>
        </div>

        {/* Voting Reward */}
        <div className="flex items-center justify-between p-4 bg-surface bg-opacity-50 rounded-lg">
          <div>
            <p className="text-fg font-medium">{availableRewards.voting.description}</p>
            <p className="text-sm text-muted">Participate in community voting</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-fg font-bold">+{availableRewards.voting.amount} VERI</span>
            <TransactionButton
              variant="claimReward"
              onClick={() => handleClaim('voting')}
              disabled={isWritePending}
            >
              {isWritePending && claimType === 'voting' ? 'Claiming...' : 'Claim'}
            </TransactionButton>
          </div>
        </div>
      </div>

      {/* Success message */}
      {isConfirmed && claimType && (
        <div className="mt-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400">
              Successfully claimed {availableRewards[claimType].amount} VERI tokens!
            </p>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-fg mb-2">How to earn tokens:</h4>
        <ul className="text-sm text-muted space-y-1">
          <li>• Enter draws: +10 VERI per entry</li>
          <li>• Vote on initiatives: +5 VERI per vote</li>
          <li>• Win draws: +100 VERI bonus</li>
          <li>• Create initiatives: +25 VERI</li>
        </ul>
      </div>
    </div>
  );
}
