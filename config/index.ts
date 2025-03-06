import { config } from 'dotenv';
import * as path from 'path';

const dotenv = config({ path: path.resolve('config/.env') });

type AppEnv = {
  BACKEND_BASEURL: string;
};

const env: AppEnv = {
  BACKEND_BASEURL: String(dotenv.parsed?.BACKEND_BASEURL)
};

export default env;
