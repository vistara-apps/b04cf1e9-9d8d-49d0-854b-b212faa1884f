'use client';

import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';
import { useTheme } from './ThemeProvider';
import { TokenBalance } from './TokenBalance';
import { Palette, Trophy, Vote } from 'lucide-react';

interface AppFrameProps {
  children: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="glass-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">VeriDraw</h1>
                <p className="text-sm text-muted">Fair Draws, Voted by You</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <TokenBalance className="hidden md:block" />

              <button
                onClick={() => setTheme(theme === 'default' ? 'celo' : 'default')}
                className="p-2 rounded-lg bg-surface hover:bg-opacity-80 transition-colors"
                title="Switch Theme"
              >
                <Palette className="w-5 h-5 text-muted" />
              </button>

              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-2 bg-surface px-4 py-2 rounded-lg">
                    <Avatar className="w-6 h-6" />
                    <Name className="text-fg font-medium" />
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
