'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Initiative, VotingOption } from '@/lib/types';
import { useVotingContract, useWallet } from '@/lib/blockchain/hooks';
import { MOCK_INITIATIVES } from '@/lib/constants';

// Mock data for development - replace with real contract calls
const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export function useVoting() {
  const { address, isConnected } = useWallet();
  const { getInitiative, getVotingResults, checkHasVoted, castVote, createInitiative, isWritePending, isConfirming, isConfirmed } = useVotingContract();
  const queryClient = useQueryClient();

  // Fetch all initiatives
  const {
    data: initiatives = [],
    isLoading,
    error,
    refetch: refetchInitiatives,
  } = useQuery({
    queryKey: ['initiatives'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return MOCK_INITIATIVES;
      }

      // TODO: Implement fetching all initiatives from contract
      // This would require an indexer or events listener
      // For now, return mock data
      return MOCK_INITIATIVES;
    },
    staleTime: 30000, // 30 seconds
  });

  // Fetch single initiative details
  const useInitiative = (initiativeId: number) => {
    return useQuery({
      queryKey: ['initiative', initiativeId],
      queryFn: async () => {
        if (USE_MOCK_DATA) {
          const mockInitiative = MOCK_INITIATIVES.find(i => i.initiativeId === initiativeId.toString());
          if (!mockInitiative) throw new Error('Initiative not found');
          return mockInitiative;
        }

        const initiativeData = await getInitiative(initiativeId);
        if (!initiativeData) throw new Error('Initiative not found');

        // Convert contract data to our Initiative type
        const initiative: Initiative = {
          initiativeId: (initiativeData as any)[0].toString(),
          name: (initiativeData as any)[1],
          description: (initiativeData as any)[2],
          votingDeadline: Number((initiativeData as any)[3]),
          status: ['upcoming', 'active', 'completed', 'cancelled'][Number((initiativeData as any)[4])] as any,
          voteCount: Number((initiativeData as any)[5]),
          options: [], // Will be fetched separately
        };

        // Fetch voting options
        const options = await getVotingResults(initiativeId);
        if (options) {
          initiative.options = options.map((opt: any) => ({
            id: opt.id.toString(),
            text: opt.text,
            votes: Number(opt.votes),
          }));
        }

        return initiative;
      },
      enabled: !!initiativeId,
      staleTime: 10000, // 10 seconds
    });
  };

  // Check if user has voted on initiative
  const useHasVoted = (initiativeId: number) => {
    return useQuery({
      queryKey: ['hasVoted', initiativeId, address],
      queryFn: async () => {
        if (!address) return false;

        if (USE_MOCK_DATA) {
          // Mock: user hasn't voted on first initiative
          return initiativeId === 1 ? false : true;
        }

        const hasVoted = await checkHasVoted(initiativeId, address);
        return hasVoted || false;
      },
      enabled: !!initiativeId && !!address,
      staleTime: 30000, // 30 seconds
    });
  };

  // Cast vote mutation
  const castVoteMutation = useMutation({
    mutationFn: async ({ initiativeId, optionId }: { initiativeId: number; optionId: number }) => {
      if (!isConnected) throw new Error('Wallet not connected');
      return await castVote(initiativeId, optionId);
    },
    onSuccess: () => {
      // Invalidate and refetch initiatives and voting data
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
      queryClient.invalidateQueries({ queryKey: ['initiative'] });
      queryClient.invalidateQueries({ queryKey: ['hasVoted'] });
      queryClient.invalidateQueries({ queryKey: ['votingResults'] });
    },
  });

  // Create initiative mutation
  const createInitiativeMutation = useMutation({
    mutationFn: async ({
      name,
      description,
      deadline,
      options
    }: {
      name: string;
      description: string;
      deadline: number;
      options: string[];
    }) => {
      if (!isConnected) throw new Error('Wallet not connected');
      return await createInitiative(name, description, deadline, options);
    },
    onSuccess: () => {
      // Invalidate and refetch initiatives
      queryClient.invalidateQueries({ queryKey: ['initiatives'] });
    },
  });

  // Helper functions
  const getActiveInitiatives = useCallback(() => {
    return initiatives.filter(initiative => initiative.status === 'active');
  }, [initiatives]);

  const getUpcomingInitiatives = useCallback(() => {
    return initiatives.filter((initiative: Initiative) => initiative.status === 'upcoming');
  }, [initiatives]);

  const getCompletedInitiatives = useCallback(() => {
    return initiatives.filter((initiative: Initiative) => initiative.status === 'completed');
  }, [initiatives]);

  const getUserCreatedInitiatives = useCallback(() => {
    if (!address) return [];
    // TODO: Implement user initiative tracking
    // For now, return a subset of initiatives
    return initiatives.slice(0, 1);
  }, [initiatives, address]);

  const fetchVotingResults = useCallback(async (initiativeId: number) => {
    if (USE_MOCK_DATA) {
      const initiative = MOCK_INITIATIVES.find(i => i.initiativeId === initiativeId.toString());
      return initiative?.options || [];
    }

    // Fetch from contract
    const results = await getVotingResults(initiativeId);
    return results || [];
  }, [getVotingResults]);

  return {
    // Data
    initiatives,
    isLoading,
    error,

    // Hooks
    useInitiative,
    useHasVoted,

    // Computed data
    activeInitiatives: getActiveInitiatives(),
    upcomingInitiatives: getUpcomingInitiatives(),
    completedInitiatives: getCompletedInitiatives(),
    userInitiatives: getUserCreatedInitiatives(),

    // Actions
    castVote: castVoteMutation.mutate,
    createInitiative: createInitiativeMutation.mutate,

    // Status
    isCastingVote: castVoteMutation.isPending,
    isCreatingInitiative: createInitiativeMutation.isPending,
    castVoteError: castVoteMutation.error,
    createInitiativeError: createInitiativeMutation.error,

    // Transaction status
    isWritePending,
    isConfirming,
    isConfirmed,

    // Utils
    refetchInitiatives,
    getVotingResults: fetchVotingResults,
  };
}
