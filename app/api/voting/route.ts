import { NextRequest, NextResponse } from 'next/server';
import { VOTING_CONTRACT_ABI } from '@/lib/blockchain/abis';
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

// GET /api/voting - Get all voting initiatives
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = parseInt(searchParams.get('chainId') || '84532');
    const status = searchParams.get('status'); // 'active', 'upcoming', 'completed'

    const publicClient = getPublicClient(chainId);
    const addresses = getContractAddresses(chainId);

    // TODO: Implement fetching all initiatives from contract
    // For now, return mock data structure
    const mockInitiatives = [
      {
        initiativeId: 1,
        name: 'Next Prize Pool Allocation',
        description: 'Vote on how to distribute the next community prize pool',
        votingDeadline: Math.floor(Date.now() / 1000) + 86400 * 4,
        status: 'active',
        voteCount: 156,
        optionCount: 3,
        creator: '0x1234567890123456789012345678901234567890',
        createdAt: Math.floor(Date.now() / 1000) - 86400,
        options: [
          { id: 1, text: 'Single Large Prize (1 ETH)', votes: 89 },
          { id: 2, text: 'Multiple Medium Prizes (0.2 ETH each)', votes: 45 },
          { id: 3, text: 'Many Small Prizes (0.05 ETH each)', votes: 22 },
        ],
      },
      {
        initiativeId: 2,
        name: 'Platform Feature Priority',
        description: 'Which feature should we build next?',
        votingDeadline: Math.floor(Date.now() / 1000) + 86400 * 6,
        status: 'active',
        voteCount: 203,
        optionCount: 3,
        creator: '0x1234567890123456789012345678901234567890',
        createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
        options: [
          { id: 1, text: 'Mobile App', votes: 78 },
          { id: 2, text: 'Advanced Analytics', votes: 65 },
          { id: 3, text: 'Social Features', votes: 60 },
        ],
      },
    ];

    // Filter by status if provided
    let filteredInitiatives = mockInitiatives;
    if (status) {
      filteredInitiatives = mockInitiatives.filter(init => init.status === status);
    }

    return NextResponse.json({
      data: filteredInitiatives,
      success: true,
      count: filteredInitiatives.length,
    });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch initiatives',
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST /api/voting - Create a new voting initiative (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      votingDeadline,
      options,
      chainId = 84532,
    } = body;

    // Validate input
    if (!name || !description || !options || options.length < 2) {
      return NextResponse.json(
        {
          error: 'Missing required fields or insufficient options',
          success: false,
        },
        { status: 400 }
      );
    }

    // TODO: Implement authentication and authorization
    // TODO: Validate admin permissions
    // TODO: Create initiative on blockchain

    // Mock response for now
    const newInitiative = {
      initiativeId: Math.floor(Math.random() * 1000),
      name,
      description,
      votingDeadline,
      status: 'active',
      voteCount: 0,
      optionCount: options.length,
      creator: '0x1234567890123456789012345678901234567890',
      createdAt: Math.floor(Date.now() / 1000),
      options: options.map((text: string, index: number) => ({
        id: index + 1,
        text,
        votes: 0,
      })),
    };

    return NextResponse.json({
      data: newInitiative,
      success: true,
      message: 'Initiative created successfully',
    });
  } catch (error) {
    console.error('Error creating initiative:', error);
    return NextResponse.json(
      {
        error: 'Failed to create initiative',
        success: false,
      },
      { status: 500 }
    );
  }
}
