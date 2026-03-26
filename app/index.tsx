import { Redirect } from 'expo-router';

export default function Index() {
  // Always go through the gate screen so users see auth first.
  return <Redirect href="/welcome" />;
}
