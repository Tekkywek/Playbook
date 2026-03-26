import { Redirect } from 'expo-router';

/** Sign up is handled on the same screen as log in. */
export default function SignupRedirect() {
  return <Redirect href={{ pathname: '/login', params: { mode: 'signup' } }} />;
}
