'use client';

import { useTheme } from '../components/ThemeProvider';
import { AppFrame } from '../components/AppFrame';
import { DrawCard } from '../components/DrawCard';
import { VotingPoll } from '../components/VotingPoll';
import { StatsCard } from '../components/StatsCard';
import { Trophy, Users, Vote, Coins } from 'lucide-react';
import { MOCK_DRAWS, MOCK_INITIATIVES } from '@/lib/constants';

const themes = [
  { id: 'default', name: 'Default (Warm Social)', description: 'Dark teal with coral accents' },
  { id: 'celo', name: 'Celo', description: 'Black with yellow accents' },
  { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
  { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
  { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue accents' },
] as const;

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  return (
    <AppFrame>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-fg mb-4">Theme Preview</h1>
          <p className="text-muted">Preview VeriDraw in different blockchain themes</p>
        </div>

        {/* Theme Selector */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-fg mb-4">Select Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-lg border transition-all ${
                  theme === t.id
                    ? 'border-accent bg-accent bg-opacity-20'
                    : 'border-border bg-surface hover:bg-opacity-80'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-medium text-fg">{t.name}</h3>
                  <p className="text-xs text-muted mt-1">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Draws"
            value="17%"
            subtitle="Available Entries"
            icon={Trophy}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="Community Votes"
            value="08%"
            subtitle="Quality and Vectors"
            icon={Vote}
            trend={{ value: "8%", isPositive: true }}
          />
          <StatsCard
            title="Total Participants"
            value="1,247"
            subtitle="Active Users"
            icon={Users}
            trend={{ value: "23%", isPositive: true }}
          />
          <StatsCard
            title="Token Rewards"
            value="12.6%"
            subtitle="Community Governance"
            icon={Coins}
            trend={{ value: "5%", isPositive: true }}
          />
        </div>

        {/* Component Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-fg mb-4">Draw Card Preview</h3>
            <DrawCard
              draw={MOCK_DRAWS[0]}
              variant="active"
              onEnter={() => {}}
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-fg mb-4">Voting Poll Preview</h3>
            <VotingPoll
              initiative={MOCK_INITIATIVES[0]}
              variant="open"
              onVote={() => {}}
            />
          </div>
        </div>

        {/* Button Previews */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-fg mb-4">Button Styles</h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200">
              Success Button
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-all duration-200">
              Danger Button
            </button>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
