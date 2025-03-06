/**
 * Remove properties form object
 * @param source - Source data in object
 * @param keys - Array of keys wants to delete
 * @returns Object
 */
export function omit<T extends Record<string, any>>(source: Record<string, any>, keys: (keyof T)[]) {
  return Object.keys(source).reduce((prev: Record<string, any>, curr) => {
    if (keys.indexOf(curr) === -1) {
      prev[curr] = source[curr];
    }

    return prev;
  }, {});
}
