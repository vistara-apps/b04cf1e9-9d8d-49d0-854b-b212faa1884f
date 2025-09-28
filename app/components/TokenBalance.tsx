'use client';

import { useTokenContract } from '@/lib/blockchain/hooks';
import { formatTokenAmount } from '@/lib/blockchain/utils';
import { Coins, TrendingUp } from 'lucide-react';

interface TokenBalanceProps {
  className?: string;
}

export function TokenBalance({ className = '' }: TokenBalanceProps) {
  const { balance, formattedBalance, totalEarned } = useTokenContract();



  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent bg-opacity-20 rounded-lg flex items-center justify-center">
            <Coins className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-fg">Token Balance</h3>
            <p className="text-sm text-muted">VeriDraw Tokens</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-fg">
            {formattedBalance || '0 VERI'}
          </p>
          {totalEarned && totalEarned > BigInt(0) && (
            <p className="text-xs text-accent flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Earned: {formatTokenAmount(totalEarned)} VERI
            </p>
          )}
        </div>
      </div>

      {/* Token rewards info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted">Draw Entry</p>
            <p className="text-fg font-medium">+10 VERI</p>
          </div>
          <div>
            <p className="text-muted">Voting</p>
            <p className="text-fg font-medium">+5 VERI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
