'use client';

import { useState, useEffect } from 'react';
import { AppFrame } from './components/AppFrame';
import { DrawCard } from './components/DrawCard';
import { VotingPoll } from './components/VotingPoll';
import { StatsCard } from './components/StatsCard';
import { TransactionButton } from './components/TransactionButton';
import { Modal } from './components/Modal';
import { Trophy, Users, Vote, TrendingUp, Coins, Activity } from 'lucide-react';
import { MOCK_DRAWS, MOCK_INITIATIVES } from '@/lib/constants';
import { Draw, Initiative } from '@/lib/types';

export default function HomePage() {
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);

  const handleEnterDraw = (drawId: string) => {
    const draw = MOCK_DRAWS.find(d => d.drawId === drawId);
    if (draw) {
      setSelectedDraw(draw);
      setShowDrawModal(true);
    }
  };

  const handleVote = (initiativeId: string, optionId: string) => {
    const initiative = MOCK_INITIATIVES.find(i => i.initiativeId === initiativeId);
    if (initiative) {
      setSelectedInitiative(initiative);
      setShowVoteModal(true);
    }
  };

  const confirmDrawEntry = async () => {
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowDrawModal(false);
    setSelectedDraw(null);
  };

  const confirmVote = async () => {
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowVoteModal(false);
    setSelectedInitiative(null);
  };

  return (
    <AppFrame>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-fg mb-4">
          Blockchain-verified Fair Draw
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Fair Draw platform with transparent, provably fair draws and community governance on Base
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Active Draws */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-fg">Active Draws</h2>
            <button className="btn-secondary text-sm">View All</button>
          </div>
          
          <div className="space-y-6">
            {MOCK_DRAWS.filter(draw => draw.status === 'active').map((draw) => (
              <DrawCard
                key={draw.drawId}
                draw={draw}
                variant="active"
                onEnter={handleEnterDraw}
              />
            ))}
          </div>

          {/* Upcoming Draws */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-fg mb-6">Upcoming Draws</h3>
            <div className="space-y-4">
              {MOCK_DRAWS.filter(draw => draw.status === 'upcoming').map((draw) => (
                <DrawCard
                  key={draw.drawId}
                  draw={draw}
                  variant="upcoming"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Voting & Stats */}
        <div className="space-y-8">
          {/* Community Voting */}
          <div>
            <h3 className="text-xl font-semibold text-fg mb-6">Community Voting</h3>
            <div className="space-y-6">
              {MOCK_INITIATIVES.map((initiative) => (
                <VotingPoll
                  key={initiative.initiativeId}
                  initiative={initiative}
                  variant="open"
                  onVote={handleVote}
                />
              ))}
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="glass-card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-fg">Real Time Votes</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Latest Entry</span>
                <span className="text-fg">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Last Vote</span>
                <span className="text-fg">5 minutes ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Draw Winner</span>
                <span className="text-fg">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Draw Entry Modal */}
      <Modal
        isOpen={showDrawModal}
        onClose={() => setShowDrawModal(false)}
        title="Enter Draw"
        variant="confirmation"
      >
        {selectedDraw && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-fg mb-2">{selectedDraw.name}</h3>
              <p className="text-muted text-sm">{selectedDraw.description}</p>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted">Entry Fee:</span>
                <span className="text-fg font-medium">{selectedDraw.entryFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Prize Pool:</span>
                <span className="text-fg font-medium">{selectedDraw.prizePool}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDrawModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <TransactionButton
                variant="enterDraw"
                onClick={confirmDrawEntry}
                className="flex-1"
              >
                Confirm Entry
              </TransactionButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Vote Modal */}
      <Modal
        isOpen={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        title="Cast Vote"
        variant="confirmation"
      >
        {selectedInitiative && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-fg mb-2">{selectedInitiative.name}</h3>
              <p className="text-muted text-sm">{selectedInitiative.description}</p>
            </div>
            
            <div className="bg-surface p-4 rounded-lg">
              <p className="text-muted text-sm mb-2">You are voting on:</p>
              <p className="text-fg font-medium">Platform governance decision</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowVoteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <TransactionButton
                variant="vote"
                onClick={confirmVote}
                className="flex-1"
              >
                Cast Vote
              </TransactionButton>
            </div>
          </div>
        )}
      </Modal>
    </AppFrame>
  );
}
