import Constants from 'expo-constants';

/** Matchmaker stub — replace with Cloud Function + real ranking later */
export async function runMatchmakerGames(
  _uid: string
): Promise<{ id: string; matchPct: number; reason: string }[]> {
  await new Promise((r) => setTimeout(r, 1800));
  return [
    { id: 'demo-1', matchPct: 96, reason: 'Matches your skill, 2.3 mi away, evening slot.' },
    { id: 'demo-2', matchPct: 91, reason: 'Same sport & level — host has 94 reliability.' },
    { id: 'demo-3', matchPct: 88, reason: 'Indoor venue, 3 connections may join.' },
  ];
}

export async function generateHighlightReelStub(): Promise<{ title: string; durationSec: number }> {
  await new Promise((r) => setTimeout(r, 2200));
  return { title: 'Season Mix — Auto Cut', durationSec: 42 };
}

export async function coachAssistantReply(userMessage: string): Promise<string> {
  const endpoint =
    process.env.EXPO_PUBLIC_COACH_AI_ENDPOINT ||
    (Constants.expoConfig?.extra as { coachAiUrl?: string } | undefined)?.coachAiUrl;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      if (res.ok) {
        const j = (await res.json()) as { reply?: string };
        if (j.reply) return j.reply;
      }
    } catch {
      // fall through
    }
  }

  return [
    'For defensive positioning drills, start with a 3v2 overload half-court: emphasize help-side stance and “see ball and man.”',
    'Then run a 5v5 shell drill with no dribble — forces communication and rotations.',
    'Finish with closeouts with “high hands, short steps” to contest without fouling.',
  ].join('\n\n');
}
