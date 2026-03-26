import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Body, Title } from '@/components/ui/Typography';
import { PrimaryButton } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { brand } from '@/constants/theme';
import { subscribeChannelMessages, sendChannelMessage, type ChatMessage } from '@/services/messages';

export default function ChannelScreen() {
  const { teamId, channelId } = useLocalSearchParams<{ teamId: string; channelId: string }>();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!teamId || !channelId) return;
    const u = subscribeChannelMessages(teamId, channelId, setMsgs);
    return () => u();
  }, [teamId, channelId]);

  const send = async () => {
    if (!user || !teamId || !channelId || !text.trim()) return;
    await sendChannelMessage(teamId, channelId, user.uid, text);
    setText('');
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <Title style={{ fontSize: 22 }}>#{channelId}</Title>
      <Body muted>Real-time team chat — coaches see every channel.</Body>
      <FlatList
        data={msgs}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: 12, gap: 8 }}
        renderItem={({ item }) => (
          <View style={styles.bubble}>
            <Body style={{ fontSize: 11, color: brand.textMuted }}>{item.uid.slice(0, 6)}…</Body>
            <Body>{item.text}</Body>
          </View>
        )}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TextInput
          style={styles.input}
          placeholder="Message the squad…"
          placeholderTextColor={brand.textMuted}
          value={text}
          onChangeText={setText}
        />
        <PrimaryButton title="Send" onPress={send} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: brand.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: brand.cardBorder,
  },
  input: {
    backgroundColor: brand.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: brand.cardBorder,
    padding: 12,
    color: brand.text,
    fontFamily: 'DMSans_400Regular',
    marginBottom: 8,
  },
});
