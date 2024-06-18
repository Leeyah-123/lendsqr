/**
 * Generates a random number string of the specified length.
 *
 * @param length - The length of the string to be generated
 * @returns A random number of the provided length
 */
export const generateRandomNum = (length: number): number => {
  const characters = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return Number(result);
};
