import type { RawAxiosRequestHeaders } from 'axios';
import axios from 'axios';
import type { H3Event, HTTPMethod } from 'h3';
import { createUrlParams } from './helpers';
import env from '~/config';
import { omit } from '~/utils/helper';

interface RequestOptions {
  url: string;
  event: H3Event;
  method: Readonly<HTTPMethod>;
  body?: Record<string, any>;
  query?: Record<string, any>;
  headers?: RawAxiosRequestHeaders;
  timeout?: number;
  isRawData?: boolean;
  isUrlEncoded?: boolean;
}

const getAuthorization = (event: H3Event) => {
  const session = event.context ? event.context.session : null;

  if (!session) {
    return '';
  }

  return session.token ? `Bearer ${session.token.accessToken.value}` : '';
};

const getHeaders = ({ event, isUrlEncoded }: RequestOptions) => {
  const auth = getAuthorization(event);

  const headers = {
    ...(auth && { Authorization: auth }),
    'User-Agent': event.node.req.headers['user-agent'] ? event.node.req.headers['user-agent'] : 'FE',
    'Cache-Control': 'no-cache',
    'Content-Type': !isUrlEncoded ? 'application/json' : 'application/x-www-form-urlencoded'
  };

  return headers;
};

/**
 * Create HTTP Request
 * @param opts - RequestOptions
 */
export async function doRequest<T = any>(opts: RequestOptions): Promise<T> {
  try {
    const url = env.BACKEND_BASEURL + opts.url + (opts.query ? '?' + createUrlParams(opts.query) : '');

    const remainingOptions = omit(opts, [
      'url',
      'path',
      'method',
      'query',
      'event',
      'headers',
      'body',
      'timeout',
      'responseType',
      'maxBodyLength',
      'maxContentLength',
      'responseEncoding',
      'isRawResponse',
      'httpsAgent',
      'isCoreAPI',
      'isFormData',
      'isUrlEncoded'
    ]);

    const result = await axios({
      url,
      method: opts.method,
      headers: getHeaders(opts),
      ...(opts.body && { data: opts.body }),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: opts.timeout ?? 2 * 60000,
      ...remainingOptions
    });

    return (opts.isRawData ? result : result.data) as T;
  } catch (error: any) {
    throw isError(error) ? error : createError(error);
  }
}
