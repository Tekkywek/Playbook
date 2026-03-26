import { View, StyleSheet } from 'react-native';
import { Screen } from '@/components/ui/Screen';
import { Title, Body } from '@/components/ui/Typography';
import { brand } from '@/constants/theme';

export default function SetupScreen() {
  return (
    <Screen>
      <View style={styles.box}>
        <Title>Configure Firebase</Title>
        <Body muted style={styles.p}>
          Copy `.env.example` to `.env` and add your Firebase web app keys from the Firebase console
          (Project settings → Your apps). PlayBook stores profiles, games, teams, and leagues in Firestore.
        </Body>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', gap: 16 },
  p: { marginTop: 8 },
});
