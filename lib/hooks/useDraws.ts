'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Draw } from '@/lib/types';
import { useDrawContract, useWallet } from '@/lib/blockchain/hooks';
import { MOCK_DRAWS } from '@/lib/constants';
import { getDrawStatus } from '@/lib/blockchain/utils';

// Mock data for development - replace with real contract calls
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export function useDraws() {
  const { address, isConnected } = useWallet();
  const { getDraw, getParticipants, enterDraw, claimPrize, isWritePending, isConfirming, isConfirmed } = useDrawContract();
  const queryClient = useQueryClient();

  // Fetch all draws
  const {
    data: draws = [],
    isLoading,
    error,
    refetch: refetchDraws,
  } = useQuery({
    queryKey: ['draws'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return MOCK_DRAWS.map(draw => ({
          ...draw,
          status: getDrawStatus(draw.entryDeadline, draw.drawTimestamp),
        }));
      }

      // TODO: Implement fetching all draws from contract
      // This would require an indexer or events listener
      // For now, return mock data
      return MOCK_DRAWS.map(draw => ({
        ...draw,
        status: getDrawStatus(draw.entryDeadline, draw.drawTimestamp),
      }));
    },
    staleTime: 30000, // 30 seconds
  });

  // Fetch single draw details
  const useDraw = (drawId: number) => {
    return useQuery({
      queryKey: ['draw', drawId],
      queryFn: async () => {
        if (USE_MOCK_DATA) {
          const mockDraw = MOCK_DRAWS.find(d => d.drawId === drawId.toString());
          if (!mockDraw) throw new Error('Draw not found');
          return {
            ...mockDraw,
            status: getDrawStatus(mockDraw.entryDeadline, mockDraw.drawTimestamp),
          };
        }

        const drawData = await getDraw(drawId);
        if (!drawData) throw new Error('Draw not found');

        // Convert contract data to our Draw type
        const draw: Draw = {
          drawId: drawData.drawId.toString(),
          name: drawData.name,
          description: drawData.description,
          prizePool: drawData.prizePool.toString(),
          entryFee: drawData.entryFee.toString(),
          entryDeadline: Number(drawData.entryDeadline),
          drawTimestamp: Number(drawData.drawTimestamp),
          status: ['upcoming', 'active', 'completed', 'cancelled'][Number(drawData.status)] as any,
          winnerId: drawData.winnerId || undefined,
          participantCount: Number(drawData.participantCount),
        };

        return draw;
      },
      enabled: !!drawId,
      staleTime: 10000, // 10 seconds
    });
  };

  // Fetch participants for a draw
  const useParticipants = (drawId: number) => {
    return useQuery({
      queryKey: ['participants', drawId],
      queryFn: async () => {
        if (USE_MOCK_DATA) {
          // Return mock participant addresses
          return Array.from({ length: MOCK_DRAWS.find(d => d.drawId === drawId.toString())?.participantCount || 0 }, (_, i) =>
            `0x${(i + 1).toString().padStart(40, '0')}` as `0x${string}`
          );
        }

        const participants = await getParticipants(drawId);
        return participants || [];
      },
      enabled: !!drawId,
      staleTime: 30000, // 30 seconds
    });
  };

  // Enter draw mutation
  const enterDrawMutation = useMutation({
    mutationFn: async ({ drawId, entryFee }: { drawId: number; entryFee: string }) => {
      if (!isConnected) throw new Error('Wallet not connected');
      return await enterDraw(drawId, entryFee);
    },
    onSuccess: () => {
      // Invalidate and refetch draws
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['draw'] });
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });

  // Claim prize mutation
  const claimPrizeMutation = useMutation({
    mutationFn: async (drawId: number) => {
      if (!isConnected) throw new Error('Wallet not connected');
      return await claimPrize(drawId);
    },
    onSuccess: () => {
      // Invalidate and refetch draws
      queryClient.invalidateQueries({ queryKey: ['draws'] });
      queryClient.invalidateQueries({ queryKey: ['draw'] });
    },
  });

  // Helper functions
  const getActiveDraws = useCallback(() => {
    return draws.filter(draw => draw.status === 'active');
  }, [draws]);

  const getUpcomingDraws = useCallback(() => {
    return draws.filter(draw => draw.status === 'upcoming');
  }, [draws]);

  const getCompletedDraws = useCallback(() => {
    return draws.filter(draw => draw.status === 'completed');
  }, [draws]);

  const getUserParticipatingDraws = useCallback(() => {
    if (!address) return [];
    // TODO: Implement user participation tracking
    // For now, return a subset of active draws
    return draws.filter(draw => draw.status === 'active').slice(0, 2);
  }, [draws, address]);

  return {
    // Data
    draws,
    isLoading,
    error,

    // Hooks
    useDraw,
    useParticipants,

    // Computed data
    activeDraws: getActiveDraws(),
    upcomingDraws: getUpcomingDraws(),
    completedDraws: getCompletedDraws(),
    userDraws: getUserParticipatingDraws(),

    // Actions
    enterDraw: enterDrawMutation.mutate,
    claimPrize: claimPrizeMutation.mutate,

    // Status
    isEnteringDraw: enterDrawMutation.isPending,
    isClaimingPrize: claimPrizeMutation.isPending,
    enterDrawError: enterDrawMutation.error,
    claimPrizeError: claimPrizeMutation.error,

    // Transaction status
    isWritePending,
    isConfirming,
    isConfirmed,

    // Utils
    refetchDraws,
  };
}
