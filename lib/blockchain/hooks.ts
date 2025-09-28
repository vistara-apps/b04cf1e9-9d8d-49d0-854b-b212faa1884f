'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { DRAW_CONTRACT_ABI, TOKEN_CONTRACT_ABI, VOTING_CONTRACT_ABI } from './abis';
import { getContractAddresses } from './index';
import { Draw, Initiative, VotingOption } from '@/lib/types';

// Hook for draw contract interactions
export function useDrawContract() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { address } = useAccount();

  // Read functions
  const { data: drawData, refetch: refetchDraw } = useReadContract({
    address: addresses.drawContract as `0x${string}`,
    abi: DRAW_CONTRACT_ABI,
    functionName: 'getDraw',
    args: [BigInt(0)], // Will be set when called
    query: {
      enabled: false, // Only run when explicitly called
    },
  });

  const { data: participants, refetch: refetchParticipants } = useReadContract({
    address: addresses.drawContract as `0x${string}`,
    abi: DRAW_CONTRACT_ABI,
    functionName: 'getParticipants',
    args: [BigInt(0)], // Will be set when called
    query: {
      enabled: false, // Only run when explicitly called
    },
  });

  // Write functions
  const { writeContract: writeDrawContract, data: writeData, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Helper functions
  const getDraw = async (drawId: number) => {
    const result = await refetchDraw();
    return result.data as Draw | undefined;
  };

  const getParticipants = async (drawId: number) => {
    const result = await refetchParticipants();
    return result.data as `0x${string}`[] | undefined;
  };

  const enterDraw = async (drawId: number, entryFee: string) => {
    if (!address) throw new Error('Wallet not connected');

    return writeDrawContract({
      address: addresses.drawContract as `0x${string}`,
      abi: DRAW_CONTRACT_ABI,
      functionName: 'enterDraw',
      args: [BigInt(drawId)],
      value: BigInt(entryFee),
    });
  };

  const claimPrize = async (drawId: number) => {
    if (!address) throw new Error('Wallet not connected');

    return writeDrawContract({
      address: addresses.drawContract as `0x${string}`,
      abi: DRAW_CONTRACT_ABI,
      functionName: 'claimPrize',
      args: [BigInt(drawId)],
    });
  };

  return {
    // Read functions
    getDraw,
    getParticipants,

    // Write functions
    enterDraw,
    claimPrize,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    writeData,
  };
}

// Hook for token contract interactions
export function useTokenContract() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { address } = useAccount();

  // Read functions
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: addresses.tokenContract as `0x${string}`,
    abi: TOKEN_CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: formattedBalance, refetch: refetchFormattedBalance } = useReadContract({
    address: addresses.tokenContract as `0x${string}`,
    abi: TOKEN_CONTRACT_ABI,
    functionName: 'getFormattedBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: totalEarned, refetch: refetchTotalEarned } = useReadContract({
    address: addresses.tokenContract as `0x${string}`,
    abi: TOKEN_CONTRACT_ABI,
    functionName: 'getTotalEarned',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write functions
  const { writeContract: writeTokenContract, data: writeData, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Helper functions
  const transfer = async (to: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    return writeTokenContract({
      address: addresses.tokenContract as `0x${string}`,
      abi: TOKEN_CONTRACT_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, BigInt(amount)],
    });
  };

  const approve = async (spender: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    return writeTokenContract({
      address: addresses.tokenContract as `0x${string}`,
      abi: TOKEN_CONTRACT_ABI,
      functionName: 'approve',
      args: [spender as `0x${string}`, BigInt(amount)],
    });
  };

  return {
    // Read functions
    balance: balance as bigint | undefined,
    formattedBalance: formattedBalance as string | undefined,
    totalEarned: totalEarned as bigint | undefined,
    refetchBalance,
    refetchFormattedBalance,
    refetchTotalEarned,

    // Write functions
    transfer,
    approve,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    writeData,
  };
}

// Hook for voting contract interactions
export function useVotingContract() {
  const chainId = useChainId();
  const addresses = getContractAddresses(chainId);
  const { address } = useAccount();

  // Read functions
  const { data: initiativeData, refetch: refetchInitiative } = useReadContract({
    address: addresses.votingContract as `0x${string}`,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'initiatives',
    args: [BigInt(0)], // Will be set when called
    query: {
      enabled: false, // Only run when explicitly called
    },
  });

  const { data: votingResults, refetch: refetchResults } = useReadContract({
    address: addresses.votingContract as `0x${string}`,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'getVotingResults',
    args: [BigInt(0)], // Will be set when called
    query: {
      enabled: false, // Only run when explicitly called
    },
  });

  const { data: hasVoted, refetch: refetchHasVoted } = useReadContract({
    address: addresses.votingContract as `0x${string}`,
    abi: VOTING_CONTRACT_ABI,
    functionName: 'hasUserVoted',
    args: [BigInt(0), '0x0000000000000000000000000000000000000000' as `0x${string}`], // Will be set when called
    query: {
      enabled: false, // Only run when explicitly called
    },
  });

  // Write functions
  const { writeContract: writeVotingContract, data: writeData, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Helper functions
  const getInitiative = async (initiativeId: number) => {
    const result = await refetchInitiative();
    return result.data as Initiative | undefined;
  };

  const getVotingResults = async (initiativeId: number) => {
    const result = await refetchResults();
    return result.data as VotingOption[] | undefined;
  };

  const checkHasVoted = async (initiativeId: number, userAddress: string) => {
    const result = await refetchHasVoted();
    return result.data as boolean | undefined;
  };

  const castVote = async (initiativeId: number, optionId: number) => {
    if (!address) throw new Error('Wallet not connected');

    return writeVotingContract({
      address: addresses.votingContract as `0x${string}`,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'castVote',
      args: [BigInt(initiativeId), BigInt(optionId)],
    });
  };

  const createInitiative = async (
    name: string,
    description: string,
    deadline: number,
    options: string[]
  ) => {
    if (!address) throw new Error('Wallet not connected');

    return writeVotingContract({
      address: addresses.votingContract as `0x${string}`,
      abi: VOTING_CONTRACT_ABI,
      functionName: 'createInitiative',
      args: [name, description, BigInt(deadline), options],
    });
  };

  return {
    // Read functions
    getInitiative,
    getVotingResults,
    checkHasVoted,

    // Write functions
    castVote,
    createInitiative,

    // Transaction state
    isWritePending,
    isConfirming,
    isConfirmed,
    writeData,
  };
}

// Hook for wallet connection and account management
export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
  };
}
