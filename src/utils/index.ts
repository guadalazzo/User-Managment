// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (..._: any[]) => any>(callback: T, wait: number): (..._: Parameters<T>) => void {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

/**
Races multiple promises against a timeout and sets a value if the timeout wins.
@param setLoadingValue - The value to be set if the timeout wins.
@param promisesToRace - An array of promises to race against the timeout.
@param time - The timeout duration in milliseconds.
@returns Promise
*/
export async function racePromises(
  setLoadingValue: (_: boolean) => void,
  promisesToRace: Promise<unknown>[],
  time: number,
) {
  try {
    const timeoutRacing = new Promise((resolve) => setTimeout(() => resolve('timeout'), time));
    const racingPromises = Promise.all(promisesToRace);
    const winner = await Promise.race([racingPromises, timeoutRacing]);
    if (winner === 'timeout') {
      setLoadingValue(true);
      await racingPromises;
      setLoadingValue(false);
    } else {
      setLoadingValue(false);
    }
  } catch (e) {
    console.error('Error in racePromises:', e);
    setLoadingValue(false);
    throw e;
  }
}
