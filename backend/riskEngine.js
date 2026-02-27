// Risk scoring and entry signal engine

export function calculateRiskScore(tokenData, securityData, marketData) {
  let riskScore = 50; // Start at baseline
  const factors = {};

  // Security factors (weight: 40%)
  if (securityData) {
    // Ownership risk
    if (securityData.ownership_renounced === false) {
      riskScore += 15;
      factors.ownership_risk = true;
    } else {
      riskScore -= 10;
    }

    // Mint authority risk
    if (securityData.mintable) {
      riskScore += 20;
      factors.mint_risk = true;
    } else {
      riskScore -= 5;
    }

    // Honeypot detection
    if (securityData.honeypot) {
      riskScore += 30;
      factors.honeypot = true;
    }

    // Rug risk
    if (securityData.rug_risk === 'High') {
      riskScore += 20;
      factors.rug_risk_high = true;
    } else if (securityData.rug_risk === 'Medium') {
      riskScore += 10;
      factors.rug_risk_medium = true;
    }

    // Freeze authority (Solana)
    if (securityData.freeze_authority === 'active') {
      riskScore += 15;
      factors.freeze_authority = true;
    }
  }

  // Market factors (weight: 40%)
  if (marketData) {
    // Market cap
    if (marketData.market_cap > 1000000) {
      riskScore -= 8;
      factors.healthy_market_cap = true;
    } else if (marketData.market_cap < 10000) {
      riskScore += 15;
      factors.low_market_cap = true;
    }

    // Liquidity
    if (marketData.liquidity > 100000) {
      riskScore -= 10;
      factors.good_liquidity = true;
    } else if (marketData.liquidity < 10000) {
      riskScore += 12;
      factors.low_liquidity = true;
    }

    // Volume
    if (marketData.volume > marketData.liquidity * 0.5) {
      riskScore -= 5;
      factors.good_volume = true;
    } else if (marketData.volume < 1000) {
      riskScore += 8;
      factors.low_volume = true;
    }

    // Price momentum
    if (marketData.price_change_24h > 50) {
      riskScore += 5; // Possible pump
      factors.high_price_change = true;
    } else if (marketData.price_change_24h < -50) {
      riskScore += 10; // Dumping
      factors.negative_momentum = true;
    }
  }

  // Holder distribution factors (weight: 20%)
  if (tokenData) {
    // Top holder concentration
    if (tokenData.top_10_holder_percent > 80) {
      riskScore += 18;
      factors.high_concentration = true;
    } else if (tokenData.top_10_holder_percent < 30) {
      riskScore -= 8;
      factors.good_distribution = true;
    }

    // Holder count
    if (tokenData.holder_count > 1000) {
      riskScore -= 5;
      factors.many_holders = true;
    } else if (tokenData.holder_count < 50) {
      riskScore += 12;
      factors.few_holders = true;
    }
  }

  // Ensure score is within 1-100 range
  riskScore = Math.max(1, Math.min(100, riskScore));

  return {
    risk_score: Math.round(riskScore),
    factors,
    summary: getRiskSummary(riskScore)
  };
}

function getRiskSummary(score) {
  if (score >= 75) return 'Critical Risk';
  if (score >= 60) return 'High Risk';
  if (score >= 45) return 'Medium Risk';
  if (score >= 30) return 'Low Risk';
  return 'Very Low Risk';
}

