const path = require('path');
const webpack = require('webpack');
const { withExpo } = require('@expo/next-adapter');

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  // Ensures `process.env.EXPO_OS` is inlined so Expo’s dev runtime uses the web HMR path
  // (see `expo/src/async-require/hmr.ts`) instead of Metro’s native `platform` argument.
  env: {
    EXPO_OS: 'web',
  },
  reactStrictMode: true,
  transpilePackages: [
    'expo-modules-core',
    'react-native',
    'react-native-web',
    'expo',
    'expo-router',
    'expo-glass-effect',
    '@react-navigation/native',
    '@react-navigation/core',
    '@react-navigation/bottom-tabs',
    '@react-navigation/native-stack',
    '@expo/vector-icons',
    '@react-navigation/native',
    '@react-navigation/elements',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-native-gesture-handler',
    'react-native-svg',
    'react-native-reanimated',
    'expo-font',
    'expo-asset',
    'react-native-worklets',
    'expo-blur',
    'expo-linear-gradient',
    'expo-constants',
    'expo-linking',
    'expo-web-browser',
    'expo-auth-session',
    'expo-crypto',
    'expo-file-system',
    'expo-image-picker',
    'expo-image-manipulator',
    'expo-location',
    'expo-notifications',
    'expo-sharing',
    'expo-splash-screen',
    'expo-status-bar',
    '@expo-google-fonts/dm-sans',
    '@expo-google-fonts/oswald',
    '@react-native-async-storage/async-storage',
  ],
  experimental: {
    forceSwcTransforms: true,
    // Required so webpack can bundle CJS `expo-router` against ESM `@react-navigation/native`.
    esmExternals: 'loose',
  },
  webpack(config) {
    // `useFonts` / `@expo-google-fonts/*` import `.ttf` files — treat as static assets, not JS.
    config.module.rules.push({
      test: /\.(ttf|otf|woff2?|eot)$/i,
      type: 'asset/resource',
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.EXPO_OS': JSON.stringify('web'),
      })
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      'react-native-maps': path.resolve(__dirname, 'stubs/react-native-maps.tsx'),
    };
    return config;
  },
});

module.exports = nextConfig;
