'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { formatAddress } from '@/lib/blockchain/utils';
import { SUPPORTED_CHAINS } from '@/lib/contracts';

export function useWallet() {
  const { address, isConnected, isConnecting, connector } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();

  // Get current chain info
  const currentChain = Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId);

  // Check if on supported network
  const isOnSupportedNetwork = useCallback(() => {
    return Object.values(SUPPORTED_CHAINS).some(chain => chain.id === chainId);
  }, [chainId]);

  // Switch to Base network
  const switchToBase = useCallback(() => {
    switchChain({ chainId: SUPPORTED_CHAINS.base.id });
  }, [switchChain]);

  // Switch to Base Sepolia (testnet)
  const switchToBaseTestnet = useCallback(() => {
    switchChain({ chainId: SUPPORTED_CHAINS.baseTestnet.id });
  }, [switchChain]);

  // Connect wallet
  const connectWallet = useCallback((connectorId?: string) => {
    const connector = connectors.find(c => c.id === connectorId) || connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Get wallet display info
  const walletInfo = {
    address: address || '',
    shortAddress: address ? formatAddress(address) : '',
    isConnected,
    isConnecting: isConnecting || isConnectPending,
    isSwitchingNetwork: isSwitchPending,
    connector: connector?.name || '',
    chainId,
    chainName: currentChain?.name || 'Unknown',
    isOnSupportedNetwork: isOnSupportedNetwork(),
  };

  // Available connectors
  const availableConnectors = connectors.map(connector => ({
    id: connector.id,
    name: connector.name,
    icon: connector.icon,
  }));

  return {
    // Wallet state
    ...walletInfo,

    // Actions
    connectWallet,
    disconnectWallet,
    switchToBase,
    switchToBaseTestnet,

    // Available options
    availableConnectors,

    // Chain info
    currentChain,
    supportedChains: Object.values(SUPPORTED_CHAINS),
  };
}

