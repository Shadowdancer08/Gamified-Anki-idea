import { useMemo, useState } from 'react';
import { getNextQuestion, getWinners, scoreRound } from './core/gameEngine';
import { questionBank } from './data/questions';
import { Player, Question, RoundResult } from './core/types';

type Screen = 'home' | 'setup' | 'quiz';

function createPlayers(names: string[]): Player[] {
  return names.map((name, index) => ({ id: `p-${index + 1}`, name, score: 0 }));
}

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [players, setPlayers] = useState<Player[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const targetScore = 5;

  const activePlayer = players[turnIndex % Math.max(players.length, 1)];
  const winners = useMemo(() => getWinners(players, targetScore), [players]);

  function startGame(playerNames: string[]) {
    const newPlayers = createPlayers(playerNames);
    const firstQuestion = getNextQuestion(questionBank, new Set());
    setPlayers(newPlayers);
    setUsedQuestionIds(new Set(firstQuestion ? [firstQuestion.id] : []));
    setCurrentQuestion(firstQuestion);
    setFeedback('');
    setTurnIndex(0);
    setScreen('quiz');
  }

  function answerQuestion(choiceIndex: number) {
    if (!currentQuestion || !activePlayer || winners.length > 0) return;
    const roundResult: RoundResult = {
      playerId: activePlayer.id,
      selectedIndex: choiceIndex,
      isCorrect: choiceIndex === currentQuestion.correctAnswerIndex,
    };

    setPlayers((prev) => scoreRound(prev, roundResult));
    setFeedback(
      `${activePlayer.name} picked "${currentQuestion.choices[choiceIndex]}" — ${roundResult.isCorrect ? 'Correct' : 'Incorrect'}. ${currentQuestion.explanation}`,
    );
  }

  function nextRound() {
    const nextQuestion = getNextQuestion(questionBank, usedQuestionIds);
    if (nextQuestion) {
      setUsedQuestionIds((prev) => new Set(prev).add(nextQuestion.id));
      setCurrentQuestion(nextQuestion);
      setTurnIndex((prev) => prev + 1);
      setFeedback('');
    }
  }

  function restart() {
    setScreen('setup');
    setFeedback('');
    setUsedQuestionIds(new Set());
    setCurrentQuestion(null);
    setPlayers([]);
    setTurnIndex(0);
  }

  if (screen === 'home') {
    return <main className="page"><h1>ZetaMed</h1><p>Quick-fire medic vs medic quiz.</p><button onClick={() => setScreen('setup')}>Start Local Match</button></main>;
  }

  if (screen === 'setup') {
    return <SetupScreen onStart={startGame} onBack={() => setScreen('home')} />;
  }

  return (
    <main className="page">
      <h1>ZetaMed Local</h1>
      <p>First to {targetScore} wins.</p>
      <section className="box">
        <h2>Scoreboard</h2>
        <ul>{players.map((p) => <li key={p.id}>{p.name}: {p.score}</li>)}</ul>
      </section>
      {winners.length > 0 ? (
        <section className="box"><h2>Winner: {winners[0].name}</h2><button onClick={restart}>Rematch</button></section>
      ) : currentQuestion ? (
        <section className="box">
          <p><strong>Turn:</strong> {activePlayer?.name}</p>
          <p>{currentQuestion.prompt}</p>
          <p>{currentQuestion.category} • {currentQuestion.difficulty}</p>
          <div className="choices">{currentQuestion.choices.map((choice, index) => <button key={choice} onClick={() => answerQuestion(index)}>{choice}</button>)}</div>
          {feedback && <><p>{feedback}</p><button onClick={nextRound}>Next Question</button></>}
        </section>
      ) : (
        <section className="box"><p>Out of questions.</p><button onClick={restart}>Restart</button></section>
      )}
    </main>
  );
}

function SetupScreen({ onStart, onBack }: { onStart: (names: string[]) => void; onBack: () => void }) {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['Medic 1', 'Medic 2', 'Medic 3', 'Medic 4']);

  return (
    <main className="page">
      <h1>Local Setup</h1>
      <label>Players (2-4)
        <input type="number" min={2} max={4} value={count} onChange={(e) => setCount(Number(e.target.value))} />
      </label>
      {Array.from({ length: count }).map((_, idx) => (
        <label key={idx}>Player {idx + 1}
          <input value={names[idx]} onChange={(e) => setNames((prev) => prev.map((n, i) => i === idx ? e.target.value : n))} />
        </label>
      ))}
      <div className="row"><button onClick={onBack}>Back</button><button onClick={() => onStart(names.slice(0, count).map((n) => n.trim() || `Medic ${Math.random()}`))}>Launch Match</button></div>
    </main>
  );
}
