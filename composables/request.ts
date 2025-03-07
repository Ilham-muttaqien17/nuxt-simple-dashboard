import { FetchError, type FetchOptions } from 'ofetch';
import type { HTTPMethod } from 'h3';
import { omit } from '~/utils/helper';

interface Options extends FetchOptions {
  method: Readonly<HTTPMethod>;
  body?: any;
  query?: Record<string, any>;
  headers?: Record<string, any>;
  isRawResponse?: boolean;
  isCoreAPI?: boolean;
}

// Default options
const defaultOptions: Options = {
  method: 'GET',
  query: {},
  headers: {}
};

// Validate request that only listed http method can contain body
const isPayloadMethods = (method: HTTPMethod) => ['PATCH', 'POST', 'PUT', 'DELETE'].indexOf(method) !== -1;

/**
 * Set OFetch options
 * @param options
 * @param resolver - callback resolver
 * @returns Options
 */
const setOptions = <T = any>(options: Options, resolver: (value: T | PromiseLike<T>) => void) => {
  const isRawResponse = typeof options.isRawResponse === 'boolean' ? options.isRawResponse : false;
  const omitted: (keyof Options)[] = ['headers', 'method', 'body', 'query', 'timeout', 'onResponse', 'isCoreAPI', 'isRawResponse'];

  const parts: Partial<Options> = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    },
    ...(isPayloadMethods(options.method) && { body: options.body }),
    method: options.method,
    query: options.query,
    timeout: options.timeout ?? 60000, // set timeout for 2 minutes
    onResponse: (ctx) => (isRawResponse ? resolver(ctx as T) : undefined)
  };

  return { ...parts, ...omit(options, omitted) };
};

/**
 * HTTP Fetch from client
 * @param url - url string
 * @param options - Options
 * @returns Promise<T>
 */
export function useRequest<T = any>(url: string, options: Options = defaultOptions): Promise<T> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const isCoreAPI = typeof options.isCoreAPI === 'boolean' ? options.isCoreAPI : false;
      const URL = isCoreAPI ? '/api'.concat(url) : url;
      const data = await $fetch(URL, setOptions(options, resolve));

      resolve(data as T);
    } catch (err: any) {
      reject(err);
    }
  });
}

export function useRequestError(err: any, formRef?: Ref) {
  const toast = useToast();

  const DEFAULTS = 'Ups, Something went wrong!';
  if (err instanceof FetchError) {
    const { statusCode, statusMessage, message, data } = err;
    const msg = message || statusMessage;

    if (statusCode === 401) {
      toast.add({ title: 'Unauthorized', color: 'danger' });
      nextTick(doLogout);
      return;
    }

    if (statusCode === 422) {
      formRef?.value.setErrors(data.data.errors);
      return;
    }

    if (typeof msg === 'string') {
      toast.add({ title: msg, color: 'danger' });
      return;
    }
  }

  const msg = Object.hasOwn(err, 'message') ? (typeof err.message === 'string' ? err.message : DEFAULTS) : DEFAULTS;
  toast.add({ title: msg, color: 'danger' });
}

async function doLogout() {
  try {
    const auth = useStateAuth();
    if (!auth.value) {
      return;
    }

    await useRequest('/auth/logout', {
      method: 'GET',
      isCoreAPI: true
    });

    location.reload();
  } catch {
    // nope
  }
}
