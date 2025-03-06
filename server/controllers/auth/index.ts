import type { EventHandler } from 'h3';
import login from './login';
import logout from './logout';

const router = createRouter();

const event = (handler: EventHandler) => eventHandler(handler);

// Login route
router.post('/login', event(login));
router.get('/logout', event(logout));

export default router;
