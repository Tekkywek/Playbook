import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { PremiumModal } from '@/components/profile/PremiumModal';

export default function PremiumScreen() {
  const router = useRouter();
  return (
    <Screen>
      <PremiumModal visible onClose={() => router.back()} />
    </Screen>
  );
}
