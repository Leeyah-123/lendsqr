// TODO: Use generics to infer the correct return types
type CamelToSnake<T extends { [key: string]: any } | { [key: string]: any }[]> =
  {
    // Convert each key to snake case and return the type
    [key in keyof T]: T[key] extends { [key: string]: any }
      ? {
          [K in keyof T[key]]: T[key][K] extends { [key: string]: any }
            ? CamelToSnake<T[key][K]>
            : T[key][K];
        }
      : T[key];
  };

/**
 * Converts an object with keys in camelCase to snake_case, handling arrays.
 *
 * @param obj - The object to convert
 * @returns An object with keys converted to snake_case
 */
export const convertCamelToSnake = (
  obj: { [key: string]: any } | any[]
): { [key: string]: any } | any[] => {
  if (Array.isArray(obj)) {
    return obj.map(convertCamelToSnake);
  }

  const convertedObj: { [key: string]: any } = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      convertedObj[snakeKey] =
        typeof obj[key] === 'object' ? convertCamelToSnake(obj[key]) : obj[key];
    }
  }

  return convertedObj;
};

/**
 * Converts an object with keys in snake_case to camelCase, handling arrays.
 *
 * @param obj - The object to convert
 * @returns An object with keys converted to camelCase
 */
export const convertSnakeToCamel = (
  obj: { [key: string]: any } | any[]
):
  | {
      [key: string]: any;
    }
  | any[] => {
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamel);
  }

  const convertedObj: { [key: string]: any } = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      convertedObj[camelKey] =
        typeof obj[key] === 'object' ? convertSnakeToCamel(obj[key]) : obj[key];
    }
  }

  return convertedObj;
};

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
