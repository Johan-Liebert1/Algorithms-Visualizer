/**
 * @param milliseconds sleep for this amount of milliseconds
 */
export const sleep = (milliseconds: number): Promise<void> =>
  new Promise(r => setTimeout(r, milliseconds));

/**
 * get number between Min and Max, both inclusive
 */
export const randNum = (min: number, max: number): number =>
  min + Math.floor(Math.random() * (max - min + 1));
