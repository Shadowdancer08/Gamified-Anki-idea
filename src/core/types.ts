export type Difficulty = 'easy' | 'medium' | 'hard';

export type Question = {
  id: string;
  category: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GameMode = 'local' | 'online';

export type GameSettings = {
  targetScore: number;
  categories: string[];
  difficulties: Difficulty[];
  mode: GameMode;
};

export type RoundResult = {
  playerId: string;
  isCorrect: boolean;
  selectedIndex: number;
};
