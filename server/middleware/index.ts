import { getUserSession } from '../utils/session';

export default defineEventHandler(async (event) => {
  (event.node.res as any)._implicitHeader = () => event.node.res.writeHead(event.node.res.statusCode);

  setHeaders(event, {
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'deny',
    'X-Content-Type-Options': 'nosniff'
  });

  // Set session data to context
  const session = await getUserSession(event);
  event.context.session = session;
});
