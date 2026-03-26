import React, { useEffect, useCallback, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { DMSans_400Regular, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { brand } from '@/constants/theme';
import { initFirebaseAnalytics } from '@/lib/firebase';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, err] = useFonts({
    Oswald_700Bold,
    DMSans_400Regular,
    DMSans_600SemiBold,
  });
  const [fontWaitExceeded, setFontWaitExceeded] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const id = setTimeout(() => setFontWaitExceeded(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const fontsReady = loaded || !!err || fontWaitExceeded;

  const onReady = useCallback(async () => {
    if (fontsReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  if (!fontsReady) {
    return (
      <View style={{ flex: 1, backgroundColor: brand.ink, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={brand.blue} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: brand.ink }}>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0B1020' },
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
