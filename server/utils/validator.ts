import type { H3Event } from 'h3';
import { ZodError, type ZodSchema } from 'zod';
import type { AnyType } from '~/types';

interface Validator {
  schema: ZodSchema;
  event: H3Event;
}

/**
 * Create error path
 * @param value - Array of error path
 * @returns string
 */
const createPath = (value: (string | number)[]) => {
  const parsed = value.map((path, i) => {
    if (typeof path === 'number') {
      return `[${path}]`;
    }

    if (typeof path === 'string' && i > 0) {
      return '.'.concat(path);
    }

    return path;
  });

  return parsed.join('');
};

/**
 * Get error value
 * @param param0 - Zod Error
 * @returns - array
 */
const getErrors = ({ errors }: ZodError) => {
  return errors.map((err) => ({ message: err.message, path: createPath(err.path) }));
};

/**
 * Form input validator
 * @param options Validator<T>
 * @returns Promise<T | undefined>
 */
export const useValidator = async <T extends AnyType = AnyType>({ schema, event }: Validator) => {
  try {
    const reqBody = await readBody(event);
    const source = reqBody ?? {};
    const result = schema.parse(source);
    return result as T;
  } catch (err: any) {
    if (err instanceof ZodError) {
      throw createError({
        statusCode: 422,
        message: 'Validation failed',
        data: { errors: getErrors(err) }
      });
    }
  }
};
