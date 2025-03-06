// import type { EventHandler } from 'h3';
import authRoute from '~/server/controllers/auth';

const router = createRouter();

// const h = (...handlers: EventHandler[]) => createApp().use(handlers).handler;

// Auth Routes
router.use('/auth/**', useBase('/auth/', authRoute.handler));

export default useBase('/api', router.handler);
