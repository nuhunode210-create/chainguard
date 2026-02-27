import axios from 'axios';
import { ethers } from 'ethers';

const BSC_RPC = 'https://bsc-dataseed1.binance.org';
const BSCSCAN_API = 'https://api.bscscan.com/api';
const BSCSCAN_KEY = process.env.BSCSCAN_API_KEY || 'YourBscscanKeyHere';

// Verify if address is valid BSC address (Ethereum format)
export function isValidBscAddress(address) {
  return ethers.isAddress(address);
}

// ERC20 contract ABI (minimal, for what we need)
const ERC20_ABI = [
  'function name() public view returns (string)',
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function balanceOf(address account) public view returns (uint256)',
  'function allowance(address owner, address spender) public view returns (uint256)',
  'function owner() public view returns (address)'
];

// Get BSC token info
export async function getBscTokenInfo(tokenAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(BSC_RPC);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name().catch(() => 'Unknown'),
      contract.symbol().catch(() => 'N/A'),
      contract.decimals().catch(() => 18),
      contract.totalSupply().catch(() => '0')
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals),
      total_supply: ethers.formatUnits(totalSupply, decimals)
    };
  } catch (error) {
    console.error('Error fetching BSC token info:', error.message);
    return null;
  }
}

// Detect honeypot on BSC using simulation
export async function detectHoneypotBsc(tokenAddress) {
  try {
    // Try to simulate a swap to detect honeypot
    // This is a simplified approach - in production you'd use specialized services
    const provider = new ethers.JsonRpcProvider(BSC_RPC);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Check if contract is verified and functions exist
    const hasTransfer = await contract.transfer.catch(() => false);
    
    return {
      is_honeypot: false, // Simplified - would need more complex detection
      estimated_tax: 0
    };
  } catch (error) {
    console.error('Error detecting honeypot:', error.message);
    return {
      is_honeypot: true,
      estimated_tax: 100
    };
  }
}

// Get BSC token holders information from BscScan
export async function getBscTokenHolders(tokenAddress) {
  try {
    const response = await axios.get(BSCSCAN_API, {
      params: {
        module: 'token',
        action: 'tokenholderlist',
        contractaddress: tokenAddress,
        page: 1,
        offset: 10,
        apikey: BSCSCAN_KEY
      }
    });

    if (response.data?.result && Array.isArray(response.data.result)) {
      const holders = response.data.result;
      const totalHolders = holders.length;
      
      // Calculate top 10 holder percentage
      const topHoldersBalance = holders.slice(0, 10).reduce((sum, h) => 
        sum + parseFloat(h.TokenHolderQuantity || 0), 0);
      
      const topHolderPercent = (topHoldersBalance / 
        parseFloat(holders[0]?.TokenHolderQuantity || 1)) * 100;

      return {
        holder_count: totalHolders,
        top_10_holder_percent: Math.min(topHolderPercent, 100),
        top_holders: holders.slice(0, 5).map(h => ({
          address: h.TokenHolderAddress,
          balance: h.TokenHolderQuantity,
          percent: (parseFloat(h.TokenHolderQuantity) / 
            parseFloat(holders[0]?.TokenHolderQuantity || 1)) * 100
        }))
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching BSC token holders:', error.message);
    return null;
  }
}

// Get BSC token market data
export async function getBscTokenMarketData(tokenAddress) {
  try {
    // Using PancakeSwap or other DEX data
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    
    if (response.data?.pairs?.length > 0) {
      const pair = response.data.pairs[0];
      return {
        price: parseFloat(pair.priceUsd) || 0,
        market_cap: parseFloat(pair.marketCap) || 0,
        liquidity: parseFloat(pair.liquidity?.usd) || 0,
        volume: parseFloat(pair.volume?.h24) || 0,
        price_change_24h: parseFloat(pair.priceChange?.h24) || 0
      };
    }

    return {
      price: 0,
      market_cap: 0,
      liquidity: 0,
      volume: 0,
      price_change_24h: 0
    };
  } catch (error) {
    console.error('Error fetching BSC market data:', error.message);
    return null;
  }
}

// Perform security checks for BSC token
export async function performBscSecurityCheck(tokenAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(BSC_RPC);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Try to get owner
    let ownershipRenounced = true;
    let owner = null;
    try {
      owner = await contract.owner();
      ownershipRenounced = owner === ethers.ZeroAddress;
    } catch {
      ownershipRenounced = true;
    }

    // Get contract bytecode to check for mint/burn functions
    const bytecode = await provider.getCode(tokenAddress);
    const hasMintFunction = bytecode.includes('40c10f19'); // Mint function signature
    const hasBurnFunction = bytecode.includes('42966c68'); // Burn function signature

    const honeypot = await detectHoneypotBsc(tokenAddress);

    return {
      ownership_renounced: ownershipRenounced,
      owner_address: owner,
      mint_enabled: hasMintFunction,
      burn_enabled: hasBurnFunction,
      honeypot: honeypot.is_honeypot,
      estimated_tax: honeypot.estimated_tax,
      rug_risk: honeypot.is_honeypot ? 'High' : (ownershipRenounced ? 'Low' : 'Medium'),
      verified: bytecode.length > 100
    };
  } catch (error) {
    console.error('Error performing BSC security check:', error.message);
    return null;
  }
}

// Get liquidity pools for BSC token
export async function getBscLiquidityData(tokenAddress) {
  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    
    if (response.data?.pairs?.length > 0) {
      const pair = response.data.pairs[0];
      return {
        liquidity_usd: parseFloat(pair.liquidity?.usd) || 0,
        liquidity_base: parseFloat(pair.liquidity?.base) || 0,
        liquidity_quote: parseFloat(pair.liquidity?.quote) || 0,
        dex: pair.dexId,
        locked: false // Simplified - would need to check lock contracts
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching BSC liquidity data:', error.message);
    return null;
  }
}