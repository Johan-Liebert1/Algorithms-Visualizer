/**
 * @param milliseconds sleep for this amount of milliseconds
 */
export const sleep = (milliseconds: number): Promise<void> =>
  new Promise(r => setTimeout(r, milliseconds));
