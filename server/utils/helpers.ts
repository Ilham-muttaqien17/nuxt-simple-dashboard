/**
 * Create url parameters
 * https://stackoverflow.com/questions/56173848/want-to-convert-a-nested-object-to-query-parameter-for-attaching-to-url
 * @param {object} data Data to create url query
 * @returns String
 */
export function createUrlParams(data: Record<string, any>): string {
  const replaceKey = (str: string) => (str === '__proto__' || str === 'constructor' ? '_proto' : str);
  const getPairs = (obj: Record<string, any>, keys: any[] = []) => {
    return Object.entries(obj).reduce((pairs: any[], [key, value]: any[]) => {
      if (typeof value === 'object') {
        pairs.push(...getPairs(value, [...keys, replaceKey(key)]));
      } else {
        pairs.push([[...keys, replaceKey(key)], value]);
      }
      return pairs;
    }, []);
  };

  const mapped = getPairs(data).map(([[key, ...keysRest], value]: any[]) => {
    return `${replaceKey(key)}${keysRest.map((k: string) => `[${replaceKey(k)}]`).join('')}=${value ?? ''}`;
  });

  return mapped.filter((v) => v.split('=')[1] !== '').join('&');
}
