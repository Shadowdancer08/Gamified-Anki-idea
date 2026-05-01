import { Player, Question, RoundResult } from './types';

export function getNextQuestion(questions: Question[], usedQuestionIds: Set<string>): Question | null {
  return questions.find((q) => !usedQuestionIds.has(q.id)) ?? null;
}

export function scoreRound(players: Player[], result: RoundResult): Player[] {
  return players.map((player) =>
    player.id === result.playerId && result.isCorrect
      ? { ...player, score: player.score + 1 }
      : player,
  );
}

export function getWinners(players: Player[], targetScore: number): Player[] {
  return players.filter((player) => player.score >= targetScore);
}
