import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_CONTRACT_ABI } from '@/lib/blockchain/abis';
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

// GET /api/users/[address] - Get user profile and stats
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const params = await context.params;
    const userAddress = params.address as `0x${string}`;
    const { searchParams } = new URL(request.url);
    const chainId = parseInt(searchParams.get('chainId') || '84532');

    // Validate address format
    if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
      return NextResponse.json(
        {
          error: 'Invalid address format',
          success: false,
        },
        { status: 400 }
      );
    }

    const publicClient = getPublicClient(chainId);
    const addresses = getContractAddresses(chainId);

    // TODO: Fetch real user data from contracts and database
    // For now, return mock data
    const mockUserData = {
      userId: userAddress,
      creationTimestamp: Math.floor(Date.now() / 1000) - 86400 * 30, // 30 days ago
      totalEntries: 5,
      totalVotes: 12,
      tokenBalance: '150000000000000000000', // 150 tokens in wei
      totalEarned: '150000000000000000000', // 150 tokens earned
      drawsParticipated: [1, 2, 3],
      votesCast: [1, 2],
      drawsWon: [],
      lastActivity: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    };

    return NextResponse.json({
      data: mockUserData,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch user data',
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Register or update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      address,
      email,
      kycStatus,
      preferences,
      chainId = 84532,
    } = body;

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        {
          error: 'Address is required',
          success: false,
        },
        { status: 400 }
      );
    }

    // TODO: Store user data in database
    // TODO: Handle KYC verification if provided
    // TODO: Update user preferences

    // Mock response for now
    const userProfile = {
      userId: address,
      email: email || null,
      kycStatus: kycStatus || 'pending',
      preferences: preferences || {},
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      data: userProfile,
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        error: 'Failed to update user profile',
        success: false,
      },
      { status: 500 }
    );
  }
}

// PUT /api/users/[address] - Update user profile
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ address: string }> }
) {
  try {
    const params = await context.params;
    const userAddress = params.address;
    const body = await request.json();
    const {
      email,
      kycStatus,
      preferences,
      chainId = 84532,
    } = body;

    // TODO: Update user data in database
    // TODO: Handle KYC verification updates

    // Mock response for now
    const updatedProfile = {
      userId: userAddress,
      email: email || null,
      kycStatus: kycStatus || 'pending',
      preferences: preferences || {},
      updatedAt: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json({
      data: updatedProfile,
      success: true,
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        error: 'Failed to update user profile',
        success: false,
      },
      { status: 500 }
    );
  }
}
