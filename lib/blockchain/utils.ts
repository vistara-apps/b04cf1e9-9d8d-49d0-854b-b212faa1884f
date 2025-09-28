import { formatEther, formatUnits, parseEther } from 'viem';

// Format ETH amounts for display
export function formatEthAmount(wei: bigint): string {
  return formatEther(wei);
}

// Format token amounts for display
export function formatTokenAmount(wei: bigint, decimals: number = 18): string {
  return formatUnits(wei, decimals);
}

// Parse ETH amount to wei
export function parseEthAmount(eth: string): bigint {
  return parseEther(eth);
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format large numbers with K/M/B suffixes
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Generate random seed for draw execution
export function generateRandomSeed(): `0x${string}` {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return `0x${Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
}

// Validate Ethereum address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Calculate time remaining in human readable format
export function getTimeRemaining(targetTimestamp: number): string {
  const now = Date.now() / 1000; // Convert to seconds
  const diff = targetTimestamp - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (24 * 60 * 60));
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// Check if timestamp is in the past
export function isExpired(timestamp: number): boolean {
  return timestamp < (Date.now() / 1000);
}

// Calculate draw status based on timestamps
export function getDrawStatus(
  entryDeadline: number,
  drawTimestamp: number,
  winner?: string
): 'upcoming' | 'active' | 'completed' | 'cancelled' {
  const now = Date.now() / 1000;

  if (winner) return 'completed';
  if (now > drawTimestamp) return 'completed';
  if (now <= entryDeadline) return 'active';
  return 'upcoming';
}

// Validate draw parameters
export function validateDrawParams(
  name: string,
  prizePool: string,
  entryFee: string,
  entryDeadline: number,
  drawTimestamp: number
): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Draw name is required' };
  }

  if (parseFloat(prizePool) <= 0) {
    return { isValid: false, error: 'Prize pool must be greater than 0' };
  }

  if (parseFloat(entryFee) <= 0) {
    return { isValid: false, error: 'Entry fee must be greater than 0' };
  }

  const now = Date.now() / 1000;
  if (entryDeadline <= now) {
    return { isValid: false, error: 'Entry deadline must be in the future' };
  }

  if (drawTimestamp <= entryDeadline) {
    return { isValid: false, error: 'Draw timestamp must be after entry deadline' };
  }

  return { isValid: true };
}

// Validate voting initiative parameters
export function validateInitiativeParams(
  name: string,
  description: string,
  deadline: number,
  options: string[]
): { isValid: boolean; error?: string } {
  if (!name.trim()) {
    return { isValid: false, error: 'Initiative name is required' };
  }

  if (!description.trim()) {
    return { isValid: false, error: 'Initiative description is required' };
  }

  if (options.length < 2) {
    return { isValid: false, error: 'At least 2 voting options are required' };
  }

  if (options.length > 10) {
    return { isValid: false, error: 'Maximum 10 voting options allowed' };
  }

  const now = Date.now() / 1000;
  if (deadline <= now + 3600) { // At least 1 hour from now
    return { isValid: false, error: 'Voting deadline must be at least 1 hour from now' };
  }

  // Check for duplicate options
  const uniqueOptions = new Set(options.map(opt => opt.trim().toLowerCase()));
  if (uniqueOptions.size !== options.length) {
    return { isValid: false, error: 'Voting options must be unique' };
  }

  return { isValid: true };
}

// Estimate gas cost for transactions
export function estimateGasCost(gasLimit: bigint, gasPrice: bigint): string {
  const cost = gasLimit * gasPrice;
  return formatEther(cost);
}

// Convert basis points to percentage
export function basisPointsToPercent(basisPoints: number): number {
  return basisPoints / 100;
}

// Convert percentage to basis points
export function percentToBasisPoints(percent: number): number {
  return Math.round(percent * 100);
}

// Sleep utility for delays
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry utility for blockchain calls
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        await sleep(delay * attempt); // Exponential backoff
      }
    }
  }

  throw lastError!;
}

