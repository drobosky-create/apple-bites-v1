
// Valuation Engine for Apple Bites

function calculateValuation(responses) {
  const driverTotals = {};
  const driverCounts = {};

  // Step 1: Score aggregation per value driver
  for (const response of responses) {
    const { valueDriver, weight } = response;
    if (!driverTotals[valueDriver]) {
      driverTotals[valueDriver] = 0;
      driverCounts[valueDriver] = 0;
    }
    driverTotals[valueDriver] += weight;
    driverCounts[valueDriver] += 1;
  }

  // Step 2: Normalize driver scores to 0–100
  const driverScores = {};
  let overallTotal = 0;
  for (const driver in driverTotals) {
    const avgScore = driverTotals[driver] / driverCounts[driver]; // out of 5
    const normalized = Math.round((avgScore / 5) * 100);
    driverScores[driver] = normalized;
    overallTotal += normalized;
  }

  const overallScore = Math.round(overallTotal / Object.keys(driverScores).length);

  // Step 3: Determine valuation multiple range
  let lowMult, highMult;
  if (overallScore >= 80) {
    lowMult = 6.5; highMult = 10.5;
  } else if (overallScore >= 60) {
    lowMult = 3.0; highMult = 6.5;
  } else if (overallScore >= 40) {
    lowMult = 1.0; highMult = 3.0;
  } else {
    lowMult = 0.1; highMult = 1.0;
  }

  // Step 4: Calculate Adjusted EBITDA
  const financials = responses.find(r => r.id === 'financial-1');
  const cogs = responses.find(r => r.id === 'financial-2');
  const opex = responses.find(r => r.id === 'financial-3');
  const adjustments = ['adjustments-1', 'adjustments-2', 'adjustments-3', 'adjustments-4']
    .map(id => responses.find(r => r.id === id)?.value || 0)
    .reduce((a, b) => a + b, 0);

  const revenue = financials?.value || 0;
  const grossProfit = revenue - (cogs?.value || 0);
  const ebitda = grossProfit - (opex?.value || 0) + adjustments;

  // Step 5: Calculate value range
  const estimatedLow = Math.round(ebitda * lowMult);
  const estimatedHigh = Math.round(ebitda * highMult);
  const estimatedMean = Math.round((estimatedLow + estimatedHigh) / 2);

  // Step 6: Build recommendations for drivers under 60
  const recommendations = [];
  for (const driver in driverScores) {
    if (driverScores[driver] < 60) {
      recommendations.push("Improve your " + driver + " to increase attractiveness to buyers.");
    }
  }

  return {
    overallScore,
    driverScores,
    ebitda,
    valuation: {
      low: estimatedLow,
      mean: estimatedMean,
      high: estimatedHigh
    },
    recommendations
  };
}

export default calculateValuation;
