import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Title, Body } from '@/components/ui/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { brand } from '@/constants/theme';
import { subscribeNotifications, markRead } from '@/services/notifications';
import type { NotificationDoc } from '@/types';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<NotificationDoc[]>([]);

  useEffect(() => {
    if (!user) return;
    const u = subscribeNotifications(user.uid, setItems);
    return () => u();
  }, [user?.uid]);

  const onPress = async (n: NotificationDoc) => {
    if (user) await markRead(user.uid, n.id);
    if (n.deepLink) {
      router.push(n.deepLink as Href);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <Title>Notifications</Title>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPress(item)} style={[styles.row, !item.read && styles.unread]}>
            <Body style={{ fontFamily: 'DMSans_600SemiBold' }}>{item.title}</Body>
            <Body muted>{item.body}</Body>
          </Pressable>
        )}
        ListEmptyComponent={<Body muted>Nothing new — stay locked in.</Body>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: brand.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  unread: { borderColor: brand.blue },
});