export function generateEntrySignal(tokenData, securityData, marketData) {
  let signalScore = 0;
  const signals = {
    positive: [],
    negative: [],
    neutral: []
  };

  // Security-based signals
  if (securityData) {
    if (securityData.rug_risk === 'Low') {
      signalScore += 25;
      signals.positive.push('Low rug risk');
    } else if (securityData.rug_risk === 'High') {
      signalScore -= 40;
      signals.negative.push('High rug risk');
    }

    if (securityData.ownership_renounced) {
      signalScore += 15;
      signals.positive.push('Ownership renounced');
    } else {
      signalScore -= 20;
      signals.negative.push('Ownership not renounced');
    }

    if (!securityData.mintable) {
      signalScore += 15;
      signals.positive.push('Mint disabled');
    } else {
      signalScore -= 25;
      signals.negative.push('Mint function active');
    }

    if (!securityData.honeypot) {
      signalScore += 10;
      signals.positive.push('Not honeypot');
    } else {
      signalScore -= 35;
      signals.negative.push('Potential honeypot detected');
    }
  }

  // Market-based signals
  if (marketData) {
    if (marketData.liquidity > 50000) {
      signalScore += 10;
      signals.positive.push('Strong liquidity');
    } else if (marketData.liquidity < 5000) {
      signalScore -= 15;
      signals.negative.push('Low liquidity');
    }

    if (marketData.volume > 10000) {
      signalScore += 8;
      signals.positive.push('Good trading volume');
    }

    if (marketData.price_change_24h > 0 && marketData.price_change_24h < 100) {
      signalScore += 5;
      signals.positive.push('Positive momentum');
    } else if (marketData.price_change_24h > 100) {
      signalScore -= 10;
      signals.neutral.push('Possible pump - caution advised');
    }
  }

  // Holder distribution signals
  if (tokenData) {
    if (tokenData.top_10_holder_percent < 50) {
      signalScore += 10;
      signals.positive.push('Good holder distribution');
    } else if (tokenData.top_10_holder_percent > 70) {
      signalScore -= 15;
      signals.negative.push('Concentrated holdings');
    }

    if (tokenData.holder_count > 500) {
      signalScore += 8;
      signals.positive.push('Established holder base');
    }
  }

  // Determine entry signal
  let entrySignal = 'Avoid';
  if (signalScore >= 50) {
    entrySignal = 'Strong Buy';
  } else if (signalScore >= 25) {
    entrySignal = 'Buy';
  } else if (signalScore >= 0) {
    entrySignal = 'Moderate';
  }

  return {
    entry_signal: entrySignal,
    signal_score: signalScore,
    positive_signals: signals.positive,
    negative_signals: signals.negative,
    neutral_signals: signals.neutral,
    confidence: Math.abs(signalScore) / 100
  };
}

export function detectVolumeSpike(currentVolume, historicalVolume) {
  if (!historicalVolume || historicalVolume === 0) return false;
  return currentVolume > historicalVolume * 2; // 2x increase
}

export function detectLiquidityGrowth(currentLiquidity, historicalLiquidity) {
  if (!historicalLiquidity || historicalLiquidity === 0) return false;
  return currentLiquidity > historicalLiquidity * 1.5; // 1.5x increase
}

export function detectHolderGrowth(currentHolders, historicalHolders) {
  if (!historicalHolders || historicalHolders === 0) return false;
  return currentHolders > historicalHolders * 1.3; // 1.3x increase
}

export function calculateBuySellRatio(buyVolume, sellVolume) {
  if (sellVolume === 0) return 100;
  return (buyVolume / (buyVolume + sellVolume)) * 100;
}

export function generateDetailedReport(tokenData, securityData, marketData) {
  const riskAnalysis = calculateRiskScore(tokenData, securityData, marketData);
  const entryAnalysis = generateEntrySignal(tokenData, securityData, marketData);

  return {
    timestamp: new Date().toISOString(),
    token_name: tokenData.name,
    token_symbol: tokenData.symbol,
    chain: tokenData.chain,
    risk_analysis: riskAnalysis,
    entry_analysis: entryAnalysis,
    security_summary: {
      rug_risk: securityData?.rug_risk || 'Unknown',
      honeypot: securityData?.honeypot || false,
      mintable: securityData?.mintable !== false,
      ownership_status: securityData?.ownership_renounced ? 'Renounced' : 'Active'
    },
    market_summary: {
      price: marketData?.price || 0,
      market_cap: marketData?.market_cap || 0,
      liquidity: marketData?.liquidity || 0,
      volume_24h: marketData?.volume || 0,
      price_change_24h: marketData?.price_change_24h || 0
    },
    holder_summary: {
      total_holders: tokenData?.holder_count || 0,
      top_10_concentration: tokenData?.top_10_holder_percent || 0,
      top_holders: tokenData?.top_holders || []
    },
    recommendation: `${entryAnalysis.entry_signal} - Risk Score: ${riskAnalysis.risk_score}/100 (${riskAnalysis.summary})`
  };
}