import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Head as RouterHead } from 'expo-router/build/head/ExpoHead';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RouterHead.Provider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="PlayBook — teams, leagues, and games." />
        <title>PlayBook</title>
      </Head>
      <Component {...pageProps} />
    </RouterHead.Provider>
  );
}
