import { Stack } from 'expo-router';

export default function TeamStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0B1020' },
        headerTintColor: '#F4F6FF',
        headerTitleStyle: { fontFamily: 'DMSans_600SemiBold' },
        contentStyle: { backgroundColor: '#0B1020' },
      }}
    />
  );
}
