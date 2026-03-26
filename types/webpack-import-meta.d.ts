import type { RequireContext } from 'expo-router/build/types';

declare global {
  interface ImportMeta {
    webpackContext(
      request: string,
      options: {
        recursive?: boolean;
        regExp: RegExp;
        mode?: 'sync' | 'lazy' | 'lazy-once' | 'eager' | 'weak';
      }
    ): RequireContext;
  }
}

export {};
