export function findMeanAndDeviation(arr: number[]) {
  const mean = arr.reduce((sum, value) => sum + value, 0) / arr.length;
  const variance =
    arr.reduce((sum, value) => {
      const difference = value - mean;
      return sum + difference * difference;
    }, 0) / arr.length;

  return { mean, stdDev: Math.sqrt(variance) };
}