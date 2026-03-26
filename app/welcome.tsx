import { Redirect } from 'expo-router';

/** Entry is the combined auth screen (`/login`); this route kept for old links. */
export default function WelcomeRedirect() {
  return <Redirect href="/login" />;
}
