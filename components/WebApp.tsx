import { ExpoRoot } from 'expo-router';
import type { RequireContext } from 'expo-router/build/types';

/**
 * Next.js does not expose Metro’s `require.context` in the browser bundle.
 * Webpack 5 provides `import.meta.webpackContext` instead.
 *
 * `regExp` must be a regex literal here — Webpack parses it at build time (a variable fails).
 * Same pattern as `expo-router/_ctx.web.js`.
 */
const ctx = import.meta.webpackContext('../app', {
  recursive: true,
  // Exclude Next.js App Router root `layout.tsx` (not Expo’s `_layout.tsx`) — avoids bundling it as an Expo route / client module.
  regExp:
    /^(?:\.\/)(?!layout\.[tj]sx?$)(?!(?:(?:(?:.*\+api)|(?:\+middleware)|(?:\+(html|native-intent))))\.[tj]sx?$).*(?:\.android|\.ios|\.native)?\.[tj]sx?$/,
  mode: 'sync',
}) as RequireContext;

export default function WebApp() {
  return <ExpoRoot context={ctx} />;
}
