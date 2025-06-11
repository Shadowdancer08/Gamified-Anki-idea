import { Platform } from 'react-native';

const ANKI_CONNECT_URL = 'http://127.0.0.1:8765';

interface AnkiRequest {
  action: string;
  version?: number;
  params?: Record<string, any>;
}

async function invoke(action: string, params: Record<string, any> = {}): Promise<any> {
  const request: AnkiRequest = {
    action,
    version: 6,
    params,
  };
  const res = await fetch(ANKI_CONNECT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result;
}

export interface Card {
  id: number;
  front: string;
  back: string;
}

export async function getDueCards(limit = 5): Promise<Card[]> {
  const ids: number[] = await invoke('findCards', { query: 'is:due' });
  const slice = ids.slice(0, limit);
  if (!slice.length) return [];
  const infos = await invoke('cardsInfo', { cards: slice });
  return infos.map((info: any) => ({
    id: info.cardId,
    front: info.question,
    back: info.answer,
  }));
}

export async function answerCard(cardId: number, correct: boolean): Promise<void> {
  const ease = correct ? 4 : 1; // Easy vs Again
  await invoke('answerCards', { cards: [cardId], ease });
}
