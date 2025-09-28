import { NextRequest, NextResponse } from 'next/server';
import { DRAW_CONTRACT_ABI } from '@/lib/blockchain/abis';
import { getContractAddresses } from '@/lib/blockchain';
import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'wagmi/chains';

// Create public client for reading from blockchain
const getPublicClient = (chainId: number = 84532) => { // Default to Base Sepolia testnet
  const chain = chainId === 8453 ? base : baseSepolia;
  return createPublicClient({
    chain,
    transport: http(),
  });
};

// GET /api/draws - Get all draws
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = parseInt(searchParams.get('chainId') || '84532');
    const status = searchParams.get('status'); // 'active', 'upcoming', 'completed'

    const publicClient = getPublicClient(chainId);
    const addresses = getContractAddresses(chainId);

    // TODO: Implement fetching all draws from contract
    // For now, return mock data structure
    const mockDraws = [
      {
        drawId: 1,
        name: 'Weekly ETH Prize',
        description: 'Win 0.1 ETH in our weekly community draw',
        prizePool: '0.1',
        entryFee: '0.001',
        entryDeadline: Math.floor(Date.now() / 1000) + 86400 * 3,
        drawTimestamp: Math.floor(Date.now() / 1000) + 86400 * 7,
        status: 'active',
        winnerId: null,
        participantCount: 47,
      },
      {
        drawId: 2,
        name: 'Community NFT Drop',
        description: 'Exclusive VeriDraw NFT for early supporters',
        prizePool: '1',
        entryFee: '0.005',
        entryDeadline: Math.floor(Date.now() / 1000) + 86400 * 5,
        drawTimestamp: Math.floor(Date.now() / 1000) + 86400 * 10,
        status: 'active',
        winnerId: null,
        participantCount: 23,
      },
    ];

    // Filter by status if provided
    let filteredDraws = mockDraws;
    if (status) {
      filteredDraws = mockDraws.filter(draw => draw.status === status);
    }

    return NextResponse.json({
      data: filteredDraws,
      success: true,
      count: filteredDraws.length,
    });
  } catch (error) {
    console.error('Error fetching draws:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch draws',
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST /api/draws - Create a new draw (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      prizePool,
      entryFee,
      entryDeadline,
      drawTimestamp,
      chainId = 84532,
    } = body;

    // TODO: Implement authentication and authorization
    // TODO: Validate admin permissions
    // TODO: Create draw on blockchain

    // Mock response for now
    const newDraw = {
      drawId: Math.floor(Math.random() * 1000),
      name,
      description,
      prizePool,
      entryFee,
      entryDeadline,
      drawTimestamp,
      status: 'upcoming',
      winnerId: null,
      participantCount: 0,
    };

    return NextResponse.json({
      data: newDraw,
      success: true,
      message: 'Draw created successfully',
    });
  } catch (error) {
    console.error('Error creating draw:', error);
    return NextResponse.json(
      {
        error: 'Failed to create draw',
        success: false,
      },
      { status: 500 }
    );
  }
}
