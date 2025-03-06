import type { SessionConfig } from 'h3';

export type UserSessionConfig = Omit<SessionConfig, 'name' | 'maxAge'> & {
  name: string;
  maxAge: number;
};

export type UserSessionData = Record<string, any> & {
  token: {
    accessToken: {
      value: string;
      exp: number;
    };
    refreshToken: {
      value: string;
      exp: number;
    };
  };
};
