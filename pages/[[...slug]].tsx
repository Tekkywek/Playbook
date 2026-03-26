import dynamic from 'next/dynamic';

const WebApp = dynamic(() => import('../components/WebApp'), { ssr: false });

export default function ExpoRouterPage() {
  return <WebApp />;
}
